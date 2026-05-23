import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Trophy, LogOut, Info, Share2, KeyRound, MessageCircle } from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, updateDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = { apiKey: "AIzaSyDm80NbEwqVyF5WratOIi-ENe35ykzJ-_Q", authDomain: "albumcopa2026-59c00.firebaseapp.com", projectId: "albumcopa2026-59c00", storageBucket: "albumcopa2026-59c00.firebasestorage.app", messagingSenderId: "839897438384", appId: "1:839897438384:web:b70a235d7f777c34080375" };
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

const SECTIONS = [
  { id: 'FWC_INI', group: 'Especiais', title: 'Página Inicial', prefix: 'FWC', flag: '🏠', items: ['00', '1', '2', '3', '4', '5', '6', '7', '8'] },
  { id: 'FWC_HST', group: 'Especiais', title: 'História das Copas', prefix: 'FWC', flag: '🏆', items: ['9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'] },
  { id: 'CC', group: 'Patrocinadores', title: 'Coca-Cola', prefix: 'CC', flag: '🥤', count: 14 },
  { id: 'MEX', group: 'Grupo A', title: 'México', prefix: 'MEX', flag: '🇲🇽', count: 20 },
  { id: 'RSA', group: 'Grupo A', title: 'África do Sul', prefix: 'RSA', flag: '🇿🇦', count: 20 },
  { id: 'KOR', group: 'Grupo A', title: 'Coreia do Sul', prefix: 'KOR', flag: '🇰🇷', count: 20 },
  { id: 'CZE', group: 'Grupo A', title: 'República Tcheca', prefix: 'CZE', flag: '🇨🇿', count: 20 },
  { id: 'CAN', group: 'Grupo B', title: 'Canadá', prefix: 'CAN', flag: '🇨🇦', count: 20 },
  { id: 'BIH', group: 'Grupo B', title: 'Bósnia', prefix: 'BIH', flag: '🇧🇦', count: 20 },
  { id: 'QAT', group: 'Grupo B', title: 'Catar', prefix: 'QAT', flag: '🇶🇦', count: 20 },
  { id: 'SUI', group: 'Grupo B', title: 'Suíça', prefix: 'SUI', flag: '🇨🇭', count: 20 },
  { id: 'BRA', group: 'Grupo C', title: 'Brasil', prefix: 'BRA', flag: '🇧🇷', count: 20 },
  { id: 'MAR', group: 'Grupo C', title: 'Marrocos', prefix: 'MAR', flag: '🇲🇦', count: 20 },
  { id: 'HAI', group: 'Grupo C', title: 'Haiti', prefix: 'HAI', flag: '🇭🇹', count: 20 },
  { id: 'SCO', group: 'Grupo C', title: 'Escócia', prefix: 'SCO', flag: '🇬🇧', count: 20 },
  { id: 'USA', group: 'Grupo D', title: 'Estados Unidos', prefix: 'USA', flag: '🇺🇸', count: 20 },
  { id: 'PAR', group: 'Grupo D', title: 'Paraguai', prefix: 'PAR', flag: '🇵🇾', count: 20 },
  { id: 'AUS', group: 'Grupo D', title: 'Austrália', prefix: 'AUS', flag: '🇦🇺', count: 20 },
  { id: 'TUR', group: 'Grupo D', title: 'Turquia', prefix: 'TUR', flag: '🇹🇷', count: 20 },
  { id: 'GER', group: 'Grupo E', title: 'Alemanha', prefix: 'GER', flag: '🇩🇪', count: 20 },
  { id: 'CUW', group: 'Grupo E', title: 'Curaçao', prefix: 'CUW', flag: '🇨🇼', count: 20 },
  { id: 'CIV', group: 'Grupo E', title: 'Costa do Marfim', prefix: 'CIV', flag: '🇨🇮', count: 20 },
  { id: 'ECU', group: 'Grupo E', title: 'Equador', prefix: 'ECU', flag: '🇪🇨', count: 20 },
  { id: 'NED', group: 'Grupo F', title: 'Holanda', prefix: 'NED', flag: '🇳🇱', count: 20 },
  { id: 'JPN', group: 'Grupo F', title: 'Japão', prefix: 'JPN', flag: '🇯🇵', count: 20 },
  { id: 'SWE', group: 'Grupo F', title: 'Suécia', prefix: 'SWE', flag: '🇸🇪', count: 20 },
  { id: 'TUN', group: 'Grupo F', title: 'Tunísia', prefix: 'TUN', flag: '🇹🇳', count: 20 },
  { id: 'BEL', group: 'Grupo G', title: 'Bélgica', prefix: 'BEL', flag: '🇧🇪', count: 20 },
  { id: 'EGY', group: 'Grupo G', title: 'Egito', prefix: 'EGY', flag: '🇪🇬', count: 20 },
  { id: 'IRN', group: 'Grupo G', title: 'Irã', prefix: 'IRN', flag: '🇮🇷', count: 20 },
  { id: 'NZL', group: 'Grupo G', title: 'Nova Zelândia', prefix: 'NZL', flag: '🇳🇿', count: 20 },
  { id: 'ESP', group: 'Grupo H', title: 'Espanha', prefix: 'ESP', flag: '🇪🇸', count: 20 },
  { id: 'CPV', group: 'Grupo H', title: 'Cabo Verde', prefix: 'CPV', flag: '🇨🇻', count: 20 },
  { id: 'KSA', group: 'Grupo H', title: 'Arábia Saudita', prefix: 'KSA', flag: '🇸🇦', count: 20 },
  { id: 'URU', group: 'Grupo H', title: 'Uruguai', prefix: 'URU', flag: '🇺🇾', count: 20 },
  { id: 'FRA', group: 'Grupo I', title: 'França', prefix: 'FRA', flag: '🇫🇷', count: 20 },
  { id: 'SEN', group: 'Grupo I', title: 'Senegal', prefix: 'SEN', flag: '🇸🇳', count: 20 },
  { id: 'IRQ', group: 'Grupo I', title: 'Iraque', prefix: 'IRQ', flag: '🇮🇶', count: 20 },
  { id: 'NOR', group: 'Grupo I', title: 'Noruega', prefix: 'NOR', flag: '🇳🇴', count: 20 },
  { id: 'ARG', group: 'Grupo J', title: 'Argentina', prefix: 'ARG', flag: '🇦🇷', count: 20 },
  { id: 'ALG', group: 'Grupo J', title: 'Argélia', prefix: 'ALG', flag: '🇩🇿', count: 20 },
  { id: 'AUT', group: 'Grupo J', title: 'Áustria', prefix: 'AUT', flag: '🇦🇹', count: 20 },
  { id: 'JOR', group: 'Grupo J', title: 'Jordânia', prefix: 'JOR', flag: '🇯🇴', count: 20 },
  { id: 'POR', group: 'Grupo K', title: 'Portugal', prefix: 'POR', flag: '🇵🇹', count: 20 },
  { id: 'COD', group: 'Grupo K', title: 'Congo', prefix: 'COD', flag: '🇨🇩', count: 20 },
  { id: 'UZB', group: 'Grupo K', title: 'Uzbequistão', prefix: 'UZB', flag: '🇺🇿', count: 20 },
  { id: 'COL', group: 'Grupo K', title: 'Colômbia', prefix: 'COL', flag: '🇨🇴', count: 20 },
  { id: 'ENG', group: 'Grupo L', title: 'Inglaterra', prefix: 'ENG', flag: '🇬🇧', count: 20 },
  { id: 'CRO', group: 'Grupo L', title: 'Croácia', prefix: 'CRO', flag: '🇭🇷', count: 20 },
  { id: 'GHA', group: 'Grupo L', title: 'Gana', prefix: 'GHA', flag: '🇬🇭', count: 20 },
  { id: 'PAN', group: 'Grupo L', title: 'Panamá', prefix: 'PAN', flag: '🇵🇦', count: 20 },
];

const getSectionKeys = (sec) => sec.count ? Array.from({ length: sec.count }, (_, i) => `${sec.prefix}-${i + 1}`) : sec.items.map(item => `${sec.prefix}-${item}`);
const TOTAL_STICKERS = SECTIONS.reduce((acc, sec) => acc + (sec.count || sec.items.length), 0);

export default function App() {
  const [user, setUser] = useState(null);
  const [activeFamilyId, setActiveFamilyId] = useState('');
  const [stickers, setStickers] = useState({});
  const [isPro, setIsPro] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [toast, setToast] = useState('');
  const sectionsRef = useRef({});

  useEffect(() => {
    onAuthStateChanged(auth, (u) => { setUser(u); if (u) setActiveFamilyId(u.uid); });
  }, []);

  useEffect(() => {
    if (!activeFamilyId) return;
    const unsub = onSnapshot(doc(db, 'family_albums', activeFamilyId), (d) => {
      if (d.exists()) { setStickers(d.data().stickers || {}); setIsPro(!!d.data().isPro); }
    });
    return unsub;
  }, [activeFamilyId]);

  const toggleSticker = async (key) => {
    const newStatus = ((stickers[key] || 0) + 1) % 3;
    setStickers({...stickers, [key]: newStatus});
    await updateDoc(doc(db, 'family_albums', activeFamilyId), { [`stickers.${key}`]: newStatus }).catch(() => {});
  };

  const copyToClipboard = (text, msg) => { navigator.clipboard.writeText(text).then(() => { setToast(msg); setTimeout(() => setToast(''), 2000); }); };
  const scrollToSection = (id) => sectionsRef.current[id]?.scrollIntoView({ behavior: 'smooth' });

  const stats = useMemo(() => {
    let collected = 0; Object.values(stickers).forEach(s => { if (s > 0) collected++; });
    return { percentage: TOTAL_STICKERS > 0 ? ((collected / TOTAL_STICKERS) * 100).toFixed(0) : 0 };
  }, [stickers]);

  const handleShareList = () => {
    let missingText = SECTIONS.map(sec => {
        const missing = getSectionKeys(sec).filter(k => (stickers[k] || 0) === 0).map(k => k.split('-')[1]);
        return missing.length > 0 ? `${sec.flag} *${sec.prefix}*: ${missing.join(', ')}` : null;
    }).filter(s => s !== null).join('\n');
    copyToClipboard(`🏆 *Minhas Faltantes:*\n${missingText}`, "Lista copiada!");
  };

  if (!user) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
      <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} className="bg-white text-black px-8 py-3 rounded-full font-bold">Entrar com Google</button>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-slate-50 shadow-2xl">
      {toast && <div className="fixed top-20 z-50 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs animate-bounce shadow-xl">{toast}</div>}
      
      <header className="bg-gradient-to-br from-emerald-800 to-teal-700 text-white p-4 sticky top-0 z-40">
        <div className="flex justify-between items-center mb-2">
           <div className="flex items-center gap-2">
             <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px]">{user.email[0].toUpperCase()}</div>
             <h1 className="font-black text-sm">Copa 2026</h1>
           </div>
           <div className="flex gap-1.5">
              {isPro && <button onClick={handleShareList} className="p-1.5 bg-white/10 rounded-lg"><Share2 size={18} /></button>}
              <button onClick={() => copyToClipboard(activeFamilyId, "ID copiado!")} className="p-1.5 bg-white/10 rounded-lg"><KeyRound size={18} /></button>
              <button onClick={() => setShowTutorial(true)} className="p-1.5 bg-white/10 rounded-lg"><Info size={18} /></button>
              <button onClick={() => signOut(auth)} className="p-1.5 bg-white/10 rounded-lg"><LogOut size={18} /></button>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex-1 h-1.5 bg-black/20 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 transition-all" style={{ width: `${stats.percentage}%` }}></div></div>
           <span className="text-[10px] font-bold">{stats.percentage}%</span>
        </div>
      </header>

      {showTutorial && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center" onClick={() => setShowTutorial(false)}>
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h2 className="font-black mb-4">Como usar:</h2>
            <p className="text-xs text-slate-600 mb-2">Toque 1x: Colei | Toque 2x: Repetida | Toque 3x: Faltante</p>
            <button onClick={() => setShowTutorial(false)} className="w-full bg-slate-900 text-white py-2 rounded-lg mt-4 text-xs font-bold">Fechar</button>
          </div>
        </div>
      )}

      <div className="bg-white p-3 border-b border-slate-100 flex gap-4 overflow-x-auto hide-scrollbar sticky top-[72px] z-30">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => scrollToSection(s.id)} className="flex flex-col items-center min-w-[40px]">
            <span className="text-xl">{s.flag}</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase">{s.prefix}</span>
          </button>
        ))}
      </div>

      <main className="p-4 space-y-4">
        {SECTIONS.map(sec => (
          <div key={sec.id} ref={el => sectionsRef.current[sec.id] = el} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
             <h2 className="font-black text-slate-700 mb-3 flex items-center gap-2 text-sm">{sec.flag} {sec.title}</h2>
             <div className="grid grid-cols-5 gap-2">
               {(sec.count ? Array.from({length: sec.count}, (_, i) => i + 1) : sec.items).map(item => {
                 const key = `${sec.prefix}-${item}`;
                 const status = stickers[key] || 0;
                 return (
                   <button key={key} onClick={() => toggleSticker(key)} className={`h-10 flex items-center justify-center font-bold text-xs rounded-lg transition-all ${status === 0 ? 'bg-slate-100 text-slate-400' : status === 1 ? 'bg-emerald-500 text-white shadow-md' : 'bg-purple-600 text-white shadow-md'}`}>
                     {item}
                   </button>
                 );
               })}
             </div>
          </div>
        ))}
      </main>
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
