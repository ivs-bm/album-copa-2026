import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LogOut, Info, Share2, KeyRound, MessageCircle, PlayCircle, Star, Copy } from 'lucide-react';
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
  const [activeFamilyId, setActiveFamilyId] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [stickers, setStickers] = useState({});
  const [isPro, setIsPro] = useState(false);
  const [pixCode, setPixCode] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [toast, setToast] = useState('');
  const sectionsRef = useRef({});

  useEffect(() => { onAuthStateChanged(auth, (u) => { setUser(u); if (u) setActiveFamilyId(u.uid); }); }, []);
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
  const scrollToSection = (id) => sectionsRef.current[id]?.scrollIntoView({ behavior: 'smooth' });

  const stats = useMemo(() => {
    let collected = 0; Object.values(stickers).forEach(s => { if (s > 0) collected++; });
    return { percentage: TOTAL_STICKERS > 0 ? ((collected / TOTAL_STICKERS) * 100).toFixed(0) : 0 };
  }, [stickers]);

  if (!user) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
      <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} className="bg-white text-black px-8 py-3 rounded-full font-bold">Entrar com Google</button>
    </div>
  );

  return (
    <div className="w-full max-w-[100vw] min-h-screen bg-slate-50 shadow-2xl relative overflow-x-hidden">
      <style>{`
        * { box-sizing: border-box !important; }
        html, body { width: 100%; margin: 0; padding: 0; overflow-x: hidden !important; overscroll-behavior-x: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
      {toast && <div className="fixed top-20 z-50 left-1/2 -translate-x-1/2 w-max max-w-[90%] bg-slate-900 text-white px-4 py-2 rounded-full text-xs shadow-xl text-center">{toast}</div>}
      
      <header className="w-full bg-gradient-to-br from-emerald-800 to-teal-700 text-white px-3 py-3 sticky top-0 z-40 shadow-sm">
        <div className="flex justify-between items-center mb-2">
           <div className="flex items-center gap-2">
             <img src={user.photoURL} className="w-8 h-8 rounded-full border-2 border-white/20" alt="User" />
             <h1 className="font-black text-sm truncate max-w-[120px]">Copa 2026</h1>
           </div>
           <div className="flex gap-1.5 shrink-0">
              {isPro && <button onClick={() => {
                let m = SECTIONS.map(sec => {
                    const l = getSectionKeys(sec).filter(k => (stickers[k] || 0) === 0).map(k => k.split('-')[1]);
                    return l.length > 0 ? `${sec.flag} *${sec.prefix}*: ${l.join(', ')}` : null;
                }).filter(s => s !== null).join('\n');
                copyToClipboard(`🏆 *Faltam:*\n${m}`, "Lista copiada!");
              }} className="p-1.5 bg-white/20 rounded-lg"><Share2 size={18} /></button>}
              
              {isPro && <button onClick={() => copyToClipboard(activeFamilyId, "ID copiado!")} className="p-1.5 bg-white/10 rounded-lg"><KeyRound size={18} /></button>}
              
              <button onClick={() => setShowTutorial(true)} className="p-1.5 bg-white/10 rounded-lg"><Info size={18} /></button>
              <button onClick={() => signOut(auth)} className="p-1.5 bg-white/10 rounded-lg"><LogOut size={18} /></button>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex-1 h-1.5 bg-black/20 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 transition-all" style={{ width: `${stats.percentage}%` }}></div></div>
           <span className="text-[10px] font-bold w-6 text-right">{stats.percentage}%</span>
        </div>
      </header>

      {showTutorial && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center" onClick={() => setShowTutorial(false)}>
          <div className="bg-white p-5 rounded-2xl w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="font-black text-slate-800 mb-4 text-lg border-b pb-2">Guia Rápido</h2>
            <div className="space-y-3 text-xs text-slate-600 mb-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="font-bold text-slate-800 mb-2 flex items-center gap-1">🏷️ Status das Figurinhas:</p>
                <div className="space-y-1.5 ml-2">
                  <p className="flex items-center gap-2">Toque 1x: <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">Colada</span></p>
                  <p className="flex items-center gap-2">Toque 2x: <span className="bg-purple-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">Repetida</span></p>
                  <p className="flex items-center gap-2">Toque 3x: <span className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold">Faltante</span></p>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="font-bold text-slate-800 mb-1 flex items-center gap-1">👆 Navegação:</p>
                <p className="ml-2">Deslize a barra de bandeiras no topo e toque em uma seleção para pular direto para ela.</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="font-bold text-slate-800 mb-1 flex items-center gap-1">✨ Usuários Pro:</p>
                <p className="ml-2">Use o ícone <KeyRound size={12} className="inline"/> para copiar seu ID e o ícone <Share2 size={12} className="inline"/> para gerar a lista de figurinhas faltantes.</p>
              </div>
            </div>
            <button onClick={() => setShowTutorial(false)} className="w-full bg-slate-900 text-white py-3 rounded-xl mt-2 text-sm font-bold shadow-md">Entendi, fechar!</button>
          </div>
        </div>
      )}

      <div className="sticky top-[68px] z-30 bg-slate-50 pt-3 pb-2 px-3 w-full">
        <div className="bg-white px-3 py-2 rounded-2xl shadow-sm border border-slate-100 flex gap-4 overflow-x-auto hide-scrollbar">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => scrollToSection(s.id)} className="flex flex-col items-center min-w-[44px]">
              <span className="text-xl">{s.flag}</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{s.prefix}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="w-full px-3 pb-4 space-y-4">
        {!isPro && (
          <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-sm space-y-3 mt-2">
             {activeFamilyId !== user.uid ? (
                <div className="text-center font-bold text-xs p-2 bg-emerald-50 text-emerald-800 rounded-lg">Você faz parte de uma família!</div>
             ) : (
               <div className="flex gap-2">
                 <input type="text" placeholder="Código de membro..." onChange={(e) => setJoinCode(e.target.value)} className="flex-1 w-full bg-slate-50 rounded-lg px-3 py-2 text-xs text-slate-900 border outline-none"/>
                 <button onClick={() => setActiveFamilyId(joinCode)} className="bg-emerald-600 text-white px-4 rounded-lg font-bold text-xs shrink-0">Entrar</button>
               </div>
             )}
             
             {pixCode ? (
                <div className="space-y-2">
                   <input readOnly value={pixCode} className="w-full bg-slate-50 text-[10px] p-2 rounded-lg border outline-none"/>
                   <button onClick={() => copyToClipboard(pixCode, "Pix copiado!")} className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-lg font-bold text-xs"><Copy size={14}/> Copiar Pix</button>
                </div>
             ) : (
               <div className="grid grid-cols-2 gap-2">
                  <a href="https://youtube.com/shorts/R0sVz5BjRFU?feature=share" target="_blank" className="text-center bg-red-600 text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center">Assistir Vídeo</a>
                  {activeFamilyId !== user.uid ? (
                    <button className="bg-emerald-600 text-white py-2 rounded-lg font-bold text-xs opacity-50 cursor-not-allowed">Pro Ativado</button>
                  ) : (
                    <button onClick={handleBuyPro} className="bg-indigo-600 text-white py-2 rounded-lg font-bold text-xs">Tornar-se Pro</button>
                  )}
               </div>
             )}
          </div>
        )}

        <div className={isPro ? "mt-2" : ""}>
          {SECTIONS.map((sec, index) => (
            <div key={sec.id} ref={el => sectionsRef.current[sec.id] = el} className={`bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-100 ${index > 0 ? 'mt-4' : ''}`}>
               <h2 className="font-black text-slate-700 mb-3 flex items-center gap-2 text-sm">{sec.flag} {sec.title}</h2>
               <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                 {(sec.count ? Array.from({length: sec.count}, (_, i) => i + 1) : sec.items).map(item => {
                   const key = `${sec.prefix}-${item}`;
                   const status = stickers[key] || 0;
                   return (
                     <button key={key} onClick={() => toggleSticker(key)} className={`aspect-square w-full flex items-center justify-center font-bold text-xs rounded-lg transition-all ${status === 0 ? 'bg-slate-100 text-slate-400' : status === 1 ? 'bg-emerald-500 text-white shadow-md' : 'bg-purple-600 text-white shadow-md'}`}>
                       {item}
                     </button>
                   );
                 })}
               </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
