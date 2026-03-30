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

    // Define tools for AI to search businesses, events and get details
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
          name: "search_events",
          description: "Busca eventos en Cali por categoría, nombre o tipo. Útil cuando el usuario pregunta por eventos, conciertos, festivales, actividades culturales, deportes, etc.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Término de búsqueda general (nombre del evento, tipo, categoría). Ejemplo: 'concierto', 'festival', 'teatro', 'deportes'"
              },
              category: {
                type: "string",
                description: "Categoría específica del evento (opcional). Ejemplo: 'Música', 'Teatro', 'Deportes', 'Festival'"
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
            content: `Eres el asistente de El Mundial del Sabor 2026, un asistente virtual EXCLUSIVAMENTE para El Mundial del Sabor (la app gastronómica de Cali, Colombia).

REGLA ABSOLUTA #1 - SOLO MENCIONA LO QUE ENCUENTRES:
- NUNCA NUNCA NUNCA inventes o menciones lugares que no hayas encontrado con las herramientas
- NUNCA menciones lugares famosos de Cali si no están en los resultados de búsqueda
- NUNCA recomiendes parques, plazas, museos o atracciones turísticas si no aparecen en search_businesses o search_events
- Si las herramientas devuelven vacío [], di "No encontré lugares en la app que cumplan esos criterios"
- PROHIBIDO mencionar lugares como "Parque del Perro", "Gato de Tejada", "Cristo Rey", etc. a menos que aparezcan en los resultados

REGLA ABSOLUTA #2 - USA LAS HERRAMIENTAS SIEMPRE:
- Cuando el usuario pregunta por negocios, restaurantes, cafés, comida → USA search_businesses
- Cuando el usuario pregunta por eventos, conciertos, festivales → USA search_events
- Para planes con múltiples tipos de lugares → USA search_businesses VARIAS VECES con diferentes queries
- NUNCA respondas sin buscar primero

REGLA ABSOLUTA #3 - RESPONDE SOLO CON RESULTADOS REALES:
- Cada lugar o evento que menciones DEBE venir de los resultados de las herramientas
- Usa EXACTAMENTE los nombres que devuelven las herramientas
- Usa EXACTAMENTE los slugs que devuelven las herramientas
- NO agregues lugares de tu conocimiento general de Cali

INSTRUCCIONES PARA LINKS:
- Formato: [Nombre](/place/slug) o [Nombre](/event/slug)
- SOLO usa el campo "slug", nunca "id"
- NUNCA uses "Ver más:"

FORMATO DE RESPUESTAS NEGOCIOS:
🍴 **[Nombre del Negocio](/place/slug-del-negocio)**
Descripción breve
📍 Barrio • 💰 Precio

FORMATO DE RESPUESTAS EVENTOS:
🎉 **[Nombre del Evento](/event/slug-del-evento)**
Descripción breve
📍 Ubicación • 📅 Fecha • 💰 Precio

EJEMPLOS DE USO CORRECTO:

Usuario: "qué hacer en pareja"
Tú: [Usas search_businesses con query="romántico"]
     [Usas search_businesses con query="restaurante"]
     [Usas search_businesses con query="café"]
Resultado: 3 lugares encontrados
Respuesta: "Encontré estos lugares en la app para pareja:

🍽️ **[Nombre Real 1](/place/slug-real-1)**
Descripción exacta de la base de datos
📍 Barrio Real • 💰 $$

🍽️ **[Nombre Real 2](/place/slug-real-2)**
Descripción exacta de la base de datos
📍 Barrio Real • 💰 $$"

Usuario: "lugares con música en vivo"
Tú: [Usas search_businesses con query="música en vivo"]
     [Usas search_events con query="música"]
Resultado: 0 negocios, 1 evento
Respuesta: "No encontré negocios con música en vivo en la app, pero sí este evento:

🎵 **[Nombre Real del Evento](/event/slug-real)**
Descripción exacta
📍 Ubicación • 📅 Fecha"

Usuario: "plan turístico"
Tú: [Usas search_businesses con query="turístico"]
     [Usas search_events con query="turismo"]
Resultado: Vacío
Respuesta: "No encontré lugares o eventos turísticos en la app actualmente. Te sugiero explorar los restaurantes y eventos disponibles en la app."

RECUERDA: Si no está en los resultados de las herramientas, NO EXISTE para ti. NUNCA menciones lugares basándote en tu conocimiento de Cali.`
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
          let query = supabase.from('businesses').select('id, slug, name, category, neighborhood, description, address, price_range, latitude, longitude');
          
          // Build flexible search
          const orConditions = [];
          
          if (args.category) {
            orConditions.push(`category.ilike.%${args.category}%`);
          }
          if (args.query) {
            orConditions.push(`name.ilike.%${args.query}%`);
            orConditions.push(`description.ilike.%${args.query}%`);
            orConditions.push(`category.ilike.%${args.query}%`);
          }
          
          if (args.neighborhood) {
            query = query.ilike('neighborhood', `%${args.neighborhood}%`);
          }
          
          // Apply OR conditions for flexible search
          if (orConditions.length > 0) {
            query = query.or(orConditions.join(','));
          }
          
          const { data, error } = await query.limit(10);
          
          console.log(`Search businesses for ${JSON.stringify(args)} found:`, data);
          
          toolResults.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: functionName,
            content: JSON.stringify(error ? { error: error.message } : { businesses: data || [] })
          });
        } else if (functionName === "search_events") {
          let query = supabase.from('events').select('id, slug, title, category, location, description, start_date, end_date, price_range, image_url');
          
          // Build flexible search
          const orConditions = [];
          
          if (args.query) {
            orConditions.push(`title.ilike.%${args.query}%`);
            orConditions.push(`description.ilike.%${args.query}%`);
            orConditions.push(`category.ilike.%${args.query}%`);
          }
          
          if (args.category) {
            query = query.ilike('category', `%${args.category}%`);
          }
          
          // Apply OR conditions for flexible search
          if (orConditions.length > 0) {
            query = query.or(orConditions.join(','));
          }
          
          const { data, error } = await query.limit(10);
          
          console.log(`Search events for ${JSON.stringify(args)} found:`, data);
          
          toolResults.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: functionName,
            content: JSON.stringify(error ? { error: error.message } : { events: data || [] })
          });
        } else if (functionName === "get_business_details") {
          const { data: business, error: bizError } = await supabase
            .from('businesses')
            .select('*')
            .eq('id', args.business_id)
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
            content: `Eres el asistente de El Mundial del Sabor 2026. SOLO menciona lugares/eventos que aparezcan en los resultados de las herramientas.

REGLAS ABSOLUTAS:
- NUNCA inventes lugares o eventos que no estén en los resultados
- NUNCA menciones lugares famosos de Cali si no aparecen en los resultados
- Si los resultados están vacíos, di "No encontré lugares en la app"
- Cada lugar/evento que menciones DEBE tener su slug de los resultados

FORMATO DE LINKS:
[Nombre](/place/slug) o [Nombre](/event/slug)
NUNCA uses "Ver más:"

EJEMPLO:
☕ **[Juan Valdez Café](/place/juan-valdez-cafe)**
Café colombiano premium
📍 Granada • 💰 $$`
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
            content: `Eres Sabor 360 AI. SOLO menciona lugares/eventos que aparezcan en los resultados de las herramientas.

REGLAS ABSOLUTAS:
- NUNCA inventes lugares o eventos que no estén en los resultados
- NUNCA menciones lugares famosos de Cali si no aparecen en los resultados
- Si los resultados están vacíos, di "No encontré lugares en la app"
- Cada lugar/evento que menciones DEBE tener su slug de los resultados

FORMATO DE LINKS:
[Nombre](/place/slug) o [Nombre](/event/slug)
NUNCA uses "Ver más:"

EJEMPLO:
☕ **[Juan Valdez Café](/place/juan-valdez-cafe)**
Café colombiano premium
📍 Granada • 💰 $$`
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
