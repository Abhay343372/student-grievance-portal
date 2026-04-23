import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { grievanceAPI } from '../services/api';
import { LogOut, Search, Plus, Trash2, Edit2, CheckCircle, AlertCircle, Clock, Send, ShieldAlert } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [grievances, setGrievances] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academic');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Status messages
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const fetchGrievances = async () => {
    try {
      const { data } = await grievanceAPI.getAll();
      setGrievances(data);
    } catch (error) {
      console.error('Error fetching grievances', error);
      showMessage('error', 'Failed to load grievances');
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchGrievances();
      return;
    }
    try {
      const { data } = await grievanceAPI.search(searchTerm);
      setGrievances(data);
    } catch (error) {
      console.error('Error searching', error);
      showMessage('error', 'Search failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await grievanceAPI.update(editingId, { title, description, category });
        showMessage('success', 'Grievance updated successfully');
        setEditingId(null);
      } else {
        await grievanceAPI.create({ title, description, category });
        showMessage('success', 'Grievance submitted successfully');
      }
      setTitle('');
      setDescription('');
      setCategory('Academic');
      fetchGrievances();
    } catch (error) {
      console.error('Error submitting grievance', error);
      showMessage('error', error.response?.data?.message || 'Failed to submit grievance');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grievance?')) {
      try {
        await grievanceAPI.delete(id);
        showMessage('success', 'Grievance deleted');
        fetchGrievances();
      } catch (error) {
        console.error('Error deleting', error);
        showMessage('error', 'Failed to delete grievance');
      }
    }
  };

  const handleMarkResolved = async (g) => {
    try {
      await grievanceAPI.update(g._id, { status: 'Resolved' });
      showMessage('success', 'Status marked as Resolved');
      fetchGrievances();
    } catch (error) {
      console.error('Error updating status', error);
      showMessage('error', 'Failed to update status');
    }
  };

  const handleEdit = (g) => {
    setEditingId(g._id);
    setTitle(g.title);
    setDescription(g.description);
    setCategory(g.category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setCategory('Academic');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navbar - Glassmorphism */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/80 px-6 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl">
            <ShieldAlert className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Grievance<span className="text-indigo-600">Portal</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-3 bg-gray-100/80 px-4 py-2 rounded-full border border-gray-200">
            <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-semibold text-gray-700">{user?.name}</span>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-all duration-200 font-medium border border-transparent hover:border-red-100"
          >
            <LogOut size={18} /> <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </nav>

      {/* Floating Alert Messages */}
      {message.text && (
        <div className={`fixed top-24 right-6 z-50 p-4 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in max-w-sm w-full border ${
          message.type === 'error' ? 'bg-white border-red-200 text-red-800 shadow-red-100' : 'bg-white border-green-200 text-green-800 shadow-green-100'
        }`}>
          {message.type === 'error' ? (
            <div className="bg-red-100 p-2 rounded-full"><AlertCircle className="text-red-600" size={20} /></div>
          ) : (
            <div className="bg-green-100 p-2 rounded-full"><CheckCircle className="text-green-600" size={20} /></div>
          )}
          <span className="font-semibold text-sm">{message.text}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Col: Form */}
        <div className="xl:col-span-4 relative">
          <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 sticky top-28">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-indigo-50 p-3 rounded-2xl">
                {editingId ? <Edit2 className="text-indigo-600 w-6 h-6" /> : <Plus className="text-indigo-600 w-6 h-6" />}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Grievance' : 'Submit Issue'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all focus:bg-white"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., Library AC not working"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <div className="relative">
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all focus:bg-white appearance-none cursor-pointer"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Academic">Academic</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Transport">Transport</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  rows="5"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all focus:bg-white resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide detailed information about your issue..."
                ></textarea>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                >
                  {loading ? 'Processing...' : (
                    <>
                      {editingId ? 'Save Changes' : 'Submit Grievance'}
                      <Send size={18} className={loading ? 'animate-pulse' : ''} />
                    </>
                  )}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: List & Search */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Search Bar */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 relative z-10">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search your grievances by title..."
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-medium"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if(e.target.value === '') fetchGrievances();
                  }}
                />
              </div>
              <button 
                type="submit" 
                className="px-8 py-3.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold text-sm shadow-sm"
              >
                Search
              </button>
            </form>
          </div>

          {/* Grievances List */}
          <div className="space-y-6">
            {grievances.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-16 flex flex-col items-center justify-center text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Grievances Found</h3>
                <p className="text-gray-500 max-w-sm">
                  You haven't submitted any grievances yet, or no matches were found for your search.
                </p>
              </div>
            ) : (
              grievances.map(g => (
                <div 
                  key={g._id} 
                  className="bg-white rounded-3xl shadow-soft border border-gray-100 p-7 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4">
                    
                    {/* Header Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wide uppercase">
                          {g.category}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                          <Clock size={12} /> {new Date(g.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight">{g.title}</h3>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                      <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                        g.status === 'Resolved' 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {g.status === 'Resolved' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        {g.status}
                      </div>

                      <div className="flex gap-2 ml-auto md:ml-2">
                        {g.status === 'Pending' && (
                          <button
                            onClick={() => handleMarkResolved(g)}
                            className="p-2.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition-colors border border-transparent hover:border-green-200 tooltip-trigger"
                            title="Mark as Resolved"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleEdit(g)}
                          className="p-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-transparent hover:border-indigo-200"
                          title="Edit Grievance"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(g._id)}
                          className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-transparent hover:border-red-200"
                          title="Delete Grievance"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Body Content */}
                  <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {g.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
