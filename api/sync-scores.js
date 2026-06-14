export default async function handler(req, res) {
    // 1. SEGURANÇA: Aceita apenas método GET
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Método não permitido' });
    }

    const API_KEY = process.env.API_SPORTS_KEY;
    if (!API_KEY) {
        return res.status(500).json({ success: false, message: 'Chave da API ausente.' });
    }

    try {
        // 2. EXTRAÇÃO: Chamada oficial aos servidores (Copa do Mundo = League 15)
        const response = await fetch('https://v3.football.api-sports.io/fixtures?league=15&season=2026', {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'v3.football.api-sports.io',
                'x-apisports-key': API_KEY
            }
        });
        
        const apiData = await response.json();
        let scoresConvertidos = {};

        // =================================================================
        // DICIONÁRIO DE DADOS (O DE-PARA)
        // =================================================================
        // Quando a API liberar os IDs reais de 2026, substitua os zeros da esquerda.
        const dicionarioJogos = {
            '000001': 'wc-1', // API ID -> MEX x RSA
            '000002': 'wc-2', // API ID -> CAN x BIH
            '000003': 'wc-3', // API ID -> KOR x CZE
            '000004': 'wc-4', // API ID -> USA x PAR
            // A lista segue para os demais jogos da fase de grupos...
        };

        // =================================================================
        // TRANSFORMAÇÃO: Motor Analítico
        // =================================================================
        if (apiData.response && apiData.response.length > 0) {
            apiData.response.forEach(jogo => {
                const apiId = jogo.fixture.id.toString();
                const nossoId = dicionarioJogos[apiId];
                
                // Valida se o jogo encerrou (FT = Full Time, AET = Extra Time, PEN = Penalties)
                const statusEncerrado = ['FT', 'AET', 'PEN'].includes(jogo.fixture.status.short);

                // Só processa se o jogo existe no nosso dicionário e já terminou
                if (nossoId && statusEncerrado && jogo.goals.home !== null) {
                    scoresConvertidos[nossoId] = {
                        a: jogo.goals.home,
                        b: jogo.goals.away
                    };
                }
            });
        }

        // 3. CARGA: Entrega os dados limpos ao React
        return res.status(200).json({
            success: true,
            scores: scoresConvertidos
        });

    } catch (error) {
        console.error("Erro no Servidor ETL:", error);
        return res.status(500).json({ success: false, message: 'Falha na comunicação.' });
    }
}
