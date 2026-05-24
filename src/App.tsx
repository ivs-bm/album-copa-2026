// ============================================================================
// CÓDIGO CORRIGIDO: Padrão de largura e preenchimento total aplicado
// ============================================================================
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
  const [activeTab, setActiveTab] = useState('album');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [stickers, setStickers] = useState({});
  const [isPro, setIsPro] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [toast, setToast] = useState('');
  const [activeFamilyId, setActiveFamilyId] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [pixCode, setPixCode] = useState('');
  const [trophyClicks, setTrophyClicks] = useState(0);
  const [proInput, setProInput] = useState('');
  const [showProCode, setShowProCode] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const sectionsRef = useRef({});

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) setIsStandalone(true);
    const handleBeforeInstallPrompt = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => { setDeferredPrompt(null); });
    } else {
        setToast("Use o menu do navegador para instalar.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u);
        if (u) {
            const savedFamilyId = localStorage.getItem('@AlbumCopa_FamilyId');
            setActiveFamilyId(savedFamilyId || u.uid);
        }
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
  const scrollToSection = (id) => { setActiveTab('album'); setTimeout(() => sectionsRef.current[id]?.scrollIntoView({ behavior: 'smooth' }), 100); };

  const stats = useMemo(() => {
    let coladas = 0; let repetidas = 0;
    Object.values(stickers).forEach(s => { if (s === 1) coladas++; if (s === 2) repetidas++; });
    const faltantes = TOTAL_STICKERS - (coladas + repetidas);
    return { coladas, repetidas, faltantes, percentage: TOTAL_STICKERS > 0 ? (((coladas + repetidas) / TOTAL_STICKERS) * 100).toFixed(0) : 0 };
  }, [stickers]);

  if (!user) return <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6"><button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} className="bg-white text-black px-8 py-3 rounded-full font-bold">Entrar com Google</button></div>;

  const cardBg = isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-100 text-slate-800";

  return (
    <div className={`w-full min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'} transition-colors duration-300`}>
      {toast && <div className="fixed top-20 z-50 left-1/2 -translate-x-1/2 w-max bg-emerald-600 text-white px-4 py-2 rounded-full text-xs shadow-xl">{toast}</div>}
      
      <header className={`w-full ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-emerald-800 to-teal-700'} text-white px-4 py-3 sticky top-0 z-40 shadow-md`}>
         <div className="flex justify-between items-center mb-2">
            <h1 className="font-black text-sm">Família Copa</h1>
            <div className="flex gap-2">
                <button onClick={() => setShowTutorial(true)}><Info size={18} /></button>
                <button onClick={() => setIsDarkMode(!isDarkMode)}>{isDarkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
            </div>
         </div>
         <div className="h-1.5 bg-black/30 rounded-full overflow-hidden"><div className="h-full bg-emerald-400" style={{ width: `${stats.percentage}%` }}></div></div>
      </header>

      {showTutorial && (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 flex items-center justify-center" onClick={() => setShowTutorial(false)}>
          <div className={`${cardBg} p-6 rounded-3xl w-full max-w-lg shadow-2xl`} onClick={e => e.stopPropagation()}>
            <h2 className="font-black text-lg border-b pb-2 mb-4">Guia Rápido</h2>
            <div className="text-xs space-y-3">
              <p>🏷️ <strong>Status:</strong> Toque 1x Colada, 2x Repetida, 3x Faltante.</p>
              <p>👆 <strong>Navegação:</strong> Use a barra superior para pular entre seleções.</p>
              <p>☀️🌙 <strong>Temas:</strong> Use o botão de Sol/Lua para alternar temas.</p>
              <p>📊 <strong>Resumo:</strong> Visão Geral da sua coleção com gráficos.</p>
              <p>🏆 <strong>Bolão:</strong> Acompanhe os jogos da Copa.</p>
              <p>👤 <strong>Perfil:</strong> Gerencie família, links e instale o app.</p>
              <p>✨ <strong>Usuários Pro:</strong> Ferramentas de administrador.</p>
            </div>
            <button onClick={() => setShowTutorial(false)} className="w-full bg-emerald-600 text-white py-3 rounded-xl mt-6 font-bold">Entendi!</button>
          </div>
        </div>
      )}

      {/* Main agora usa flex-1 e w-full para preencher toda a área */}
      <main className="w-full flex-1 flex flex-col p-3 space-y-4">
        {activeTab === 'album' && (
            <div className="flex-1 w-full">
              <div className="sticky top-[65px] z-30 pt-1 pb-2 w-full"><div className={`${cardBg} px-3 py-2 rounded-2xl flex gap-4 overflow-x-auto hide-scrollbar`}>{SECTIONS.map(s => <button key={s.id} onClick={() => scrollToSection(s.id)} className="flex flex-col items-center min-w-[44px]"><span className="text-xl">{s.flag}</span><span className="text-[8px] font-bold uppercase">{s.prefix}</span></button>)}</div></div>
              <div className="space-y-4">{SECTIONS.map((sec) => (<div key={sec.id} ref={el => sectionsRef.current[sec.id] = el} className={`${cardBg} p-4 rounded-2xl border`}><h2 className="font-black mb-3 text-sm">{sec.flag} {sec.title}</h2><div className="grid grid-cols-5 gap-2">{(sec.count ? Array.from({length: sec.count}, (_, i) => i + 1) : sec.items).map(item => { const key = `${sec.prefix}-${item}`; const status = stickers[key] || 0; return <button key={key} onClick={() => toggleSticker(key)} className={`aspect-square w-full rounded-lg font-bold text-xs ${status === 0 ? 'bg-slate-100 text-slate-400' : status === 1 ? 'bg-emerald-500 text-white' : 'bg-purple-600 text-white'}`}>{item}</button>; })}</div></div>))}</div>
            </div>
        )}

        {/* Resumo preenchendo toda a página */}
        {activeTab === 'stats' && (
            <div className={`${cardBg} p-6 rounded-3xl border text-center flex-1 w-full flex flex-col justify-center`}>
                <h2 className="font-black text-lg mb-8">Visão Geral da Coleção</h2>
                <div className="space-y-3 w-full"><div className="flex justify-between items-center p-4 rounded-2xl bg-emerald-500/10"><span className="font-bold text-emerald-500">Coladas</span><span className="font-black">{stats.coladas}</span></div><div className="flex justify-between items-center p-4 rounded-2xl bg-purple-500/10"><span className="font-bold text-purple-500">Repetidas</span><span className="font-black">{stats.repetidas}</span></div></div>
            </div>
        )}

        {/* Bolão preenchendo toda a página */}
        {activeTab === 'jogos' && (
            <div className={`${cardBg} p-6 rounded-3xl border text-center flex-1 w-full flex flex-col items-center justify-center`}>
                <Trophy size={60} className="text-yellow-500 mb-6 cursor-pointer" onClick={() => { setTrophyClicks(prev => prev + 1); if(trophyClicks >= 2) setShowProCode(true); }} />
                <h2 className="font-black text-xl mb-2">Bolão da Família</h2>
                <p className="text-sm mb-8">Acompanhe os jogos da Copa!</p>
                {showProCode && (<div className="flex gap-2 mb-6 w-full"><input className="flex-1 bg-slate-700 text-white p-3 rounded-xl text-xs" onChange={(e) => setProInput(e.target.value)} /><button onClick={() => { if(proInput === 'NOSVICOPA2026') { setIsPro(true); setShowProCode(false); setToast("Modo Pro!"); } }} className="bg-emerald-500 text-white px-6 rounded-xl text-xs font-bold">OK</button></div>)}
            </div>
        )}

        {/* Perfil preenchendo toda a página */}
        {activeTab === 'perfil' && (
            <div className="space-y-4 flex flex-1 w-full flex-col">
                <button onClick={handleInstallClick} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-black uppercase text-sm">INSTALAR APLICATIVO</button>
                <div className={`${cardBg} p-6 rounded-3xl border space-y-4 flex-1`}>
                     {/* ... restante do código do perfil ... */}
                </div>
            </div>
        )}
      </main>

      <nav className={`fixed bottom-0 left-0 w-full ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'} border-t pt-2 px-6 z-50`}>
          <div className="flex justify-between items-center pb-2 max-w-md mx-auto">
              <button onClick={() => setActiveTab('album')}><Book size={24}/></button>
              <button onClick={() => setActiveTab('stats')}><PieChart size={24}/></button>
              <button onClick={() => setActiveTab('jogos')}><Trophy size={24}/></button>
              <button onClick={() => setActiveTab('perfil')}><User size={24}/></button>
          </div>
      </nav>
    </div>
  );
}
