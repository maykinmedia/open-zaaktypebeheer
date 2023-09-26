import { Routes, Route } from 'react-router-dom';
import { AuthProvider, RequireAuth, RequireNoAuth } from './components/Auth/Auth';
import BaseView from './views/BaseView';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView/DashboardView';
import ZaaktypeEditView from './views/ZaaktypeEditView';
import { ThemeProvider } from '@emotion/react';
import { theme } from './utils/theme';
import ReportComplete from './components/Snackbar/Snackbar';
import { SnackbarProvider } from 'notistack';
import ZaaktypeView from './views/ZaaktypenView';
import { ConfigProvider } from './components/Config/Config';

function App() {
  return (
    <ConfigProvider>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={1}
          Components={{
            success: ReportComplete,
            error: ReportComplete,
            unsavedChanges: ReportComplete,
          }}
        >
          <AuthProvider>
            <Routes>
              <Route element={<RequireAuth />}>
                <Route path="/" element={<BaseView />}>
                  <Route path="/" element={<DashboardView />} />
                  <Route path="/zaaktypen" element={<DashboardView />} />
                  <Route path="/zaaktypen/:zaaktypeUuid" element={<ZaaktypeView />} />
                  <Route path="/zaaktypen/:zaaktypeUuid/wijzigen" element={<ZaaktypeEditView />} />
                </Route>
              </Route>
              <Route element={<RequireNoAuth />}>
                <Route path="/login" element={<LoginView />} />
              </Route>
            </Routes>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
}

export default App;
