import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LogOut, Info, Share2, KeyRound, Copy, Moon, Sun, Download, Star, PlayCircle } from 'lucide-react';
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
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [trophyClicks, setTrophyClicks] = useState(0);
  const [proInput, setProInput] = useState('');
  const [showProCode, setShowProCode] = useState(false);
  const sectionsRef = useRef({});

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) { deferredPrompt.prompt(); const { outcome } = await deferredPrompt.userChoice; if (outcome === 'accepted') setDeferredPrompt(null); }
    else { setToast("Use o menu do navegador para 'Adicionar à Tela Inicial'."); setTimeout(() => setToast(''), 3000); }
  };

  useEffect(() => { 
    const unsubscribe = onAuthStateChanged(auth, (u) => { 
      setUser(u); 
      if (u) {
        const savedFamilyId = localStorage.getItem('@AlbumCopa_FamilyId');
        setActiveFamilyId(savedFamilyId ? savedFamilyId : u.uid);
      } else { localStorage.removeItem('@AlbumCopa_FamilyId'); setActiveFamilyId(''); }
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

  const stats = useMemo(() => {
    let collected = 0; Object.values(stickers).forEach(s => { if (s > 0) collected++; });
    return { percentage: TOTAL_STICKERS > 0 ? ((collected / TOTAL_STICKERS) * 100).toFixed(0) : 0 };
  }, [stickers]);

  if (isAuthLoading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-500"></div></div>;
  if (!user) return <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center"><button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} className="bg-white text-black px-8 py-3 rounded-full font-bold shadow-xl">Entrar com Google</button></div>;

  return (
    <div className="w-full max-w-[100vw] min-h-screen bg-slate-50 relative overflow-x-hidden">
      <style>{`* { box-sizing: border-box !important; } html, body { width: 100%; margin: 0; padding: 0; overflow-x: hidden !important; }`}</style>
      {toast && <div className="fixed top-20 z-50 left-1/2 -translate-x-1/2 w-max bg-slate-900 text-white px-4 py-2 rounded-full text-xs shadow-xl">{toast}</div>}
      
      <header className="w-full bg-gradient-to-br from-emerald-800 to-teal-700 text-white px-3 py-3 sticky top-0 z-40 shadow-sm">
        <div className="flex justify-between items-center mb-2">
           <div className="flex items-center gap-2"><img src={user.photoURL} className="w-8 h-8 rounded-full border-2 border-white/20" alt="User" /><h1 className="font-black text-sm">Copa 2026</h1></div>
           <div className="flex gap-2">
             <button onClick={() => setShowTutorial(true)} className="p-1.5 bg-white/10 rounded-lg"><Info size={18} /></button>
             <button onClick={() => { signOut(auth); localStorage.removeItem('@AlbumCopa_FamilyId'); }} className="p-1.5 bg-white/10 rounded-lg"><LogOut size={18} /></button>
           </div>
        </div>
        <div className="flex items-center gap-3"><div className="flex-1 h-1.5 bg-black/20 rounded-full overflow-hidden"><div className="h-full bg-yellow-400" style={{ width: `${stats.percentage}%` }}></div></div><span className="text-[10px] font-bold w-6 text-right">{stats.percentage}%</span></div>
      </header>

      {showTutorial && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center" onClick={() => setShowTutorial(false)}>
          <div className="bg-white p-5 rounded-2xl w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="font-black text-slate-800 mb-4 border-b pb-2">Guia Rápido</h2>
            <div className="space-y-3 text-xs text-slate-600 mb-4"><p>Toque 1x: <span className="bg-emerald-500 text-white px-2 py-0.5 rounded">Colada</span></p><p>Toque 2x: <span className="bg-purple-600 text-white px-2 py-0.5 rounded">Repetida</span></p><p>Toque 3x: <span className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded">Faltante</span></p></div>
            <button onClick={() => setShowTutorial(false)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Entendi!</button>
          </div>
        </div>
      )}

      <main className="w-full px-3 pb-4 space-y-4 pt-4">
        {deferredPrompt && <button onClick={handleInstallClick} className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-bold text-xs"><Download size={16}/> Instalar App</button>}
        
        {!isPro && (
          <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
             {activeFamilyId !== user.uid ? <div className="text-center font-bold text-xs p-2 bg-emerald-50 text-emerald-800 rounded-lg">Você faz parte de uma família!</div> : (
               <div className="flex gap-2"><input type="text" placeholder="Código..." onChange={(e) => setJoinCode(e.target.value)} className="flex-1 bg-slate-50 rounded-lg px-3 py-2 text-xs border"/><button onClick={() => { if (joinCode.trim()) { setActiveFamilyId(joinCode.trim()); localStorage.setItem('@AlbumCopa_FamilyId', joinCode.trim()); } }} className="bg-emerald-600 text-white px-4 rounded-lg font-bold text-xs">Entrar</button></div>
             )}
             <div className="grid grid-cols-2 gap-2">
                <a href="https://youtube.com/shorts/R0sVz5BjRFU?feature=share" target="_blank" rel="noreferrer" className="text-center bg-red-600 text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center"><PlayCircle size={14} className="mr-1"/> Vídeo</a>
                <button onClick={handleBuyPro} className="bg-indigo-600 text-white py-2 rounded-lg font-bold text-xs">Tornar-se Pro</button>
             </div>
          </div>
        )}

        <div className="text-center">
            <Trophy size={40} className="mx-auto text-yellow-500 mb-2 cursor-pointer" onClick={() => { setTrophyClicks(prev => prev + 1); if(trophyClicks >= 2) setShowProCode(true); }} />
            {showProCode && <div className="flex gap-2"><input className="flex-1 bg-slate-200 p-2 rounded" onChange={(e) => setProInput(e.target.value)}/><button onClick={() => { if(proInput === 'IVSON2026') { setIsPro(true); setShowProCode(false); } }} className="bg-emerald-600 text-white px-4 rounded">OK</button></div>}
        </div>

        {SECTIONS.map((sec) => (
          <div key={sec.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
             <h2 className="font-black text-slate-700 mb-3 text-sm">{sec.flag} {sec.title}</h2>
             <div className="grid grid-cols-5 gap-2">
               {(sec.count ? Array.from({length: sec.count}, (_, i) => i + 1) : sec.items).map(item => {
                 const key = `${sec.prefix}-${item}`;
                 const status = stickers[key] || 0;
                 return <button key={key} onClick={() => toggleSticker(key)} className={`aspect-square w-full rounded-lg font-bold text-xs ${status === 0 ? 'bg-slate-100 text-slate-400' : status === 1 ? 'bg-emerald-500 text-white' : 'bg-purple-600 text-white'}`}>{item}</button>;
               })}
             </div>
          </div>
        ))}
      </main>
    </div>
  );
}
