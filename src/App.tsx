import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AssetLibraryPage from './pages/AssetLibraryPage';
import AssetDetailsPage from './pages/AssetDetailsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUploadPage from './pages/admin/AdminUploadPage';
import AdminFilterCategoryPage from './pages/admin/AdminFilterCategoryPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assets" element={<AssetLibraryPage />} />
          <Route path="/assets/:assetId" element={<AssetDetailsPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/upload" element={<AdminUploadPage />} />
          <Route path="/admin/filters" element={<AdminFilterCategoryPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;