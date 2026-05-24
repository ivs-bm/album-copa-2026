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
  const [activeTab, setActiveTab] = useState('album'); // Controla qual guia está aberta (album, stats, jogos, perfil)
  const [isDarkMode, setIsDarkMode] = useState(true); // Controla a chave do Modo Escuro/Claro
  const [stickers, setStickers] = useState({}); // Dicionário contendo o status de cada figurinha (0, 1 ou 2)
  const [isPro, setIsPro] = useState(false); // Define se a família atual possui acesso Premium/Pro
  const [showTutorial, setShowTutorial] = useState(false); // Define se a tela do Guia Rápido está visível
  const [toast, setToast] = useState(''); // Controla as mensagens pop-up no topo (ex: "Pix copiado")
  const [activeFamilyId, setActiveFamilyId] = useState(''); // Guarda o código da família sendo visualizada
  const [joinCode, setJoinCode] = useState(''); // Guarda o texto digitado no input "Entrar em família"
  const [pixCode, setPixCode] = useState(''); // Guarda o código do PIX gerado para compra do Pro
  
  // Estados referentes ao código secreto (Easter Egg no Troféu)
  const [trophyClicks, setTrophyClicks] = useState(0); // Conta quantas vezes o usuário clicou no troféu
  const [proInput, setProInput] = useState(''); // Guarda a senha secreta digitada ("NOSVICOPA2026")
  const [showProCode, setShowProCode] = useState(false); // Define se a caixa de senha secreta está visível
  
  // Estados referentes ao PWA (Instalação no celular)
  const [deferredPrompt, setDeferredPrompt] = useState(null); // Salva o evento do navegador que permite instalar o App
  const [isStandalone, setIsStandalone] = useState(false); // Verifica se o app já está instalado
  const sectionsRef = useRef({}); // Referência invisível usada para fazer a rolagem automática até a bandeira clicada

  // ============================================================================
  // EFEITOS E LÓGICA DE INICIALIZAÇÃO
  // ============================================================================
  
  // Efeito 1: Captura a permissão do celular para instalar o App (PWA)
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) setIsStandalone(true);
    const handleBeforeInstallPrompt = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Função: Botão "Instalar Aplicativo" (Aba Perfil)
  const handleInstallClick = () => {
    if (deferredPrompt) {
        // Mostra a janela oficial do Android/iOS para instalar
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => { if (choiceResult.outcome === 'accepted') { setDeferredPrompt(null); setIsStandalone(true); } });
    } else {
        // Se o celular bloquear a janela, mostra o aviso em formato Toast
        setToast("Use o menu do navegador para instalar.");
        setTimeout(() => setToast(''), 4500);
    }
  };

  // Efeito 2: Verifica o login no Google ao abrir o App
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u); // Salva o usuário logado
        if (u) {
            // Se logou, tenta buscar se ele já estava em alguma família antes
            const savedFamilyId = localStorage.getItem('@AlbumCopa_FamilyId');
            setActiveFamilyId(savedFamilyId || u.uid);
        } else {
            localStorage.removeItem('@AlbumCopa_FamilyId');
            setActiveFamilyId('');
        }
    });
    return () => unsubscribe();
  }, []);

  // Efeito 3: Fica "escutando" o banco de dados (Firebase) para atualizar figurinhas em tempo real
  useEffect(() => {
    if (!activeFamilyId) return;
    return onSnapshot(doc(db, 'family_albums', activeFamilyId), (d) => {
      if (d.exists()) { setStickers(d.data().stickers || {}); setIsPro(!!d.data().isPro); }
    });
  }, [activeFamilyId]);

  // ============================================================================
  // FUNÇÕES DE INTERAÇÃO (CLIQUES NOS BOTÕES)
  // ============================================================================
  
  // Função: Quando clica em qualquer botão de figurinha (Aba Álbum)
  const toggleSticker = async (key) => {
    // Rotaciona o status: 0 (Faltante) -> 1 (Colada) -> 2 (Repetida) -> Volta pro 0
    const newStatus = ((stickers[key] || 0) + 1) % 3;
    setStickers({...stickers, [key]: newStatus});
    // Salva a mudança no banco de dados Firebase
    await updateDoc(doc(db, 'family_albums', activeFamilyId), { [`stickers.${key}`]: newStatus }).catch(() => {});
  };

  // Função: Botão "Tornar-se Pro" (Aba Perfil)
  const handleBuyPro = () => setPixCode("00020126460014br.gov.bcb.pix0124... (Código PIX)");
  
  // Função Genérica: Copia textos para a área de transferência do celular e mostra aviso
  const copyToClipboard = (text, msg) => { navigator.clipboard.writeText(text).then(() => { setToast(msg); setTimeout(() => setToast(''), 2000); }); };
  
  // Função: Quando clica em uma bandeira (Aba Álbum), faz a tela deslizar até aquele país
  const scrollToSection = (id) => { setActiveTab('album'); setTimeout(() => sectionsRef.current[id]?.scrollIntoView({ behavior: 'smooth' }), 100); };

  // Função de Cálculo: Conta figurinhas coladas, repetidas e o % completo
  const stats = useMemo(() => {
    let coladas = 0; let repetidas = 0;
    Object.values(stickers).forEach(s => { if (s === 1) coladas++; if (s === 2) repetidas++; });
    const faltantes = TOTAL_STICKERS - (coladas + repetidas);
    return { 
        coladas, repetidas, faltantes, 
        percentage: TOTAL_STICKERS > 0 ? (((coladas + repetidas) / TOTAL_STICKERS) * 100).toFixed(0) : 0,
        percColadas: ((coladas / TOTAL_STICKERS) * 100).toFixed(1),
        percRepetidas: ((repetidas / TOTAL_STICKERS) * 100).toFixed(1)
    };
  }, [stickers]);

  // ============================================================================
  // RENDERIZAÇÃO: TELA DE LOGIN
  // ============================================================================
  // Se não tem usuário logado, trava a tela toda exibindo apenas o Botão do Google
  if (!user) return <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6"><button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} className="bg-white text-black px-8 py-3 rounded-full font-bold">Entrar com Google</button></div>;

  // Variáveis para trocar a cor das caixas (Cards) dependendo se é Modo Claro ou Escuro
  const themeBg = isDarkMode ? "bg-slate-900" : "bg-slate-50";
  const cardBg = isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-100 text-slate-800";
  const textColor = isDarkMode ? "text-slate-200" : "text-slate-600";
  const titleColor = isDarkMode ? "text-white" : "text-slate-800";

  // ============================================================================
  // RENDERIZAÇÃO PRINCIPAL: INTERFACE DO APLICATIVO LOGADO
  // ============================================================================
  return (
    // DIV PRINCIPAL: Fundo do app que envelopa tudo
    <div className={`w-full min-h-screen flex flex-col ${themeBg} transition-colors duration-300`}>
      <style>{`* { box-sizing: border-box !important; } html, body { width: 100%; margin: 0; padding: 0; } .hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      
      {/* ALERTA TOAST (O balão flutuante que avisa "Pix copiado", "Modo Pro ativado", etc) */}
      {toast && <div className="fixed top-20 z-[100] left-1/2 -translate-x-1/2 w-max bg-emerald-600 text-white px-4 py-2 rounded-full text-xs shadow-xl font-bold">{toast}</div>}
      
      {/* ======================================================================= */}
      {/* CABEÇALHO SUPERIOR (Header fixo com Foto, Titulo e Progresso) */}
      {/* ======================================================================= */}
      <header className={`w-full ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-emerald-800 to-teal-700'} text-white px-4 py-3 sticky top-0 z-40 shadow-md`}>
         <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
               <img src={user.photoURL} className="w-9 h-9 rounded-full border-2 border-emerald-400" alt="User" />
               <div><h1 className="font-black text-sm">Família Copa</h1><p className="text-[10px] text-emerald-200">{stats.percentage}% Concluído</p></div>
            </div>
            <div className="flex gap-2">
                {/* BOTÃO: Abrir tela de Ajuda (Guia Rápido) */}
                <button onClick={() => setShowTutorial(true)} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><Info size={18} /></button>
                {/* BOTÃO: Alternar Modo Claro / Escuro */}
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 bg-white/10 rounded-full hover:bg-white/20">{isDarkMode ? <Sun size={18} className="text-yellow-400"/> : <Moon size={18} />}</button>
            </div>
         </div>
         {/* BARRA DE PROGRESSO: Linha que enche conforme % de figurinhas */}
         <div className="flex items-center gap-3"><div className="flex-1 h-1.5 bg-black/30 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 transition-all" style={{ width: `${stats.percentage}%` }}></div></div></div>
      </header>

      {/* ======================================================================= */}
      {/* MODAL: GUIA RÁPIDO (Abre quando clica no botão "i" do topo) */}
      {/* ======================================================================= */}
      {showTutorial && (
        <div className="fixed inset-0 z-[100] bg-black/60 p-4 flex items-center justify-center backdrop-blur-sm" onClick={() => setShowTutorial(false)}>
          <div className={`${cardBg} p-6 rounded-3xl w-full max-w-lg shadow-2xl space-y-4`} onClick={e => e.stopPropagation()}>
            <h2 className={`font-black ${titleColor} text-lg border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} pb-2`}>Guia Rápido</h2>
            <div className="text-xs space-y-3 text-slate-400">
              <p>🏷️ <strong>Status:</strong> Toque 1x Colada, 2x Repetida, 3x Faltante.</p>
              <p>👆 <strong>Navegação:</strong> Use a barra superior para pular entre seleções.</p>
              <p>☀️🌙 <strong>Temas:</strong> Use o botão de Sol/Lua para alternar temas.</p>
              <p>📊 <strong>Resumo:</strong> Visão Geral da sua coleção com gráficos.</p>
              <p>🏆 <strong>Bolão:</strong> Acompanhe os jogos da Copa.</p>
              <p>👤 <strong>Perfil:</strong> Gerencie família, links e instale o app.</p>
              <p>✨ <strong>Usuários Pro:</strong> Ferramentas de administrador.</p>
            </div>
            {/* BOTÃO FECHAR GUIA RÁPIDO */}
            <button onClick={() => setShowTutorial(false)} className={`w-full ${isDarkMode ? 'bg-emerald-500' : 'bg-slate-900'} text-white py-3 rounded-xl mt-6 font-bold`}>Entendi!</button>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* ÁREA DE CONTEÚDO CENTRAL (Muda dependendo da Aba selecionada abaixo) */}
      {/* ======================================================================= */}
      <main className="w-full flex-1 flex flex-col p-3 space-y-4">
        
        {/* ABA 1: ÁLBUM DE FIGURINHAS */}
        {activeTab === 'album' && (
            <div className="flex-1 w-full">
              
              {/* === INÍCIO DO TRECHO SUBSTITUÍDO: MENU DE BANDEIRAS HORIZONTAIS === */}
              {/* MENU DE BANDEIRAS HORIZONTAIS: Permite deslizar lateralmente */}
              <div className="sticky top-[65px] z-30 pt-1 pb-2 w-full">
                <div className={`${cardBg} px-3 py-2 rounded-2xl flex gap-4 overflow-x-auto hide-scrollbar`}>
                  
                  {/* AQUI ESTÃO OS BOTÕES! O comando 'map' cria um botão para cada país */}
                  {SECTIONS.map(s => (
                    <button key={s.id} onClick={() => scrollToSection(s.id)} className="flex flex-col items-center min-w-[44px]">
                      <span className="text-xl">{s.flag}</span>
                      <span className="text-[8px] font-bold uppercase">{s.prefix}</span>
                    </button>
                  ))}

                </div>
              </div>
              {/* === FIM DO TRECHO SUBSTITUÍDO === */}

              {/* LISTA DAS SEÇÕES (Países) E BOTÕES INDIVIDUAIS DE FIGURINHAS */}
              <div className="space-y-4">
                 {SECTIONS.map((sec) => (
                    <div key={sec.id} ref={el => sectionsRef.current[sec.id] = el} className={`${cardBg} p-4 rounded-2xl border`}>
                       <h2 className={`font-black ${titleColor} mb-3 text-sm`}>{sec.flag} {sec.title}</h2>
                       <div className="grid grid-cols-5 gap-2">
                         {/* Mapeia a quantidade de figurinhas do país e cria os botões quadrados */}
                         {(sec.count ? Array.from({length: sec.count}, (_, i) => i + 1) : sec.items).map(item => { 
                             const key = `${sec.prefix}-${item}`; 
                             const status = stickers[key] || 0; 
                             return (
                               <button key={key} onClick={() => toggleSticker(key)} className={`aspect-square w-full rounded-lg font-bold text-xs ${status === 0 ? (isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-400') : status === 1 ? 'bg-emerald-500 text-white' : 'bg-purple-600 text-white'}`}>
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

        {/* ABA 2: RESUMO (ESTATÍSTICAS / GRÁFICO) */}
        {activeTab === 'stats' && (
            <div className={`${cardBg} p-6 rounded-3xl border text-center flex-1 w-full flex flex-col justify-center items-center`}>
                <h2 className={`font-black ${titleColor} text-lg mb-8`}>Visão Geral da Coleção</h2>
                
                {/* GRÁFICO DE PIZZA (Feito com CSS Gradient dinâmico) */}
                <div className="relative w-48 h-48 mb-8 rounded-full shadow-inner flex items-center justify-center" style={{ background: `conic-gradient(#10b981 0% ${stats.percColadas}%, #9333ea ${stats.percColadas}% ${parseFloat(stats.percColadas) + parseFloat(stats.percRepetidas)}%, ${isDarkMode ? '#334155' : '#e2e8f0'} ${parseFloat(stats.percColadas) + parseFloat(stats.percRepetidas)}% 100%)` }}>
                    <div className={`w-32 h-32 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-white'} flex flex-col items-center justify-center`}>
                        <span className={`text-2xl font-black ${titleColor}`}>{stats.percentage}%</span>
                        <span className={`text-[10px] ${textColor} font-bold uppercase`}>Completado</span>
                    </div>
                </div>
                
                {/* BLOCOS DE INFORMAÇÃO NUMÉRICA (Coladas, Repetidas) */}
                <div className="space-y-3 w-full max-w-sm">
                    <div className="flex justify-between items-center p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                        <span className="flex items-center gap-2 font-bold text-emerald-500">Coladas</span>
                        <span className={`font-black ${titleColor}`}>{stats.coladas}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                        <span className="flex items-center gap-2 font-bold text-purple-500">Repetidas</span>
                        <span className={`font-black ${titleColor}`}>{stats.repetidas}</span>
                    </div>
                </div>
            </div>
        )}

        {/* ABA 3: BOLÃO E CÓDIGO SECRETO (TROFÉU) */}
        {activeTab === 'jogos' && (
            <div className={`${cardBg} p-6 rounded-3xl border text-center flex-1 w-full flex flex-col items-center justify-center`}>
                
                {/* BOTÃO SECRETO: Clicar 3 vezes no troféu abre o input do Pro */}
                <Trophy size={60} className="text-yellow-500 mb-6 cursor-pointer" onClick={() => { setTrophyClicks(prev => prev + 1); if(trophyClicks >= 2) setShowProCode(true); }} />
                
                <h2 className={`font-black ${titleColor} text-xl mb-2`}>Bolão da Família</h2>
                <p className={`text-sm ${textColor} mb-8`}>Acompanhe os jogos da Copa!</p>
                
                {/* CAIXA SECRETA DE SENHA VIP: Só aparece após os 3 cliques no troféu */}
                {showProCode && (
                  <div className="flex gap-2 mb-6 w-full max-w-xs">
                    {/* INPUT: Digitar "NOSVICOPA2026" */}
                    <input className={`flex-1 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'} text-white p-3 rounded-xl text-xs`} onChange={(e) => setProInput(e.target.value)} />
                    {/* BOTÃO OK: Confirma a senha secreta VIP */}
                    <button onClick={() => { if(proInput === 'NOSVICOPA2026') { setIsPro(true); setShowProCode(false); setToast("Modo Pro!"); } }} className="bg-emerald-500 text-white px-6 rounded-xl text-xs font-bold">OK</button>
                  </div>
                )}
                
                <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200'} w-full max-w-sm`}><p className={`text-xs font-bold ${textColor}`}>📅 Em Breve: Tabela de Jogos 2026</p></div>
            </div>
        )}

        {/* ABA 4: PERFIL E CONFIGURAÇÕES */}
        {activeTab === 'perfil' && (
            <div className="space-y-4 flex flex-1 w-full flex-col">
                
                {/* BOTÃO OFICIAL PWA: Instalar aplicativo (Sempre visível até ser instalado) */}
                {!isStandalone && (
                  <button onClick={handleInstallClick} className="w-full flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl shadow-lg font-black uppercase text-sm tracking-wide">
                     Instalar Aplicativo
                  </button>
                )}
                
                {/* BLOCO PARA CONTAS FREE (Área Premium - Convite ou Compra) */}
                {!isPro && (
                  <div className={`${cardBg} p-6 rounded-3xl border space-y-4 flex-1 flex flex-col`}>
                     <h3 className={`font-black ${titleColor} text-sm flex items-center gap-2`}><Star size={16} className="text-yellow-500"/> Área Premium</h3>
                     {activeFamilyId !== user.uid ? (
                        <div className="text-center font-bold text-xs p-4 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20">Você faz parte de uma família ativada!</div>
                     ) : (
                       <div className="flex gap-2">
                         {/* INPUT DE CONVITE */}
                         <input type="text" placeholder="Código..." onChange={(e) => setJoinCode(e.target.value)} className={`flex-1 w-full ${isDarkMode ? 'bg-slate-900 text-white border-slate-700' : 'bg-slate-50 text-slate-900 border-slate-200'} rounded-xl px-4 py-3 text-xs border outline-none`}/>
                         {/* BOTÃO DE ENTRAR NA FAMÍLIA */}
                         <button onClick={() => { if (joinCode.trim()) { setActiveFamilyId(joinCode.trim()); localStorage.setItem('@AlbumCopa_FamilyId', joinCode.trim()); } }} className="bg-emerald-600 text-white px-6 rounded-xl font-bold text-xs">Entrar</button>
                       </div>
                     )}
                     <div className="grid grid-cols-2 gap-3 mt-auto pt-4">
                        {/* BOTÃO VER VÍDEO NO YOUTUBE */}
                        <a href="https://youtube.com/shorts/R0sVz5BjRFU?feature=share" target="_blank" rel="noreferrer" className="text-center bg-red-600 text-white py-4 rounded-xl font-bold text-xs">Ver Vídeo</a>
                        {activeFamilyId !== user.uid ? (
                            <button className="bg-emerald-600 text-white py-4 rounded-xl font-bold text-xs opacity-50 cursor-not-allowed">Pro Ativado</button>
                        ) : (
                            <button onClick={handleBuyPro} className="bg-indigo-600 text-white py-4 rounded-xl font-bold text-xs">Tornar-se Pro</button>
                        )}
                     </div>
                  </div>
                )}

                {/* BLOCO PARA CONTAS PRO (Ferramentas de Administrador) */}
                {isPro && (
                    <div className={`${cardBg} p-4 rounded-2xl shadow-sm border space-y-3 flex-1`}>
                        <h3 className={`font-black ${titleColor} text-sm flex items-center gap-2 mb-2`}><KeyRound size={16} className="text-indigo-400"/> Ferramentas do Administrador</h3>
                        
                        {/* BOTÃO: Copiar Código da Família (Convite) */}
                        <button onClick={() => copyToClipboard(activeFamilyId, "ID copiado!")} className={`w-full flex items-center justify-between p-3 rounded-xl ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
                            <span className={`text-xs font-bold ${textColor}`}>Código da Família</span><Copy size={14} />
                        </button>

                        {/* BOTÃO: Gerar e Copiar Lista de Faltantes */}
                        <button onClick={() => { 
                            let m = SECTIONS.map(sec => { const l = getSectionKeys(sec).filter(k => (stickers[k] || 0) === 0).map(k => k.split('-')[1]); return l.length > 0 ? `${sec.flag} *${sec.prefix}*: ${l.join(', ')}` : null; }).filter(s => s !== null).join('\n'); 
                            copyToClipboard(`🏆 *Faltam:*\n${m}`, "Lista copiada!"); 
                        }} className={`w-full flex items-center justify-between p-3 rounded-xl ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
                            <span className={`text-xs font-bold ${textColor}`}>Copiar Faltantes</span><Share2 size={14} />
                        </button>
                    </div>
                )}

                {/* BOTÃO DE SAIR DA CONTA (Aparece tanto para PRO quanto para FREE) */}
                <div className={`${cardBg} p-4 rounded-2xl border`}>
                   <button onClick={() => { signOut(auth); localStorage.removeItem('@AlbumCopa_FamilyId'); }} className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 py-4 rounded-xl font-bold text-sm">
                       Sair da Conta
                   </button>
                </div>
            </div>
        )}
      </main>

      {/* ======================================================================= */}
      {/* MENU INFERIOR (BOTTOM NAVIGATION): Os 4 botões do rodapé */}
      {/* ======================================================================= */}
      <nav className={`fixed bottom-0 left-0 w-full ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'} border-t pt-2 px-6 z-50`}>
          <div className="flex justify-between items-center pb-2 max-w-md mx-auto">
              {/* BOTÃO INFERIOR 1: ÁLBUM */}
              <button onClick={() => setActiveTab('album')} className={`flex flex-col items-center gap-1 ${activeTab === 'album' ? 'text-emerald-500' : 'text-slate-400'}`}>
                 <Book size={24}/><span className="text-[10px] font-bold">Álbum</span>
              </button>
              {/* BOTÃO INFERIOR 2: RESUMO */}
              <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-1 ${activeTab === 'stats' ? 'text-emerald-500' : 'text-slate-400'}`}>
                 <PieChart size={24}/><span className="text-[10px] font-bold">Resumo</span>
              </button>
              {/* BOTÃO INFERIOR 3: BOLÃO */}
              <button onClick={() => setActiveTab('jogos')} className={`flex flex-col items-center gap-1 ${activeTab === 'jogos' ? 'text-emerald-500' : 'text-slate-400'}`}>
                 <Trophy size={24}/><span className="text-[10px] font-bold">Bolão</span>
              </button>
              {/* BOTÃO INFERIOR 4: PERFIL */}
              <button onClick={() => setActiveTab('perfil')} className={`flex flex-col items-center gap-1 ${activeTab === 'perfil' ? 'text-emerald-500' : 'text-slate-400'}`}>
                 <User size={24}/><span className="text-[10px] font-bold">Perfil</span>
              </button>
          </div>
      </nav>
    </div>
  );
}
