import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { logoutUser, subscribeToAuth, addAccount, updateAccount, deleteAccount, uploadImage, getAccounts, getAccountById, checkIsAdmin } from '../services/supabase';
import { Account, AccountStatus, AccountCategory, AccountFormData } from '../types';
import { Button, Input } from '../components/Shared';
import { Plus, Edit, Trash2, LogOut, Image as ImageIcon, BarChart, ChevronLeft, Loader2 } from 'lucide-react';

// --- WRAPPER ---
export const AdminPanel: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeToAuth((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-gaming-neon"><div className="animate-spin w-8 h-8 border-4 border-current border-t-transparent rounded-full" /></div>;

  // Not logged in -> Go to Login
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but not admin -> Go Home (or unauthorized page)
  if (!checkIsAdmin(user)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-3xl font-gaming font-bold text-red-500 mb-2">Access Denied</h1>
        <p className="text-slate-400 mb-6">You do not have permission to view this area.</p>
        <Link to="/">
          <Button variant="outline">Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard user={user} />} />
      <Route path="/new" element={<Editor />} />
      <Route path="/edit/:id" element={<Editor />} />
    </Routes>
  );
};

// --- DASHBOARD ---
const Dashboard: React.FC<{ user: any }> = ({ user }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    getAccounts().then(data => {
      setAccounts(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this listing permanently? This action cannot be undone.')) {
      setDeletingId(id);
      try {
        await deleteAccount(id);
        setAccounts(prev => prev.filter(a => a.id !== id));
      } catch (error: any) {
        console.error("Delete failed in UI", error);
        alert(`Failed to delete account. Error: ${error.message || 'Unknown error'}`);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const soldCount = accounts.filter(a => a.status === AccountStatus.SOLD).length;
  const totalValue = accounts.filter(a => a.status === AccountStatus.AVAILABLE).reduce((acc, curr) => acc + curr.price, 0);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-gaming-neon"><div className="animate-spin w-8 h-8 border-4 border-current border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-24 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-gaming font-bold text-white">Command Center</h1>
            <p className="text-slate-400 text-sm">Welcome back, {user.email}</p>
          </div>
          <button onClick={() => logoutUser()} className="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-all border border-slate-800">
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BarChart size={40} />
            </div>
            <div className="text-slate-500 text-xs uppercase font-bold mb-1 tracking-wider">Total Value</div>
            <div className="text-2xl font-bold text-gaming-neon">₹{totalValue.toLocaleString('en-IN')}</div>
          </div>
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BarChart size={40} />
            </div>
            <div className="text-slate-500 text-xs uppercase font-bold mb-1 tracking-wider">Sold Units</div>
            <div className="text-2xl font-bold text-green-400">{soldCount}</div>
          </div>
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <BarChart size={40} />
            </div>
            <div className="text-slate-500 text-xs uppercase font-bold mb-1 tracking-wider">Active Listings</div>
            <div className="text-2xl font-bold text-blue-400">{accounts.length - soldCount}</div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            Inventory <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">{accounts.length}</span>
          </h2>
          <Link to="/admin/new">
            <Button className="py-2.5 px-4 text-sm shadow-lg shadow-gaming-neon/10"><Plus size={18} className="mr-1.5"/> Add Listing</Button>
          </Link>
        </div>

        <div className="space-y-3">
          {accounts.map(acc => (
            <div key={acc.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex gap-4 items-center group">
               <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-black flex-shrink-0">
                  <img src={acc.thumbnail} className="w-full h-full object-cover" alt="" />
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center font-bold text-[10px] uppercase tracking-wider text-white ${acc.status === 'AVAILABLE' ? 'hidden' : 'flex'}`}>
                    {acc.status}
                  </div>
               </div>
               
               <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 mb-1">
                   <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${acc.status === 'AVAILABLE' ? 'text-green-500 bg-green-500' : acc.status === 'RESERVED' ? 'text-yellow-500 bg-yellow-500' : 'text-red-500 bg-red-500'}`} />
                   <h3 className="text-white font-bold truncate text-base">{acc.title}</h3>
                   {acc.featured && <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-500/30">FEATURED</span>}
                 </div>
                 <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <span className="text-gaming-neon font-bold">₹{acc.price.toLocaleString('en-IN')}</span>
                    <span>•</span>
                    <span>{acc.category}</span>
                    <span>•</span>
                    <span className="truncate">Lv. {acc.level}</span>
                 </div>
               </div>

               <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Link to={`/admin/edit/${acc.id}`} className="p-2.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors" title="Edit">
                    <Edit size={18} />
                  </Link>
                  <button 
                    onClick={() => handleDelete(acc.id)} 
                    disabled={deletingId === acc.id}
                    className="p-2.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50" 
                    title="Delete"
                  >
                    {deletingId === acc.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  </button>
               </div>
            </div>
          ))}
          {accounts.length === 0 && (
            <div className="text-center py-12 text-slate-500 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
               No accounts in inventory. Click "Add Listing" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- EDITOR (ADD/EDIT) ---
const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const initialForm: AccountFormData = {
    title: '', description: '', price: 0, level: 1, rankBr: 'Bronze I', rankCs: 'Bronze I',
    server: 'NA', skinsCount: 0, evoGunsCount: 0, elitePassCount: 0, loginMethod: 'Google',
    status: AccountStatus.AVAILABLE, category: AccountCategory.BUDGET, tags: [],
    images: [], thumbnail: '', featured: false
  };

  const [form, setForm] = useState<AccountFormData>(initialForm);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (id) {
      getAccountById(id).then(acc => {
        if (acc) setForm(acc);
      });
    }
  }, [id]);

  const handleChange = (field: keyof AccountFormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    const urls: string[] = [];
    
    for (let i = 0; i < e.target.files.length; i++) {
      try {
        const url = await uploadImage(e.target.files[i]);
        urls.push(url);
      } catch (err) {
        console.error("Upload failed", err);
        alert("Failed to upload image. Make sure you are logged in.");
      }
    }
    
    setForm(prev => ({
      ...prev,
      images: [...prev.images, ...urls],
      thumbnail: prev.thumbnail || urls[0] // Set first image as thumbnail if empty
    }));
    setUploading(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await updateAccount(id, form);
      } else {
        await addAccount(form);
      }
      navigate('/admin');
    } catch (err) {
      console.error(err);
      alert('Error saving. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 pb-24 text-white md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin" className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-700 transition-all">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">{id ? 'Edit Account' : 'New Listing'}</h1>
            <p className="text-slate-400 text-xs">Fill in the details below.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider mb-4 border-b border-slate-800 pb-2">Basic Info</h3>
            
            <Input label="Title" value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="e.g. S1 Sakura Veteran Account" required />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Price (₹)" type="number" value={form.price} onChange={e => handleChange('price', Number(e.target.value))} required />
              
              <div className="mb-4">
                <label className="block text-slate-400 text-sm font-semibold mb-1.5 uppercase tracking-wide">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(AccountCategory).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleChange('category', cat)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold uppercase border transition-all ${
                        form.category === cat 
                        ? 'bg-gaming-neon text-black border-gaming-neon' 
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Input label="Description" as="textarea" value={form.description} onChange={e => handleChange('description', e.target.value)} required className="min-h-[150px]" />
          </div>

          {/* Details Card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider mb-4 border-b border-slate-800 pb-2">Account Details</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input label="Level" type="number" value={form.level} onChange={e => handleChange('level', Number(e.target.value))} />
              <Input label="BR Rank" value={form.rankBr} onChange={e => handleChange('rankBr', e.target.value)} />
              <Input label="CS Rank" value={form.rankCs} onChange={e => handleChange('rankCs', e.target.value)} />
              <Input label="Server" value={form.server} onChange={e => handleChange('server', e.target.value)} />
              <Input label="Skins" type="number" value={form.skinsCount} onChange={e => handleChange('skinsCount', Number(e.target.value))} />
              <Input label="Evo Guns" type="number" value={form.evoGunsCount} onChange={e => handleChange('evoGunsCount', Number(e.target.value))} />
              <Input label="Elite Pass" type="number" value={form.elitePassCount} onChange={e => handleChange('elitePassCount', Number(e.target.value))} />
              <Input label="Login" value={form.loginMethod} onChange={e => handleChange('loginMethod', e.target.value)} />
            </div>
          </div>

          {/* Media & Tags */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
            <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider mb-2 border-b border-slate-800 pb-2">Media & Extras</h3>
            
            {/* Images */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                 <label className="block text-slate-400 text-sm font-semibold uppercase">Gallery</label>
                 <span className="text-xs text-slate-500">{form.images.length} images uploaded</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <label className="w-24 h-24 bg-slate-800 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gaming-neon hover:bg-slate-800/80 transition-all">
                  <ImageIcon size={24} className="text-slate-500 mb-2" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{uploading ? '...' : 'Upload'}</span>
                  <input type="file" multiple className="hidden" onChange={handleImageUpload} />
                </label>
                
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 group">
                    <img src={img} className="w-full h-full object-cover rounded-xl border border-slate-700 bg-black" />
                    <button 
                      type="button"
                      onClick={() => setForm(prev => ({...prev, images: prev.images.filter((_, i) => i !== idx)}))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100"
                    >
                      <Trash2 size={12} />
                    </button>
                    {form.thumbnail === img ? (
                      <span className="absolute bottom-0 left-0 right-0 bg-green-500 text-black text-[9px] font-bold text-center py-0.5 rounded-b-lg">COVER</span>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => handleChange('thumbnail', img)} 
                        className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[9px] font-bold text-center py-0.5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        SET COVER
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-slate-400 text-sm font-semibold uppercase mb-2">Tags</label>
              <div className="flex gap-2">
                <input 
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-gaming-neon focus:border-gaming-neon outline-none" 
                  placeholder="Type tag & press enter (e.g. Rare, S1)" 
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag} variant="secondary" className="px-6">Add</Button>
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {form.tags.map(tag => (
                  <span key={tag} className="bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 border border-slate-700">
                    #{tag} 
                    <button type="button" onClick={() => setForm(prev => ({...prev, tags: prev.tags.filter(t => t !== tag)}))} className="hover:text-red-400"><Trash2 size={12} /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-xs uppercase text-slate-500 mb-2 font-bold">Listing Status</label>
                   <select 
                      value={form.status} 
                      onChange={e => handleChange('status', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg focus:ring-1 focus:ring-gaming-neon outline-none"
                    >
                      {Object.values(AccountStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                   <input 
                      type="checkbox" 
                      id="featured"
                      checked={form.featured} 
                      onChange={e => handleChange('featured', e.target.checked)}
                      className="w-6 h-6 accent-gaming-neon rounded"
                    />
                    <label htmlFor="featured" className="cursor-pointer select-none">
                       <span className="block font-bold text-white text-sm">Featured Listing</span>
                       <span className="block text-xs text-slate-500">Show on homepage slider</span>
                    </label>
                </div>
             </div>
          </div>

          <div className="pt-4 flex gap-4">
             <Button type="button" variant="ghost" onClick={() => navigate('/admin')} className="flex-1">Cancel</Button>
             <Button type="submit" fullWidth isLoading={loading} variant="primary" className="flex-[2]">
               {id ? 'Save Changes' : 'Publish Account'}
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
};