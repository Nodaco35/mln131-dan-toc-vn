import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { Toaster } from 'react-hot-toast';
import { Save, LogOut, Settings } from 'lucide-react';

const AdminLogin = () => {
  const [inputToken, setInputToken] = useState('');
  const { login } = useAdmin();

  const handleLogin = (e) => {
    e.preventDefault();
    if (inputToken.trim()) login(inputToken.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex justify-center mb-6 text-gray-800">
          <Settings size={48} />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Đăng nhập Admin</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Github Personal Access Token</label>
            <input 
              type="password"
              value={inputToken}
              onChange={e => setInputToken(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="ghp_xxxxxxxxxxxx"
              required
            />
            <p className="text-xs text-gray-500 mt-2">Token chỉ lưu tạm trên trình duyệt của bạn (localStorage), không lưu trên bất kỳ server nào khác.</p>
          </div>
          <button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
            Truy cập
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const { isLogged, logout, totalChanges, publishChanges, isPublishing } = useAdmin();
  const navigate = useNavigate();

  if (!isLogged) {
    return <AdminLogin />;
  }

  const changesCount = totalChanges();

  return (
    <div className="relative min-h-screen bg-gray-50 pb-20">
      {/* Floating Header / Toolbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white px-6 py-3 shadow-lg flex justify-between items-center">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/admin-mln131-setting')}>
          <div className="bg-red-600 text-xs font-bold px-2 py-1 rounded">ADMIN MODE</div>
          <span className="font-semibold hidden md:inline">Catalog 54 Dân tộc</span>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={logout} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm">
            <LogOut size={16} /> Thoát
          </button>
          <div className="h-6 w-px bg-gray-700"></div>
          
          <button 
            onClick={publishChanges}
            disabled={changesCount === 0 || isPublishing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              changesCount > 0 && !isPublishing
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg transform hover:scale-105' 
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Save size={18} />
            {isPublishing ? 'Đang Publish...' : 'Publish lên Github'}
            {changesCount > 0 && (
              <span className="bg-white text-blue-600 text-xs px-2 py-0.5 rounded-full ml-2">
                {changesCount} thay đổi
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="pt-16">
        <Outlet />
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default AdminLayout;
