import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import data from '../data/data.json';

// Component fallback ảnh dành riêng cho danh sách
const ThumbnailWithFallback = ({ src, alt, fallbackText }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400 text-xs border-b border-gray-200 p-2">
        <svg className="w-6 h-6 mb-1 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <span className="text-center italic">{fallbackText}</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className="w-full h-full object-cover"
      onError={() => setError(true)}
    />
  );
};

const EthnicList = () => {
  return (
    <div className="min-h-screen bg-orange-50 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-primary text-white py-8 shadow-md mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center tracking-wide uppercase">
          Catalog 54 Dân Tộc Việt Nam
        </h1>
        <p className="text-center mt-3 text-orange-200 text-lg font-medium">Khám phá văn hóa, trang phục, phong tục và ẩm thực</p>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map(ethnic => (
            <Link 
              key={ethnic.id} 
              to={`/dan-toc/${ethnic.id}`}
              className="bg-white rounded-xl shadow hover:shadow-xl transition-shadow duration-300 overflow-hidden transform hover:-translate-y-1 border-b-4 border-secondary flex flex-col h-full"
            >
              {/* Thumbnail (Sử dụng ảnh mascot) */}
              <div className="w-full aspect-[4/3] bg-gray-50 flex items-center justify-center overflow-hidden">
                <ThumbnailWithFallback 
                  src={`/images/${ethnic.id}/mascot.png`}
                  alt={`Mascot ${ethnic.name}`}
                  fallbackText="Thiếu ảnh Mascot"
                />
              </div>
              
              {/* Info */}
              <div className="p-4 flex-grow flex flex-col items-center justify-center text-center">
                <h2 className="text-xl font-bold text-primary mb-1 uppercase tracking-wider">{ethnic.name}</h2>
                <div className="w-8 h-1 bg-secondary rounded-full mt-2"></div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default EthnicList;
