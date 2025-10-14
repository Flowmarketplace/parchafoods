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
            content: `Eres HandCity AI, un asistente virtual experto en Cali, Colombia. 

IMPORTANTE: SIEMPRE usa las herramientas search_businesses o search_events cuando el usuario pregunta por lugares, comida, negocios o eventos.

INSTRUCCIONES CRÍTICAS PARA LINKS:
- NUNCA uses "Ver más:" seguido de una URL
- SIEMPRE usa el formato de markdown: [Nombre del Lugar](/place/slug-aqui) o [Nombre del Evento](/event/slug-aqui)
- El "slug" es el identificador legible en la URL (ej: "juan-valdez-cafe", "feria-de-cali-2025")
- NUNCA uses el campo "id", SOLO usa el campo "slug"

EJEMPLO INCORRECTO:
Ver más: /place/abc-123-456
Ver más: /event/abc-123-456

EJEMPLO CORRECTO:
[Juan Valdez Café](/place/juan-valdez-cafe)
[Feria de Cali 2025](/event/feria-de-cali-2025)

FORMATO DE RESPUESTAS PARA NEGOCIOS:
Cuando encuentres negocios, muéstralos así:

🍴 **[Nombre del Negocio](/place/slug-del-negocio)**
Descripción breve
📍 Barrio • 💰 Rango de precio

FORMATO DE RESPUESTAS PARA EVENTOS:
Cuando encuentres eventos, muéstralos así:

🎉 **[Nombre del Evento](/event/slug-del-evento)**
Descripción breve
📍 Ubicación • 📅 Fecha • 💰 Precio

EJEMPLO COMPLETO DE NEGOCIOS:
"Encontré estos lugares para café en Granada:

☕ **[Juan Valdez Café](/place/juan-valdez-cafe)**
Café colombiano premium y pasteles artesanales
📍 Granada • 💰 $$

☕ **[La Comitiva](/place/la-comitiva)**
Café specialty y brunch
📍 El Peñón • 💰 $$

¿Te gustaría más información de alguno?"

EJEMPLO COMPLETO DE EVENTOS:
"Encontré estos eventos de música:

🎵 **[Concierto Salsa al Parque](/event/concierto-salsa-parque)**
Concierto gratuito de orquestas de salsa
📍 Parque de la Música • 📅 Nov 15 • 💰 Gratis

🎵 **[Festival Petronio Álvarez](/event/festival-petronio-alvarez)**
Festival de música del Pacífico colombiano
📍 Unidad Deportiva • 📅 Ago 15-19 • 💰 $

¿Te interesa alguno en particular?"

REGLAS:
- USA el campo "slug" de cada negocio o evento para crear el link
- El link DEBE estar en formato markdown: [texto](/place/slug) o [texto](/event/slug)
- NUNCA escribas "Ver más:" o URLs sueltas
- Cuando el usuario mencione "asado", "pizza", "café", etc., SIEMPRE usa search_businesses
- Cuando el usuario mencione "concierto", "evento", "festival", etc., SIEMPRE usa search_events
- USA EL SLUG que recibes de la herramienta en el formato: /place/[slug] o /event/[slug]
- NUNCA inventes slugs, usa exactamente el que viene en los datos
- Si no encuentras resultados, sugiere buscar en otros barrios o categorías`
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
            content: `Eres HandCity AI, un asistente virtual experto en Cali, Colombia.

INSTRUCCIONES CRÍTICAS PARA LINKS:
- NUNCA uses "Ver más:" seguido de una URL
- SIEMPRE usa el formato de markdown: [Nombre del Lugar](/place/slug-aqui) o [Nombre del Evento](/event/slug-aqui)
- El "slug" es el identificador legible en la URL
- NUNCA uses el campo "id", SOLO usa el campo "slug"

EJEMPLO CORRECTO NEGOCIOS:
☕ **[Juan Valdez Café](/place/juan-valdez-cafe)**
Café colombiano premium
📍 Granada • 💰 $$

EJEMPLO CORRECTO EVENTOS:
🎉 **[Feria de Cali 2025](/event/feria-de-cali-2025)**
Festival cultural y musical
📍 Cali Centro • 📅 Dic 25-30 • 💰 Gratis

NUNCA hagas esto:
Ver más: /place/abc-123
Ver más: /event/abc-123

Sé conciso, amigable y útil.`
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
            content: `Eres HandCity AI, un asistente virtual experto en Cali, Colombia.

INSTRUCCIONES CRÍTICAS PARA LINKS:
- NUNCA uses "Ver más:" seguido de una URL
- SIEMPRE usa el formato de markdown: [Nombre del Lugar](/place/slug-aqui) o [Nombre del Evento](/event/slug-aqui)
- El "slug" es el identificador legible en la URL
- NUNCA uses el campo "id", SOLO usa el campo "slug"

EJEMPLO CORRECTO NEGOCIOS:
☕ **[Juan Valdez Café](/place/juan-valdez-cafe)**
Café colombiano premium
📍 Granada • 💰 $$

EJEMPLO CORRECTO EVENTOS:
🎉 **[Feria de Cali 2025](/event/feria-de-cali-2025)**
Festival cultural y musical
📍 Cali Centro • 📅 Dic 25-30 • 💰 Gratis

NUNCA hagas esto:
Ver más: /place/abc-123
Ver más: /event/abc-123

Sé conciso, amigable y útil.`
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
