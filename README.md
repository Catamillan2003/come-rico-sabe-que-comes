# Come rico, sabe qué comes

Especial periodístico web sobre alimentación juvenil y oferta gastronómica en Bochalema y Cachipay, Cali.

## Archivos
- `index.html`: estructura y contenidos de la página.
- `styles.css`: diseño adaptable a celular y computador; las fotografías se muestran completas, sin recortes.
- `script.js`: navegación y conexión del chatbot.
- `cloudflare-worker.js`: servicio seguro que conecta el chat con Gemini.
- `CONFIGURAR-GEMINI.md`: guía paso a paso para activar el chatbot.
- `assets/`: logo, fotografías, infografía y audio del proyecto.

## Publicar en GitHub Pages
Sube el contenido de esta carpeta al repositorio y activa GitHub Pages desde la rama principal y la carpeta raíz. El sitio se publica como página estática.

## Chatbot
El chat visual está incluido, pero necesita un Worker desplegado en Cloudflare y el secreto `GEMINI_API_KEY`. Sigue `CONFIGURAR-GEMINI.md`. No pongas la clave en los archivos públicos.

## Nota editorial
La información de los establecimientos debe atribuirse a las cartas o entrevistas. No se presentan estimaciones nutricionales como resultados de laboratorio ni se ofrecen diagnósticos o recomendaciones médicas individuales.
