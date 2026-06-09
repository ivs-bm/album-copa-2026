export default async function handler(req, res) {
    // 1. SEGURANÇA: Apenas aceita pedidos de leitura (GET)
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Método não permitido' });
    }

    // Puxa a chave mestra do cofre secreto
    const API_KEY = process.env.API_SPORTS_KEY;

    if (!API_KEY) {
        return res.status(500).json({ success: false, message: 'Chave da API ausente no servidor.' });
    }

    try {
        // 2. EXTRAÇÃO (Extract): Pedido oficial aos servidores da API-Sports
        // League 15 = FIFA World Cup | Season = 2026
        const response = await fetch('https://v3.football.api-sports.io/fixtures?league=15&season=2026', {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'v3.football.api-sports.io',
                'x-apisports-key': API_KEY
            }
        });
        
        const apiData = await response.json();

        // 3. TRANSFORMAÇÃO (Transform): Mapeamento (De/Para)
        let scoresConvertidos = {};

        // Como a FIFA ainda não sorteou os grupos, a API ainda não tem os jogos exatos disponíveis.
        // A lógica abaixo garante que a aplicação não quebra enquanto esperamos a tabela oficial.
        if (apiData.response && apiData.response.length > 0) {
            // Lógica futura: Faremos um map ligando os IDs da API aos seus (wc-1, wc-2)
            // apiData.response.forEach(match => { ... })
        } else {
            // Fallback de Segurança: Retorna resultados visuais para testar a comunicação
            scoresConvertidos = {
                'wc-1': { a: 2, b: 1 }, 
                'wc-2': { a: 0, b: 0 },
                'wc-3': { a: 3, b: 0 },
                'wc-4': { a: 2, b: 2 }
            };
        }

        // 4. CARGA (Load): Entrega o pacote de dados limpo à sua aplicação
        return res.status(200).json({
            success: true,
            scores: scoresConvertidos
        });

    } catch (error) {
        console.error("Erro no Servidor:", error);
        return res.status(500).json({ success: false, message: 'Falha na comunicação com a API Esportiva.' });
    }
}
