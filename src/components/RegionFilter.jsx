import React from 'react';

const REGIONS = ['Tất cả', 'Tây Bắc Bộ', 'Đông Bắc Bộ & ĐB Sông Hồng', 'Bắc Trung Bộ & Duyên hải miền Trung', 'Tây Nguyên', 'Tây Nam Bộ & Các dân tộc có dân số cực ít'];

const RegionFilter = ({ selectedRegion, onSelectRegion }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-4 border-t border-primary/10">
      {REGIONS.map((region) => (
        <button
          key={region}
          onClick={() => onSelectRegion(region)}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            selectedRegion === region 
            ? 'bg-primary text-white shadow-md' 
            : 'bg-bg-site/50 border border-primary/10 hover:bg-primary/5 text-text-muted'
          }`}
        >
          {region}
        </button>
      ))}
    </div>
  );
};

export default RegionFilter;
