import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Trophy, Search, Layers, CheckCircle2, CircleDashed, BarChart3, 
  Globe2, Check, Cloud, LogIn, Users, LogOut, KeyRound, Lock, Copy, MapPin, Info, X, Share2, Smartphone, ShoppingCart, PlayCircle
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
const getSectionKeys = (sec) => sec.count 
  ? Array.from({ length: sec.count }, (_, i) => generateKey(sec.prefix, i + 1))
  : sec.items.map(item => generateKey(sec.prefix, item));

const TOTAL_STICKERS = SECTIONS.reduce((acc, sec) => acc + (sec.count || sec.items.length), 0);

const getInitialState = () => {
  const state = {};
  SECTIONS.forEach(sec => getSectionKeys(sec).forEach(k => state[k] = 0));
  return state;
};

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeFamilyId, setActiveFamilyId] = useState('');
  const [joinCode, setJoinCode] = useState('');
  
  const [stickers, setStickers] = useState(getInitialState());
  const [filter, setFilter] = useState('all'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [isPro, setIsPro] = useState(false);
  const [pixCode, setPixCode] = useState('');
  const [loadingPix, setLoadingPix] = useState(false);
  const [payError, setPayError] = useState('');
  
  const [showTutorial, setShowTutorial] = useState(false);
  const sectionsRef = useRef({});
  const [trophyClicks, setTrophyClicks] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setActiveFamilyId(currentUser.uid);
      } else {
        setActiveFamilyId('');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !activeFamilyId) return;
    setIsSyncing(true);
    
    const albumRef = doc(db, 'family_albums', activeFamilyId);
    
    const unsubscribe = onSnapshot(albumRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStickers(prev => ({ ...prev, ...(data.stickers || {}) }));
        setIsPro(!!data.isPro); 
      } else {
        if (activeFamilyId === user.uid) {
          setDoc(albumRef, { 
            adminEmail: user.email,
            createdAt: new Date(),
            isPro: false,
            stickers: getInitialState() 
          });
        }
      }
      setIsSyncing(false);
    }, (error) => {
      console.error(error);
    });

    return () => unsubscribe();
  }, [user, activeFamilyId]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider).catch(e => console.error(e));
  };

  const handleJoinFamily = (e) => {
    e.preventDefault();
    if (joinCode.trim().length > 5) {
      setActiveFamilyId(joinCode.trim());
      setJoinCode('');
      showToast("Conectado ao cofre da família!");
    }
  };

  const handleBuyPro = async () => {
    setLoadingPix(true);
    setPayError('');
    try {
      const res = await fetch('/api/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, email: user.email })
      });
      const data = await res.json();
      
      if (data.qr_code) {
        setPixCode(data.qr_code);
        showToast('Código Pix gerado!');
      } else {
        setPayError(data.error || 'Erro desconhecido no Mercado Pago.');
        showToast('Mercado Pago recusou o pedido.');
      }
    } catch(e) {
      showToast('Erro de conexão ao gerar o Pix.');
    }
    setLoadingPix(false);
  };

  const handleSecretUnlock = async () => {
    const code = window.prompt("🔑 Acesso VIP: Digite o código de cortesia");
    if (code && code.trim().toUpperCase() === 'VIP2026') {
      try {
        const albumRef = doc(db, 'family_albums', activeFamilyId);
        await updateDoc(albumRef, { isPro: true });
        showToast("🎉 Cortesia ativada! Bem-vindo ao PRO.");
      } catch (error) {
        showToast("Erro ao ativar cortesia.");
      }
    } else if (code) {
      showToast("Código de cortesia inválido.");
    }
    setTrophyClicks(0);
  };

  const handleTrophyClick = () => {
    const newClicks = trophyClicks + 1;
    setTrophyClicks(newClicks);
    if (newClicks >= 3) {
      handleSecretUnlock();
    } else {
      setTimeout(() => setTrophyClicks(0), 2000);
    }
  };

  const toggleSticker = async (key) => {
    if (!user || !activeFamilyId) return;
    const newStatus = (stickers[key] + 1) % 3;
    setStickers(prev => ({ ...prev, [key]: newStatus })); 

    const albumRef = doc(db, 'family_albums', activeFamilyId);
    try {
      await updateDoc(albumRef, { [`stickers.${key}`]: newStatus });
    } catch (error) {
      await setDoc(albumRef, { stickers: { [key]: newStatus } }, { merge: true });
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000); 
  };

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text)
      .then(() => showToast(message))
      .catch(() => showToast("Erro ao copiar."));
  };

  // NOVA LÓGICA DE GERAÇÃO PARA O WHATSAPP (AGRUPADO E LIMPO)
  const handleShareList = () => {
    let missingTextArray = [];
    let repeatedTextArray = [];

    SECTIONS.forEach(sec => {
      const keys = getSectionKeys(sec);
      const missingNums = [];
      const repeatedNums = [];

      keys.forEach(k => {
        // Pega apenas o número da figurinha (ex: do "BRA-10", pega só o "10")
        const num = k.split('-')[1];
        if (stickers[k] === 0) missingNums.push(num);
        if (stickers[k] === 2) repeatedNums.push(num);
      });

      // Se tiver figurinhas faltando nesta seleção, cria a linha formatada
      if (missingNums.length > 0) {
        missingTextArray.push(`${sec.flag} *${sec.prefix}*: ${missingNums.join(', ')}`);
      }
      
      // Se tiver repetidas nesta seleção, cria a linha formatada
      if (repeatedNums.length > 0) {
        repeatedTextArray.push(`${sec.flag} *${sec.prefix}*: ${repeatedNums.join(', ')}`);
      }
    });

    const missingText = missingTextArray.length > 0 ? missingTextArray.join('\n') : 'Nenhuma! 🎉';
    const repeatedText = repeatedTextArray.length > 0 ? repeatedTextArray.join('\n') : 'Nenhuma no momento.';

    const text = `🏆 *Minhas Figurinhas - Copa 2026*\n\n❌ *Faltam:*\n${missingText}\n\n🔁 *Tenho Repetidas:*\n${repeatedText}\n\n📱 _Gerado pelo Cofre Família PRO_`;

    copyToClipboard(text, "Lista copiada! Cole no seu WhatsApp.");
  };

  const scrollToSection = (sectionId) => {
    if (sectionId && sectionsRef.current[sectionId]) {
      const yOffset = -20; 
      const element = sectionsRef.current[sectionId];
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const stats = useMemo(() => {
    let missing = 0, collected = 0, repeated = 0;
    Object.values(stickers).forEach(s => {
      if (s === 0) missing++;
      if (s === 1) collected++;
      if (s === 2) { collected++; repeated++; }
    });
    return { missing, collected, repeated, percentage: ((collected / TOTAL_STICKERS) * 100).toFixed(1) };
  }, [stickers]);

  const groupedSections = useMemo(() => {
    const visibleSections = SECTIONS.map(sec => {
      const keys = getSectionKeys(sec);
      const visibleKeys = keys.filter(k => {
        const num = k.split('-')[1];
        const searchStr = `${sec.prefix} ${num} ${sec.title} ${sec.group}`.toLowerCase();
        if (searchQuery && !searchStr.includes(searchQuery.toLowerCase())) return false;
        if (filter === 'missing' && stickers[k] !== 0) return false;
        if (filter === 'collected' && stickers[k] === 0) return false;
        if (filter === 'repeated' && stickers[k] !== 2) return false;
        return true;
      });
      return { ...sec, visibleKeys };
    }).filter(sec => sec.visibleKeys.length > 0);

    const groups = {};
    visibleSections.forEach(sec => {
      if (!groups[sec.group]) groups[sec.group] = [];
      groups[sec.group].push(sec);
    });
    return groups;
  }, [stickers, filter, searchQuery]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div></div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
          <Globe2 size={64} className="text-emerald-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-slate-800 mb-2">Álbum Copa 2026</h1>
          <p className="text-slate-500 mb-8 font-medium">Controle suas figurinhas e sincronize em tempo real com toda a sua família.</p>
          <button onClick={handleLogin} className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold transition-all shadow-md active:scale-95">
            <LogIn size={20} /> Entrar com conta Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-10">
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-fade-in">
          <Check size={18} className="text-emerald-400"/>
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}

      {showTutorial && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowTutorial(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Info className="text-teal-500" /> Como Funciona?
              </h3>
              <button onClick={() => setShowTutorial(false)} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-black flex items-center justify-center shadow-md flex-shrink-0">1</div>
                <div>
                  <p className="font-bold text-slate-800">Toque 1 vez</p>
                  <p className="text-sm text-slate-500">A figurinha fica <span className="text-emerald-600 font-bold">Verde</span> (Colada no álbum).</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white font-black flex items-center justify-center shadow-md flex-shrink-0 relative">2 <span className="absolute -top-1 -right-1 bg-yellow-400 w-3 h-3 rounded-full"></span></div>
                <div>
                  <p className="font-bold text-slate-800">Toque 2 vezes</p>
                  <p className="text-sm text-slate-500">A figurinha fica <span className="text-purple-600 font-bold">Roxa</span> (Você tem repetidas para trocar).</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-400 font-black flex items-center justify-center flex-shrink-0 border-2 border-dashed border-slate-300">3</div>
                <div>
                  <p className="font-bold text-slate-800">Toque 3 vezes</p>
                  <p className="text-sm text-slate-500">Volta a ficar <span className="text-slate-400 font-bold">Cinza</span> (Faltante).</p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Smartphone size={18} className="text-teal-600"/> Instale como Aplicativo
              </h4>
              <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-sm">
                  <p className="font-bold text-slate-700 mb-1">🤖 No Android (Chrome):</p>
                  <p className="text-slate-500 leading-tight">Toque nos <span className="font-bold text-slate-700">3 pontinhos</span> no topo da tela e escolha <span className="font-bold text-slate-700">"Adicionar à tela inicial"</span>.</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-sm">
                  <p className="font-bold text-slate-700 mb-1">🍎 No iPhone (Safari):</p>
                  <p className="text-slate-500 leading-tight">Toque no ícone <span className="font-bold text-slate-700">Compartilhar</span> (quadrado com seta) e escolha <span className="font-bold text-slate-700">"Adicionar à Tela de Início"</span>.</p>
                </div>
              </div>
            </div>
            
            <button onClick={() => setShowTutorial(false)} className="w-full mt-6 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
              Entendi, vamos colecionar!
            </button>
          </div>
        </div>
      )}

      <header className="bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 text-white p-6 shadow-lg rounded-b-3xl mb-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-white/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg backdrop-blur-sm">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div className="text-sm">
                <p className="font-semibold flex items-center gap-1">
                  {user.displayName || 'Colecionador'} {isPro && <span className="bg-yellow-400 text-yellow-900 text-[9px] px-1.5 py-0.5 rounded font-black uppercase">PRO</span>}
                </p>
                <p className="text-emerald-100/80 text-xs">{user.email}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button onClick={() => setShowTutorial(true)} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm border border-white/10" title="Como Funciona">
                <Info size={16} /> Ajuda
              </button>

              {isPro ? (
                <button onClick={() => copyToClipboard(activeFamilyId, "Código da família copiado!")} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm border border-white/10">
                  <KeyRound size={16} /> Copiar Meu Código
                </button>
              ) : (
                <div className="flex items-center gap-1 bg-white/5 px-3 py-2 rounded-lg text-sm font-medium text-white/50 border border-white/5">
                  <Lock size={14} /> Código Bloqueado
                </div>
              )}
              <button onClick={() => signOut(auth)} className="flex items-center gap-2 bg-red-500/80 hover:bg-red-500 px-3 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
                <LogOut size={16} /> Sair
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight">Copa 2026</h1>
                  {!isSyncing ? <Cloud size={20} className="text-emerald-300" title="Sincronizado" /> : <div className="w-4 h-4 border-2 border-emerald-300 border-t-transparent rounded-full animate-spin"></div>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-800/50 px-2 py-0.5 rounded text-xs font-bold font-mono tracking-widest border border-emerald-500/30">
                    ID do Cofre: {activeFamilyId.substring(0,8).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center bg-black/20 rounded-2xl p-4 w-full md:w-auto backdrop-blur-md border border-white/10 shadow-inner">
              <Trophy size={28} className="text-yellow-400 mr-4" />
              <div className="flex flex-col flex-1 min-w-[180px]">
                <div className="flex justify-between text-sm font-bold mb-1.5">
                  <span>Álbum Completado</span>
                  <span>{stats.percentage}%</span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-200 h-3 rounded-full transition-all duration-500" style={{ width: `${stats.percentage}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 lg:px-8">
        
        <div className="mb-8 space-y-4">
          
          {activeFamilyId === user.uid && (
            <form onSubmit={handleJoinFamily} className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 text-slate-600 sm:w-1/3">
                <Users size={20} className="text-emerald-600" />
                <span className="text-sm font-bold">Unir-se a um Grupo/Cofre:</span>
              </div>
              <input type="text" placeholder="Cole o código (ID) do cofre da família aqui..." value={joinCode} onChange={(e) => setJoinCode(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"/>
              <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-800">Conectar</button>
            </form>
          )}

          {isPro && (
            <button onClick={handleShareList} className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20b858] text-white px-6 py-3 rounded-2xl text-sm font-black transition-all shadow-md active:scale-95">
              <Share2 size={20}/> Copiar Lista de Trocas (WhatsApp)
            </button>
          )}

          {!isPro && (
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-slate-700">
                <ShoppingCart size={18} className="text-emerald-600"/>
                <span className="text-xs font-black uppercase tracking-wider">🛒 Mercado da Copa (Descontos)</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <a href="https://amzn.to/seu-link-afiliado-figurinhas" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center text-center bg-orange-50 hover:bg-orange-100 border border-orange-200 p-3 rounded-2xl transition-colors">
                  <span className="text-xs font-bold text-orange-800">Pacotes de Figurinhas</span>
                  <span className="text-[10px] text-orange-600 mt-0.5 font-medium">Comprar na Amazon ↗</span>
                </a>
                <a href="https://shopee.com.br/seu-link-afiliado-album" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center text-center bg-red-50 hover:bg-red-100 border border-red-200 p-3 rounded-2xl transition-colors">
                  <span className="text-xs font-bold text-red-800">Álbum Capa Dura</span>
                  <span className="text-[10px] text-red-600 mt-0.5 font-medium">Comprar na Shopee ↗</span>
                </a>
              </div>
            </div>
          )}

          {activeFamilyId === user.uid && !isPro && (
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-3xl shadow-lg border border-slate-700 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="relative z-10 w-full">
                <h3 className="text-xl font-black mb-2 flex items-center gap-2">
                  <Trophy className="text-yellow-400 cursor-pointer" onClick={handleTrophyClick} /> 
                  Ativar o Cofre Família PRO
                </h3>
                <p className="text-sm text-slate-300 max-w-md mb-4">Sincronize o álbum em tempo real com sua família. Custa menos que 2 pacotinhos (R$ 14,90) e evita comprar figurinhas repetidas à toa!</p>
                
                <a href="https://www.youtube.com/shorts/seu_link_aqui" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 hover:text-emerald-200 bg-white/10 px-3 py-1.5 rounded-lg transition-colors mb-4 md:mb-0">
                  <PlayCircle size={16} /> Ver a mágica na prática
                </a>
              </div>
              
              <div className="w-full md:w-auto relative z-10 flex flex-col items-center md:items-end">
                {!pixCode ? (
                  <button onClick={handleBuyPro} disabled={loadingPix} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-6 py-3 rounded-xl text-sm font-black transition-all shadow-md w-full md:w-auto whitespace-nowrap active:scale-95 disabled:opacity-60">
                    {loadingPix ? 'Gerando Pix...' : 'Liberar PRO por R$ 14,90'}
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-2xl w-full md:w-auto text-slate-800 shadow-inner">
                    <span className="text-xs font-bold text-slate-500">Pague este Pix Copia e Cola no seu banco:</span>
                    <input type="text" readOnly value={pixCode} className="w-full text-xs bg-slate-50 p-2 rounded-lg border border-slate-200 outline-none text-center" />
                    <button onClick={() => copyToClipboard(pixCode, "Pix Copiado! Cole no seu banco.")} className="text-sm bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold w-full transition-all flex items-center justify-center gap-2 active:scale-95"><Copy size={16}/> Copiar Código Pix</button>
                    <span className="text-[10px] text-emerald-600 animate-pulse font-bold mt-1 text-center">Aguardando pagamento... O acesso PRO será liberado sozinho!</span>
                  </div>
                )}
                 {payError && <p className="text-xs text-red-400 mt-2 bg-red-950 p-2 rounded-lg border border-red-700 w-full text-center">{payError}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col items-center">
            <CheckCircle2 size={28} className="text-emerald-500 mb-1" />
            <span className="text-2xl md:text-3xl font-black text-slate-800">{stats.collected}</span>
            <span className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Coladas</span>
          </div>
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col items-center">
            <CircleDashed size={28} className="text-slate-300 mb-1" />
            <span className="text-2xl md:text-3xl font-black text-slate-800">{stats.missing}</span>
            <span className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Faltam</span>
          </div>
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col items-center">
            <Layers size={28} className="text-purple-500 mb-1" />
            <span className="text-2xl md:text-3xl font-black text-slate-800">{stats.repeated}</span>
            <span className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Repetidas</span>
          </div>
        </div>

        <div className="mb-6 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="text-teal-600" size={18}/>
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">Pular para Seleção</span>
          </div>
          
          <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar snap-x">
            {SECTIONS.map(sec => (
              <button 
                key={sec.id} 
                onClick={() => scrollToSection(sec.id)}
                className="snap-start flex flex-col items-center justify-center min-w-[70px] bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 p-2 rounded-2xl transition-all active:scale-95"
              >
                <span className="text-2xl mb-1">{sec.flag}</span>
                <span className="text-[10px] font-bold text-slate-600">{sec.prefix}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            <div className="flex space-x-2 p-1">
              {[{ id: 'all', label: 'Todas', icon: BarChart3 }, { id: 'missing', label: 'Faltantes', icon: CircleDashed }, { id: 'collected', label: 'Obtidas', icon: CheckCircle2 }, { id: 'repeated', label: 'Repetidas', icon: Layers }].map(tab => (
                <button key={tab.id} onClick={() => setFilter(tab.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === tab.id ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Buscar (ex: BRA 10 ou Grupo C)" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500"/>
          </div>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedSections).map(([groupName, sections]) => (
            <div key={groupName} className="space-y-6">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter border-b-4 border-teal-500 pb-2 inline-block">
                {groupName}
              </h2>
              
              {sections.map((sec) => (
                <div key={sec.id} ref={el => sectionsRef.current[sec.id] = el} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 scroll-mt-24">
                  <div className="flex items-baseline justify-between border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
                      <span className="text-2xl">{sec.flag}</span> {sec.title} <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{sec.prefix}</span>
                    </h3>
                    <span className="text-sm font-semibold text-slate-400">{sec.visibleKeys.filter(k => stickers[k] !== 0).length} / {sec.visibleKeys.length}</span>
                  </div>
                  <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-20 gap-2">
                    {sec.visibleKeys.map((key) => {
                      const status = stickers[key];
                      const numStr = key.split('-')[1];
                      return (
                        <button key={key} onClick={() => toggleSticker(key)} className={`relative aspect-square rounded-xl flex items-center justify-center text-sm font-black transition-all transform active:scale-90 select-none ${status === 0 ? 'bg-slate-50 border-2 border-dashed border-slate-300 text-slate-400 hover:border-emerald-400' : ''} ${status === 1 ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-md border-2 border-emerald-500' : ''} ${status === 2 ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-md border-2 border-purple-600' : ''}`}>
                          {numStr}
                          {status === 2 && <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white">+1</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
