import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AssetLibraryPage from './pages/AssetLibraryPage';
import AssetDetailsPage from './pages/AssetDetailsPage';
import AdvancedSearchPage from './pages/AdvancedSearchPage';
import FolderManagementPage from './pages/FolderManagementPage';
import TagManagementPage from './pages/TagManagementPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUploadPage from './pages/admin/AdminUploadPage';
import AdminFilterCategoryPage from './pages/admin/AdminFilterCategoryPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import GroupManagementPage from './pages/admin/GroupManagementPage';
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
          <Route path="/search" element={<AdvancedSearchPage />} />
          <Route path="/folders" element={<FolderManagementPage />} />
          <Route path="/tags" element={<TagManagementPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/upload" element={<AdminUploadPage />} />
          <Route path="/admin/filters" element={<AdminFilterCategoryPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/groups" element={<GroupManagementPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;