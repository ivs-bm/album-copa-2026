import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LogOut, Info, Share2, KeyRound, Copy, Moon, Sun, Book, PieChart, Trophy, User, Download, Star, PlayCircle } from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, updateDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = { apiKey: "AIzaSyDm80NbEwqVyF5WratOIi-ENe35ykzJ-_Q", authDomain: "albumcopa2026-59c00.firebaseapp.com", projectId: "albumcopa2026-59c00", storageBucket: "albumcopa2026-59c00.firebasestorage.app", messagingSenderId: "839897438384", appId: "1:839897438384:web:b70a235d7f777c34080375" };
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

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

const getSectionKeys = (sec) => sec.count ? Array.from({ length: sec.count }, (_, i) => `${sec.prefix}-${i + 1}`) : sec.items.map(item => `${sec.prefix}-${item}`);
const TOTAL_STICKERS = SECTIONS.reduce((acc, sec) => acc + (sec.count || sec.items.length), 0);

export default function App() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeFamilyId, setActiveFamilyId] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [stickers, setStickers] = useState({});
  const [isPro, setIsPro] = useState(false);
  const [pixCode, setPixCode] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [toast, setToast] = useState('');
  
  const [activeTab, setActiveTab] = useState('album'); 
  const [isDarkMode, setIsDarkMode] = useState(true); 
  const [deferredPrompt, setDeferredPrompt] = useState(null); 
  const [isStandalone, setIsStandalone] = useState(false); 
  
  const sectionsRef = useRef({});

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsStandalone(true);
    }
    
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

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

  useEffect(() => {
    if (!activeFamilyId) return;
    return onSnapshot(doc(db, 'family_albums', activeFamilyId), (d) => {
      if (d.exists()) { setStickers(d.data().stickers || {}); setIsPro(!!d.data().isPro); }
    });
  }, [activeFamilyId]);

  const toggleSticker = async (key) => {
    const newStatus = ((stickers[key] || 0) + 1) % 3;
    setStickers({...stickers, [key]: newStatus});
    await updateDoc(doc(db, 'family_albums', activeFamilyId), { [`stickers.${key}`]: newStatus }).catch(() => {});
  };

  const handleBuyPro = () => setPixCode("00020126460014br.gov.bcb.pix0124... (Código PIX)");
  const copyToClipboard = (text, msg) => { navigator.clipboard.writeText(text).then(() => { setToast(msg); setTimeout(() => setToast(''), 2000); }); };
  const scrollToSection = (id) => {
      setActiveTab('album');
      setTimeout(() => sectionsRef.current[id]?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

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

  const themeBg = isDarkMode ? "bg-slate-900" : "bg-slate-50";
  const cardBg = isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-100 text-slate-800";
  const textColor = isDarkMode ? "text-slate-200" : "text-slate-600";
  const titleColor = isDarkMode ? "text-white" : "text-slate-800";

  return (
    <div className={`w-full max-w-[100vw] min-h-screen flex flex-col ${themeBg} relative overflow-x-hidden pb-20 transition-colors duration-300`}>
      <style>{`
        * { box-sizing: border-box !important; }
        html, body { width: 100%; margin: 0; padding: 0; overflow-x: hidden !important; overscroll-behavior-x: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
      
      {toast && <div className="fixed top-20 z-50 left-1/2 -translate-x-1/2 w-max max-w-[90%] bg-emerald-600 text-white px-4 py-2 rounded-full text-xs shadow-xl text-center font-bold">{toast}</div>}
      
      <header className={`w-full ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-emerald-800 to-teal-700'} text-white px-4 py-3 sticky top-0 z-40 shadow-md`}>
        <div className="flex justify-between items-center mb-2">
           <div className="flex items-center gap-3">
             <img src={user.photoURL} className="w-9 h-9 rounded-full border-2 border-emerald-400" alt="User" />
             <div>
                 <h1 className="font-black text-sm leading-tight">Família Copa</h1>
                 <p className="text-[10px] text-emerald-200">{stats.percentage}% Concluído</p>
             </div>
           </div>
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

      {/* GUIA RÁPIDO ADAPTADO AO DARK MODE */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 flex items-center justify-center backdrop-blur-sm" onClick={() => setShowTutorial(false)}>
          <div className={`${cardBg} p-5 rounded-3xl w-full max-w-sm shadow-2xl`} onClick={e => e.stopPropagation()}>
            <h2 className={`font-black ${titleColor} mb-4 text-lg border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} pb-2`}>Guia Rápido</h2>
            <div className="space-y-3 text-xs mb-4">
              <div className={`${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'} p-3 rounded-xl`}>
                <p className={`font-bold ${titleColor} mb-2 flex items-center gap-1`}>🏷️ Status das Figurinhas:</p>
                <div className="space-y-1.5 ml-2">
                  <p className={`flex items-center gap-2 ${textColor}`}>Toque 1x: <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">Colada</span></p>
                  <p className={`flex items-center gap-2 ${textColor}`}>Toque 2x: <span className="bg-purple-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">Repetida</span></p>
                  <p className={`flex items-center gap-2 ${textColor}`}>Toque 3x: <span className={`${isDarkMode ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-500'} px-2 py-0.5 rounded text-[10px] font-bold`}>Faltante</span></p>
                </div>
              </div>
              <div className={`${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'} p-3 rounded-xl`}>
                <p className={`font-bold ${titleColor} mb-1 flex items-center gap-1`}>👆 Navegação:</p>
                <p className={`ml-2 ${textColor} leading-relaxed`}>Deslize a barra de bandeiras no topo e toque em uma seleção para pular direto para ela.</p>
              </div>
              <div className={`${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'} p-3 rounded-xl`}>
                <p className={`font-bold ${titleColor} mb-1 flex items-center gap-1`}>✨ Usuários Pro:</p>
                <p className={`ml-2 ${textColor} leading-relaxed`}>Na aba Perfil, use as ferramentas de Administrador para copiar seu código de convite ou gerar uma lista de faltantes.</p>
              </div>
            </div>
            <button onClick={() => setShowTutorial(false)} className={`w-full ${isDarkMode ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-900 hover:bg-slate-800'} text-white py-3 rounded-xl mt-2 text-sm font-bold shadow-md transition-colors`}>Entendi, fechar!</button>
          </div>
        </div>
      )}

      <main className="w-full flex-1 flex flex-col px-3 py-4 space-y-4">
        
        {/* ABA 1: ÁLBUM */}
        {activeTab === 'album' && (
            <div className="flex-1">
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

              <div className="space-y-4">
                  {SECTIONS.map((sec) => (
                    <div key={sec.id} ref={el => sectionsRef.current[sec.id] = el} className={`${cardBg} p-3 sm:p-4 rounded-2xl shadow-sm border`}>
                       <h2 className={`font-black ${titleColor} mb-3 flex items-center gap-2 text-sm`}>{sec.flag} {sec.title}</h2>
                       <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                         {(sec.count ? Array.from({length: sec.count}, (_, i) => i + 1) : sec.items).map(item => {
                           const key = `${sec.prefix}-${item}`;
                           const status = stickers[key] || 0;
                           const btnClass = status === 0 
                                ? (isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-400')
                                : status === 1 
                                    ? 'bg-emerald-500 text-white shadow-md' 
                                    : 'bg-purple-600 text-white shadow-md';

                           return (
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

        {/* ABA 2: ESTATÍSTICAS (GRÁFICO) */}
        {activeTab === 'stats' && (
            <div className={`${cardBg} p-5 rounded-2xl shadow-sm border text-center flex flex-1 flex-col justify-center`}>
                <h2 className={`font-black ${titleColor} text-lg mb-6`}>Visão Geral da Coleção</h2>
                
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full shadow-inner flex items-center justify-center" 
                     style={{ 
                         background: `conic-gradient(#10b981 0% ${stats.percColadas}%, #9333ea ${stats.percColadas}% ${parseFloat(stats.percColadas) + parseFloat(stats.percRepetidas)}%, ${isDarkMode ? '#334155' : '#e2e8f0'} ${parseFloat(stats.percColadas) + parseFloat(stats.percRepetidas)}% 100%)`
                     }}>
                    <div className={`w-32 h-32 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-white'} flex flex-col items-center justify-center shadow-md`}>
                        <span className={`text-2xl font-black ${titleColor}`}>{stats.percentage}%</span>
                        <span className={`text-[10px] ${textColor} font-bold uppercase`}>Completado</span>
                    </div>
                </div>

                <div className="space-y-3 w-full max-w-sm mx-auto">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <span className="flex items-center gap-2 font-bold text-emerald-500"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Coladas</span>
                        <span className={`font-black ${titleColor}`}>{stats.coladas} <span className="text-xs font-normal opacity-50">({stats.percColadas}%)</span></span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                        <span className="flex items-center gap-2 font-bold text-purple-500"><div className="w-3 h-3 rounded-full bg-purple-500"></div> Repetidas</span>
                        <span className={`font-black ${titleColor}`}>{stats.repetidas} <span className="text-xs font-normal opacity-50">({stats.percRepetidas}%)</span></span>
                    </div>
                    <div className={`flex justify-between items-center p-3 rounded-xl ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-100 border-slate-200'}`}>
                        <span className={`flex items-center gap-2 font-bold ${textColor}`}><div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-slate-500' : 'bg-slate-300'}`}></div> Faltantes</span>
                        <span className={`font-black ${titleColor}`}>{stats.faltantes} <span className="text-xs font-normal opacity-50">({stats.percFaltantes}%)</span></span>
                    </div>
                </div>
            </div>
        )}

        {/* ABA 3: BOLÃO */}
        {activeTab === 'jogos' && (
            <div className={`${cardBg} p-5 rounded-2xl shadow-sm border text-center flex flex-1 flex-col items-center justify-center`}>
                <Trophy size={48} className="mx-auto text-yellow-500 mb-4" />
                <h2 className={`font-black ${titleColor} text-xl mb-2`}>Bolão da Família</h2>
                <p className={`text-sm ${textColor} mb-6 max-w-xs mx-auto`}>Acompanhe os jogos da Copa e faça seus palpites para competir com a família!</p>
                
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-slate-100 border border-slate-200'} opacity-70 w-full max-w-sm`}>
                    <p className={`text-xs font-bold ${textColor}`}>📅 Em Breve: Tabela de Jogos 2026</p>
                    <p className={`text-[10px] mt-2 ${textColor}`}>Esta área será ativada automaticamente quando os grupos oficiais forem sorteados pela FIFA.</p>
                </div>
            </div>
        )}

        {/* ABA 4: PERFIL E CONFIGURAÇÕES */}
        {activeTab === 'perfil' && (
            <div className="space-y-4 flex flex-1 flex-col">
                
                {!isStandalone && (
                   <button onClick={handleInstallClick} className="w-full flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 rounded-2xl shadow-lg transition-all border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1">
                     <span className="font-black text-base uppercase tracking-wide flex items-center gap-2"><Download size={20}/> Instalar Aplicação</span>
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
