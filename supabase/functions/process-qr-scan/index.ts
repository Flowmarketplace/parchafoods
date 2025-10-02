import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QRScanRequest {
  qrCode: string;
  placeId?: string;
  businessId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('User authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Usuario no autenticado' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { qrCode, placeId, businessId }: QRScanRequest = await req.json();

    // Check if it's a loyalty QR code (format: loyalty:business_id:timestamp)
    const isLoyaltyQR = qrCode.startsWith('loyalty:');
    let targetBusinessId = businessId;

    if (isLoyaltyQR) {
      const parts = qrCode.split(':');
      if (parts.length < 2) {
        return new Response(
          JSON.stringify({ error: 'Código QR de lealtad inválido' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      targetBusinessId = parts[1];
      console.log('Processing loyalty QR scan for user:', user.id, 'business:', targetBusinessId);
    } else {
      console.log('Processing QR scan for user:', user.id, 'place:', placeId);

      // Validate QR code format for old place-based QRs (should be place_id:timestamp)
      if (!qrCode.startsWith(`${placeId}:`)) {
        console.error('Invalid QR code format');
        return new Response(
          JSON.stringify({ error: 'Código QR inválido' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Get business loyalty configuration if this is a loyalty QR
    let pointsPerScan = 1;
    let pointsToRedeem = 10;

    if (isLoyaltyQR && targetBusinessId) {
      const { data: business, error: businessError } = await supabaseClient
        .from('businesses')
        .select('loyalty_enabled, loyalty_points_per_scan, loyalty_points_to_redeem')
        .eq('id', targetBusinessId)
        .single();

      if (businessError || !business) {
        console.error('Error fetching business:', businessError);
        return new Response(
          JSON.stringify({ error: 'Negocio no encontrado' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      if (!business.loyalty_enabled) {
        return new Response(
          JSON.stringify({ error: 'Este negocio no tiene programa de lealtad activo' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      pointsPerScan = business.loyalty_points_per_scan || 1;
      pointsToRedeem = business.loyalty_points_to_redeem || 10;
    }

    // Check if user already scanned today (prevent spam)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const historyQuery = supabaseClient
      .from('loyalty_history')
      .select('*')
      .eq('user_id', user.id)
      .gte('scanned_at', today.toISOString())
      .limit(1);

    // Filter by business_id for loyalty QRs or place_id for old QRs
    if (isLoyaltyQR && targetBusinessId) {
      historyQuery.eq('business_id', targetBusinessId);
    } else if (placeId) {
      historyQuery.is('business_id', null); // Legacy place-based scans
    }

    const { data: todayScans, error: historyCheckError } = await historyQuery;

    if (historyCheckError) {
      console.error('Error checking today scans:', historyCheckError);
      return new Response(
        JSON.stringify({ error: 'Error al verificar escaneos' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (todayScans && todayScans.length > 0) {
      console.log('User already scanned today');
      return new Response(
        JSON.stringify({ 
          error: 'Ya escaneaste un código QR en este lugar hoy. Vuelve mañana para acumular más puntos.',
          alreadyScanned: true
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Add scan to history
    const historyInsert: any = {
      user_id: user.id,
      points_earned: pointsPerScan,
      scan_type: isLoyaltyQR ? 'qr_scan' : 'purchase',
    };

    if (isLoyaltyQR && targetBusinessId) {
      historyInsert.business_id = targetBusinessId;
    }

    const { error: historyError } = await supabaseClient
      .from('loyalty_history')
      .insert(historyInsert);

    if (historyError) {
      console.error('Error adding to history:', historyError);
      return new Response(
        JSON.stringify({ error: 'Error al registrar el escaneo' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get or create loyalty points record
    const pointsQuery = supabaseClient
      .from('loyalty_points')
      .select('*')
      .eq('user_id', user.id);

    if (isLoyaltyQR && targetBusinessId) {
      pointsQuery.eq('business_id', targetBusinessId);
    } else if (placeId) {
      pointsQuery.is('business_id', null);
    }

    const { data: existingPoints, error: pointsError } = await pointsQuery.single();

    let newPoints = pointsPerScan;
    let rewardEarned = false;

    if (pointsError && pointsError.code !== 'PGRST116') {
      console.error('Error fetching loyalty points:', pointsError);
      return new Response(
        JSON.stringify({ error: 'Error al obtener puntos' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (existingPoints) {
      // Update existing record
      newPoints = existingPoints.reward_claimed ? pointsPerScan : existingPoints.points + pointsPerScan;
      rewardEarned = newPoints >= pointsToRedeem;

      const updateData: any = {
        points: rewardEarned ? pointsToRedeem : newPoints,
        last_scan_at: new Date().toISOString(),
        reward_claimed: false,
      };

      const updateQuery = supabaseClient
        .from('loyalty_points')
        .update(updateData)
        .eq('user_id', user.id);

      if (isLoyaltyQR && targetBusinessId) {
        updateQuery.eq('business_id', targetBusinessId);
      } else if (placeId) {
        updateQuery.is('business_id', null);
      }

      const { error: updateError } = await updateQuery;

      if (updateError) {
        console.error('Error updating points:', updateError);
        return new Response(
          JSON.stringify({ error: 'Error al actualizar puntos' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    } else {
      // Create new record
      const insertData: any = {
        user_id: user.id,
        points: pointsPerScan,
        last_scan_at: new Date().toISOString(),
      };

      if (isLoyaltyQR && targetBusinessId) {
        insertData.business_id = targetBusinessId;
      }

      const { error: insertError } = await supabaseClient
        .from('loyalty_points')
        .insert(insertData);

      if (insertError) {
        console.error('Error creating loyalty points:', insertError);
        return new Response(
          JSON.stringify({ error: 'Error al crear registro de puntos' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    console.log('QR scan processed successfully. Points:', newPoints, 'Reward:', rewardEarned);

    return new Response(
      JSON.stringify({
        success: true,
        points: newPoints,
        rewardEarned,
        pointsToRedeem,
        message: rewardEarned 
          ? `¡Felicitaciones! Has completado ${pointsToRedeem} puntos. Reclama tu recompensa.` 
          : `¡${pointsPerScan} punto(s) acumulado(s)! Llevas ${newPoints} de ${pointsToRedeem} puntos.`
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
