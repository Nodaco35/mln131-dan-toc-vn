import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import data from '../data/data2.json';

// Component thẻ ảnh có thể ẩn nếu bị lỗi
const OptionalImageCard = ({ src, alt, caption }) => {
  const [error, setError] = useState(false);

  if (error) return null;

  return (
    <div className="group cursor-pointer flex flex-col">
      <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg shadow-inner overflow-hidden flex items-center justify-center transition-transform transform group-hover:scale-105 duration-300">
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      </div>
    </div>
  );
};



const EthnicDetail = () => {
  const { id } = useParams();
  
  // Tìm dữ liệu dân tộc dựa trên id từ URL
  const ethnicData = data.find(item => item.id === id);

  if (!ethnicData) {
    return <div className="p-8 text-center text-xl text-red-600 font-bold">Không tìm thấy thông tin dân tộc!</div>;
  }

  // Khai báo các chuyên mục nội dung
  const sections = [
    { key: 'trang_phuc', title: 'Trang Phục' },
    { key: 'am_thuc', title: 'Ẩm Thực' },
    { key: 'phong_tuc', title: 'Phong Tục' },
    { key: 'chuyen_ke', title: 'Chuyện Kể' },
  ];

  return (
    <div className="min-h-screen bg-orange-50 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-primary text-white py-6 shadow-md mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center tracking-wide uppercase">
          {ethnicData.name}
        </h1>
      </header>

      {/* Main Layout */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-12">
          
          {/* Mascot Intro */}
          {ethnicData.mascot_intro && (
            <div className="bg-orange-100 rounded-2xl shadow-sm p-8 text-center">
              <p className="text-xl leading-relaxed text-gray-800 italic font-medium">
                "{ethnicData.mascot_intro}"
              </p>
            </div>
          )}

          {/* Storytelling */}
          {sections.map(section => (
            <section key={section.key} className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-primary">
              <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm">✦</span>
                {section.title}
              </h2>
              
              <div className="text-lg leading-relaxed text-gray-700 mb-8 whitespace-pre-wrap">
                {ethnicData.content[section.key]}
              </div>

              {/* Images Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(imgIndex => {
                  const imageName = ethnicData.images?.[section.key]?.[imgIndex - 1] || `${section.key}_${imgIndex}.jpg`;
                  return (
                    <OptionalImageCard 
                      key={imgIndex}
                      src={`/images/${id}/${imageName}`}
                      alt={`${section.title} ${imgIndex}`}
                    />
                  );
                })}
              </div>
            </section>
          ))}
          
        </div>
      </main>
    </div>
  );
};

export default EthnicDetail;
