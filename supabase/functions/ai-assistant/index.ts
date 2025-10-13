import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    console.log("Processing AI request with", messages.length, "messages");

    // Define tools for AI to search businesses and get details
    const tools = [
      {
        type: "function",
        function: {
          name: "search_businesses",
          description: "Busca negocios en Cali por categoría, nombre o barrio. Útil cuando el usuario pregunta por restaurantes, cafés, tiendas, asados, pizza, etc. Usa términos generales y flexibles.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Término de búsqueda general (nombre, tipo de comida, especialidad). Ejemplo: 'asado', 'pizza', 'café', 'sushi'"
              },
              neighborhood: {
                type: "string",
                description: "Barrio específico donde buscar (opcional)"
              }
            },
            required: ["query"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "get_business_details",
          description: "Obtiene información detallada de un negocio específico incluyendo menú, precios, horarios, etc.",
          parameters: {
            type: "object",
            properties: {
              business_name: {
                type: "string",
                description: "Nombre del negocio"
              }
            },
            required: ["business_name"]
          }
        }
      }
    ];

    // First check if we need tools (non-streaming)
    const checkResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Eres HandCity AI, un asistente virtual experto en Cali, Colombia. Tu trabajo es ayudar a los usuarios a descubrir y explorar lugares en la ciudad.

CAPACIDADES:
- Buscar negocios por categoría, barrio o nombre
- Proporcionar información detallada sobre lugares (precios, horarios, ubicación, menú)
- Recomendar lugares según las necesidades del usuario
- Dar links directos para ver lugares en la app

FORMATO DE RESPUESTAS:
Cuando recomiendes un lugar, SIEMPRE incluye:
1. Nombre del lugar
2. Descripción breve
3. Link directo: /place/[id] (usa el ID del negocio)
4. Información relevante (precio, ubicación, especialidad)

EJEMPLO:
"Te recomiendo **Restaurante El Sabor del Barrio** - Deliciosa comida típica caleña. 
📍 Barrio Compartir
💰 Rango: $$
Ver más: /place/1

Ofrecen sancocho de gallina ($18.000) y bandeja paisa ($25.000)."

Usa las herramientas search_businesses y get_business_details para buscar información real.
Sé conciso, amigable y útil. Si no encuentras algo, sugiere alternativas.`
          },
          ...messages,
        ],
        tools: tools,
        stream: false,
      }),
    });

    if (!checkResponse.ok) {
      if (checkResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de peticiones excedido, intenta más tarde." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (checkResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Fondos insuficientes en la cuenta." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await checkResponse.text();
      console.error("AI gateway error:", checkResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "Error en el servicio de IA" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!checkResponse.ok) {
      if (checkResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de peticiones excedido, intenta más tarde." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (checkResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Fondos insuficientes en la cuenta." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await checkResponse.text();
      console.error("AI gateway error:", checkResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "Error en el servicio de IA" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const checkData = await checkResponse.json();
    
    // Check if AI wants to use tools
    if (checkData.choices?.[0]?.message?.tool_calls) {
      const toolCalls = checkData.choices[0].message.tool_calls;
      const toolResults = [];

      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        
        console.log(`Executing tool: ${functionName}`, args);

        if (functionName === "search_businesses") {
          let query = supabase.from('businesses').select('id, name, category, neighborhood, description, address, price_range, latitude, longitude');
          
          // Build search conditions
          const conditions = [];
          
          if (args.query) {
            // Search in name, description, and category
            conditions.push(`name.ilike.%${args.query}%`);
            conditions.push(`description.ilike.%${args.query}%`);
            conditions.push(`category.ilike.%${args.query}%`);
          }
          
          if (args.neighborhood) {
            query = query.ilike('neighborhood', `%${args.neighborhood}%`);
          }
          
          // Apply OR conditions for flexible search
          if (conditions.length > 0) {
            query = query.or(conditions.join(','));
          }
          
          const { data, error } = await query.limit(10);
          
          toolResults.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: functionName,
            content: JSON.stringify(error ? { error: error.message } : { businesses: data || [] })
          });
        } else if (functionName === "get_business_details") {
          const { data: business, error: bizError } = await supabase
            .from('businesses')
            .select('*')
            .ilike('name', `%${args.business_name}%`)
            .single();

          if (!bizError && business) {
            const { data: menu } = await supabase
              .from('business_menu')
              .select('*')
              .eq('business_id', business.id);

            const { data: hours } = await supabase
              .from('business_hours')
              .select('*')
              .eq('business_id', business.id);

            toolResults.push({
              tool_call_id: toolCall.id,
              role: "tool",
              name: functionName,
              content: JSON.stringify({ business, menu, hours })
            });
          } else {
            toolResults.push({
              tool_call_id: toolCall.id,
              role: "tool",
              name: functionName,
              content: JSON.stringify({ error: "Negocio no encontrado" })
            });
          }
        }
      }

      // Send tool results back to AI for final response (with streaming)
      const finalResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `Eres HandCity AI, un asistente virtual experto en Cali, Colombia. Tu trabajo es ayudar a los usuarios a descubrir y explorar lugares en la ciudad.

CAPACIDADES:
- Buscar negocios por categoría, barrio o nombre
- Proporcionar información detallada sobre lugares (precios, horarios, ubicación, menú)
- Recomendar lugares según las necesidades del usuario
- Dar links directos para ver lugares en la app

FORMATO DE RESPUESTAS:
Cuando recomiendes un lugar, SIEMPRE incluye:
1. Nombre del lugar
2. Descripción breve
3. Link directo: /place/[id] (usa el ID del negocio)
4. Información relevante (precio, ubicación, especialidad)

EJEMPLO:
"Te recomiendo **Restaurante El Sabor del Barrio** - Deliciosa comida típica caleña. 
📍 Barrio Compartir
💰 Rango: $$
Ver más: /place/1

Ofrecen sancocho de gallina ($18.000) y bandeja paisa ($25.000)."

Sé conciso, amigable y útil. Si no encuentras algo, sugiere alternativas.`
            },
            ...messages,
            checkData.choices[0].message,
            ...toolResults
          ],
          stream: true,
        }),
      });

      // Stream the final response
      return new Response(finalResponse.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // No tools needed, make streaming call
    const streamResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Eres HandCity AI, un asistente virtual experto en Cali, Colombia. Tu trabajo es ayudar a los usuarios a descubrir y explorar lugares en la ciudad.

CAPACIDADES:
- Buscar negocios por categoría, barrio o nombre
- Proporcionar información detallada sobre lugares (precios, horarios, ubicación, menú)
- Recomendar lugares según las necesidades del usuario
- Dar links directos para ver lugares en la app

FORMATO DE RESPUESTAS:
Cuando recomiendes un lugar, SIEMPRE incluye:
1. Nombre del lugar
2. Descripción breve
3. Link directo: /place/[id] (usa el ID del negocio)
4. Información relevante (precio, ubicación, especialidad)

EJEMPLO:
"Te recomiendo **Restaurante El Sabor del Barrio** - Deliciosa comida típica caleña. 
📍 Barrio Compartir
💰 Rango: $$
Ver más: /place/1

Ofrecen sancocho de gallina ($18.000) y bandeja paisa ($25.000)."

Sé conciso, amigable y útil. Si no encuentras algo, sugiere alternativas.`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    return new Response(streamResponse.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI assistant error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Error desconocido" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
