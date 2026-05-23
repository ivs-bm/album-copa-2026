import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Trophy, LogOut, Info, Share2, MessageCircle, ShoppingCart, KeyRound, X, Smartphone } from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, updateDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = { apiKey: "AIzaSyDm80NbEwqVyF5WratOIi-ENe35ykzJ-_Q", authDomain: "albumcopa2026-59c00.firebaseapp.com", projectId: "albumcopa2026-59c00", storageBucket: "albumcopa2026-59c00.firebasestorage.app", messagingSenderId: "839897438384", appId: "1:839897438384:web:b70a235d7f777c34080375" };
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

const SECTIONS = [
  { id: 'FWC_INI', title: 'Ínicio', prefix: 'FWC', flag: '🏠', items: ['00', '1', '2', '3', '4', '5', '6', '7', '8'] },
  { id: 'BRA', title: 'Brasil', prefix: 'BRA', flag: '🇧🇷', count: 20 },
  { id: 'MEX', title: 'México', prefix: 'MEX', flag: '🇲🇽', count: 20 },
  { id: 'GER', title: 'Alemanha', prefix: 'GER', flag: '🇩🇪', count: 20 },
  { id: 'ARG', title: 'Argentina', prefix: 'ARG', flag: '🇦🇷', count: 20 },
  { id: 'POR', title: 'Portugal', prefix: 'POR', flag: '🇵🇹', count: 20 },
  { id: 'FRA', title: 'França', prefix: 'FRA', flag: '🇫🇷', count: 20 },
  { id: 'ENG', title: 'Inglaterra', prefix: 'ENG', flag: '🇬🇧', count: 20 },
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

  if (!user) return (
    <div className="min-h-screen bg-emerald-900 flex items-center justify-center p-6 text-center">
      <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} className="bg-white text-emerald-900 px-8 py-3 rounded-full font-bold">Entrar com Google</button>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-slate-50 shadow-2xl">
      {toast && <div className="fixed top-4 z-50 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs animate-bounce">{toast}</div>}
      
      {/* HEADER COMPACTO E FUNCIONAL */}
      <header className="bg-gradient-to-br from-emerald-800 to-teal-700 text-white p-4 sticky top-0 z-40">
        <div className="flex justify-between items-center mb-2">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">{user.email[0].toUpperCase()}</div>
             <h1 className="font-black text-sm">Copa 2026</h1>
           </div>
           <div className="flex gap-2">
              <button onClick={() => copyToClipboard(activeFamilyId, "ID copiado!")} className="p-1.5 bg-white/10 rounded-lg"><KeyRound size={18} /></button>
              <button onClick={() => setShowTutorial(true)} className="p-1.5 bg-white/10 rounded-lg"><Info size={18} /></button>
              <button onClick={() => signOut(auth)} className="p-1.5 bg-white/10 rounded-lg"><LogOut size={18} /></button>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex-1 h-1.5 bg-black/20 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 transition-all" style={{ width: `${stats.percentage}%` }}></div></div>
           <span className="text-[10px] font-bold">{stats.percentage}% Concluído</span>
        </div>
      </header>

      {/* TUTORIAL MODAL */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center" onClick={() => setShowTutorial(false)}>
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h2 className="font-black mb-4">Como usar:</h2>
            <p className="text-xs text-slate-600 mb-2">Toque 1x: Colei | Toque 2x: Repetida | Toque 3x: Faltante</p>
            <button onClick={() => setShowTutorial(false)} className="w-full bg-slate-900 text-white py-2 rounded-lg mt-4 text-xs font-bold">Fechar</button>
          </div>
        </div>
      )}

      {/* CARROSSEL DE BANDEIRAS */}
      <div className="bg-white p-3 border-b border-slate-100 flex gap-4 overflow-x-auto hide-scrollbar sticky top-[72px] z-30">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => scrollToSection(s.id)} className="flex flex-col items-center min-w-[40px]">
            <span className="text-xl">{s.flag}</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase">{s.prefix}</span>
          </button>
        ))}
      </div>

      <main className="p-4 space-y-4">
        {isPro && (
          <button onClick={() => {
            let missingText = SECTIONS.map(sec => `${sec.flag} *${sec.prefix}*: ${getSectionKeys(sec).filter(k => (stickers[k] || 0) === 0).map(k => k.split('-')[1]).join(', ')}`).filter(s => !s.endsWith(': ')).join('\n');
            copyToClipboard(`🏆 *Minhas Faltantes:*\n${missingText}`, "Lista copiada!");
          }} className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold shadow-md shadow-green-200">
            <MessageCircle size={20}/> Compartilhar Lista
          </button>
        )}

        {SECTIONS.map(sec => (
          <div key={sec.id} ref={el => sectionsRef.current[sec.id] = el} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
             <h2 className="font-black text-slate-700 mb-3 flex items-center gap-2 text-sm">{sec.flag} {sec.title}</h2>
             <div className="grid grid-cols-5 gap-2">
               {(sec.count ? Array.from({length: sec.count}, (_, i) => i + 1) : sec.items).map(item => {
                 const key = `${sec.prefix}-${item}`;
                 const status = stickers[key] || 0;
                 return (
                   <button key={key} onClick={() => toggleSticker(key)} className={`h-10 flex items-center justify-center font-bold text-xs rounded-lg transition-all ${status === 0 ? 'bg-slate-100 text-slate-400' : status === 1 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-purple-600 text-white shadow-lg shadow-purple-200'}`}>
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
