import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { Plus, X } from 'lucide-react';

// Hàm tạo ID từ tên tiếng Việt (slugify)
const generateId = (name) => {
  return name.toString().toLowerCase()
    .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
    .replace(/ì|í|ị|ỉ|ĩ/g, "i")
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
    .replace(/đ/g, "d")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const AdminList = () => {
  const { ethnicData, addEthnic } = useAdmin();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    mascot_intro: '',
    trang_phuc: '',
    am_thuc: '',
    phong_tuc: '',
    chuyen_ke: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    const newId = generateId(formData.name);
    
    const newEthnic = {
      id: newId,
      name: formData.name,
      mascot_intro: formData.mascot_intro,
      images: {},
      content: {
        trang_phuc: formData.trang_phuc,
        am_thuc: formData.am_thuc,
        phong_tuc: formData.phong_tuc,
        chuyen_ke: formData.chuyen_ke
      }
    };
    
    addEthnic(newEthnic);
    setShowModal(false);
    // Chuyển hướng tới trang chi tiết để admin có thể upload ảnh
    navigate(`/admin-mln131-setting/edit/${newId}`);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="font-sans text-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-8">Quản lý Dân tộc</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {ethnicData.map(ethnic => (
          <Link 
            key={ethnic.id} 
            to={`/admin-mln131-setting/edit/${ethnic.id}`}
            className="bg-white rounded-xl shadow border hover:shadow-md transition block overflow-hidden relative group"
          >
            <div className="p-4 text-center">
              <h2 className="text-lg font-bold text-gray-800">{ethnic.name}</h2>
              <p className="text-xs text-gray-500 mt-1">ID: {ethnic.id}</p>
            </div>
            <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full shadow">Chỉnh sửa</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Nút FAB (Floating Action Button) thêm mới */}
      <button 
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-green-500 hover:scale-110 transition-all z-40"
      >
        <Plus size={28} />
      </button>

      {/* Modal Thêm mới */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Thêm Dân tộc mới</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Tên dân tộc</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" placeholder="VD: Mông, Ê Đê..." />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Lời chào (Mascot Intro)</label>
                <textarea name="mascot_intro" value={formData.mascot_intro} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" rows="2" placeholder="Nhập lời chào..." />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Trang phục</label>
                <textarea name="trang_phuc" value={formData.trang_phuc} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" rows="3" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Ẩm thực</label>
                <textarea name="am_thuc" value={formData.am_thuc} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" rows="3" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Phong tục</label>
                <textarea name="phong_tuc" value={formData.phong_tuc} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" rows="3" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Chuyện kể</label>
                <textarea name="chuyen_ke" value={formData.chuyen_ke} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" rows="3" />
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">Thêm & Tiếp tục (Upload ảnh)</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminList;
