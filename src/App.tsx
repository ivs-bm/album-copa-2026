```react
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Trophy, Search, Layers, CheckCircle2, CircleDashed, BarChart3, 
  Globe2, Copy, Check, Cloud, LogIn, Users, LogOut, KeyRound
} from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

// 1. AS SUAS CHAVES DO FIREBASE (Injetadas com sucesso)
const firebaseConfig = {
  apiKey: "AIzaSyDm80NbEwqVyF5WratOIi-ENe35ykzJ-_Q",
  authDomain: "albumcopa2026-59c00.firebaseapp.com",
  projectId: "albumcopa2026-59c00",
  storageBucket: "albumcopa2026-59c00.firebasestorage.app",
  messagingSenderId: "839897438384",
  appId: "1:839897438384:web:b70a235d7f777c34080375"
};

// Inicializa o Firebase garantindo que não duplique instâncias
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// 2. ESTRUTURA DO ÁLBUM
const SECTIONS = [
  { id: 'FWC_INI', title: 'Página Inicial', prefix: 'FWC', items: ['00', '1', '2', '3', '4', '5', '6', '7', '8'] },
  { id: 'MEX', title: 'México', prefix: 'MEX', count: 20 },
  { id: 'RSA', title: 'África do Sul', prefix: 'RSA', count: 20 },
  { id: 'BRA', title: 'Brasil', prefix: 'BRA', count: 20 },
  { id: 'ARG', title: 'Argentina', prefix: 'ARG', count: 20 },
  { id: 'FRA', title: 'França', prefix: 'FRA', count: 20 },
  { id: 'CC', title: 'Coca-Cola', prefix: 'CC', items: ['1', '2', '3', '4', '5', '6', '7', '8'] },
  // Nota: Reduzi a lista visualmente aqui no código para focar na lógica de login, 
  // mas na versão publicada colocamos as 48 seleções.
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

  // Monitora o estado de Login do usuário
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Ao logar, por padrão, o usuário acessa o seu próprio cofre (UID)
        setActiveFamilyId(currentUser.uid);
      } else {
        setActiveFamilyId('');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sincronização em Tempo Real com o Firestore
  useEffect(() => {
    if (!user || !activeFamilyId) return;
    setIsSyncing(true);
    
    const albumRef = doc(db, 'family_albums', activeFamilyId);
    
    const unsubscribe = onSnapshot(albumRef, (docSnap) => {
      if (docSnap.exists()) {
        setStickers(prev => ({ ...prev, ...(docSnap.data().stickers || {}) }));
      } else {
        // Se o banco não existe (primeiro acesso), cria ele
        if (activeFamilyId === user.uid) {
          setDoc(albumRef, { 
            adminEmail: user.email,
            createdAt: new Date(),
            stickers: getInitialState() 
          });
        }
      }
      setIsSyncing(false);
    }, (error) => {
      console.error("Erro de sincronização:", error);
      showToast("Erro ao conectar ao banco. Verifique as regras do Firebase.");
    });

    return () => unsubscribe();
  }, [user, activeFamilyId]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
      showToast("Erro ao fazer login. Tente novamente.");
    }
  };

  const handleJoinFamily = (e) => {
    e.preventDefault();
    if (joinCode.trim().length > 5) {
      setActiveFamilyId(joinCode.trim());
      setJoinCode('');
      showToast("Conectado ao novo cofre familiar!");
    }
  };

  const toggleSticker = async (key) => {
    if (!user || !activeFamilyId) return;
    
    const newStatus = (stickers[key] + 1) % 3;
    setStickers(prev => ({ ...prev, [key]: newStatus })); // Otimista (Muda na tela antes)

    const albumRef = doc(db, 'family_albums', activeFamilyId);
    try {
      await updateDoc(albumRef, { [`stickers.${key}`]: newStatus });
    } catch (error) {
      console.error(error);
      // Fallback em caso de erro no documento
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

  // Cálculos Estatísticos
  const stats = useMemo(() => {
    let missing = 0, collected = 0, repeated = 0;
    Object.values(stickers).forEach(s => {
      if (s === 0) missing++;
      if (s === 1) collected++;
      if (s === 2) { collected++; repeated++; }
    });
    return { missing, collected, repeated, percentage: ((collected / TOTAL_STICKERS) * 100).toFixed(1) };
  }, [stickers]);

  const filteredSections = useMemo(() => {
    return SECTIONS.map(sec => {
      const keys = getSectionKeys(sec);
      const visibleKeys = keys.filter(k => {
        const num = k.split('-')[1];
        const searchStr = `${sec.prefix} ${num} ${sec.title}`.toLowerCase();
        if (searchQuery && !searchStr.includes(searchQuery.toLowerCase())) return false;
        if (filter === 'missing' && stickers[k] !== 0) return false;
        if (filter === 'collected' && stickers[k] === 0) return false;
        if (filter === 'repeated' && stickers[k] !== 2) return false;
        return true;
      });
      return { ...sec, visibleKeys };
    }).filter(sec => sec.visibleKeys.length > 0);
  }, [stickers, filter, searchQuery]);

  // TELA DE CARREGAMENTO INICIAL
  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-emerald-600"><div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div></div>;
  }

  // TELA DE LOGIN (O que o usuário vê antes de pagar/acessar)
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
          <Globe2 size={64} className="text-emerald-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-slate-800 mb-2">Álbum Copa 2026</h1>
          <p className="text-slate-500 mb-8 font-medium">Controle suas figurinhas e sincronize em tempo real com toda a sua família.</p>
          
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold transition-all shadow-md active:scale-95"
          >
            <LogIn size={20} />
            Entrar com conta Google
          </button>

          <p className="mt-6 text-xs text-slate-400">
            Acesso exclusivo Pro. Ao continuar, você concorda com os termos de uso.
          </p>
        </div>
      </div>
    );
  }

  // TELA PRINCIPAL (O Álbum Sincronizado)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-10">
      
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-fade-in">
          <Check size={18} className="text-emerald-400"/>
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}

      {/* Header Fixo e Colorido */}
      <header className="bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 text-white p-6 shadow-lg rounded-b-3xl mb-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Top Bar (Usuário e Compartilhamento) */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-white/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg backdrop-blur-sm">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div className="text-sm">
                <p className="font-semibold">{user.displayName || 'Colecionador'}</p>
                <p className="text-emerald-100/80 text-xs">{user.email}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => copyToClipboard(activeFamilyId, "Código da família copiado!")}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm border border-white/10"
              >
                <KeyRound size={16} /> Copiar Meu Código
              </button>
              <button 
                onClick={() => signOut(auth)}
                className="flex items-center gap-2 bg-red-500/80 hover:bg-red-500 px-3 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
              >
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
                    ID: {activeFamilyId.substring(0,6).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center bg-black/20 rounded-2xl p-4 w-full md:w-auto backdrop-blur-md border border-white/10 shadow-inner">
              <Trophy size={28} className="text-yellow-400 mr-4" />
              <div className="flex flex-col flex-1 min-w-[180px]">
                <div className="flex justify-between text-sm font-bold mb-1.5">
                  <span>Concluído</span>
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
        
        {/* Entrar em Outra Família (Para Esposa e Filho) */}
        {activeFamilyId === user.uid && (
          <form onSubmit={handleJoinFamily} className="mb-8 flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 text-slate-600 sm:w-1/3">
              <Users size={20} className="text-emerald-600" />
              <span className="text-sm font-bold">Unir-se a um Cofre:</span>
            </div>
            <input 
              type="text" 
              placeholder="Cole o código (ID) recebido aqui..." 
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-800">
              Conectar
            </button>
          </form>
        )}

        {/* Dashboard Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col items-center">
            <CheckCircle2 size={28} className="text-emerald-500 mb-1" />
            <span className="text-2xl md:text-3xl font-black text-slate-800">{stats.collected}</span>
            <span className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Obtidas</span>
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

        {/* Filtros e Busca */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            <div className="flex space-x-2 p-1">
              {[
                { id: 'all', label: 'Todas', icon: BarChart3 },
                { id: 'missing', label: 'Faltantes', icon: CircleDashed },
                { id: 'collected', label: 'Obtidas', icon: CheckCircle2 },
                { id: 'repeated', label: 'Repetidas', icon: Layers },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    filter === tab.id ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar (ex: BRA 10)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Grid de Figurinhas */}
        <div className="space-y-6">
          {filteredSections.map((sec) => (
            <div key={sec.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-3 mb-4">
                <h2 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
                  {sec.title} <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{sec.prefix}</span>
                </h2>
                <span className="text-sm font-semibold text-slate-400">
                  {sec.visibleKeys.filter(k => stickers[k] !== 0).length} / {sec.visibleKeys.length}
                </span>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-20 gap-2">
                {sec.visibleKeys.map((key) => {
                  const status = stickers[key];
                  const numStr = key.split('-')[1];
                  return (
                    <button
                      key={key}
                      onClick={() => toggleSticker(key)}
                      className={`
                        relative aspect-square rounded-xl flex items-center justify-center text-sm font-black transition-all transform active:scale-90 select-none
                        ${status === 0 ? 'bg-slate-50 border-2 border-dashed border-slate-300 text-slate-400 hover:border-emerald-400' : ''}
                        ${status === 1 ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-md border-2 border-emerald-500' : ''}
                        ${status === 2 ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-md border-2 border-purple-600' : ''}
                      `}
                    >
                      {numStr}
                      {status === 2 && <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white">+1</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
      `}} />
    </div>
  );
}


```
