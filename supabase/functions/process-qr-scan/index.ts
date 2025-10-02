import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QRScanRequest {
  qrCode: string;
  placeId: string;
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

    const { qrCode, placeId }: QRScanRequest = await req.json();

    console.log('Processing QR scan for user:', user.id, 'place:', placeId);

    // Validate QR code format (should be place_id:timestamp)
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

    // Check if user already scanned today (prevent spam)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: todayScans, error: historyCheckError } = await supabaseClient
      .from('loyalty_history')
      .select('*')
      .eq('user_id', user.id)
      .eq('place_id', placeId)
      .gte('scanned_at', today.toISOString())
      .limit(1);

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
    const { error: historyError } = await supabaseClient
      .from('loyalty_history')
      .insert({
        user_id: user.id,
        place_id: placeId,
        points_earned: 1,
        qr_code: qrCode,
      });

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
    const { data: existingPoints, error: pointsError } = await supabaseClient
      .from('loyalty_points')
      .select('*')
      .eq('user_id', user.id)
      .eq('place_id', placeId)
      .single();

    let newPoints = 1;
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
      newPoints = existingPoints.reward_claimed ? 1 : existingPoints.points + 1;
      rewardEarned = newPoints >= 5;

      const { error: updateError } = await supabaseClient
        .from('loyalty_points')
        .update({
          points: rewardEarned ? 5 : newPoints,
          last_scan_at: new Date().toISOString(),
          reward_claimed: false,
        })
        .eq('user_id', user.id)
        .eq('place_id', placeId);

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
      const { error: insertError } = await supabaseClient
        .from('loyalty_points')
        .insert({
          user_id: user.id,
          place_id: placeId,
          points: 1,
          last_scan_at: new Date().toISOString(),
        });

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
        message: rewardEarned 
          ? '¡Felicitaciones! Has completado 5 puntos. Reclama tu recompensa.' 
          : `¡Punto acumulado! Llevas ${newPoints} de 5 puntos.`
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
