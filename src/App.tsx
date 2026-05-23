import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Trophy, Search, Layers, CheckCircle2, CircleDashed, BarChart3, 
  Globe2, Check, Cloud, LogIn, LogOut, Info, X, Share2, MessageCircle, KeyRound
} from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDm80NbEwqVyF5WratOIi-ENe35ykzJ-_Q",
  authDomain: "albumcopa2026-59c00.firebaseapp.com",
  projectId: "albumcopa2026-59c00",
  storageBucket: "albumcopa2026-59c00.firebasestorage.app",
  messagingSenderId: "839897438384",
  appId: "1:839897438384:web:b70a235d7f777c34080375"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// ... (SECTIONS array mantido igual para garantir a integridade dos dados)
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

const generateKey = (prefix, num) => `${prefix}-${num}`;
const getSectionKeys = (sec) => sec.count ? Array.from({ length: sec.count }, (_, i) => generateKey(sec.prefix, i + 1)) : sec.items.map(item => generateKey(sec.prefix, item));
const TOTAL_STICKERS = SECTIONS.reduce((acc, sec) => acc + (sec.count || sec.items.length), 0);

export default function App() {
  const [user, setUser] = useState(null);
  const [activeFamilyId, setActiveFamilyId] = useState('');
  const [stickers, setStickers] = useState({});
  const [isPro, setIsPro] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const sectionsRef = useRef({});

  // Auth & Data
  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) setActiveFamilyId(u.uid);
    });
  }, []);

  useEffect(() => {
    if (!activeFamilyId) return;
    const unsub = onSnapshot(doc(db, 'family_albums', activeFamilyId), (d) => {
      if (d.exists()) {
        setStickers(d.data().stickers || {});
        setIsPro(!!d.data().isPro);
      }
    });
    return unsub;
  }, [activeFamilyId]);

  const toggleSticker = async (key) => {
    const newStatus = ((stickers[key] || 0) + 1) % 3;
    setStickers({...stickers, [key]: newStatus});
    await updateDoc(doc(db, 'family_albums', activeFamilyId), { [`stickers.${key}`]: newStatus }).catch(() => {});
  };

  const handleShareList = () => {
    let missingTextArray = [];
    SECTIONS.forEach(sec => {
        const keys = getSectionKeys(sec);
        const missingNums = keys.filter(k => (stickers[k] || 0) === 0).map(k => k.split('-')[1]);
        if (missingNums.length > 0) missingTextArray.push(`${sec.flag} *${sec.prefix}*: ${missingNums.join(', ')}`);
    });
    const text = `🏆 *Minhas Faltantes:*\n${missingTextArray.join('\n')}`;
    navigator.clipboard.writeText(text).then(() => alert("Lista copiada!"));
  };

  const stats = useMemo(() => {
    let collected = 0;
    Object.values(stickers).forEach(s => { if (s > 0) collected++; });
    return { percentage: TOTAL_STICKERS > 0 ? ((collected / TOTAL_STICKERS) * 100).toFixed(0) : 0 };
  }, [stickers]);

  if (!user) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-white text-3xl font-black mb-6">Álbum Copa 2026</h1>
        <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} className="bg-white text-black px-8 py-3 rounded-full font-bold">Entrar com Google</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* HEADER OTIMIZADO */}
      <header className="bg-gradient-to-br from-emerald-800 to-teal-700 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="flex justify-between items-center mb-3">
           <h1 className="font-black text-lg">Copa 2026 <span className="text-[10px] font-normal opacity-60">ID: {activeFamilyId.slice(0,5)}</span></h1>
           <div className="flex gap-2">
              <button onClick={() => setShowTutorial(true)} className="p-2 bg-white/10 rounded-lg"><Info size={18} /></button>
              <button onClick={() => signOut(auth)} className="p-2 bg-white/10 rounded-lg"><LogOut size={18} /></button>
           </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
             <div className="h-full bg-yellow-400 transition-all" style={{ width: `${stats.percentage}%` }}></div>
          </div>
          <span className="text-xs font-bold">{stats.percentage}%</span>
        </div>
      </header>

      {/* AÇÕES E FILTROS */}
      <div className="p-4 flex gap-2">
        {isPro && (
          <button onClick={handleShareList} className="bg-[#25D366] text-white p-3 rounded-xl shadow-md active:scale-95 transition-transform">
            <Share2 size={24} />
          </button>
        )}
      </div>

      {/* GRID DE FIGURINHAS (COMPACTO) */}
      <main className="p-4 space-y-6">
        {SECTIONS.map(sec => (
          <div key={sec.id} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex items-center gap-2 mb-3 border-b border-slate-50 pb-2">
               <span className="text-xl">{sec.flag}</span>
               <h2 className="font-bold text-slate-700 text-sm">{sec.title}</h2>
             </div>
             <div className="grid grid-cols-6 gap-1">
               {getSectionKeys(sec).map(key => {
                 const status = stickers[key] || 0;
                 return (
                   <button 
                     key={key} 
                     onClick={() => toggleSticker(key)}
                     className={`aspect-square flex items-center justify-center text-[10px] font-bold rounded-lg transition-colors
                     ${status === 0 ? 'bg-slate-100 text-slate-400' : 
                       status === 1 ? 'bg-emerald-500 text-white' : 'bg-purple-600 text-white'}`}
                   >
                     {key.split('-')[1]}
                   </button>
                 );
               })}
             </div>
          </div>
        ))}
      </main>
    </div>
  );
}
