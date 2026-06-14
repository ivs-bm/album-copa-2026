export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Método não permitido' });
    }

    const API_KEY = process.env.API_SPORTS_KEY;
    if (!API_KEY) {
        return res.status(500).json({ success: false, message: 'Chave da API ausente.' });
    }

    try {
        const response = await fetch('https://v3.football.api-sports.io/fixtures?league=15&season=2026', {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'v3.football.api-sports.io',
                'x-apisports-key': API_KEY
            }
        });
        
        const apiData = await response.json();
        let scoresConvertidos = {};
        
        // NOVO: Array que vai capturar os IDs verdadeiros para nós
        let listaParaMapear = []; 

        const dicionarioJogos = {
            '000001': 'wc-1', // Ainda temporário, mudaremos em breve
        };

        if (apiData.response && apiData.response.length > 0) {
            apiData.response.forEach(jogo => {
                
                // MÁGICA: Grava o ID real, os times e o status da partida
                listaParaMapear.push(`ID: ${jogo.fixture.id} | Jogo: ${jogo.teams.home.name} x ${jogo.teams.away.name} | Status: ${jogo.fixture.status.short}`);

                const apiId = jogo.fixture.id.toString();
                const nossoId = dicionarioJogos[apiId];
                const statusEncerrado = ['FT', 'AET', 'PEN'].includes(jogo.fixture.status.short);

                if (nossoId && statusEncerrado && jogo.goals.home !== null) {
                    scoresConvertidos[nossoId] = {
                        a: jogo.goals.home,
                        b: jogo.goals.away
                    };
                }
            });
        }

        return res.status(200).json({
            success: true,
            scores: scoresConvertidos,
            descoberta_de_ids: listaParaMapear // <-- Os IDs reais virão escondidos aqui!
        });

    } catch (error) {
        console.error("Erro no Servidor ETL:", error);
        return res.status(500).json({ success: false, message: 'Falha na comunicação.' });
    }
}
