import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, 
  query, orderBy, setDoc
} from 'firebase/firestore';
import { 
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User 
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Account, AccountFormData, AccountStatus, AccountCategory } from '../types';

// --- CONFIGURATION ---
// Handle Vite env vars (import.meta.env)
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    return import.meta.env?.[key];
  } catch (e) {
    return undefined;
  }
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY') || "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

let db: any;
let auth: any;
let storage: any;
let isMock = true;

// Initialize Firebase if config is present
try {
  // Check if we are in a real environment with valid config
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    isMock = false;
  }
} catch (e) {
  console.warn("Firebase initialization failed, using mock mode.", e);
}

// --- MOCK DATA ---
let MOCK_ACCOUNTS: Account[] = [
  {
    id: '1',
    title: 'S1 Sakura Veteran Account',
    description: 'Extremely rare Season 1 account with Sakura bundle, all elite passes maxed, and multiple evo guns level 7. This is a collector\'s dream item.',
    price: 35000,
    level: 78,
    rankBr: 'Grandmaster',
    rankCs: 'Master',
    server: 'NA',
    skinsCount: 450,
    evoGunsCount: 6,
    elitePassCount: 25,
    loginMethod: 'Facebook',
    status: AccountStatus.AVAILABLE,
    category: AccountCategory.RARE,
    tags: ['Sakura', 'HipHop', 'Evo Max'],
    images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1593305841991-05c29736f87e?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
    featured: true,
    createdAt: Date.now()
  },
  {
    id: '2',
    title: 'Budget Starter - Gold AK',
    description: 'Great starter account with decent collection and Gold AK skin.',
    price: 3500,
    level: 55,
    rankBr: 'Diamond II',
    rankCs: 'Heroic',
    server: 'EU',
    skinsCount: 120,
    evoGunsCount: 1,
    elitePassCount: 5,
    loginMethod: 'Google',
    status: AccountStatus.AVAILABLE,
    category: AccountCategory.BUDGET,
    tags: ['Starter', 'Cheap'],
    images: ['https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800',
    featured: false,
    createdAt: Date.now() - 100000
  },
  {
    id: '3',
    title: 'Criminal Red + Blue',
    description: 'Double criminal bundle (Red & Blue). Very rare combination.',
    price: 75000,
    level: 82,
    rankBr: 'Heroic',
    rankCs: 'Grandmaster',
    server: 'NA',
    skinsCount: 600,
    evoGunsCount: 8,
    elitePassCount: 30,
    loginMethod: 'VK',
    status: AccountStatus.RESERVED,
    category: AccountCategory.PREMIUM,
    tags: ['Criminal', 'Rare', 'Stacked'],
    images: ['https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&q=80&w=800',
    featured: true,
    createdAt: Date.now() - 200000
  }
];

let MOCK_USERS = [
  { email: 'admin@demo.com', password: 'demo123', uid: 'admin_001', displayName: 'Admin' },
  { email: 'user@demo.com', password: 'user123', uid: 'user_001', displayName: 'User' }
];

let mockAuthListeners: ((user: any) => void)[] = [];

// --- API FUNCTIONS ---

export const getAccounts = async (): Promise<Account[]> => {
  if (isMock) {
    return new Promise(resolve => setTimeout(() => resolve([...MOCK_ACCOUNTS]), 600));
  }
  const q = query(collection(db, 'accounts'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Account));
};

export const getAccountById = async (id: string): Promise<Account | null> => {
  if (isMock) {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_ACCOUNTS.find(a => a.id === id) || null), 400));
  }
  const docRef = doc(db, 'accounts', id);
  const snap = await getDoc(docRef);
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Account) : null;
};

// --- AUTH FUNCTIONS ---

const notifyMockAuth = () => {
  const stored = localStorage.getItem('mock_user');
  const user = stored ? JSON.parse(stored) : null;
  mockAuthListeners.forEach(cb => cb(user));
};

export const loginUser = async (email: string, password: string): Promise<void> => {
  if (isMock) {
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (user) {
       localStorage.setItem('mock_user', JSON.stringify(user));
       notifyMockAuth();
       return Promise.resolve();
    }
    return Promise.reject(new Error("Invalid credentials"));
  }
  await signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = async (email: string, password: string): Promise<void> => {
  if (isMock) {
    if (MOCK_USERS.find(u => u.email === email)) {
      return Promise.reject(new Error("Email already exists"));
    }
    const newUser = { email, password, uid: 'user_' + Date.now(), displayName: email.split('@')[0] };
    MOCK_USERS.push(newUser);
    localStorage.setItem('mock_user', JSON.stringify(newUser));
    notifyMockAuth();
    return Promise.resolve();
  }
  await createUserWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async (): Promise<void> => {
  if (isMock) {
    localStorage.removeItem('mock_user');
    notifyMockAuth();
    return Promise.resolve();
  }
  await signOut(auth);
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  if (isMock) {
    mockAuthListeners.push(callback);
    const stored = localStorage.getItem('mock_user');
    if (stored) callback(JSON.parse(stored));
    else callback(null);
    return () => { mockAuthListeners = mockAuthListeners.filter(c => c !== callback); };
  }
  return onAuthStateChanged(auth, callback);
};

export const checkIsAdmin = (user: User | null | any): boolean => {
  if (!user) return false;
  return user.email === 'admin@demo.com';
};

// --- ADMIN ACTIONS ---

export const addAccount = async (data: AccountFormData): Promise<void> => {
  if (isMock) {
    const newAccount: Account = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now()
    };
    MOCK_ACCOUNTS.unshift(newAccount);
    return Promise.resolve();
  }
  await addDoc(collection(db, 'accounts'), {
    ...data,
    createdAt: Date.now()
  });
};

export const updateAccount = async (id: string, data: AccountFormData): Promise<void> => {
  if (isMock) {
    const idx = MOCK_ACCOUNTS.findIndex(a => a.id === id);
    if (idx !== -1) {
      MOCK_ACCOUNTS[idx] = { ...MOCK_ACCOUNTS[idx], ...data };
    }
    return Promise.resolve();
  }
  await updateDoc(doc(db, 'accounts', id), data as any);
};

export const deleteAccount = async (id: string): Promise<void> => {
  if (isMock) {
    MOCK_ACCOUNTS = MOCK_ACCOUNTS.filter(a => a.id !== id);
    return Promise.resolve();
  }
  await deleteDoc(doc(db, 'accounts', id));
};

export const uploadImage = async (file: File): Promise<string> => {
  if (isMock) {
    // Return a local object URL for preview
    return new Promise(resolve => {
       const reader = new FileReader();
       reader.onload = (e) => resolve(e.target?.result as string);
       reader.readAsDataURL(file);
    });
  }
  const storageRef = ref(storage, `accounts/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};