
import { Topic, Flashcard, DailyActivity } from './types.ts';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Configuração oficial vinculada ao projeto estude-comigo
const firebaseConfig = {
  apiKey: "AIzaSyBti3jPgLdUOjGn3_Xp3YB1xfsjZAEFvx8",
  authDomain: "estude-comigo.firebaseapp.com",
  projectId: "estude-comigo",
  storageBucket: "estude-comigo.firebasestorage.app",
  messagingSenderId: "1012724812452",
  appId: "1:1012724812452:web:0c068fbe85d289c80a3431"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const SHEET_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vRcPbACEpTaSt-6ilfR4vJa2sPqV9rKxMR5L6uG6dzjP92cqdt61nneL6_iR7rmjxeEvckNbqgg6JNB/pub?gid=531286968&single=true&output=tsv`;

export const TOPICS: Topic[] = [
  { id: 'antro', name: 'Antropologia e Hamartiologia', category: '1 - Doutrinas Teológicas', icon: 'person', color: 'blue', total: 0, stats: { wrong: 0, review: 0, correct: 0 } },
  { id: 'bib', name: 'Bibliologia', category: '1 - Doutrinas Teológicas', icon: 'menu_book', color: 'blue', total: 0, stats: { wrong: 0, review: 0, correct: 0 } },
  { id: 'theo', name: 'Doutrina de Deus', category: '1 - Doutrinas Teológicas', icon: 'psychology_alt', color: 'blue', total: 0, stats: { wrong: 0, review: 0, correct: 0 } },
  { id: 'cris', name: 'Cristologia', category: '1 - Doutrinas Teológicas', icon: 'redeem', color: 'blue', total: 0, stats: { wrong: 0, review: 0, correct: 0 } },
  { id: 'pneu', name: 'Pneumatologia', category: '1 - Doutrinas Teológicas', icon: 'air', color: 'blue', total: 0, stats: { wrong: 0, review: 0, correct: 0 } },
  { id: 'sote', name: 'Soteriologia', category: '1 - Doutrinas Teológicas', icon: 'auto_awesome', color: 'blue', total: 0, stats: { wrong: 0, review: 0, correct: 0 } },
  { id: 'ecles', name: 'Eclesiologia', category: '1 - Doutrinas Teológicas', icon: 'church', color: 'blue', total: 0, stats: { wrong: 0, review: 0, correct: 0 } },
  { id: 'escat', name: 'Escatologia', category: '1 - Doutrinas Teológicas', icon: 'hourglass_empty', color: 'blue', total: 0, stats: { wrong: 0, review: 0, correct: 0 } },
  { id: 'rel', name: 'Ética Pastoral e Casuística', category: '2 - Ética Pastoral e Casuística', icon: 'groups', color: 'emerald', total: 0, stats: { wrong: 0, review: 0, correct: 0 } },
  { id: 'hist_orig', name: 'Origem e História dos Batistas', category: '3 - Origem e História dos Batistas', icon: 'history_edu', color: 'purple', total: 0, stats: { wrong: 0, review: 0, correct: 0 } },
];

export const MOCK_CARDS: Flashcard[] = [];

export const ACTIVITY_DATA: DailyActivity[] = [
  { day: 'S', cards: 0 }, { day: 'T', cards: 0 }, { day: 'Q', cards: 0 }, { day: 'Q', cards: 0 }, { day: 'S', cards: 0 }, { day: 'S', cards: 0, isToday: true }, { day: 'D', cards: 0 },
];

export const fetchSheetData = async (url: string): Promise<Flashcard[] | null> => {
  try {
    const res = await fetch(`${url}&t=${Date.now()}`);
    if (!res.ok) return null;
    const tsv = await res.text();
    const rows = tsv.replace(/^\uFEFF/, '').split(/\r?\n/).slice(1).filter(row => row.trim() !== '' && row.split('\t').length >= 4);
    return rows.map((row, index) => {
      const p = row.split('\t').map(col => col.trim());
      return { id: `sheet-${index}`, topicId: p[0] || 'antro', category: p[1] || 'Teologia', question: p[2] || 'Pergunta vazia?', answer: p[3] || 'Resposta não informada.', level: parseInt(p[4]) || 1, details: p[5] || '' };
    });
  } catch (e) { return null; }
};

export const saveUserDataCloud = async (uid: string, data: any) => {
  try { await setDoc(doc(db, "users", uid), data, { merge: true }); } catch (e) { console.error("Erro ao salvar nuvem", e); }
};

export const getUserDataCloud = async (uid: string) => {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
  } catch (e) { return null; }
};
