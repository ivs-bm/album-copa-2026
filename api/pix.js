export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Use POST');
  const { userId, email } = req.body;

  try {
    // Limpa espaços vazios invisíveis que podem causar bloqueio da chave
    const token = process.env.MP_ACCESS_TOKEN ? process.env.MP_ACCESS_TOKEN.trim() : '';

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Idempotency-Key': Math.random().toString(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transaction_amount: 14.90,
        payment_method_id: 'pix',
        payer: { 
          email: email || 'comprador@email.com',
          first_name: 'Colecionador' // Adicionado para satisfazer regras bancárias
        },
        external_reference: userId, 
        description: 'Cofre Família Pro - Álbum 2026',
        notification_url: `https://albumfamiliacopa.com.br/api/webhook`
      })
    });
    
    const data = await response.json();
    
    // Se o MP aprovar, devolve o Pix. Se recusar, devolve o motivo exato!
    if (data.point_of_interaction?.transaction_data?.qr_code) {
      return res.status(200).json({ qr_code: data.point_of_interaction.transaction_data.qr_code });
    } else {
      return res.status(400).json({ error: data.message || 'Erro não identificado no MP' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Erro no servidor interno da Vercel' });
  }
}
