// Navegación móvil y asistente conectado a Gemini mediante un endpoint seguro.
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}

// Después de desplegar el Worker, pega aquí su URL HTTPS.
const GEMINI_CHAT_ENDPOINT = 'https://come-rico-gemini.catamillan2003.workers.dev';
const launcher = document.getElementById('chatLauncher');
const panel = document.getElementById('chatPanel');
const closeChat = document.getElementById('chatClose');
const form = document.getElementById('chatForm');
const input = document.getElementById('chatInput');
const messages = document.getElementById('chatMessages');
const history = [];

function addMessage(text, who = 'bot', extra = '') {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${who} ${extra}`.trim();
  bubble.textContent = text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
  return bubble;
}
function toggleChat(show) {
  panel.hidden = !show;
  if (show) input.focus();
}
launcher?.addEventListener('click', () => toggleChat(true));
closeChat?.addEventListener('click', () => toggleChat(false));

form?.addEventListener('submit', async event => {
  event.preventDefault();
  const question = input.value.trim();
  if (!question) return;
  addMessage(question, 'user');
  input.value = '';
  if (!GEMINI_CHAT_ENDPOINT.startsWith('https://')) {
    addMessage('El chat está en la página, pero aún falta conectarlo. Configura el Worker de Cloudflare y pega su URL HTTPS en script.js.', 'bot', 'error');
    return;
  }

  const sendButton = form.querySelector('button[type="submit"]');
  sendButton.disabled = true;
  sendButton.textContent = 'Enviando…';
  const pending = addMessage('Estoy consultando a Gemini…', 'bot');
  const contents = [...history, { role: 'user', parts: [{ text: question }] }];
  try {
    const response = await fetch(GEMINI_CHAT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Error de conexión (${response.status}).`);
    const answer = data.reply || 'Gemini no devolvió una respuesta. Intenta de nuevo.';
    pending.textContent = answer;
    history.push({ role: 'user', parts: [{ text: question }] }, { role: 'model', parts: [{ text: answer }] });
    if (history.length > 12) history.splice(0, history.length - 12);
  } catch (error) {
    pending.textContent = `No pude conectarme con Gemini. ${error.message} Revisa la configuración del servicio e inténtalo otra vez.`;
    pending.classList.add('error');
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = 'Enviar';
    input.focus();
  }
});
