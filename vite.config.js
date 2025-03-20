import { defineConfig } from 'vite';

export default defineConfig({
  root: 'frontend',  // Đặt thư mục frontend làm thư mục gốc
  build: {
    outDir: '../dist', // Xuất file build ra ngoài thư mục gốc
    emptyOutDir: true  // Xóa thư mục cũ trước khi build
  }
});
