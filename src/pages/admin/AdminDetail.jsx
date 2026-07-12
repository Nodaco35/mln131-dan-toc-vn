import React, { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { Edit2, Upload, Trash2, ArrowLeft } from 'lucide-react';

// --- Components Con ---

const EditableText = ({ text, onSave, multiline = false, className }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(text || '');

  const handleSave = () => {
    setIsEditing(false);
    if (val !== text) onSave(val);
  };

  if (isEditing) {
    return (
      <div className="w-full relative">
        {multiline ? (
          <textarea 
            autoFocus 
            className="w-full border-2 border-blue-500 rounded p-2 text-gray-800 focus:outline-none shadow-lg" 
            rows="5" 
            value={val} 
            onChange={e => setVal(e.target.value)} 
            onBlur={handleSave} 
          />
        ) : (
          <input 
            autoFocus 
            className="w-full border-2 border-blue-500 rounded p-2 text-gray-800 focus:outline-none shadow-lg" 
            value={val} 
            onChange={e => setVal(e.target.value)} 
            onBlur={handleSave} 
            onKeyDown={e => e.key === 'Enter' && handleSave()} 
          />
        )}
      </div>
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)} 
      className={`group relative cursor-pointer hover:bg-yellow-100 rounded transition-colors p-1 -m-1 border border-transparent hover:border-yellow-300 ${className}`}
    >
      <div className="absolute -top-3 -right-3 bg-blue-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow">
        <Edit2 size={12} />
      </div>
      {text ? (multiline ? <span className="whitespace-pre-wrap">{text}</span> : text) : <span className="text-gray-400 italic">Click để nhập nội dung...</span>}
    </div>
  );
};

const ImageUploader = ({ ethnicId, category, index, currentImageName, pendingFiles, onUpload }) => {
  const fileInputRef = useRef(null);

  // Đường dẫn mặc định (trong public/images/)
  const defaultSrc = currentImageName ? `/images/${ethnicId}/${currentImageName}` : null;
  
  // Đường dẫn giả lập cho Base64
  let expectedPath = '';
  if (category === 'mascot') {
    expectedPath = `public/images/${ethnicId}/mascot.`; // Bỏ qua đuôi
  } else {
    expectedPath = `public/images/${ethnicId}/${category}_${index}.`;
  }

  // Tìm trong mảng pending xem có ảnh nào đang chờ đẩy lên hợp với ô này không
  const pendingImage = pendingFiles.find(f => f.path.startsWith(expectedPath));
  
  // Hiển thị ảnh đang chờ hoặc ảnh có sẵn
  const displaySrc = pendingImage ? `data:image/jpeg;base64,${pendingImage.content}` : defaultSrc;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    
    const reader = new FileReader();
    reader.onloadend = () => {
      onUpload(ethnicId, category, index, reader.result, ext);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div 
      className="relative w-full h-full group cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center"
      onClick={() => fileInputRef.current.click()}
    >
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange} 
      />
      
      {displaySrc ? (
        <>
          <img src={displaySrc} alt="Preview" className="w-full h-full object-cover object-center transition-opacity group-hover:opacity-50" />
          {pendingImage && <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow">Chờ lưu</div>}
        </>
      ) : (
        <div className="text-gray-400 text-sm flex flex-col items-center p-4 text-center">
          <Upload size={24} className="mb-2 text-gray-300 group-hover:text-blue-500 transition-colors" />
          <span>Click để upload ảnh</span>
          <span className="text-xs mt-1 italic">{category === 'mascot' ? 'Mascot' : `${category}_${index}`}</span>
        </div>
      )}

      {/* Lớp phủ khi hover */}
      <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-white font-bold bg-blue-600 px-3 py-1 rounded-full shadow">Thay ảnh</span>
      </div>
    </div>
  );
};

// --- Màn hình chính ---

const AdminDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ethnicData, updateEthnicText, addPendingImage, deleteEthnic, pendingFiles } = useAdmin();

  const ethnic = ethnicData.find(item => item.id === id);

  if (!ethnic) {
    return <div className="p-8 text-center">Không tìm thấy hoặc đã bị xóa.</div>;
  }

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa Dân tộc "${ethnic.name}" không? Thao tác này sẽ hiển thị lên web sau khi Publish.`)) {
      deleteEthnic(id);
      navigate('/admin-mln131-setting');
    }
  };

  const sections = [
    { key: 'trang_phuc', title: 'Trang Phục' },
    { key: 'am_thuc', title: 'Ẩm Thực' },
    { key: 'phong_tuc', title: 'Phong Tục' },
    { key: 'chuyen_ke', title: 'Chuyện Kể' },
  ];

  return (
    <div className="font-sans text-gray-800 pb-12 bg-orange-50 min-h-screen">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/admin-mln131-setting" className="text-blue-600 font-bold flex items-center gap-2 hover:underline">
          <ArrowLeft size={16} /> Quay lại
        </Link>
        <button onClick={handleDelete} className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition">
          <Trash2 size={16} /> Xóa dân tộc này
        </button>
      </div>

      <header className="bg-primary text-white py-6 shadow-md mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center tracking-wide uppercase px-4">
          <EditableText 
            text={ethnic.name} 
            onSave={val => updateEthnicText(id, 'name', val)} 
            className="inline-block"
          />
        </h1>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full sticky top-24">
              <div className="w-full aspect-square mb-6">
                <ImageUploader 
                  ethnicId={id} 
                  category="mascot" 
                  index={null} 
                  currentImageName={ethnic.images?.mascot} 
                  pendingFiles={pendingFiles} 
                  onUpload={addPendingImage}
                />
              </div>
              <div className="bg-orange-100 p-4 rounded-lg relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-orange-100"></div>
                <div className="text-lg leading-relaxed text-gray-800 italic font-medium">
                  "<EditableText 
                    text={ethnic.mascot_intro} 
                    onSave={val => updateEthnicText(id, 'mascot_intro', val)} 
                    multiline
                  />"
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-12">
            {sections.map(section => (
              <section key={section.key} className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-primary">
                <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm">✦</span>
                  {section.title}
                </h2>
                
                <div className="text-lg leading-relaxed text-gray-700 mb-8">
                  <EditableText 
                    text={ethnic.content[section.key]} 
                    onSave={val => updateEthnicText(id, section.key, val)} 
                    multiline
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(imgIndex => (
                    <div key={imgIndex} className="flex flex-col h-full">
                      <div className="w-full aspect-[4/3]">
                        <ImageUploader 
                          ethnicId={id} 
                          category={section.key} 
                          index={imgIndex} 
                          currentImageName={ethnic.images?.[section.key]?.[imgIndex - 1]} 
                          pendingFiles={pendingFiles} 
                          onUpload={addPendingImage}
                        />
                      </div>
                      <p className="text-sm text-gray-400 mt-2 text-center italic">Trích nguồn: ...</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default AdminDetail;
