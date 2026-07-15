import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createGitHubClient, commitChanges } from '../services/githubApi';
import originalData from '../data/data2.json';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('github_pat') || '');
  const [isLogged, setIsLogged] = useState(!!token);
  
  // Toàn bộ data dân tộc trong phiên làm việc
  const [ethnicData, setEthnicData] = useState(originalData);
  
  // Lưu trữ các file ảnh chờ được đẩy lên Github
  // Format: { path: "public/images/xinh-mun/mascot.png", content: "base64...", isBase64: true }
  const [pendingFiles, setPendingFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [isPublishing, setIsPublishing] = useState(false);

  // Hàm tiện ích: Lưu Token
  const login = (newToken) => {
    localStorage.setItem('github_pat', newToken);
    setToken(newToken);
    setIsLogged(true);
    toast.success('Đã lưu Token');
  };

  const logout = () => {
    localStorage.removeItem('github_pat');
    setToken('');
    setIsLogged(false);
    toast.success('Đã đăng xuất Admin');
  };

  // Cập nhật text của một dân tộc
  const updateEthnicText = (id, section, newText) => {
    setEthnicData(prev => prev.map(item => {
      if (item.id === id) {
        if (section === 'name' || section === 'mascot_intro') {
          return { ...item, [section]: newText };
        } else {
          return { ...item, content: { ...item.content, [section]: newText } };
        }
      }
      return item;
    }));
    toast.success('Đã ghi nhận thay đổi Text');
  };

  // Thêm ảnh vào hàng chờ
  const addPendingImage = (id, category, index, fileBase64, extension) => {
    let fileName = '';
    if (category === 'mascot') {
      fileName = `mascot.${extension}`;
    } else {
      fileName = `${category}_${index}.${extension}`;
    }
    const path = `public/images/${id}/${fileName}`;
    
    // Cập nhật data.json để lưu chính xác tên file ảnh
    setEthnicData(prev => prev.map(item => {
      if (item.id === id) {
        const newImages = { ...(item.images || {}) };
        if (category === 'mascot') {
          newImages.mascot = fileName;
        } else {
          const arr = newImages[category] ? [...newImages[category]] : [];
          arr[index - 1] = fileName; // index là 1, 2, 3
          newImages[category] = arr;
        }
        return { ...item, images: newImages };
      }
      return item;
    }));

    // Thêm vào hàng chờ file (Lọc bỏ meta data của base64 "data:image/png;base64,...")
    const base64Content = fileBase64.split(',')[1];
    
    setPendingFiles(prev => {
      const filtered = prev.filter(f => f.path !== path); // ghi đè nếu upload lại
      return [...filtered, { path, content: base64Content, isBase64: true }];
    });
    
    toast.success('Đã ghi nhận Hình ảnh');
  };

  // Thêm dân tộc mới
  const addEthnic = (newEthnic) => {
    setEthnicData(prev => [...prev, newEthnic]);
    toast.success('Đã thêm dân tộc mới vào bộ nhớ tạm');
  };

  // Xóa dân tộc
  const deleteEthnic = (id) => {
    setEthnicData(prev => prev.filter(item => item.id !== id));
    // Lưu ý: Việc xóa thư mục trên Github Tree API hơi phức tạp (phải lấy danh sách file). 
    // Tạm thời chỉ đánh dấu xóa trong data.json, thư mục ảnh nếu để lại cũng không ảnh hưởng giao diện.
    // Nếu muốn xóa sạch file ảnh, ta phải liệt kê tất cả file có tiền tố path là public/images/{id}/...
    toast.success('Đã xóa dân tộc khỏi giao diện (Cần Publish để cập nhật Github)');
  };

  // Tính tổng thay đổi
  const totalChanges = () => {
    // Để đơn giản, mỗi lần ấn "Lưu" ta mặc định sẽ ghi đè toàn bộ data.json.
    // Nên totalChanges = số file ảnh + 1 file data
    return pendingFiles.length + (JSON.stringify(ethnicData) !== JSON.stringify(originalData) ? 1 : 0);
  };

  // Thực thi Batch Commit
  const publishChanges = async () => {
    if (isPublishing) return;
    if (!token) {
      toast.error('Bạn cần nhập Github Token!');
      return;
    }
    
    const changesCount = totalChanges();
    if (changesCount === 0) {
      toast('Không có thay đổi nào để publish!', { icon: 'ℹ️' });
      return;
    }

    const loadingToast = toast.loading('Đang gom dữ liệu và gửi lên Github...');
    setIsPublishing(true);
    
    try {
      const octokit = createGitHubClient(token);
      
      // Tạo cục mảng files cho Tree API
      const filesToCommit = [...pendingFiles];
      
      // Thêm data.json
      if (JSON.stringify(ethnicData) !== JSON.stringify(originalData)) {
        filesToCommit.push({
          path: 'src/data/data2.json',
          content: JSON.stringify(ethnicData, null, 2),
          isBase64: false
        });
      }

      // Xử lý các file cần xóa (nếu có bổ sung logic xóa file sau này)
      deletedFiles.forEach(path => {
        filesToCommit.push({ path, isDelete: true });
      });

      await commitChanges(
        octokit,
        'Nodaco35', // Owner
        'mln131-dan-toc-vn', // Repo
        'main', // Branch
        filesToCommit,
        'Admin: Update ethnic data and images via Admin Panel'
      );

      toast.success('Publish thành công! Vercel đang bắt đầu build lại.', { id: loadingToast });
      
      // Reset hàng chờ
      setPendingFiles([]);
      setDeletedFiles([]);
      // Reload lại trang để có thể fetch data mới từ gốc nếu cần, hoặc giữ nguyên
      
    } catch (error) {
      console.error(error);
      toast.error('Publish thất bại: ' + error.message, { id: loadingToast });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <AdminContext.Provider value={{
      token, isLogged, login, logout,
      ethnicData, updateEthnicText, addPendingImage, addEthnic, deleteEthnic,
      pendingFiles, totalChanges, publishChanges, isPublishing
    }}>
      {children}
    </AdminContext.Provider>
  );
};
