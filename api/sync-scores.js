export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Método não permitido' });
    }

    try {
        // =================================================================
        // API PRÓPRIA (GITHUB GIST) - AMBIENTE DE CONTROLE TOTAL
        // =================================================================
        // Link sem o "hash" de versão para garantir que puxa sempre a última edição!
        const urlGitHub = 'https://gist.githubusercontent.com/ivs-bm/9836907e34b7918bd9fc23218f40d7e2/raw/copa-api.json';
        
        // Faz a extração dos dados (O "E" do processo de ETL)
        const response = await fetch(urlGitHub, { method: 'GET' });
        const apiData = await response.json();
        
        let scoresConvertidos = {};
        let listaParaMapear = []; 

        // =================================================================
        // DICIONÁRIO DE DADOS (O DE-PARA)
        // =================================================================
        const dicionarioJogos = {
            '1045982': 'wc-1', // ID da API liga ao jogo do México
            '1045983': 'wc-3', // ID da API liga ao jogo do Canadá
            // Quando cadastrar novos jogos no seu Gist, mapeie-os aqui!
        };

        // =================================================================
        // MOTOR DE TRANSFORMAÇÃO (O "T" do processo de ETL)
        // =================================================================
        if (apiData.response && apiData.response.length > 0) {
            apiData.response.forEach(jogo => {
                
                // Rastreamento invisível para a sua apresentação na aba Network
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

        // =================================================================
        // CARGA (O "L" do processo de ETL)
        // =================================================================
        return res.status(200).json({
            success: true,
            scores: scoresConvertidos,
            descoberta_de_ids: listaParaMapear
        });

    } catch (error) {
        console.error("Erro no Servidor ETL:", error);
        return res.status(500).json({ success: false, message: 'Falha na comunicação com o GitHub.' });
    }
}
