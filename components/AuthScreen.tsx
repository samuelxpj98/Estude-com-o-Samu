
import React, { useState } from 'react';
import { auth, saveUserDataCloud } from '../constants.ts';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { UserProfile } from '../types.ts';

interface AuthScreenProps {
  onSuccess: (profile?: UserProfile) => void;
  onBack: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [church, setChurch] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        onSuccess();
      } else {
        // Fluxo de Cadastro
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Atualiza o display name do Firebase Auth
        await updateProfile(user, { displayName: name });

        const newProfile: UserProfile = {
          id: user.uid,
          name: name || 'Seminarista',
          church: church || 'Igreja Batista',
          phone: phone,
          role: 'user',
          avatarColor: '#135bec',
          isProfileComplete: true,
          email: email
        };

        const initialStats = {
          streak: 1,
          lastLoginDate: new Date().toISOString().split('T')[0],
          cardsToday: 0,
          cardsLifetime: 0
        };

        // SALVAMENTO IMEDIATO: Garante que os dados do perfil não se percam
        await saveUserDataCloud(user.uid, {
          profile: newProfile,
          stats: initialStats,
          topics: [],
          updatedAt: new Date().toISOString()
        });
        
        onSuccess(newProfile);
      }
    } catch (err: any) {
      console.error(err);
      let msg = 'Erro na autenticação.';
      if (err.code === 'auth/user-not-found') msg = 'Usuário não encontrado.';
      if (err.code === 'auth/wrong-password') msg = 'Senha incorreta.';
      if (err.code === 'auth/email-already-in-use') msg = 'E-mail já cadastrado.';
      if (err.code === 'auth/weak-password') msg = 'A senha deve ter pelo menos 6 caracteres.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const autofillGmail = () => {
    if (!email.includes('@')) {
      setEmail(email.trim() + '@gmail.com');
    }
  };

  const showGmailHelper = email.length > 0 && !email.includes('@');

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark p-8 animate-page-transition overflow-y-auto no-scrollbar">
      <button onClick={onBack} className="self-start mb-8 text-gray-400 flex items-center gap-2 active:scale-95">
        <span className="material-symbols-outlined">arrow_back</span>
        Voltar
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full pb-10">
        <div className="size-16 rounded-[24px] bg-primary flex items-center justify-center text-white mb-6 shadow-xl shadow-primary/20">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>
        
        <h2 className="text-3xl font-black tracking-tighter uppercase mb-2 leading-none">
          {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h2>
        <p className="text-gray-500 text-sm mb-8 font-medium">
          {isLogin ? 'Retome seus estudos agora.' : 'Preencha seus dados de seminarista.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Seu Nome</label>
                <input 
                  type="text" required
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-white dark:bg-surface-dark border-none ring-1 ring-gray-200 dark:ring-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Nome Completo"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Sua Igreja</label>
                <input 
                  type="text" required
                  value={church} onChange={e => setChurch(e.target.value)}
                  className="w-full bg-white dark:bg-surface-dark border-none ring-1 ring-gray-200 dark:ring-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Nome da Igreja"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">WhatsApp</label>
                <input 
                  type="tel" required
                  value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full bg-white dark:bg-surface-dark border-none ring-1 ring-gray-200 dark:ring-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </>
          )}

          <div className="space-y-1 relative">
            <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">E-mail</label>
            <input 
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-white dark:bg-surface-dark border-none ring-1 ring-gray-200 dark:ring-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="seu@email.com"
            />
            {showGmailHelper && (
              <button 
                type="button"
                onClick={autofillGmail}
                className="absolute right-3 bottom-3 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-xl text-[10px] font-black text-primary uppercase tracking-tighter border border-primary/20 animate-page-transition hover:bg-primary hover:text-white transition-colors"
              >
                + @gmail.com
              </button>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Senha</label>
            <input 
              type="password" required minLength={6}
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-white dark:bg-surface-dark border-none ring-1 ring-gray-200 dark:ring-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center px-2 animate-bounce">{error}</p>}

          <button 
            type="submit" disabled={loading}
            className="w-full h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-tighter shadow-lg shadow-primary/20 flex items-center justify-center active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : (isLogin ? 'Entrar' : 'Finalizar Cadastro')}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 text-xs text-gray-400 font-bold uppercase tracking-widest hover:text-primary transition-colors text-center"
        >
          {isLogin ? 'Novo aqui? Crie sua conta' : 'Já tem conta? Acesse aqui'}
        </button>
      </div>
    </div>
  );
};

export default AuthScreen;
