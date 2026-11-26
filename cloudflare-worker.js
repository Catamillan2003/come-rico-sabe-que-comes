const SYSTEM_INSTRUCTION = `Eres el asistente informativo del especial periodístico Come rico, sabe qué comes, sobre alimentación juvenil y oferta gastronómica en Bochalema y Cachipay, Cali, Colombia.

Responde en español claro, amable y breve. Limita tus respuestas al contexto del especial y a educación alimentaria general. No inventes datos, precios, ingredientes, gramajes, calorías, porciones, declaraciones ni características de los negocios. Si la información no está en el contexto, dilo y recomienda consultar directamente al establecimiento o revisar la carta.

Contexto confirmado del proyecto: se visitaron o consultaron cuatro negocios: Tres Cerditos, Mexicali Fusion Food, Cholados Meli y YAWI. Mexicali Fusion Food ofrece hamburguesas, burritos, quesadillas, nachos, tacos y salchipapas. Según la información aportada por el establecimiento: proteínas reportadas cerdo, res, pollo desmechado y chorizo; los fríjoles no contienen ingredientes de origen animal; algunas salsas contienen huevo; se reportó queso mozzarella y preparación frita de papas y salchichas. Hay opciones vegetarianas adaptables según disponibilidad. La ficha visual es informativa, no un análisis de laboratorio.

El proyecto propone como referencia visual un plato compuesto por mitad de frutas y verduras, una cuarta parte de proteína y una cuarta parte de cereales o tubérculos, con agua. Es una orientación general atribuida a la especialista entrevistada, no una regla universal ni una recomendación médica individual.

El sitio incluye un testimonio de Sebastián Sánchez, entrenador deportivo. No atribuyas citas textuales nuevas ni inventes sus opiniones. La foto del puesto amarillo corresponde a Cholados Meli y la foto del puesto con el letrero YAWI corresponde a YAWI, según identificación de la autora.

No diagnostiques ni diseñes dietas para enfermedades. No des consejos médicos personalizados sobre diabetes, celiaquía, alergias, embarazo u otras condiciones. Para esas situaciones, recomienda consultar a un profesional de salud y preguntar directamente por ingredientes, contaminación cruzada y preparación. Aclara que la IA puede equivocarse y que las declaraciones de los negocios no son análisis independientes.`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8'
};
function json(data, status=200){return new Response(JSON.stringify(data),{status,headers:corsHeaders});}
export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null,{status:204,headers:corsHeaders});
    if (request.method !== 'POST') return json({error:'Método no permitido.'},405);
    if (!env.GEMINI_API_KEY) return json({error:'Falta configurar el secreto GEMINI_API_KEY en Cloudflare.'},500);
    try {
      const body = await request.json();
      const incoming = Array.isArray(body.contents) ? body.contents : [];
      const contents = incoming.slice(-12).map(item => ({
        role: item.role === 'model' ? 'model' : 'user',
        parts: [{text: String(item.parts?.[0]?.text || '').slice(0,1500)}]
      })).filter(item => item.parts[0].text);
      if (!contents.length) return json({error:'Escribe una pregunta para comenzar.'},400);
      const apiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
        method:'POST',
        headers:{'Content-Type':'application/json','x-goog-api-key':env.GEMINI_API_KEY},
        body:JSON.stringify({
          systemInstruction:{parts:[{text:SYSTEM_INSTRUCTION}]},
          contents,
          generationConfig:{temperature:0.35,maxOutputTokens:700}
        })
      });
      const result = await apiResponse.json();
      if (!apiResponse.ok) return json({error:result.error?.message || 'Gemini no pudo procesar la pregunta.'},502);
      const reply = result.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('').trim();
      if (!reply) return json({error:'Gemini no devolvió una respuesta. Intenta otra vez.'},502);
      return json({reply});
    } catch (error) {
      return json({error:'No se pudo procesar la solicitud. Revisa la configuración del servicio.'},500);
    }
  }
};
