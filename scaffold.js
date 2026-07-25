/**
 * Script de scaffold: cria toda a estrutura de pastas/arquivos do projeto
 * "escola-chat" na pasta atual. Rode com: node scaffold.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'escola-chat');

const dirs = [
  'public/css',
  'public/js/model',
  'public/js/view',
  'public/js/controller',
  'netlify/functions'
];

dirs.forEach((dir) => {
  const full = path.join(ROOT, dir);
  fs.mkdirSync(full, { recursive: true });
  console.log('Criado:', full);
});

const files = {
  '.env.example': 'GROQ_API_KEY=coloque_sua_api_key_aqui\n',
  '.gitignore': 'node_modules/\n.env\n.netlify/\n',
  'README.md':
    '# Escola Chat\n\n' +
    '1. `npm install`\n' +
    '2. Copie `.env.example` para `.env` e coloque sua GROQ_API_KEY\n' +
    '3. `npx netlify dev` para testar localmente\n' +
    '4. Suba para o GitHub e conecte o repositório no Netlify\n' +
    '5. Em Netlify > Site settings > Environment variables, adicione GROQ_API_KEY\n'
};

Object.entries(files).forEach(([relPath, content]) => {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) {
    fs.writeFileSync(full, content);
    console.log('Criado:', full);
  }
});

console.log('\nEstrutura criada em:', ROOT);
console.log('Copie os arquivos de código (index.html, style.css, ChatModel.js, ChatView.js,');
console.log('ChatController.js, app.js, netlify/functions/chat.js, netlify.toml, package.json)');
console.log('para dentro das pastas correspondentes.');
