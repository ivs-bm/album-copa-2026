// ============================================================================

// IMPORTAÇÕES E CONFIGURAÇÃO DO FIREBASE

// ============================================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';

// Importação dos ícones visuais usados nos botões e menus do aplicativo

import { LogOut, Info, Share2, KeyRound, Copy, Moon, Sun, Book, PieChart, Trophy, User, Download, Star, PlayCircle } from 'lucide-react';

import { initializeApp, getApps, getApp } from 'firebase/app';

import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';

import { getFirestore, doc, updateDoc, onSnapshot } from 'firebase/firestore';



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

  { id: 'FWC_INI', title: 'Ínicio', prefix: 'FWC', flag: '🏠', items: ['00', '1', '2', '3', '4', '5', '6', '7', '8'] },

  { id: 'FWC_HST', title: 'História', prefix: 'FWC', flag: '🏆', items: ['9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'] },

  { id: 'CC', title: 'Coca-Cola', prefix: 'CC', flag: '🥤', count: 14 },

  { id: 'MEX', title: 'México', prefix: 'MEX', flag: '🇲🇽', count: 20 },

  { id: 'RSA', title: 'África do Sul', prefix: 'RSA', flag: '🇿🇦', count: 20 },

  { id: 'KOR', title: 'Coreia do Sul', prefix: 'KOR', flag: '🇰🇷', count: 20 },

  { id: 'CZE', title: 'Rep. Tcheca', prefix: 'CZE', flag: '🇨🇿', count: 20 },

  { id: 'CAN', title: 'Canadá', prefix: 'CAN', flag: '🇨🇦', count: 20 },

  { id: 'BIH', title: 'Bósnia', prefix: 'BIH', flag: '🇧🇦', count: 20 },

  { id: 'QAT', title: 'Catar', prefix: 'QAT', flag: '🇶🇦', count: 20 },

  { id: 'SUI', title: 'Suíça', prefix: 'SUI', flag: '🇨🇭', count: 20 },

  { id: 'BRA', title: 'Brasil', prefix: 'BRA', flag: '🇧🇷', count: 20 },

  { id: 'MAR', title: 'Marrocos', prefix: 'MAR', flag: '🇲🇦', count: 20 },

  { id: 'HAI', title: 'Haiti', prefix: 'HAI', flag: '🇭🇹', count: 20 },

  { id: 'SCO', title: 'Escócia', prefix: 'SCO', flag: '🇬🇧', count: 20 },

  { id: 'USA', title: 'EUA', prefix: 'USA', flag: '🇺🇸', count: 20 },

  { id: 'PAR', title: 'Paraguai', prefix: 'PAR', flag: '🇵🇾', count: 20 },

  { id: 'AUS', title: 'Austrália', prefix: 'AUS', flag: '🇦🇺', count: 20 },

  { id: 'TUR', title: 'Turquia', prefix: 'TUR', flag: '🇹🇷', count: 20 },

  { id: 'GER', title: 'Alemanha', prefix: 'GER', flag: '🇩🇪', count: 20 },

  { id: 'CUW', title: 'Curaçao', prefix: 'CUW', flag: '🇨🇼', count: 20 },

  { id: 'CIV', title: 'Costa do Marfim', prefix: 'CIV', flag: '🇨🇮', count: 20 },

  { id: 'ECU', title: 'Equador', prefix: 'ECU', flag: '🇪🇨', count: 20 },

  { id: 'NED', title: 'Holanda', prefix: 'NED', flag: '🇳🇱', count: 20 },

  { id: 'JPN', title: 'Japão', prefix: 'JPN', flag: '🇯🇵', count: 20 },

  { id: 'SWE', title: 'Suécia', prefix: 'SWE', flag: '🇸🇪', count: 20 },

  { id: 'TUN', title: 'Tunísia', prefix: 'TUN', flag: '🇹🇳', count: 20 },

  { id: 'BEL', title: 'Bélgica', prefix: 'BEL', flag: '🇧🇪', count: 20 },

  { id: 'EGY', title: 'Egito', prefix: 'EGY', flag: '🇪🇬', count: 20 },

  { id: 'IRN', title: 'Irã', prefix: 'IRN', flag: '🇮🇷', count: 20 },

  { id: 'NZL', title: 'Nova Zelândia', prefix: 'NZL', flag: '🇳🇿', count: 20 },

  { id: 'ESP', title: 'Espanha', prefix: 'ESP', flag: '🇪🇸', count: 20 },

  { id: 'CPV', title: 'Cabo Verde', prefix: 'CPV', flag: '🇨🇻', count: 20 },

  { id: 'KSA', title: 'Arábia Saudita', prefix: 'KSA', flag: '🇸🇦', count: 20 },

  { id: 'URU', title: 'Uruguai', prefix: 'URU', flag: '🇺🇾', count: 20 },

  { id: 'FRA', title: 'França', prefix: 'FRA', flag: '🇫🇷', count: 20 },

  { id: 'SEN', title: 'Senegal', prefix: 'SEN', flag: '🇸🇳', count: 20 },

  { id: 'IRQ', title: 'Iraque', prefix: 'IRQ', flag: '🇮🇶', count: 20 },

  { id: 'NOR', title: 'Noruega', prefix: 'NOR', flag: '🇳🇴', count: 20 },

  { id: 'ARG', title: 'Argentina', prefix: 'ARG', flag: '🇦🇷', count: 20 },

  { id: 'ALG', title: 'Argélia', prefix: 'ALG', flag: '🇩🇿', count: 20 },

  { id: 'AUT', title: 'Áustria', prefix: 'AUT', flag: '🇦🇹', count: 20 },

  { id: 'JOR', title: 'Jordânia', prefix: 'JOR', flag: '🇯🇴', count: 20 },

  { id: 'POR', title: 'Portugal', prefix: 'POR', flag: '🇵🇹', count: 20 },

  { id: 'COD', title: 'Congo', prefix: 'COD', flag: '🇨🇩', count: 20 },

  { id: 'UZB', title: 'Uzbequistão', prefix: 'UZB', flag: '🇺🇿', count: 20 },

  { id: 'COL', title: 'Colômbia', prefix: 'COL', flag: '🇨🇴', count: 20 },

  { id: 'ENG', title: 'Inglaterra', prefix: 'ENG', flag: '🇬🇧', count: 20 },

  { id: 'CRO', title: 'Croácia', prefix: 'CRO', flag: '🇭🇷', count: 20 },

  { id: 'GHA', title: 'Gana', prefix: 'GHA', flag: '🇬🇭', count: 20 },

  { id: 'PAN', title: 'Panamá', prefix: 'PAN', flag: '🇵🇦', count: 20 },

];



// Funções utilitárias para contar o número total de figurinhas do álbum

const getSectionKeys = (sec) => sec.count ? Array.from({ length: sec.count }, (_, i) => `${sec.prefix}-${i + 1}`) : sec.items.map(item => `${sec.prefix}-${item}`);

const TOTAL_STICKERS = SECTIONS.reduce((acc, sec) => acc + (sec.count || sec.items.length), 0);



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

  

  const [activeTab, setActiveTab] = useState('album'); // Aba atual selecionada no menu inferior

  const [isDarkMode, setIsDarkMode] = useState(true); // Controle do modo Claro/Escuro

  

  // Estados referentes ao PWA (Instalação no celular)

  const [deferredPrompt, setDeferredPrompt] = useState(null); 

  const [isStandalone, setIsStandalone] = useState(false); 

  

  // Estados referentes ao código VIP secreto (Bolão)

  const [trophyClicks, setTrophyClicks] = useState(0); 

  const [showProCode, setShowProCode] = useState(false); 

  const [proInput, setProInput] = useState(''); 

  

  const sectionsRef = useRef({}); // Referência para deslizar as bandeiras



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

    const unsubscribe = onAuthStateChanged(auth, (u) => { 

      setUser(u); 

      if (u) {

        const savedFamilyId = localStorage.getItem('@AlbumCopa_FamilyId');

        setActiveFamilyId(savedFamilyId ? savedFamilyId : u.uid);

      } else {

        localStorage.removeItem('@AlbumCopa_FamilyId');

        setActiveFamilyId('');

      }

      setIsAuthLoading(false);

    }); 

    return () => unsubscribe();

  }, []);



  // Efeito 3: Busca as figurinhas em tempo real no banco de dados (Firestore)

  useEffect(() => {

    if (!activeFamilyId) return;

    return onSnapshot(doc(db, 'family_albums', activeFamilyId), (d) => {

      if (d.exists()) { setStickers(d.data().stickers || {}); setIsPro(!!d.data().isPro); }

    });

  }, [activeFamilyId]);



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

      setTimeout(() => sectionsRef.current[id]?.scrollIntoView({ behavior: 'smooth' }), 100);

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

  return (

    // DIV PRINCIPAL: Mantido exatamente como no primeiro print (max-w-[100vw] overflow-x-hidden)

    <div className={`w-full max-w-[100vw] min-h-screen flex flex-col ${themeBg} relative overflow-x-hidden pb-20 transition-colors duration-300`}>

      <style>{`

        * { box-sizing: border-box !important; }

        html, body { width: 100%; margin: 0; padding: 0; overflow-x: hidden !important; overscroll-behavior-x: none; }

        .hide-scrollbar::-webkit-scrollbar { display: none; }

      `}</style>

      

      {/* TOAST NOTIFICATION: Balão de aviso flutuante */}

      {toast && <div className="fixed top-20 z-50 left-1/2 -translate-x-1/2 w-max max-w-[90%] bg-emerald-600 text-white px-4 py-2 rounded-full text-xs shadow-xl text-center font-bold">{toast}</div>}

      

      {/* ======================================================================= */}

      {/* CABEÇALHO (HEADER) FIXO */}

      {/* ======================================================================= */}

      <header className={`w-full ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-emerald-800 to-teal-700'} text-white px-4 py-3 sticky top-0 z-40 shadow-md`}>

        <div className="flex justify-between items-center mb-2">

           <div className="flex items-center gap-3">

             <img src={user.photoURL} className="w-9 h-9 rounded-full border-2 border-emerald-400" alt="User" />

             <div>

                 <h1 className="font-black text-sm leading-tight">Família Copa</h1>

                 <p className="text-[10px] text-emerald-200">{stats.percentage}% Concluído</p>

             </div>

           </div>

           {/* BOTÕES: Guia Rápido e Tema Escuro */}

           <div className="flex gap-2 shrink-0">

              <button onClick={() => setShowTutorial(true)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">

                  <Info size={18} />

              </button>

              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">

                  {isDarkMode ? <Sun size={18} className="text-yellow-400"/> : <Moon size={18} />}

              </button>

           </div>

        </div>

        <div className="flex items-center gap-3 mt-1">

           <div className="flex-1 h-1.5 bg-black/30 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 transition-all" style={{ width: `${stats.percentage}%` }}></div></div>

        </div>

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

      <main className="w-full flex-1 flex flex-col px-3 py-4 gap-4 min-h-0">

        

        {/* ABA 1: ÁLBUM */}

        {activeTab === 'album' && (

            <div className="flex-1 w-full">

              {/* MENU DE BANDEIRAS HORIZONTAIS: Permite deslizar lateralmente */}

              <div className={`${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'} sticky top-[65px] z-30 pt-1 pb-2 w-full`}>

                <div className={`${cardBg} px-3 py-2 rounded-2xl shadow-sm border flex gap-4 overflow-x-auto hide-scrollbar`}>

                  {SECTIONS.map(s => (

                    <button key={s.id} onClick={() => scrollToSection(s.id)} className="flex flex-col items-center min-w-[44px]">

                      <span className="text-xl">{s.flag}</span>

                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{s.prefix}</span>

                    </button>

                  ))}

                </div>

              </div>



              {/* LISTA DE SEÇÕES DE PAÍSES E BOTÕES DE FIGURINHAS */}

              <div className="space-y-4">

                  {SECTIONS.map((sec) => (

                    <div key={sec.id} ref={el => sectionsRef.current[sec.id] = el} className={`${cardBg} p-3 sm:p-4 rounded-2xl shadow-sm border`}>

                       <h2 className={`font-black ${titleColor} mb-3 flex items-center gap-2 text-sm`}>{sec.flag} {sec.title}</h2>

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



============================================

{/* // ABA 2: ESTATÍSTICAS (RESUMO) */}

{/* // ============================================================================ */}

{activeTab === 'stats' && (

  <div className="flex-1 w-full min-h-[calc(100dvh-170px)] flex">

    <div

      className={`${cardBg} p-5 rounded-2xl shadow-sm border text-center flex flex-col justify-between w-full flex-1 min-h-[calc(100dvh-170px)] overflow-hidden`}

    >

      {/* AJUSTE DE LAYOUT: o Resumo agora ocupa toda a altura útil da tela,

          sem alterar nenhum dado, gráfico ou informação exibida. */}

      <h2 className={`font-black ${titleColor} text-lg mb-6`}>Visão Geral da Coleção</h2>



      {/* GRÁFICO DE PIZZA */}

      <div

        className="relative w-48 h-48 mx-auto mb-4 rounded-full shadow-inner flex items-center justify-center"

        style={{

          background: `conic-gradient(#10b981 0% ${stats.percColadas}%, #9333ea ${stats.percColadas}% ${parseFloat(stats.percColadas) + parseFloat(stats.percRepetidas)}%, ${isDarkMode ? '#334155' : '#e2e8f0'} ${parseFloat(stats.percColadas) + parseFloat(stats.percRepetidas)}% 100%)`

        }}

      >

        <div className={`w-32 h-32 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-white'} flex flex-col items-center justify-center shadow-md`}>

          <span className={`text-2xl font-black ${titleColor}`}>{stats.percentage}%</span>

          <span className={`text-[10px] ${textColor} font-bold uppercase`}>Completado</span>

        </div>

      </div>



      {/* BLOCOS DE INFORMAÇÃO NUMÉRICA */}

      <div className="space-y-3 w-full max-w-sm mx-auto mt-4">

        <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">

          <span className="flex items-center gap-2 font-bold text-emerald-500">

            <div className="w-3 h-3 rounded-full bg-emerald-500"></div> Coladas

          </span>

          <span className={`font-black ${titleColor}`}>

            {stats.coladas} <span className="text-xs font-normal opacity-50">({stats.percColadas}%)</span>

          </span>

        </div>



        <div className="flex justify-between items-center p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">

          <span className="flex items-center gap-2 font-bold text-purple-500">

            <div className="w-3 h-3 rounded-full bg-purple-500"></div> Repetidas

          </span>

          <span className={`font-black ${titleColor}`}>

            {stats.repetidas} <span className="text-xs font-normal opacity-50">({stats.percRepetidas}%)</span>

          </span>

        </div>



        <div className={`flex justify-between items-center p-3 rounded-xl ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-100 border-slate-200'}`}>

          <span className={`flex items-center gap-2 font-bold ${textColor}`}>

            <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-slate-500' : 'bg-slate-300'}`}></div> Faltantes

          </span>

          <span className={`font-black ${titleColor}`}>

            {stats.faltantes} <span className="text-xs font-normal opacity-50">({stats.percFaltantes}%)</span>

          </span>

        </div>

      </div>

    </div>

  </div>

)}



        {/* ABA 3: BOLÃO - Agora com o código VIP embutido no Troféu */}

        {activeTab === 'jogos' && (

            <div className={`${cardBg} p-5 rounded-2xl shadow-sm border text-center flex flex-1 flex-col items-center justify-center w-full`}>

                

                {/* BOTÃO SECRETO (3 Cliques) */}

                <Trophy size={48} className="mx-auto text-yellow-500 mb-4 cursor-pointer" onClick={() => { setTrophyClicks(prev => prev + 1); if(trophyClicks >= 2) setShowProCode(true); }} />

                

                <h2 className={`font-black ${titleColor} text-xl mb-2`}>Bolão da Família</h2>

                <p className={`text-sm ${textColor} mb-6 max-w-xs mx-auto`}>Acompanhe os jogos da Copa e faça seus palpites para competir com a família!</p>

                

                {/* CAIXA SECRETA DE SENHA VIP */}

                {showProCode && (

                  <div className="flex gap-2 mb-6 w-full max-w-xs mx-auto">

                    <input className={`flex-1 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'} border text-white p-3 rounded-xl text-xs outline-none`} onChange={(e) => setProInput(e.target.value)} placeholder="Código VIP" />

                    <button onClick={() => { if(proInput === 'NOSVICOPA2026') { setIsPro(true); setShowProCode(false); setToast("Modo Pro Ativado!"); } }} className="bg-emerald-600 text-white px-6 rounded-xl text-xs font-bold shadow-md">OK</button>

                  </div>

                )}

                

                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-slate-100 border border-slate-200'} opacity-70 w-full max-w-sm mx-auto`}>

                    <p className={`text-xs font-bold ${textColor}`}>📅 Em Breve: Tabela de Jogos 2026</p>

                    <p className={`text-[10px] mt-2 ${textColor}`}>Esta área será ativada automaticamente quando os grupos oficiais forem sorteados pela FIFA.</p>

                </div>

            </div>

        )}



{/* // ============================================================================ */}

{/* // ABA 4: PERFIL E CONFIGURAÇÕES */}

{/* // ============================================================================ */}

{activeTab === 'perfil' && (

  <div className="flex flex-1 flex-col w-full min-h-[calc(100dvh-170px)] gap-4 justify-between">

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

                            let m = SECTIONS.map(sec => {

                                const l = getSectionKeys(sec).filter(k => (stickers[k] || 0) === 0).map(k => k.split('-')[1]);

                                return l.length > 0 ? `${sec.flag} *${sec.prefix}*: ${l.join(', ')}` : null;

                            }).filter(s => s !== null).join('\n');

                            copyToClipboard(`🏆 *Faltam:*\n${m}`, "Lista copiada!");

                        }} className={`w-full flex items-center justify-between p-3 rounded-xl ${isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} transition-colors`}>

                            <span className={`text-xs font-bold ${textColor}`}>Copiar Lista de Faltantes</span>

                            <Share2 size={14} className={textColor} />

                        </button>

                    </div>

                )}



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

