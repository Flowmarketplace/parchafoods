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
          description: "Busca negocios en Cali por categoría, nombre o barrio. Útil cuando el usuario pregunta por restaurantes, cafés, tiendas, etc.",
          parameters: {
            type: "object",
            properties: {
              category: {
                type: "string",
                description: "Categoría del negocio (Restaurante, Café, Hotel, Gym, etc.)"
              },
              neighborhood: {
                type: "string",
                description: "Barrio específico donde buscar"
              },
              search: {
                type: "string",
                description: "Término de búsqueda general por nombre"
              }
            }
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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de peticiones excedido, intenta más tarde." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Fondos insuficientes en la cuenta." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Error en el servicio de IA" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle streaming with potential tool calls
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = "";
        
        try {
          while (true) {
            const { done, value } = await reader!.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  continue;
                }

                try {
                  const parsed = JSON.parse(data);
                  
                  // Check for tool calls
                  if (parsed.choices?.[0]?.delta?.tool_calls) {
                    const toolCall = parsed.choices[0].delta.tool_calls[0];
                    console.log("Tool call detected:", toolCall);
                    
                    // Handle tool execution here if needed
                    // For now, just pass through
                  }
                  
                  controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                } catch (e) {
                  console.error("Error parsing SSE data:", e);
                }
              }
            }
          }

          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
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
