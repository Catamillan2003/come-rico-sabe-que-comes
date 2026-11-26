# Cómo activar el chatbot de Gemini

El chat ya aparece en la página y el código de conexión está preparado. Para que responda preguntas reales, hay que conectar el sitio con un servicio seguro. GitHub Pages publica archivos estáticos; por eso usamos Cloudflare Workers como intermediario.

## 1. Crear tu clave de Gemini

1. Abre https://aistudio.google.com/apikey e inicia sesión con tu cuenta de Google.
2. Crea una API key.
3. Cópiala y guárdala en un lugar privado.
4. **No la pegues en `index.html`, `script.js`, ni en un archivo del repositorio de GitHub.** La clave se guardará como secreto en Cloudflare.

## 2. Crear el Worker en Cloudflare

1. Abre https://dash.cloudflare.com/ y crea una cuenta o inicia sesión.
2. En el menú, entra a **Workers & Pages**.
3. Selecciona **Create application** y luego **Create Worker** (el nombre exacto puede variar).
4. Ponle un nombre, por ejemplo `come-rico-gemini`, y crea el Worker.
5. Entra al editor de código del Worker.
6. Abre el archivo `cloudflare-worker.js` de esta carpeta, copia todo su contenido y reemplaza el código de ejemplo del editor.
7. Guarda y despliega (**Deploy**).

## 3. Guardar la clave como secreto

1. Dentro del Worker, abre **Settings**.
2. Busca **Variables and Secrets**.
3. Pulsa **Add** y selecciona el tipo **Secret**.
4. En el nombre escribe exactamente `GEMINI_API_KEY`.
5. En el valor pega la clave creada en Google AI Studio.
6. Guarda y vuelve a desplegar el Worker si Cloudflare lo solicita.

La clave debe ser de tipo **Secret**, no una variable de texto pública. Cloudflare documenta que los secretos se guardan cifrados y se leen desde el parámetro `env` del Worker.

## 4. Conectar el Worker con tu página

1. Después del despliegue, copia la URL HTTPS del Worker. Se verá parecida a `https://come-rico-gemini.tu-usuario.workers.dev`.
2. En la carpeta del sitio, abre `script.js`.
3. Busca esta línea:

   `const GEMINI_CHAT_ENDPOINT = 'PEGA_AQUI_LA_URL_DE_TU_WORKER';`

4. Reemplaza solo el texto de ejemplo por la URL real, conservando las comillas. Ejemplo:

   `const GEMINI_CHAT_ENDPOINT = 'https://come-rico-gemini.tu-usuario.workers.dev';`

5. Guarda `script.js` y sube el archivo actualizado a tu repositorio de GitHub, reemplazando el anterior.
6. Espera a que GitHub Pages publique los cambios y abre la página.

## 5. Probar que sí responde

Abre el botón **Pregunta a Come Rico** y prueba:

- ¿Qué proteínas reportó Mexicali Fusion Food?
- ¿Qué información hay sobre los fríjoles y las salsas de Mexicali?
- ¿Qué puedo preguntar en un negocio si quiero conocer cómo preparan un producto?
- ¿Qué información tiene el especial sobre Cholados Meli y YAWI?

El asistente debe explicar cuando el proyecto todavía no tiene datos suficientes. No debe inventar ingredientes, precios, calorías ni porciones.

## Si no funciona

- **El chat dice que falta conectarlo:** todavía no cambiaste el texto `PEGA_AQUI_LA_URL_DE_TU_WORKER` por la URL real.
- **Error 500 o falta `GEMINI_API_KEY`:** revisa que el secreto esté creado con ese nombre exacto y que el Worker esté desplegado.
- **Error 401 o 403 de Google:** revisa que la API key sea válida y que el acceso a Gemini esté habilitado para esa clave.
- **Error 404:** revisa que copiaste la URL completa del Worker.
- **No aparecen los cambios:** confirma que subiste el `script.js` correcto y recarga la web.

## Qué sabe el asistente

El Worker contiene instrucciones editoriales y datos confirmados del proyecto, especialmente la información reportada por Mexicali Fusion Food. Sobre los demás establecimientos, solo responderá lo que esté descrito en el sitio o en el contexto que se le haya proporcionado. Para ampliar sus respuestas, hay que agregar al contexto del Worker la información verificada de las entrevistas y cartas correspondientes.

El asistente es informativo; no diagnostica, no formula dietas ni reemplaza la orientación de profesionales de salud. Las declaraciones de los negocios no son análisis independientes ni pruebas de laboratorio.

## Privacidad y publicación

- Nunca publiques la API key en GitHub ni la compartas en capturas de pantalla.
- El Worker de esta versión acepta solicitudes desde cualquier origen para facilitar la primera prueba. Antes de una publicación de mayor alcance, limita los orígenes permitidos al dominio real de GitHub Pages y configura controles de uso en Cloudflare.
- El Worker usa la API `generateContent` de Gemini. Google presenta actualmente Interactions como la interfaz recomendada para proyectos nuevos, mientras `generateContent` sigue documentada como interfaz heredada; si se migra en el futuro, habrá que adaptar el Worker.
