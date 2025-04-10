import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

// Get the Git commit hash
const getCommitHash = (): string => {
  try {
    console.error('fetching Git commit hash:');
    // Lấy commit ID (hash)
    const commitId = execSync("git rev-parse --short HEAD").toString().trim();

    // Lấy ngày commit
    const commitDate = execSync("git log -1 --format=%cd --date=format:'%Y%m%d'").toString().trim();

    return `${commitId}.${commitDate}`;
    // return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (error) {
    console.error('Error fetching Git commit hash:', error);
    return 'unknown';
  }
};

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [react(), nodePolyfills()],
    define: {
      'import.meta.env.VITE_COMMIT_HASH': JSON.stringify(getCommitHash()), // Pass the commit hash
    },
    resolve: {
      alias: [
        {
          find: /^(components|configs|types|modules|assets|helpers|hooks|pages|providers|libs|locales|icons)([^]*)/, // Sử dụng regex để tìm các đường dẫn bắt đầu bằng '/components/'
          replacement: '/src/$1$2', // Thay thế bằng đường dẫn tương ứng trong thư mục /src/components/
        },
      ],
    },
    server: {
      https: {
        key: readFileSync('./.cert/key.pem'),
        cert: readFileSync('./.cert/cert.pem'),
      },
      proxy: {
        '/API': {
          target: env['VITE_APP_API_URL'] || '',
          changeOrigin: true,
          secure: false,
        },
        '/video.mp4': {
          target: env.VITE_APP_VIDEO_URL || '',
          changeOrigin: true,
          secure: false,
        },
        '/upload.ipc': {
          target: env.VITE_APP_API_URL || '',
          changeOrigin: true,
          secure: false,
        },
        '/download.ipc': {
          target: env.VITE_APP_API_URL || '',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });
};
