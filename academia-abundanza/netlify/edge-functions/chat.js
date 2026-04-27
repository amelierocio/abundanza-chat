export default async (request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { system, messages } = await request.json();
    const apiKey = Deno.env.get('GROQ_API_KEY') ?? '';

    const body = {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: system },
        ...messages
      ],
      max_tokens: 1500,
      temperature: 0.75
    };

    let res, data;
    for (let attempt = 0; attempt < 3; attempt++) {
      res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
      });
      data = await res.json();
      if (res.status !== 503) break;
      if (attempt < 2) await new Promise(r => setTimeout(r, 2000));
    }

    if (!res.ok) {
      const msg = res.status === 503
        ? 'El servicio está ocupado. Esperá unos segundos y volvé a intentarlo.'
        : data.error?.message || `Error ${res.status}`;
      return new Response(
        JSON.stringify({ error: { message: msg } }),
        { status: res.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const text = data.choices?.[0]?.message?.content ?? '';
    return new Response(
      JSON.stringify({ text }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: { message: err.message } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const config = { path: '/api/chat' };
