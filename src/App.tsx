// ============================================================================

// IMPORTAÇÕES E CONFIGURAÇÃO DO FIREBASE

// ============================================================================

import { getFirestore, doc, updateDoc, onSnapshot, setDoc } from 'firebase/firestore';

import React, { useState, useEffect, useRef, useMemo } from 'react';

// Importação dos ícones visuais usados nos botões e menus do aplicativo

import { LogOut, Info, Share2, KeyRound, Copy, Moon, Sun, Book, PieChart, Trophy, User, Download, Star, PlayCircle, ArrowRightLeft } from 'lucide-react';

import { initializeApp, getApps, getApp } from 'firebase/app';

import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';

import { getFirestore, doc, updateDoc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';



// Credenciais de conexão com o seu banco de dados Firebase

const firebaseConfig = { apiKey: "AIzaSyDm80NbEwqVyF5WratOIi-ENe35ykzJ-_Q", authDomain: "albumcopa2026-59c00.firebaseapp.com", projectId: "albumcopa2026-59c00", storageBucket: "albumcopa2026-59c00.firebasestorage.app", messagingSenderId: "839897438384", appId: "1:839897438384:web:b70a235d7f777c34080375" };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

const db = getFirestore(app);



// ============================================================================

// ESTRUTURA DE DADOS (BANCO DE FIGURINHAS)

// ============================================================================

// Esta lista define todas as seleções, suas bandeiras, prefixos e quantidade de figurinhas
const SECTIONS = [
  { id: 'FWC_INI', title: 'Ínicio', prefix: 'FWC', flag: '🏠', items: ['00', '1', '2', '3', '4', '5', '6', '7', '8'], group: 'Especiais' },
  { id: 'FWC_HST', title: 'História', prefix: 'FWC', flag: '🏆', items: ['9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'], group: 'Especiais' },
  { id: 'CC', title: 'Coca-Cola', prefix: 'CC', flag: '🥤', count: 14, group: 'Especiais' },
  { id: 'MEX', title: 'México', prefix: 'MEX', flag: '🇲🇽', count: 20, group: 'Grupo A' },
  { id: 'RSA', title: 'África do Sul', prefix: 'RSA', flag: '🇿🇦', count: 20, group: 'Grupo A' },
  { id: 'KOR', title: 'Coreia do Sul', prefix: 'KOR', flag: '🇰🇷', count: 20, group: 'Grupo A' },
  { id: 'CZE', title: 'Rep. Tcheca', prefix: 'CZE', flag: '🇨🇿', count: 20, group: 'Grupo A' },
  { id: 'CAN', title: 'Canadá', prefix: 'CAN', flag: '🇨🇦', count: 20, group: 'Grupo B' },
  { id: 'BIH', title: 'Bósnia', prefix: 'BIH', flag: '🇧🇦', count: 20, group: 'Grupo B' },
  { id: 'QAT', title: 'Catar', prefix: 'QAT', flag: '🇶🇦', count: 20, group: 'Grupo B' },
  { id: 'SUI', title: 'Suíça', prefix: 'SUI', flag: '🇨🇭', count: 20, group: 'Grupo B' },
  { id: 'BRA', title: 'Brasil', prefix: 'BRA', flag: '🇧🇷', count: 20, group: 'Grupo C' },
  { id: 'MAR', title: 'Marrocos', prefix: 'MAR', flag: '🇲🇦', count: 20, group: 'Grupo C' },
  { id: 'HAI', title: 'Haiti', prefix: 'HAI', flag: '🇭🇹', count: 20, group: 'Grupo C' },
  { id: 'SCO', title: 'Escócia', prefix: 'SCO', flag: '🇬🇧', flagUrlApple: '/gb-sct-iphone.png', flagUrlAndroid: '/gb-sct-android.png', count: 20, group: 'Grupo C' },
  { id: 'USA', title: 'EUA', prefix: 'USA', flag: '🇺🇸', count: 20, group: 'Grupo D' },
  { id: 'PAR', title: 'Paraguai', prefix: 'PAR', flag: '🇵🇾', count: 20, group: 'Grupo D' },
  { id: 'AUS', title: 'Austrália', prefix: 'AUS', flag: '🇦🇺', count: 20, group: 'Grupo D' },
  { id: 'TUR', title: 'Turquia', prefix: 'TUR', flag: '🇹🇷', count: 20, group: 'Grupo D' },
  { id: 'GER', title: 'Alemanha', prefix: 'GER', flag: '🇩🇪', count: 20, group: 'Grupo E' },
  { id: 'CUW', title: 'Curaçao', prefix: 'CUW', flag: '🇨🇼', count: 20, group: 'Grupo E' },
  { id: 'CIV', title: 'Costa do Marfim', prefix: 'CIV', flag: '🇨🇮', count: 20, group: 'Grupo E' },
  { id: 'ECU', title: 'Equador', prefix: 'ECU', flag: '🇪🇨', count: 20, group: 'Grupo E' },
  { id: 'NED', title: 'Holanda', prefix: 'NED', flag: '🇳🇱', count: 20, group: 'Grupo F' },
  { id: 'JPN', title: 'Japão', prefix: 'JPN', flag: '🇯🇵', count: 20, group: 'Grupo F' },
  { id: 'SWE', title: 'Suécia', prefix: 'SWE', flag: '🇸🇪', count: 20, group: 'Grupo F' },
  { id: 'TUN', title: 'Tunísia', prefix: 'TUN', flag: '🇹🇳', count: 20, group: 'Grupo F' },
  { id: 'BEL', title: 'Bélgica', prefix: 'BEL', flag: '🇧🇪', count: 20, group: 'Grupo G' },
  { id: 'EGY', title: 'Egito', prefix: 'EGY', flag: '🇪🇬', count: 20, group: 'Grupo G' },
  { id: 'IRN', title: 'Irã', prefix: 'IRN', flag: '🇮🇷', count: 20, group: 'Grupo G' },
  { id: 'NZL', title: 'Nova Zelândia', prefix: 'NZL', flag: '🇳🇿', count: 20, group: 'Grupo G' },
  { id: 'ESP', title: 'Espanha', prefix: 'ESP', flag: '🇪🇸', count: 20, group: 'Grupo H' },
  { id: 'CPV', title: 'Cabo Verde', prefix: 'CPV', flag: '🇨🇻', count: 20, group: 'Grupo H' },
  { id: 'KSA', title: 'Arábia Saudita', prefix: 'KSA', flag: '🇸🇦', count: 20, group: 'Grupo H' },
  { id: 'URU', title: 'Uruguai', prefix: 'URU', flag: '🇺🇾', count: 20, group: 'Grupo H' },
  { id: 'FRA', title: 'França', prefix: 'FRA', flag: '🇫🇷', count: 20, group: 'Grupo I' },
  { id: 'SEN', title: 'Senegal', prefix: 'SEN', flag: '🇸🇳', count: 20, group: 'Grupo I' },
  { id: 'IRQ', title: 'Iraque', prefix: 'IRQ', flag: '🇮🇶', count: 20, group: 'Grupo I' },
  { id: 'NOR', title: 'Noruega', prefix: 'NOR', flag: '🇳🇴', count: 20, group: 'Grupo I' },
  { id: 'ARG', title: 'Argentina', prefix: 'ARG', flag: '🇦🇷', count: 20, group: 'Grupo J' },
  { id: 'ALG', title: 'Argélia', prefix: 'ALG', flag: '🇩🇿', count: 20, group: 'Grupo J' },
  { id: 'AUT', title: 'Áustria', prefix: 'AUT', flag: '🇦🇹', count: 20, group: 'Grupo J' },
  { id: 'JOR', title: 'Jordânia', prefix: 'JOR', flag: '🇯🇴', count: 20, group: 'Grupo J' },
  { id: 'POR', title: 'Portugal', prefix: 'POR', flag: '🇵🇹', count: 20, group: 'Grupo K' },
  { id: 'COD', title: 'Congo', prefix: 'COD', flag: '🇨🇩', count: 20, group: 'Grupo K' },
  { id: 'UZB', title: 'Uzbequistão', prefix: 'UZB', flag: '🇺🇿', count: 20, group: 'Grupo K' },
  { id: 'COL', title: 'Colômbia', prefix: 'COL', flag: '🇨🇴', count: 20, group: 'Grupo K' },
  { id: 'ENG', title: 'Inglaterra', prefix: 'ENG', flag: '🇬🇧', flagUrlApple: '/gb-eng-iphone.png', flagUrlAndroid: '/gb-eng-android.png', count: 20, group: 'Grupo L' },
  { id: 'CRO', title: 'Croácia', prefix: 'CRO', flag: '🇭🇷', count: 20, group: 'Grupo L' },
  { id: 'GHA', title: 'Gana', prefix: 'GHA', flag: '🇬🇭', count: 20, group: 'Grupo L' },
  { id: 'PAN', title: 'Panamá', prefix: 'PAN', flag: '🇵🇦', count: 20, group: 'Grupo L' },
];



// Funções utilitárias para contar o número total de figurinhas do álbum

const getSectionKeys = (sec) => sec.count ? Array.from({ length: sec.count }, (_, i) => `${sec.prefix}-${i + 1}`) : sec.items.map(item => `${sec.prefix}-${item}`);

const TOTAL_STICKERS = SECTIONS.reduce((acc, sec) => acc + (sec.count || sec.items.length), 0);

// ============================================================================
// ESTRUTURA OFICIAL: JOGOS DA COPA DO MUNDO 2026
// ============================================================================
const MATCHES = [
  // Rodada 1 - Fase de Grupos
  { id: 'wc-1', date: '11/06 - 15:00', teamA: 'MEX', teamB: 'GER', status: 'pending' }, // Jogo 1 (Abertura)
  { id: 'wc-2', date: '11/06 - 19:00', teamA: 'CAN', teamB: 'ENG', status: 'pending' }, // Jogo 2
  { id: 'wc-3', date: '12/06 - 15:00', teamA: 'USA', teamB: 'FRA', status: 'pending' }, // Jogo 3
  { id: 'wc-4', date: '12/06 - 18:00', teamA: 'BRA', teamB: 'SUI', status: 'pending' }, // Jogo 4
  
  // Nota: Você pode duplicar essas linhas e adicionar os 104 jogos da Copa aqui.
  // Basta alterar as siglas (teamA / teamB) quando a FIFA fizer o sorteio oficial dos grupos!
];

// ============================================================================
// CONEXÃO COM O BACK-END (ETL Real)
// ============================================================================
const fetchApiScores = async () => {
    try {
        // Agora a aplicação chama o nosso próprio servidor de forma segura
        const response = await fetch('/api/sync-scores', { method: 'GET' });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar dados do servidor interno:", error);
        return { success: false };
    }
};



// ============================================================================

// COMPONENTE PRINCIPAL (APLICATIVO)

// ============================================================================

export default function App() {

  // ============================================================================

  // ESTADOS DA APLICAÇÃO (Variáveis que mudam e atualizam a tela)

  // ============================================================================

  const [user, setUser] = useState(null); // Armazena os dados da conta Google logada

  const [isAuthLoading, setIsAuthLoading] = useState(true); // Controle da tela de carregamento inicial

  const [activeFamilyId, setActiveFamilyId] = useState(''); // ID da família do usuário

  const [joinCode, setJoinCode] = useState(''); // Código digitado no input de convite

  const [stickers, setStickers] = useState({}); // Dicionário contendo o status de cada figurinha

  const [isPro, setIsPro] = useState(false); // Status de conta Premium/Pro

  const [pixCode, setPixCode] = useState(''); // Armazena o código PIX para tornar-se PRO

  const [showTutorial, setShowTutorial] = useState(false); // Controle se o modal "Guia Rápido" está aberto

  const [toast, setToast] = useState(''); // Controle dos alertas verdes no topo da tela
  
  
  
  // Detector de Sistema: Verifica se o usuário está no iPhone/iPad/Mac
  const isAppleDevice = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);

  

  const [activeTab, setActiveTab] = useState('album'); // Aba atual selecionada no menu inferior
  
  const [statsFilter, setStatsFilter] = useState(null); // Filtros: 'coladas', 'repetidas', 'faltantes' ou null

  const [isDarkMode, setIsDarkMode] = useState(true); // Controle do modo Claro/Escuro

  

  // Estados referentes ao PWA (Instalação no celular)

  const [deferredPrompt, setDeferredPrompt] = useState(null); 

  const [isStandalone, setIsStandalone] = useState(false); 

  
 
  // ==========================================================
  // NOVOS ESTADOS: Referentes ao motor de Trocas Justas
  // ==========================================================
  const [compareId, setCompareId] = useState('');
  const [tradeStats, setTradeStats] = useState({ send: [], receive: [] });
  const [isLoadingCompare, setIsLoadingCompare] = useState(false);
  const [friendData, setFriendData] = useState(null);

  

  const sectionsRef = useRef({}); // Referência para deslizar as bandeiras
  
  
  const [magicCode, setMagicCode] = useState('');
  
  
  
  // Memória das Ligas que o usuário participa
  const [savedLeagues, setSavedLeagues] = useState(() => {
     const local = localStorage.getItem('@AlbumCopa_Leagues');
     return local ? JSON.parse(local) : [];
  });
  
  
  // ESTADOS DO BOLÃO
  const [guesses, setGuesses] = useState({}); // Memória que guarda os palpites individuais
  const [officialScores, setOfficialScores] = useState({}); // Memória que guarda o Gabarito Oficial
  const [isAdminMode, setIsAdminMode] = useState(false); // Controle da tela do Administrador
  const [allPlayersData, setAllPlayersData] = useState({}); // Memória para todos os jogadores da família
  const [bolaoView, setBolaoView] = useState('jogos'); // Controle da subtela: 'jogos' ou 'ranking'
  const [isSyncingAPI, setIsSyncingAPI] = useState(false); // Controle de carregamento da API de jogos
  const [expandedMatch, setExpandedMatch] = useState(null); // NOVO: Controla qual jogo exibe os palpites da galera
  
  // Função que atualiza o número digitado na caixinha em tempo real
  const handleGuess = (matchId, team, value) => {
    if (value !== '' && (value < 0 || value > 99)) return; // Trava contra números absurdos
    
    // Se o Admin Mode estiver ligado, salva no Gabarito. Se não, salva no palpite do usuário.
    if (isAdminMode) {
        setOfficialScores(prev => ({
          ...prev,
          [matchId]: { ...prev[matchId], [team]: value }
        }));
    } else {
        setGuesses(prev => ({
          ...prev,
          [matchId]: { ...prev[matchId], [team]: value }
        }));
    }
  };
    
  // ==========================================================
  // INÍCIO DO PASSO 3: CÉREBRO MATEMÁTICO E RANKING
  // ==========================================================
  
  // Função Matemática: Calcula os pontos de um único palpite
  const calculatePoints = (guessA, guessB, realA, realB) => {
      // Se alguém não preencheu a caixa, 0 pontos
      if (guessA === '' || guessB === '' || realA === '' || realB === '' || guessA === undefined || guessB === undefined) return 0;
      
      const gA = parseInt(guessA, 10);
      const gB = parseInt(guessB, 10);
      const rA = parseInt(realA, 10);
      const rB = parseInt(realB, 10);

      // Regra 1: Cravou o placar exato
      if (gA === rA && gB === rB) return 5; 

      const guessDiff = gA - gB;
      const realDiff = rA - rB;

      // Regra 2: Acertou a diferença de gols (saldo) ou acertou o empate (ambos os saldos são 0)
      if (guessDiff === realDiff) return 3; 

      const guessWinner = guessDiff > 0 ? 'A' : (guessDiff < 0 ? 'B' : 'E');
      const realWinner = realDiff > 0 ? 'A' : (realDiff < 0 ? 'B' : 'E');

      // Regra 3: Acertou apenas quem ia vencer
      if (guessWinner === realWinner) return 1; 

      // Errou tudo
      return 0; 
  };

  // Motor do Ranking: Processa a matemática apenas quando os dados mudam
  const rankingList = useMemo(() => {
      const players = Object.entries(allPlayersData).map(([uid, playerData]) => {
          let totalPoints = 0;
          let exactMatches = 0; // Critério de desempate principal

          // Passa por todos os jogos que o jogador palpitou
          Object.keys(playerData.guesses || {}).forEach(matchId => {
              const guess = playerData.guesses[matchId];
              const real = officialScores[matchId];
              
              // Só calcula se o Admin já preencheu o Gabarito Oficial daquela partida
              if (real && real.a !== '' && real.b !== '') {
                  const pts = calculatePoints(guess?.a, guess?.b, real.a, real.b);
                  totalPoints += pts;
                  if (pts === 5) exactMatches++;
              }
          });

          return {
              uid,
              name: playerData.name || 'Jogador',
              photo: playerData.photo || null,
              points: totalPoints,
              exactMatches
          };
      });

      // Ordena do maior pro menor ponto. Em caso de empate, quem tem mais "Cravadas" sobe.
      return players.sort((a, b) => b.points - a.points || b.exactMatches - a.exactMatches);
  }, [allPlayersData, officialScores]);



  // ============================================================================

  // EFEITOS E LÓGICA DE INICIALIZAÇÃO

  // ============================================================================

  

  // Efeito 1: Captura a permissão do celular para instalar o App (PWA)

  // Efeito 1: Registro do Service Worker e Captura de instalação

  useEffect(() => {

    // Registro do Service Worker

    if ('serviceWorker' in navigator) {

      navigator.serviceWorker.register('/sw.js')

        .then(() => console.log('Service Worker registrado!'))

        .catch((err) => console.log('Erro ao registrar SW:', err));

    }



    // Verifica se já está em modo standalone

    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {

      setIsStandalone(true);

    }

    

    // Captura o evento de instalação

    const handleBeforeInstallPrompt = (e) => {

      e.preventDefault();

      setDeferredPrompt(e);

    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

  }, []);



  // Função: Botão "Instalar Aplicativo"

  const handleInstallClick = async () => {

    if (deferredPrompt) {

      deferredPrompt.prompt();

      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {

        setDeferredPrompt(null);

        setIsStandalone(true);

      }

    } else {

      setToast("Abra o menu do navegador (3 pontinhos) e toque em 'Adicionar à Tela Inicial'.");

      setTimeout(() => setToast(''), 4500);

    }

  };



  // Efeito 2: Verifica o login do usuário quando o App carrega
  useEffect(() => { 
    const unsubscribe = onAuthStateChanged(auth, async (u) => { 
      setUser(u); 
      if (u) {
        const savedFamilyId = localStorage.getItem('@AlbumCopa_FamilyId');
        setActiveFamilyId(savedFamilyId ? savedFamilyId : u.uid);
        
        // NOVO CÓDIGO: Registra o usuário no banco imediatamente no login
        // Ele usa o merge: true para nunca apagar as figurinhas se o usuário já existir
        try {
          await setDoc(doc(db, 'family_albums', u.uid), {
            adminEmail: u.email,
            // Apenas marca false se o campo não existir (não tira o Pro de quem já pagou)
          }, { merge: true });
        } catch (error) {
          console.error("Erro ao registrar usuário no banco:", error);
        }

      } else {
        localStorage.removeItem('@AlbumCopa_FamilyId');
        setActiveFamilyId('');
      }
      setIsAuthLoading(false);
    }); 
    return () => unsubscribe();
  }, []);



  // Efeito 3: Busca as figurinhas e os dados do Bolão em tempo real no banco
  useEffect(() => {
    if (!activeFamilyId) return;
    return onSnapshot(doc(db, 'family_albums', activeFamilyId), (d) => {
      if (d.exists()) { 
          const data = d.data();
          setStickers(data.stickers || {}); 
          setIsPro(!!data.isPro); 
          
          // Carrega os palpites salvos deste usuário específico (CORREÇÃO DE VAZAMENTO)
          if (user && data.bolao && data.bolao[user.uid]) {
              setGuesses(data.bolao[user.uid].guesses || {});
          } else {
              // Se o usuário não tem palpites nesta liga, ZERA as caixinhas obrigatoriamente
              setGuesses({}); 
          }
                    
		  // Carrega os dados de todos os jogadores para o processamento matemático do Ranking
          setAllPlayersData(data.bolao || {});
      } else {
          // Se o documento inteiro ainda não existir, zera tudo por segurança
          setStickers({});
          setGuesses({});
          setOfficialScores({});
          setAllPlayersData({});
      }
    });
  }, [activeFamilyId, user]);
  
  
  
  // Efeito 4: Sincronização com o Gabarito Mundial (Para todas as ligas)
  useEffect(() => {
    // Este listener não depende do activeFamilyId, ele lê a base global diretamente
    return onSnapshot(doc(db, 'global_data', 'Gabarito_Mundial'), (d) => {
      if (d.exists()) {
          setOfficialScores(d.data().scores || {});
      } else {
          setOfficialScores({});
      }
    });
  }, []);



  // ============================================================================

  // FUNÇÕES DE INTERAÇÃO

  // ============================================================================

  
  const copyToClipboard = (text, msg) => { 
    navigator.clipboard.writeText(text).then(() => { 
      setToast(msg); 
      // Faz o aviso de cópia sumir após 2 segundos
      setTimeout(() => setToast(''), 2000); 
    }); 
  };
  
  // Função: Quando clica na figurinha para colar/repetir
    const toggleSticker = async (key) => {

    const newStatus = ((stickers[key] || 0) + 1) % 3;

    setStickers({...stickers, [key]: newStatus});

    await updateDoc(doc(db, 'family_albums', activeFamilyId), { [`stickers.${key}`]: newStatus }).catch(() => {});

  };
  
  
  // ==========================================================
  // NOVA FUNÇÃO: Comparar Álbuns (Troca Justa)
  // ==========================================================
  // Função: Comparar Álbuns (Troca Justa)
  const handleCompareAlbums = async () => {
    // CORREÇÃO 1: Adicionado o timer se o código for inválido ou vazio
    if (!compareId.trim() || compareId.trim() === activeFamilyId) {
      setToast("Digite um código de amigo válido.");
      setTimeout(() => setToast(''), 3000);
      return; 
    }
    
    setIsLoadingCompare(true);
    setToast("Analisando álbuns...");
    
    try {
      const docRef = doc(db, 'family_albums', compareId.trim());
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const friendStickers = docSnap.data().stickers || {};
        let send = []; 
        let receive = []; 

        SECTIONS.forEach(sec => {
          const keys = sec.count ? Array.from({length: sec.count}, (_, i) => `${sec.prefix}-${i+1}`) : sec.items.map(i => `${sec.prefix}-${i}`);
          keys.forEach(k => {
            const myStatus = stickers[k] || 0;
            const friendStatus = friendStickers[k] || 0;
            if (myStatus === 2 && friendStatus === 0) send.push(k);
            if (friendStatus === 2 && myStatus === 0) receive.push(k);
          });
        });

        setTradeStats({ send, receive });
        setFriendData({ id: compareId.trim(), email: docSnap.data().adminEmail });
        setToast("Análise concluída!");
        setTimeout(() => setToast(''), 5000); 
      } else {
        // CORREÇÃO 2: Adicionado o timer se o álbum não for encontrado no banco
        setToast("Álbum não encontrado!");
        setTimeout(() => setToast(''), 3000);
      }
    } catch (e) {
      // CORREÇÃO 3: Adicionado o timer se der erro de conexão com o Firebase
      setToast("Erro ao buscar álbum.");
      setTimeout(() => setToast(''), 3000);
    }
    setIsLoadingCompare(false);
  };
  
  
  
  // Função: Limpar a tela de trocas para uma nova consulta
          const handleClearCompare = () => {
            setCompareId('');
            setFriendData(null);
            setTradeStats({ send: [], receive: [] });
  };
  
  

  // ============================================================================
  // AQUI FOI FEITA A CORREÇÃO DA INTEGRAÇÃO DO PIX (Chamada de API Real)
  // ============================================================================
  const handleBuyPro = async () => {
    setToast("Gerando Pix...");
    try {
      const response = await fetch('/api/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
			userId: activeFamilyId || user.uid, // <--- A MUDANÇA ESTÁ AQUI
			email: user.email || 'comprador@album.com' 
        })
      });
      const data = await response.json();
      
      if (data.qr_code) {
        setPixCode(data.qr_code);
        setToast("Pix gerado com sucesso!");
        // O aviso some após 3 segundos
        setTimeout(() => setToast(''), 3000); 
      } else {
        setToast("Erro: " + (data.error || "Erro ao gerar Pix"));
        setTimeout(() => setToast(''), 3000);
      }
    } catch (e) {
      setToast("Erro de conexão.");
      setTimeout(() => setToast(''), 3000);
      console.error(e);
    }
  };

  

  // Função: Faz a tela deslizar ao clicar na bandeira do menu superior
  const scrollToSection = (id) => {
      setActiveTab('album');
      setTimeout(() => {
          const element = sectionsRef.current[id];
          if (element) {
              const topPos = element.getBoundingClientRect().top + window.scrollY - (savedLeagues.length > 0 ? 225 : 190); 
              window.scrollTo({ top: topPos, behavior: 'smooth' });
          }
      }, 100);
  };



  // Cálculo de Estatísticas da coleção

  const stats = useMemo(() => {

    let coladas = 0; let repetidas = 0;

    Object.values(stickers).forEach(s => { 

        if (s === 1) coladas++; 

        if (s === 2) repetidas++; 

    });

    const faltantes = TOTAL_STICKERS - (coladas + repetidas);

    return { 

        coladas, repetidas, faltantes,

        percColadas: ((coladas / TOTAL_STICKERS) * 100).toFixed(1),

        percRepetidas: ((repetidas / TOTAL_STICKERS) * 100).toFixed(1),

        percFaltantes: ((faltantes / TOTAL_STICKERS) * 100).toFixed(1),

        percentage: TOTAL_STICKERS > 0 ? (((coladas + repetidas) / TOTAL_STICKERS) * 100).toFixed(0) : 0 

    };

  }, [stickers]);



  // ============================================================================

  // RENDERIZAÇÃO: TELAS DE CARREGAMENTO E LOGIN

  // ============================================================================

  if (isAuthLoading) {

    return (

      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">

        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-500 border-opacity-50"></div>

        <p className="text-white mt-4 font-bold text-sm opacity-80">Carregando...</p>

      </div>

    );

  }



  if (!user) return (

    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">

      <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} className="bg-white text-black px-8 py-3 rounded-full font-bold shadow-xl">Entrar com Google</button>

    </div>

  );



  // Variáveis para trocar cores baseadas no Tema Claro/Escuro

  const themeBg = isDarkMode ? "bg-slate-900" : "bg-slate-50";

  const cardBg = isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-100 text-slate-800";

  const textColor = isDarkMode ? "text-slate-200" : "text-slate-600";

  const titleColor = isDarkMode ? "text-white" : "text-slate-800";



  // ============================================================================

  // RENDERIZAÇÃO PRINCIPAL (INTERFACE DO APLICATIVO LOGADO)

  // ============================================================================
	
	// Extrai a lista de grupos únicos para desenhar o novo menu
  const uniqueGroups = [...new Set(SECTIONS.map(item => item.group))];
  
  
   return (

    // DIV PRINCIPAL: Mantido exatamente como no primeiro print (max-w-[100vw] overflow-x-hidden)

    <div className={`w-full min-w-[100vw] max-w-[100vw] min-h-screen flex flex-col ${themeBg} relative overflow-x-hidden pb-20 transition-colors duration-300`}>

      <style>{`

        * { box-sizing: border-box !important; }

        html, body { width: 100%; margin: 0; padding: 0; overflow-x: hidden !important; overscroll-behavior-x: none; }

        .hide-scrollbar::-webkit-scrollbar { display: none; }

      `}</style>

      

      {/* TOAST NOTIFICATION: Balão de aviso flutuante */}
      
	  {toast && <div style={{ top: savedLeagues.length > 0 ? '140px' : '90px' }} className="fixed z-[60] left-1/2 -translate-x-1/2 w-max max-w-[90%] bg-emerald-600 text-white px-4 py-2 rounded-full text-xs shadow-xl text-center font-bold transition-all">{toast}</div>}

      

      {/* ======================================================================= */}
      {/* CABEÇALHO (HEADER) FIXO E DINÂMICO */}
      {/* ======================================================================= */}
      <header className={`w-full min-h-[76px] h-auto ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-emerald-800 to-teal-700'} text-white px-4 py-3 fixed top-0 left-0 z-50 shadow-md transition-all`}>
        <div className="flex justify-between items-center mb-2">
           <div className="flex items-center gap-3">
             <img src={user.photoURL} className="w-9 h-9 rounded-full border-2 border-emerald-400" alt="User" />
             <div>
                 <h1 className="font-black text-sm leading-tight">Família Copa</h1>
                 <p className="text-[10px] text-emerald-200">{stats.percentage}% Concluído</p>
             </div>
           </div>
           <div className="flex gap-2 shrink-0">
              <button onClick={() => setShowTutorial(true)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Info size={18} /></button>
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  {isDarkMode ? <Sun size={18} className="text-yellow-400"/> : <Moon size={18} />}
              </button>
           </div>
        </div>
        
        <div className="flex items-center gap-3 mt-1 mb-1">
           <div className="flex-1 h-1.5 bg-black/30 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 transition-all" style={{ width: `${stats.percentage}%` }}></div></div>
        </div>

        {/* BARRA DE TROCA RÁPIDA DE LIGAS */}
        {(savedLeagues.length > 0 || (user && activeFamilyId !== user.uid)) && (
            <div className="w-full mt-3 pt-3 border-t border-white/10 flex gap-2 overflow-x-auto hide-scrollbar">
                <button 
                   onClick={() => { setActiveFamilyId(user.uid); localStorage.setItem('@AlbumCopa_FamilyId', user.uid); }}
                   className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${activeFamilyId === user.uid ? 'bg-white text-emerald-800 border-white shadow-md scale-105' : 'bg-black/20 text-white/80 border-transparent hover:bg-black/30'}`}
                >
                   🏠 Minha Família
                </button>
                {savedLeagues.map(leagueCode => (
                    <button 
                       key={leagueCode}
                       onClick={() => { setActiveFamilyId(leagueCode); localStorage.setItem('@AlbumCopa_FamilyId', leagueCode); }}
                       className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1 ${activeFamilyId === leagueCode ? 'bg-white text-emerald-800 border-white shadow-md scale-105' : 'bg-black/20 text-white/80 border-transparent hover:bg-black/30'}`}
                    >
                       🏆 {leagueCode.replace('LIGA-', '')}
                    </button>
                ))}
            </div>
        )}
      </header>



      {/* ======================================================================= */}

      {/* MODAL: GUIA RÁPIDO */}

      {/* ======================================================================= */}

      {showTutorial && (

        <div className="fixed inset-0 z-50 bg-black/60 p-4 flex items-center justify-center backdrop-blur-sm" onClick={() => setShowTutorial(false)}>

          <div className={`${cardBg} p-6 rounded-3xl w-full max-w-lg shadow-2xl space-y-4`} onClick={e => e.stopPropagation()}>

            <h2 className={`font-black ${titleColor} text-lg border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} pb-2`}>Guia Rápido</h2>

            <div className="text-sm space-y-3">

              <p>🏷️ <strong>Status:</strong> Toque 1x Colada, 2x Repetida, 3x Faltante.</p>

              <p>👆 <strong>Navegação:</strong> Use a barra superior para pular entre seleções.</p>

              <p>☀️🌙 <strong>Temas:</strong> Use o botão de Sol/Lua para alternar temas.</p>

              <p>📊 <strong>Resumo:</strong> Visão Geral da sua coleção com gráficos.</p>

              <p>🏆 <strong>Bolão:</strong> Acompanhe os jogos da Copa.</p>

              <p>👤 <strong>Perfil:</strong> Gerencie família, links e instale o app.</p>

              <p>✨ <strong>Usuários Pro:</strong> Ferramentas de administrador.</p>

            </div>

            <button onClick={() => setShowTutorial(false)} className={`w-full ${isDarkMode ? 'bg-emerald-500' : 'bg-slate-900'} text-white py-3 rounded-xl mt-6 font-bold`}>Entendi!</button>

          </div>

        </div>

      )}



      {/* ======================================================================= */}

      {/* CONTEÚDO PRINCIPAL (MAIN): Container base */}

      {/* ======================================================================= */}

      <main 
  style={{ paddingTop: activeTab === 'album' ? (savedLeagues.length > 0 ? '225px' : '190px') : (savedLeagues.length > 0 ? '125px' : '90px') }} 
  className={`w-full flex-1 flex flex-col px-3 pb-4 gap-4 min-h-0 max-w-3xl mx-auto transition-all`}
	>
        
        {/* ABA 1: ÁLBUM */}
        {activeTab === 'album' && (
            <div className="flex-1 w-full">
              {/* NOVO MENU DE GRUPOS FIXO NO TOPO */}
              <div style={{ top: savedLeagues.length > 0 ? '112px' : '76px' }} className={`fixed left-0 w-full z-40 px-3 pt-2 pb-2 transition-all ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                {/* MUDANÇA: gap-6 reduzido para gap-3 para equilibrar o visual dos cartões */}
                <div className={`${cardBg} px-3 py-2 rounded-2xl shadow-sm border flex gap-3 overflow-x-auto hide-scrollbar max-w-3xl mx-auto`}>
                  {uniqueGroups.map(groupName => {
                    const groupSections = SECTIONS.filter(s => s.group === groupName);
                    return (
                      // MUDANÇA PRINCIPAL: Classes px-4, py-2, rounded-xl e cores dinâmicas de fundo/borda para criar a caixa
                      <div key={groupName} className={`flex flex-col items-center shrink-0 px-4 py-2 rounded-xl border shadow-sm ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-100 border-slate-200'}`}>
                        <span className="text-emerald-500 font-bold text-[10px] uppercase mb-2 tracking-[0.25em] ml-[0.25em]">{groupName}</span>
                        <div className="flex gap-4">
                          {groupSections.map(s => (
                            <button key={s.id} onClick={() => scrollToSection(s.id)} className="flex flex-col items-center hover:scale-110 transition-transform cursor-pointer">
                              {/* Lógica da Imagem vs Emoji */}
                              {s.flagUrlApple ? (
                                <img src={isAppleDevice ? s.flagUrlApple : s.flagUrlAndroid} alt={s.title} className="w-5 h-5 object-contain" />
                              ) : (
                                <span className="text-xl leading-none">{s.flag}</span>
                              )}
                              <span className="text-[8px] font-bold text-slate-400 mt-1">{s.prefix}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>



              {/* LISTA DE SEÇÕES DE PAÍSES E BOTÕES DE FIGURINHAS */}
              <div className="space-y-4">
                  {SECTIONS.map((sec) => (
                    <div key={sec.id} ref={el => sectionsRef.current[sec.id] = el} className={`${cardBg} p-3 sm:p-4 rounded-2xl shadow-sm border`}>
                       {/* MUDANÇA AQUI: Inserido o sec.prefix com cor mais clara entre a bandeira e o nome */}
                       <h2 className={`font-black ${titleColor} mb-3 flex items-center gap-2 text-sm`}>
                          {sec.flagUrlApple ? (
                            <img src={isAppleDevice ? sec.flagUrlApple : sec.flagUrlAndroid} alt={sec.title} className="w-[18px] h-[18px] object-contain" />
                          ) : (
                            <span className="text-lg">{sec.flag}</span>
                          )}
                          <span className="text-slate-400 font-bold text-xs">{sec.prefix}</span>
                          {sec.title}
                       </h2>

                       <div className="grid grid-cols-5 gap-1.5 sm:gap-2">

                         {(sec.count ? Array.from({length: sec.count}, (_, i) => i + 1) : sec.items).map(item => {

                           const key = `${sec.prefix}-${item}`;

                           const status = stickers[key] || 0;

                           

                           // Lógica de cores do botão de figurinha

                           const btnClass = status === 0 

                                ? (isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-400')

                                : status === 1 

                                    ? 'bg-emerald-500 text-white shadow-md' 

                                    : 'bg-purple-600 text-white shadow-md';



                           return (

                             // BOTÃO INDIVIDUAL DA FIGURINHA

                             <button key={key} onClick={() => toggleSticker(key)} className={`aspect-square w-full flex items-center justify-center font-bold text-xs rounded-lg transition-all ${btnClass}`}>

                               {item}

                             </button>

                           );

                         })}

                       </div>

                    </div>

                  ))}

              </div>

            </div>

        )}



{/* // ABA 2: ESTATÍSTICAS (RESUMO) */}
{/* // ============================================================================ */}
{activeTab === 'stats' && (
  <div className="w-full flex flex-col max-w-md mx-auto h-[calc(100dvh-170px)]">
    {/* MUDANÇA: Adicionado overflow-y-auto para permitir rolagem interna caso a lista de bandeiras fique grande */}
    <div className={`${cardBg} p-4 rounded-2xl shadow-sm border text-center flex flex-col w-full h-full overflow-y-auto hide-scrollbar gap-4`}>
      
      <h2 className={`font-black ${titleColor} text-lg shrink-0`}>Visão Geral da Coleção</h2>

      {/* GRÁFICO DE PIZZA */}
      <div
        className="relative w-48 h-48 mx-auto rounded-full shadow-inner flex items-center justify-center shrink-0"
        style={{
          background: `conic-gradient(#10b981 0% ${stats.percColadas}%, #9333ea ${stats.percColadas}% ${parseFloat(stats.percColadas) + parseFloat(stats.percRepetidas)}%, ${isDarkMode ? '#334155' : '#e2e8f0'} ${parseFloat(stats.percColadas) + parseFloat(stats.percRepetidas)}% 100%)`
        }}
      >
        <div className={`w-32 h-32 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-white'} flex flex-col items-center justify-center shadow-md`}>
          <span className={`text-2xl font-black ${titleColor}`}>{stats.percentage}%</span>
          <span className={`text-[10px] ${textColor} font-bold uppercase`}>Completado</span>
        </div>
      </div>

      {/* BLOCOS DE INFORMAÇÃO NUMÉRICA (AGORA CLICÁVEIS) */}
      <div className="space-y-3 w-full max-w-sm mx-auto shrink-0">
        <div onClick={() => setStatsFilter(statsFilter === 'coladas' ? null : 'coladas')} className={`flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border cursor-pointer transition-all ${statsFilter === 'coladas' ? 'border-emerald-500 scale-[1.02] shadow-md' : 'border-emerald-500/20 hover:scale-[1.01]'}`}>
          <span className="flex items-center gap-2 font-bold text-emerald-500">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div> Coladas
          </span>
          <span className={`font-black ${titleColor}`}>{stats.coladas} <span className="text-xs font-normal opacity-50">({stats.percColadas}%)</span></span>
        </div>

        <div onClick={() => setStatsFilter(statsFilter === 'repetidas' ? null : 'repetidas')} className={`flex justify-between items-center p-3 rounded-xl bg-purple-500/10 border cursor-pointer transition-all ${statsFilter === 'repetidas' ? 'border-purple-500 scale-[1.02] shadow-md' : 'border-purple-500/20 hover:scale-[1.01]'}`}>
          <span className="flex items-center gap-2 font-bold text-purple-500">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div> Repetidas
          </span>
          <span className={`font-black ${titleColor}`}>{stats.repetidas} <span className="text-xs font-normal opacity-50">({stats.percRepetidas}%)</span></span>
        </div>

        <div onClick={() => setStatsFilter(statsFilter === 'faltantes' ? null : 'faltantes')} className={`flex justify-between items-center p-3 rounded-xl cursor-pointer transition-all ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100'} ${statsFilter === 'faltantes' ? (isDarkMode ? 'border-slate-400 scale-[1.02] shadow-md' : 'border-slate-400 scale-[1.02] shadow-md') : (isDarkMode ? 'border-slate-600 hover:scale-[1.01]' : 'border-slate-200 hover:scale-[1.01]')}`}>
          <span className={`flex items-center gap-2 font-bold ${textColor}`}>
            <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-slate-500' : 'bg-slate-300'}`}></div> Faltantes
          </span>
          <span className={`font-black ${titleColor}`}>{stats.faltantes} <span className="text-xs font-normal opacity-50">({stats.percFaltantes}%)</span></span>
        </div>
      </div>

      {/* LISTA DINÂMICA DE BANDEIRAS (Aparece ao clicar em um filtro) */}
      {statsFilter && (
        <div className="w-full pt-4 border-t border-slate-500/20 animate-fade-in mt-auto shrink-0">
           <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-wider">
               Países com {statsFilter} (Toque para ir)
           </p>
           <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 px-2">
               {SECTIONS.filter(sec => {
                    // Aqui o código descobre quais países atendem à regra clicada
                    const keys = getSectionKeys(sec);
                    if (statsFilter === 'coladas') return keys.some(k => (stickers[k] || 0) === 1);
                    if (statsFilter === 'repetidas') return keys.some(k => (stickers[k] || 0) === 2);
                    if (statsFilter === 'faltantes') return keys.some(k => (stickers[k] || 0) === 0);
                    return false;
               }).map(sec => (
                    // Botão da Bandeira: Limpa o filtro e navega para o país
                    <button key={sec.id} onClick={() => { setStatsFilter(null); scrollToSection(sec.id); }} className="flex flex-col items-center shrink-0 hover:scale-110 transition-transform cursor-pointer">
                        {sec.flagUrlApple ? (
                            <img src={isAppleDevice ? sec.flagUrlApple : sec.flagUrlAndroid} alt={sec.title} className="w-6 h-6 object-contain" />
                        ) : (
                            <span className="text-2xl leading-none">{sec.flag}</span>
                        )}
                        <span className="text-[9px] font-bold text-slate-400 mt-1">{sec.prefix}</span>
                    </button>
               ))}
           </div>
        </div>
      )}

    </div>
  </div>
)}



        {/* ABA 3: BOLÃO - FASE 1 E 3 (LAYOUT + MODO ADMIN) */}
        {activeTab === 'jogos' && (
            <div className="w-full flex flex-col gap-4 max-w-md mx-auto h-[calc(100dvh-170px)] overflow-y-auto hide-scrollbar pb-6">
                
				{/* MENU DE NAVEGAÇÃO DO BOLÃO (JOGOS / RANKING) */}
                <div className="flex bg-slate-500/10 p-1 rounded-xl w-full max-w-[240px] mx-auto mb-2 shrink-0">
                    <button onClick={() => setBolaoView('jogos')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${bolaoView === 'jogos' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}>Jogos</button>
                    <button onClick={() => setBolaoView('ranking')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${bolaoView === 'ranking' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}>Ranking</button>
                </div>
                
				{/* CABEÇALHO DO BOLÃO */}
                <div className={`${cardBg} p-5 rounded-2xl shadow-sm border text-center shrink-0 relative transition-colors ${isAdminMode ? 'border-red-500/50 bg-red-500/5' : ''}`}>
                    
                    {/* BOTÃO SECRETO DE ADMIN (Só aparece para o dono da família) */}
                    {activeFamilyId === user.uid && (
                        <button 
                            onClick={() => setIsAdminMode(!isAdminMode)}
                            className={`absolute top-4 right-4 p-2 rounded-lg text-[10px] font-bold uppercase transition-colors ${isAdminMode ? 'bg-red-500 text-white shadow-md' : 'bg-slate-500/10 text-slate-400'}`}
                        >
                            {isAdminMode ? 'Modo Admin ON' : 'Admin'}
                        </button>
                    )}
                    
                    <Trophy size={40} className={`mx-auto mb-3 transition-colors ${isAdminMode ? 'text-red-500' : 'text-yellow-500'}`} />
                    <h2 className={`font-black ${titleColor} text-lg mb-1`}>
                        {isAdminMode ? 'Gabarito Oficial (Admin)' : 'Bolão da Família'}
                    </h2>
                    <p className={`text-xs ${textColor}`}>
                        {isAdminMode ? 'Insira os placares reais da Copa. Isso definirá o Ranking.' : 'Faça seus palpites antes do início de cada partida.'}
                    </p>
                </div>

                {/* ----------------- SUB-TELA 1: JOGOS ----------------- */}
                {bolaoView === 'jogos' && (
                    <>
                        {/* LISTA DE JOGOS */}
                <div className="space-y-4">
                  {MATCHES.map(match => {
                     const tA = SECTIONS.find(s => s.prefix === match.teamA);
                     const tB = SECTIONS.find(s => s.prefix === match.teamB);
                     
                     // A MÁGICA DO BLOQUEIO
                     const isLocked = !isAdminMode && match.status !== 'pending';
                     
                     return (
                        <div key={match.id} className={`${cardBg} p-4 rounded-2xl shadow-sm border ${isAdminMode ? 'border-red-500/20' : ''}`}>
                           
                           {/* Data, Hora e Etiqueta de Status */}
                           <div className="flex justify-center items-center gap-2 mb-4">
                               <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-500/10 py-1 px-3 rounded-md">
                                   {match.date}
                               </div>
                               {match.status === 'finished' && <span className="text-[9px] font-black uppercase px-2 py-1 rounded-md bg-slate-500 text-white shadow-sm">Encerrado</span>}
                               {match.status === 'live' && <span className="text-[9px] font-black uppercase px-2 py-1 rounded-md bg-red-500 text-white shadow-sm animate-pulse">Ao Vivo</span>}
                               {match.status === 'pending' && <span className="text-[9px] font-black uppercase px-2 py-1 rounded-md bg-emerald-500 text-white shadow-sm">Em Breve</span>}
                           </div>
                           
                           <div className="flex justify-between items-center gap-2">
                              {/* Equipa A */}
                              <div className="flex flex-col items-center w-[30%]">
                                 {tA?.flagUrlApple ? (
                                    <img src={isAppleDevice ? tA.flagUrlApple : tA.flagUrlAndroid} alt={tA.title} className="w-8 h-8 object-contain drop-shadow-md"/>
                                 ) : (
                                    <span className="text-3xl drop-shadow-md">{tA?.flag}</span>
                                 )}
                                 <span className={`text-[10px] font-bold mt-2 text-center ${titleColor}`}>{tA?.title}</span>
                              </div>

                              {/* Caixas de Palpite / Resultado Oficial */}
                              <div className="flex items-center gap-3 justify-center w-[40%]">
                                 <input 
                                   type="number" 
                                   disabled={isLocked}
                                   value={isAdminMode ? (officialScores[match.id]?.a ?? '') : (guesses[match.id]?.a ?? '')} 
                                   onChange={(e) => handleGuess(match.id, 'a', e.target.value)} 
                                   placeholder="-"
                                   className={`w-12 h-12 text-center rounded-xl font-black text-xl border shadow-inner transition-colors outline-none 
                                     ${isLocked ? 'opacity-50 cursor-not-allowed bg-slate-200/50 dark:bg-slate-800/50 text-slate-400 border-transparent' : 
                                     (isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:bg-slate-800' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white')} 
                                     ${!isLocked && isAdminMode ? 'focus:border-red-500' : ''} 
                                     ${!isLocked && !isAdminMode ? 'focus:border-emerald-500' : ''}`} 
                                 />
                                 <span className="text-slate-300 font-black text-sm">X</span>
                                 <input 
                                   type="number" 
                                   disabled={isLocked}
                                   value={isAdminMode ? (officialScores[match.id]?.b ?? '') : (guesses[match.id]?.b ?? '')} 
                                   onChange={(e) => handleGuess(match.id, 'b', e.target.value)} 
                                   placeholder="-"
                                   className={`w-12 h-12 text-center rounded-xl font-black text-xl border shadow-inner transition-colors outline-none 
                                     ${isLocked ? 'opacity-50 cursor-not-allowed bg-slate-200/50 dark:bg-slate-800/50 text-slate-400 border-transparent' : 
                                     (isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:bg-slate-800' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white')} 
                                     ${!isLocked && isAdminMode ? 'focus:border-red-500' : ''} 
                                     ${!isLocked && !isAdminMode ? 'focus:border-emerald-500' : ''}`} 
                                 />
                              </div>

                              {/* Equipa B */}
                              <div className="flex flex-col items-center w-[30%]">
                                 {tB?.flagUrlApple ? (
                                    <img src={isAppleDevice ? tB.flagUrlApple : tB.flagUrlAndroid} alt={tB.title} className="w-8 h-8 object-contain drop-shadow-md"/>
                                 ) : (
                                    <span className="text-3xl drop-shadow-md">{tB?.flag}</span>
                                 )}
                                 <span className={`text-[10px] font-bold mt-2 text-center ${titleColor}`}>{tB?.title}</span>
                              </div>
                           </div>

                           {/* ========================================== */}
                           {/* NOVA ÁREA: VER PALPITES DA GALERA (Fase 8) */}
                           {/* ========================================== */}
                           {match.status !== 'pending' && Object.keys(allPlayersData).length > 0 && (
                               <div className="mt-4 border-t border-slate-200/20 pt-3">
                                   <button 
                                      onClick={() => setExpandedMatch(expandedMatch === match.id ? null : match.id)}
                                      className="w-full py-2 text-[10px] font-bold text-slate-400 hover:text-emerald-500 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest"
                                   >
                                       {expandedMatch === match.id ? 'Ocultar Palpites' : '👁️ Ver Palpites da Galera'}
                                   </button>
                                   
                                   {expandedMatch === match.id && (
                                       <div className="mt-3 space-y-2">
                                           {Object.entries(allPlayersData).map(([playerId, playerData]) => {
                                               // Ignora o documento oficial do gabarito, mostrando apenas os jogadores
                                               if (playerId === 'bolao_official') return null;
                                               
                                               const pGuess = playerData.guesses?.[match.id];
                                               
                                               return (
                                                   <div key={playerId} className="flex items-center justify-between bg-black/5 dark:bg-black/20 p-2 rounded-lg">
                                                       <div className="flex items-center gap-2">
                                                           <img src={playerData.photoURL || `https://ui-avatars.com/api/?name=${playerData.displayName || 'J'}&background=10b981&color=fff`} referrerPolicy="no-referrer" className="w-6 h-6 rounded-full shadow-sm" alt="avatar" />
                                                           <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                                               {playerData.displayName?.split(' ')[0] || 'Jogador'}
                                                           </span>
                                                       </div>
                                                       <div className="flex items-center gap-2 font-black text-sm">
                                                           {pGuess ? (
                                                               <>
                                                                   <span className="text-slate-700 dark:text-slate-200">{pGuess.a}</span>
                                                                   <span className="text-[10px] text-slate-400 font-normal">X</span>
                                                                   <span className="text-slate-700 dark:text-slate-200">{pGuess.b}</span>
                                                               </>
                                                           ) : (
                                                               <span className="text-[10px] text-slate-400 font-normal uppercase">Sem palpite</span>
                                                           )}
                                                       </div>
                                                   </div>
                                               );
                                           })}
                                       </div>
                                   )}
                               </div>
                           )}
                           {/* ========================================== */}
                        </div>
                     );
                  })}
                </div>

                        {/* BOTÃO AUXILIAR: SINCRONIZAR VIA API (Apenas no Modo Admin) */}
                        {isAdminMode && (
                            <button
                              type="button"
                              disabled={isSyncingAPI}
                              onClick={async () => {
                                 setIsSyncingAPI(true);
                                 setToast("Buscando dados na API Esportiva... 📡");
                                 try {
                                     // Aciona o simulador da API de Futebol (Substituirá pelo fetch real na Copa)
                                     const data = await fetchApiScores();
                                     
                                     if (data.success && data.scores) {
                                         // Injeta os placares retornados pela API direto na memória do Gabarito
                                         setOfficialScores(prev => ({
                                             ...prev,
                                             ...data.scores
                                         }));
                                         setToast("Placares importados! Revise e clique em Salvar. ⚽");
                                     } else {
                                         setToast("Nenhum placar novo encontrado na API.");
                                     }
                                 } catch (error) {
                                     setToast("Erro de conexão com o servidor da API.");
                                 } finally {
                                     setIsSyncingAPI(false);
                                     setTimeout(() => setToast(''), 3000);
                                 }
                              }}
                              className={`w-full mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-3 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-xs uppercase tracking-wider ${isSyncingAPI ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}`}
                            >
                              {isSyncingAPI ? 'Sincronizando...' : '🔄 Puxar Resultados da API'}
                            </button>
                        )}
						{/* BOTÃO DE SALVAR */}
                        <button 
                          onClick={async () => {
                             setToast(isAdminMode ? "Salvando placares oficiais..." : "Salvando palpites...");
                             try {
                                 if (isAdminMode) {
                                     // Salva no GABARITO MUNDIAL para todas as ligas lerem
                                     await setDoc(doc(db, 'global_data', 'Gabarito_Mundial'), {
                                         scores: officialScores,
                                         updatedBy: user.email || 'Admin',
                                         lastUpdate: new Date().toISOString()
                                     }, { merge: true });
                                     setToast("Gabarito Mundial atualizado! 🌍");
                                 } else {
                                     await updateDoc(doc(db, 'family_albums', activeFamilyId), {
                                         [`bolao.${user.uid}.name`]: user.displayName || 'Jogador',
                                         [`bolao.${user.uid}.photo`]: user.photoURL || '',
                                         [`bolao.${user.uid}.guesses`]: guesses
                                     });
                                     setToast("Palpites salvos com sucesso! 🏆");
                                 }
                                 setTimeout(() => setToast(''), 3000);
                             } catch (error) {
                                 setToast("Erro ao salvar. Verifique a internet.");
                                 setTimeout(() => setToast(''), 3000);
                             }
                          }}
                          className={`w-full text-white font-black py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98] mt-2 flex items-center justify-center gap-2 shrink-0 ${isAdminMode ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'}`}
                        >
                          {isAdminMode ? 'Salvar Resultados Oficiais' : 'Salvar Meus Palpites'}
                        </button>
                    </>
                )}

                {/* ----------------- SUB-TELA 2: RANKING ----------------- */}
                {bolaoView === 'ranking' && (
                    <div className="space-y-3 mt-2">
                        {rankingList.length === 0 ? (
                            <p className="text-center text-xs text-slate-400 py-6">Nenhum palpite ou resultado oficial registrado ainda.</p>
                        ) : (
                            rankingList.map((player, index) => (
                                <div key={player.uid} className={`${cardBg} p-3 rounded-xl shadow-sm border flex items-center gap-3`}>
                                    
                                    {/* Medalhas (Ouro, Prata, Bronze) */}
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${index === 0 ? 'bg-yellow-500 text-white shadow-md' : index === 1 ? 'bg-slate-300 text-slate-800 shadow-sm' : index === 2 ? 'bg-amber-700 text-white shadow-sm' : 'bg-slate-500/10 text-slate-400'}`}>
                                        {index + 1}
                                    </div>
                                    
                                    {/* Foto do Perfil Google */}
                                    {player.photo ? (
                                        <img src={player.photo} alt="avatar" className="w-10 h-10 rounded-full border-2 border-emerald-500/20" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-slate-500/20 flex items-center justify-center">
                                            <User size={18} className="text-slate-400"/>
                                        </div>
                                    )}
                                    
                                    {/* Nome e Desempate */}
                                    <div className="flex-1">
                                        <h3 className={`font-bold text-sm ${titleColor}`}>{player.name}</h3>
                                        <p className="text-[10px] text-slate-400">{player.exactMatches} placares exatos (cravadas)</p>
                                    </div>
                                    
                                    {/* Pontuação Final */}
                                    <div className="text-right">
                                        <span className="font-black text-emerald-500 text-2xl leading-none">{player.points}</span>
                                        <span className="text-[9px] text-slate-400 block mt-1 uppercase tracking-widest">pontos</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        )}



{/* ========================================================== */}
{/* NOVA ABA 5: TROCAS JUSTAS (MATCH) */}
{/* ========================================================== */}
        {activeTab === 'trocas' && (
            <div className="w-full flex flex-col gap-3 max-w-md mx-auto h-[calc(100dvh-170px)] justify-between overflow-y-auto hide-scrollbar">
              <div className={`${cardBg} p-5 rounded-2xl shadow-sm border`}>
                <h2 className={`font-black ${titleColor} text-lg mb-2 flex items-center gap-2`}><ArrowRightLeft size={20} className="text-emerald-500"/> Trocas Justas</h2>
                <p className={`text-xs ${textColor} mb-4`}>Digite o código da família de um amigo para descobrir quais figurinhas vocês podem trocar.</p>
                <div className="flex gap-2">
                  <input type="text" placeholder="Código do Amigo..." value={compareId} onChange={(e) => setCompareId(e.target.value)} className={`flex-1 w-full ${isDarkMode ? 'bg-slate-900 text-white border-slate-700' : 'bg-slate-50 text-slate-900 border-slate-200'} rounded-xl px-3 py-3 text-xs border outline-none focus:border-emerald-500 uppercase`}/>
                  <button onClick={handleCompareAlbums} disabled={isLoadingCompare} className="bg-emerald-600 text-white px-5 rounded-xl font-bold text-xs shrink-0 shadow-md disabled:opacity-50">
                    {isLoadingCompare ? '...' : 'Analisar'}
                  </button>
                </div>
              </div>

              {friendData && (
                <div className="flex-1 flex flex-col gap-4">
                  {/* Bloco: Você Recebe */}
                  <div className={`${cardBg} p-4 rounded-2xl shadow-sm border border-emerald-500/30 flex-1`}>
                    <h3 className="font-bold text-emerald-500 text-sm mb-3">Você Recebe ({tradeStats.receive.length})</h3>
                    <div className="flex flex-wrap gap-2">
                      {tradeStats.receive.length === 0 ? <p className="text-xs opacity-50">Ele não tem figurinhas repetidas que você precise.</p> : 
                      tradeStats.receive.map(k => <span key={k} className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md text-[10px] font-bold border border-emerald-500/20">{k}</span>)}
                    </div>
                  </div>
                  {/* Bloco: Você Entrega */}
                  <div className={`${cardBg} p-4 rounded-2xl shadow-sm border border-purple-500/30 flex-1`}>
                    <h3 className="font-bold text-purple-500 text-sm mb-3">Você Dá ({tradeStats.send.length})</h3>
                    <div className="flex flex-wrap gap-2">
                      {tradeStats.send.length === 0 ? <p className="text-xs opacity-50">Você não tem figurinhas repetidas que ele precise.</p> : 
                      tradeStats.send.map(k => <span key={k} className="bg-purple-500/10 text-purple-500 px-2 py-1 rounded-md text-[10px] font-bold border border-purple-500/20">{k}</span>)}
                    </div>
                  </div>
				  
				  {/* NOVO BOTÃO DE LIMPEZA */}
                  <button onClick={handleClearCompare} className={`w-full mt-2 py-3 rounded-xl font-bold text-xs transition-colors border ${isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'}`}>
                     Limpar e fazer nova consulta?
                  </button>
				  
                </div>
              )}
            </div>
        )}
		
		
		
{/* // ============================================================================ */}

{/* // ABA 4: PERFIL E CONFIGURAÇÕES */}

{/* // ============================================================================ */}

{activeTab === 'perfil' && (

  <div className="w-full flex flex-col gap-3 justify-between max-w-md mx-auto h-[calc(100dvh-170px)] overflow-y-auto hide-scrollbar">

    {/* AJUSTE DE LAYOUT: o Perfil também passa a ocupar a altura disponível

        da tela, sem alterar nenhuma informação exibida. */}



    {/* BOTÃO INSTALAR APLICATIVO (PWA) */}

    {!isStandalone && (

      <button onClick={handleInstallClick} className="w-full flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 rounded-2xl shadow-lg transition-all border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1">

        <span className="font-black text-base uppercase tracking-wide flex items-center gap-2"><Download size={20}/> INSTALAR APLICATIVO</span>

        <span className="text-[10px] font-medium opacity-90">Acesso direto da tela inicial, rápido e seguro.</span>

      </button>

    )}



                {!isPro && (

                  <div className={`${cardBg} p-4 rounded-2xl shadow-sm border space-y-4 flex-1 flex flex-col`}>

                     <h3 className={`font-black ${titleColor} text-sm flex items-center gap-2`}><Star size={16} className="text-yellow-500"/> Área Premium</h3>

                     {activeFamilyId !== user.uid ? (

                        <div className="text-center font-bold text-xs p-3 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20">Você faz parte de uma família ativada!</div>

                     ) : (

                       <div className="flex gap-2">

                         <input type="text" placeholder="Código de convite..." onChange={(e) => setJoinCode(e.target.value)} className={`flex-1 w-full ${isDarkMode ? 'bg-slate-900 text-white border-slate-700' : 'bg-slate-50 text-slate-900 border-slate-200'} rounded-xl px-3 py-2 text-xs border outline-none focus:border-emerald-500`}/>

                         <button onClick={() => {

                           if (joinCode.trim()) {

                             setActiveFamilyId(joinCode.trim());

                             localStorage.setItem('@AlbumCopa_FamilyId', joinCode.trim());

                           }

                         }} className="bg-emerald-600 text-white px-4 rounded-xl font-bold text-xs shrink-0 shadow-md">Entrar</button>

                       </div>

                     )}

                     

                     {pixCode ? (

                        <div className="space-y-2 mt-auto">

                           <input readOnly value={pixCode} className={`w-full ${isDarkMode ? 'bg-slate-900 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-500 border-slate-200'} text-[10px] p-2 rounded-xl border outline-none text-center`}/>

                           <button onClick={() => copyToClipboard(pixCode, "Pix copiado!")} className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-bold text-xs shadow-md"><Copy size={16}/> Copiar Chave PIX</button>

                        </div>

                     ) : (

                       <div className="grid grid-cols-2 gap-2 mt-auto pt-4">

                          <a href="https://youtube.com/shorts/R0sVz5BjRFU?feature=share" target="_blank" rel="noreferrer" className="text-center bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-xs flex flex-col items-center justify-center shadow-md transition-colors"><PlayCircle size={18} className="mb-1"/> Ver Vídeo</a>

                          {activeFamilyId !== user.uid ? (

                            <button className={`bg-emerald-600 text-white py-3 rounded-xl font-bold text-xs opacity-50 cursor-not-allowed flex flex-col items-center justify-center`}><Star size={18} className="mb-1"/> Pro Ativado</button>

                          ) : (

                            <button onClick={handleBuyPro} className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-xs flex flex-col items-center justify-center shadow-md transition-colors"><KeyRound size={18} className="mb-1"/> Tornar-se Pro</button>

                          )}

                       </div>

                     )}

                  </div>

                )}



                {isPro && (

                    <div className={`${cardBg} p-4 rounded-2xl shadow-sm border space-y-3 flex-1`}>

                        <h3 className={`font-black ${titleColor} text-sm flex items-center gap-2 mb-2`}><KeyRound size={16} className="text-indigo-400"/> Ferramentas do Administrador</h3>

                        

                        <button onClick={() => copyToClipboard(activeFamilyId, "ID da Família copiado!")} className={`w-full flex items-center justify-between p-3 rounded-xl ${isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} transition-colors`}>

                            <span className={`text-xs font-bold ${textColor}`}>Código da Família (Convite)</span>

                            <Copy size={14} className={textColor} />

                        </button>



                        <button onClick={() => {
                            // 1. Mapeia as Faltantes (status === 0)
                            let faltantes = SECTIONS.map(sec => {
                                const l = getSectionKeys(sec).filter(k => (stickers[k] || 0) === 0).map(k => k.split('-')[1]);
                                return l.length > 0 ? `${sec.flag} *${sec.prefix}*: ${l.join(', ')}` : null;
                            }).filter(s => s !== null).join('\n');

                            // 2. Mapeia as Repetidas (status === 2)
                            let repetidas = SECTIONS.map(sec => {
                                const l = getSectionKeys(sec).filter(k => (stickers[k] || 0) === 2).map(k => k.split('-')[1]);
                                return l.length > 0 ? `${sec.flag} *${sec.prefix}*: ${l.join(', ')}` : null;
                            }).filter(s => s !== null).join('\n');

                            // 3. Monta o texto final com formatação para o WhatsApp
                            let textoFinal = '';
                            if (repetidas) textoFinal += `🔄 *REPETIDAS (Para Troca):*\n${repetidas}\n\n`;
							if (faltantes) textoFinal += `🏆 *FALTAM:*\n${faltantes}`;
                            
                            
                            // Caso raro de álbum 100% completo e sem repetidas
                            if (!faltantes && !repetidas) textoFinal = "Álbum completo e sem repetidas disponíveis!";

                            copyToClipboard(textoFinal.trim(), "Lista copiada!");

                        }} className={`w-full flex items-center justify-between p-3 rounded-xl ${isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} transition-colors`}>
                            {/* O texto do botão também foi atualizado para refletir a nova função */}
                            <span className={`text-xs font-bold ${textColor}`}>Copiar Faltantes e Repetidas</span>
                            <Share2 size={14} className={textColor} />
                        </button>

                    </div>

                )}
				
				{/* ÁREA DE CÓDIGOS (VIP OU LIGAS) */}
                <div className={`${cardBg} p-4 rounded-2xl shadow-sm border flex flex-col gap-3 relative overflow-hidden`}>
                  <h3 className={`font-black ${titleColor} text-sm flex items-center gap-2`}>
                    <Trophy size={16} className="text-yellow-500"/>
                    Comunidade e Códigos
                  </h3>
                  <p className={`text-[11px] leading-tight ${textColor}`}>Tem um código promocional ou convite de liga? Insira abaixo para desbloquear acessos.</p>
                  
                  <div className="flex gap-2 mt-1">
                    <input 
                      type="text" 
                      placeholder="Digite seu código..." 
                      value={magicCode}
                      onChange={(e) => setMagicCode(e.target.value)}
                      className={`flex-1 px-3 py-2 rounded-xl border text-sm uppercase ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} focus:outline-none focus:border-emerald-500 transition-colors`}
                    />
                    <button 
                      onClick={async () => {
                        const code = magicCode.trim().toUpperCase();
                        
                        if (code === 'NOSVICOPA2026') {
                           // 1. Lógica antiga: Ativa o Modo Pro
                           setIsPro(true);
                           setMagicCode('');
                           setToast("Modo Pro Ativado com Sucesso!");
                           setTimeout(() => setToast(''), 3000);
                           
                        } else if (code.startsWith('LIGA-')) {
                           // 2. NOVA LÓGICA: Entrar ou Criar uma Liga
                           setToast("Conectando à Liga...");
                           try {
                               // Cria ou entra na liga
                               await setDoc(doc(db, 'family_albums', code), {
                                   isLeague: true,
                                   createdAt: new Date().toISOString()
                               }, { merge: true });
                               
                               setActiveFamilyId(code);
                               localStorage.setItem('@AlbumCopa_FamilyId', code);
                               
                               // INSERÇÃO: Salva a liga no histórico do celular como atalho para o cabeçalho
                               setSavedLeagues(prev => {
                                   if (!prev.includes(code)) {
                                       const newList = [...prev, code];
                                       localStorage.setItem('@AlbumCopa_Leagues', JSON.stringify(newList));
                                       return newList;
                                   }
                                   return prev;
                               });
                               
                               setMagicCode('');
                               setToast(`Você entrou na ${code}! 🏆`);
                               setTimeout(() => setToast(''), 4000);
                           } catch (error) {
                               setToast("Erro ao entrar na liga.");
                               setTimeout(() => setToast(''), 3000);
                           }
                        } else {
                           setToast("Código inválido ou expirado.");
                           setTimeout(() => setToast(''), 3000);
                        }
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-xs transition-colors shadow-sm"
                    >
                      Ativar
                    </button>
                  </div>
                </div>



                <div className={`${cardBg} p-4 rounded-2xl shadow-sm border`}>

                   <button onClick={() => { signOut(auth); localStorage.removeItem('@AlbumCopa_FamilyId'); }} className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 py-3 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-colors">

                       <LogOut size={18}/> Sair da Conta

                   </button>

                </div>



            </div>

        )}

      </main>



      {/* ======================================================================= */}

      {/* MENU INFERIOR (BOTTOM NAVIGATION) */}

      {/* ======================================================================= */}

      <nav className={`fixed bottom-0 left-0 w-full ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'} border-t pb-safe pt-2 px-6 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]`}>

          <div className="flex justify-between items-center pb-2 max-w-md mx-auto">

              <button onClick={() => setActiveTab('album')} className={`flex flex-col items-center gap-1 ${activeTab === 'album' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-300'} transition-colors`}>

                  <Book size={22} className={activeTab === 'album' ? 'fill-emerald-500/20' : ''}/>

                  <span className="text-[9px] font-bold">Álbum</span>

              </button>

              

              <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-1 ${activeTab === 'stats' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-300'} transition-colors`}>

                  <PieChart size={22} className={activeTab === 'stats' ? 'fill-emerald-500/20' : ''}/>

                  <span className="text-[9px] font-bold">Resumo</span>

              </button>



              <button onClick={() => setActiveTab('jogos')} className={`flex flex-col items-center gap-1 ${activeTab === 'jogos' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-300'} transition-colors`}>

                  <Trophy size={22} className={activeTab === 'jogos' ? 'fill-emerald-500/20' : ''}/>

                  <span className="text-[9px] font-bold">Bolão</span>

              </button>
			
			
			
			{/* NOVO BOTÃO: Trocas Justas */}
              
			  <button onClick={() => setActiveTab('trocas')} className={`flex flex-col items-center gap-1 ${activeTab === 'trocas' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-300'} transition-colors`}>
                  
				  <ArrowRightLeft size={22} className={activeTab === 'trocas' ? 'stroke-emerald-500' : ''}/>
                  
				  <span className="text-[9px] font-bold">Trocas</span>
              
			  </button>



              <button onClick={() => setActiveTab('perfil')} className={`flex flex-col items-center gap-1 ${activeTab === 'perfil' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-300'} transition-colors relative`}>

                  {!isPro && <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>}

                  <User size={22} className={activeTab === 'perfil' ? 'fill-emerald-500/20' : ''}/>

                  <span className="text-[9px] font-bold">Perfil</span>

              </button>

          </div>

      </nav>



    </div>

  );

} 
