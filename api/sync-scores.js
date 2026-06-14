export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Método não permitido' });
    }

    try {
        // =================================================================
        // SIMULADOR DE API (MOCK) PARA APRESENTAÇÃO DE PORTFÓLIO/FACULDADE
        // Como a API-Sports ainda não tem os jogos de 2026, criamos um 
        // pacote de dados idêntico ao deles para provar que a lógica funciona.
        // =================================================================
        const mockApiResponse = {
            response: [
                {
                    fixture: { id: 1045982, status: { short: 'FT' } },
                    teams: { home: { name: 'Mexico' }, away: { name: 'South Africa' } },
                    goals: { home: 2, away: 0 }
                },
                {
                    fixture: { id: 1045983, status: { short: 'FT' } },
                    teams: { home: { name: 'South Korea' }, away: { name: 'Czech Republic' } },
                    goals: { home: 2, away: 1 }
                },
                {
                    fixture: { id: 1045984, status: { short: 'FT' } },
                    teams: { home: { name: 'Canada' }, away: { name: 'Bosnia' } },
                    goals: { home: 1, away: 1 }
                },
                {
                    fixture: { id: 1045985, status: { short: 'FT' } },
                    teams: { home: { name: 'USA' }, away: { name: 'Paraguay' } },
                    goals: { home: 4, away: 1 }
                },
                {
                    fixture: { id: 1045986, status: { short: 'FT' } },
                    teams: { home: { name: 'Catar' }, away: { name: 'Suiça' } },
                    goals: { home: 1, away: 1 }
                },
                {
                    fixture: { id: 1045987, status: { short: 'FT' } },
                    teams: { home: { name: 'Brasil' }, away: { name: 'Marrocos' } },
                    goals: { home: 1, away: 1 }
                },
                {
                    fixture: { id: 1045988, status: { short: 'FT' } },
                    teams: { home: { name: 'Haiti' }, away: { name: 'Escócia' } },
                    goals: { home: 0, away: 1 }
                },
                {
                    fixture: { id: 1045985, status: { short: 'FT' } },
                    teams: { home: { name: 'Austrália' }, away: { name: 'Turquia' } },
                    goals: { home: 2, away: 0 }
                }
            ]
        };

        let scoresConvertidos = {};
        let listaParaMapear = []; 

        // =================================================================
        // DICIONÁRIO DE DADOS (O DE-PARA)
        // Aqui mapeamos os IDs que a API (Mock) gerou para os nossos IDs
        // =================================================================
        const dicionarioJogos = {
            '1045982': 'wc-1', // Liga o 1045982 ao jogo do México
            '1045983': 'wc-2', // Liga o 1045983 ao jogo da Coreia
            '1045984': 'wc-3', // Liga o 1045984 ao jogo do Canadá
            '1045985': 'wc-4', // Liga o 1045985 ao jogo dos EUA
            '1045986': 'wc-5', // Liga o 1045985 ao jogo dos Catar
            '1045987': 'wc-6', // Liga o 1045985 ao jogo dos Brasil
            '1045988': 'wc-7', // Liga o 1045985 ao jogo dos Haiti
            '1045989': 'wc-8', // Liga o 1045985 ao jogo dos Austrália
        };

        // =================================================================
        // MOTOR DE TRANSFORMAÇÃO
        // =================================================================
        if (mockApiResponse.response && mockApiResponse.response.length > 0) {
            mockApiResponse.response.forEach(jogo => {
                
                // Grava o ID para a nossa "Descoberta de Dados"
                listaParaMapear.push(`ID: ${jogo.fixture.id} | Jogo: ${jogo.teams.home.name} x ${jogo.teams.away.name} | Status: ${jogo.fixture.status.short}`);

                const apiId = jogo.fixture.id.toString();
                const nossoId = dicionarioJogos[apiId];
                
                // FT significa Full Time (Jogo Encerrado)
                const statusEncerrado = ['FT', 'AET', 'PEN'].includes(jogo.fixture.status.short);

                if (nossoId && statusEncerrado && jogo.goals.home !== null) {
                    scoresConvertidos[nossoId] = {
                        a: jogo.goals.home,
                        b: jogo.goals.away
                    };
                }
            });
        }

        // Devolve os dados para o Aplicativo (Front-end)
        return res.status(200).json({
            success: true,
            scores: scoresConvertidos,
            descoberta_de_ids: listaParaMapear
        });

    } catch (error) {
        console.error("Erro no Servidor ETL:", error);
        return res.status(500).json({ success: false, message: 'Falha na comunicação.' });
    }
}
