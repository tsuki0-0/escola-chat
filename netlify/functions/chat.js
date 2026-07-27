
const SYSTEM_PROMPT = `Você é a assistente virtual da Escola Técnica Horizonte.

Responda de forma cordial, acolhedora e em português do Brasil.
Ajude com dúvidas sobre cursos técnicos oferecidos, processo de matrícula,
horários de aula, valores, localização e contato da escola.

Trate todos os alunos e visitantes com respeito e gentileza.
Você pode usar uma comunicação amigável e positiva, mas mantenha clareza
e profissionalismo.

Se não souber uma informação específica (como valores exatos ou datas),
oriente o usuário a entrar em contato com a secretaria pelo telefone
(11) 0000-0000 ou e-mail contato@escolahorizonte.edu.br.

Nunca invente informações institucionais que não tenha certeza.`;
>>>>>>> e7d80c03dfb32b5749f08476011babf7221533c9

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Método não permitido' }) };
  }

  try {
    const { message, history } = JSON.parse(event.body || '{}');

    if (!message || typeof message !== 'string') {
      return { statusCode: 400, body: JSON.stringify({ error: 'Mensagem inválida' }) };
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'API key não configurada no servidor' }) };
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(Array.isArray(history) ? history.slice(-10) : []),
      { role: 'user', content: message }
    ];

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        temperature: 0.6,
        max_tokens: 500
      })
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      return {
        statusCode: groqResponse.status,
        body: JSON.stringify({ error: 'Erro na API Groq', details: errText })
      };
    }

    const data = await groqResponse.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || 'Desculpe, não consegui gerar uma resposta.';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno', details: err.message })
    };
  }
};
