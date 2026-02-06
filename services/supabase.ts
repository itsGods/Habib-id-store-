import { createClient, User } from '@supabase/supabase-js';
import { Account, AccountFormData, AccountStatus, AccountCategory } from '../types';

const supabaseUrl = 'https://bukjenabgfnzpmmwzaqe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1a2plbmFiZ2ZuenBtbXd6YXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzODY3MDIsImV4cCI6MjA4NTk2MjcwMn0.gHLXHHUdN8Z7Q8UhXrxLHoiU0_0gPj_fUGdyvws95eA';

export const supabase = createClient(supabaseUrl, supabaseKey);

// --- MAPPERS ---
// Convert DB Snake Case to App Camel Case
const mapAccount = (row: any): Account => ({
  id: row.id,
  title: row.title,
  description: row.description,
  price: row.price,
  level: row.level,
  rankBr: row.rank_br,
  rankCs: row.rank_cs,
  server: row.server,
  skinsCount: row.skins_count,
  evoGunsCount: row.evo_guns_count,
  elitePassCount: row.elite_pass_count,
  loginMethod: row.login_method,
  status: row.status as AccountStatus,
  category: row.category as AccountCategory,
  tags: row.tags || [],
  images: row.images || [],
  thumbnail: row.thumbnail,
  featured: row.featured,
  createdAt: new Date(row.created_at).getTime(),
  videoUrl: row.video_url
});

// Convert App Camel Case to DB Snake Case
const mapToDb = (data: AccountFormData) => ({
  title: data.title,
  description: data.description,
  price: data.price,
  level: data.level,
  rank_br: data.rankBr,
  rank_cs: data.rankCs,
  server: data.server,
  skins_count: data.skinsCount,
  evo_guns_count: data.evoGunsCount,
  elite_pass_count: data.elitePassCount,
  login_method: data.loginMethod,
  status: data.status,
  category: data.category,
  tags: data.tags,
  images: data.images,
  thumbnail: data.thumbnail,
  featured: data.featured,
  video_url: data.videoUrl
});

// --- API FUNCTIONS ---

export const getAccounts = async (): Promise<Account[]> => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }
  return data.map(mapAccount);
};

export const getAccountById = async (id: string): Promise<Account | null> => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return mapAccount(data);
};

export const addAccount = async (data: AccountFormData): Promise<void> => {
  const dbData = {
    ...mapToDb(data),
    created_at: new Date().toISOString()
  };
  const { error } = await supabase.from('accounts').insert([dbData]);
  if (error) throw error;
};

export const updateAccount = async (id: string, data: AccountFormData): Promise<void> => {
  const dbData = mapToDb(data);
  const { error } = await supabase.from('accounts').update(dbData).eq('id', id);
  if (error) throw error;
};

export const deleteAccount = async (id: string): Promise<void> => {
  const { error } = await supabase.from('accounts').delete().eq('id', id);
  if (error) throw error;
};

export const uploadImage = async (file: File): Promise<string> => {
  const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '-')}`;
  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('images').getPublicUrl(fileName);
  return data.publicUrl;
};

// --- AUTH FUNCTIONS ---

export const loginUser = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
};

export const registerUser = async (email: string, password: string) => {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
};

export const logoutUser = async () => {
  await supabase.auth.signOut();
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
  return () => subscription.unsubscribe();
};

export const checkIsAdmin = (user: User | null): boolean => {
  if (!user || !user.email) return false;
  return user.email === 'admin@demo.com';
};
