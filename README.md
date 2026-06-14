# 🏆 Família Copa: Ecossistema PWA de Gestão de Colecionáveis e Bolão Esportivo

## 📖 Sobre o Projeto
O **Família Copa** é uma aplicação web progressiva (PWA) Full-Stack desenvolvida para modernizar e unificar a experiência da Copa do Mundo. Nascido para resolver o atrito e a desorganização em grupos de amigos e familiares, o sistema substitui o controle analógico de álbuns de figurinhas e as planilhas manuais de bolão por uma plataforma automatizada, segura e orientada a dados em tempo real.

## 🚀 Principais Funcionalidades
* **Gestão de Inventário em Tempo Real:** Controle ágil de figurinhas (Faltantes, Coladas e Repetidas) com cálculos percentuais automáticos de completude do álbum.
* **Matchmaking de Trocas (Motor Inteligente):** Algoritmo de cruzamento de dados que analisa o inventário de todos os usuários da liga e sugere "Trocas Justas" de forma automática (quem tem o que eu preciso e o que eu posso oferecer).
* **Bolão Automatizado com API Externa:** Sistema de apostas com travamento automático de palpites baseados no status do jogo (Em Breve, Ao Vivo, Encerrado) e ranking matemático gerado de forma autônoma.
* **Sistema Multi-Ligas:** Isolamento de dados no banco que permite aos usuários criarem e transitarem entre diferentes grupos (ex: Família, Trabalho, Faculdade) usando códigos de acesso únicos.

## 📱 Demonstração Visual

<div align="center">
  <img src="https://github.com/ivs-bm/album-copa-2026/raw/main/Tela%20do%20%C3%81lbum.jpeg" width="220" alt="Tela do Álbum">
  <img src="https://github.com/ivs-bm/album-copa-2026/raw/main/Tela%20de%20Trocas%20Justas.jpeg" width="220" alt="Tela de Trocas Justas">
  <img src="https://github.com/ivs-bm/album-copa-2026/raw/main/Tela%20de%20Trocas%20Justas%20(com%20o%20Matchmaking%20cruzando%20dados).jpeg" width="220" alt="Matchmaking de Trocas">
  <img src="https://github.com/ivs-bm/album-copa-2026/raw/main/Tela%20do%20Bol%C3%A3o.jpeg" width="220" alt="Tela do Bolão">
</div>

## 🧠 Engenharia de Dados e Lógica Analítica
Este projeto destaca-se pela forte aplicação de conceitos de **Ciência de Dados e Engenharia de Software**:

1. **Lógica de Matchmaking (Teoria dos Conjuntos):** A central de trocas utiliza operações de *Anti-Join* rodando no lado do cliente. O algoritmo pega o vetor de repetidas do `Usuário A` e subtrai os itens já existentes no álbum do `Usuário B`, resultando em recomendações cirúrgicas de escambo, eliminando negociações ineficientes.
2. **Pipeline ETL (Extração, Transformação e Carga):** Para alimentar o Bolão, foi construída uma arquitetura *Serverless*. Uma rota de servidor oculta consulta uma API Esportiva Global (API-Sports), extrai os JSONs brutos da Copa, transforma-os para a lógica interna do app e os carrega no banco de dados para calcular os rankings, sem expor chaves sensíveis.
3. **Motor Matemático de Pontuação:** O ranking não usa somatórios simples. Ele aplica pesos condicionais: 5 pontos para acerto exato de placar, 3 pontos para acerto de saldo de gols/empate, e 1 ponto para acerto do time vencedor, utilizando os acertos exatos como critério de desempate.

## 🗄️ Modelagem do Banco de Dados (NoSQL)
A arquitetura foi construída no Firebase (Cloud Firestore) visando alta escalabilidade e isolamento de informações. Em vez de tabelas SQL tradicionais, utilizamos documentos otimizados:
* `family_albums (Collection)`: Cada documento é uma Liga/Família (identificada por um ID único). Dentro dela, existem mapas aninhados de `stickers` (inventário global daquela liga) e `bolao` (dados dos jogadores, palpites individuais e pontuações).
* `global_data (Collection)`: Contém o documento `Gabarito_Mundial`, alimentado pelo pipeline da API, servindo como uma "Single Source of Truth" (Fonte Única de Verdade) lida por todas as centenas de ligas simultaneamente para atualizar o ranking.

## 🛠️ Tecnologias Utilizadas
* **Front-end:** React.js, Vite, Tailwind CSS e Lucide-Icons.
* **Back-end / APIs:** Vercel Serverless Functions (Node.js).
* **Banco de Dados & Autenticação:** Firebase Cloud Firestore e Google Auth.
* **Deploy e CI/CD:** Hospedagem contínua via Vercel.
* **Provedor de Dados:** API-Sports (RapidAPI).

---
*Desenvolvido como projeto de extensão acadêmica e portfólio de Engenharia de Dados.*
