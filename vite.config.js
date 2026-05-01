import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
    hmr: {
      clientPort: 3000,
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }
          // Recharts (maior lib)
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3') || id.includes('node_modules/victory')) {
            return 'vendor-charts';
          }
          // Lucide icons
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // Páginas cliente (crédito/pessoal)
          if (
            id.includes('pages/Credito') ||
            id.includes('pages/Reequilibrio') ||
            id.includes('pages/Educacao') ||
            id.includes('pages/Perfil')
          ) {
            return 'pages-cliente';
          }
          // Páginas operacional
          if (
            id.includes('pages/Esteira') ||
            id.includes('pages/Compliance') ||
            id.includes('pages/Financeiro')
          ) {
            return 'pages-operacional';
          }
          // Páginas gestão
          if (
            id.includes('pages/Corban') ||
            id.includes('pages/Produtividade') ||
            id.includes('pages/Seguranca') ||
            id.includes('pages/Campanhas') ||
            id.includes('pages/Seguros') ||
            id.includes('pages/Produtos')
          ) {
            return 'pages-gestao';
          }
          // Dashboards
          if (
            id.includes('pages/Dashboard') ||
            id.includes('pages/DashboardAdmin') ||
            id.includes('pages/DashboardFuncionario')
          ) {
            return 'pages-dashboards';
          }
        },
      },
    },
  },
})
