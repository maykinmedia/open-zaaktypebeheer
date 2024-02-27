import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, RequireAuth, RequireNoAuth, useAuth } from './components/Auth/Auth';
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
import { A, Button, Navbar } from '@maykin-ui/admin-ui/components';
import { NavigationContext } from '@maykin-ui/admin-ui/contexts';
import { getSiteTree } from './utils/siteTree.tsx';

/**
 * Create the navigation
 */
function Nav() {
  const auth = useAuth();
  const navigate = useNavigate();
  const siteTreeOptions = getSiteTree(navigate, auth);

  return (
    <Navbar>
      {siteTreeOptions.map(({ href, Icon, label, onClick }) => {
        return href ? (
          <A key={label} href={href} onClick={onClick}>
            {Icon}
            {label}
          </A>
        ) : (
          <Button key={label} onClick={onClick}>
            {Icon}
            {label}
          </Button>
        );
      })}
    </Navbar>
  );
}

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
            <NavigationContext.Provider value={{ primaryNavigation: <Nav /> }}>
              <Routes>
                <Route element={<RequireAuth />}>
                  <Route path="/" element={<DashboardView />} />
                  <Route path="/zaaktypen" element={<DashboardView />} />

                  <Route path="/" element={<BaseView />}>
                    <Route path="/zaaktypen/:zaaktypeUuid" element={<ZaaktypeView />} />
                    <Route
                      path="/zaaktypen/:zaaktypeUuid/wijzigen"
                      element={<ZaaktypeEditView />}
                    />
                  </Route>
                </Route>

                <Route element={<RequireNoAuth />}>
                  <Route path="/login" element={<LoginView />} />
                </Route>
              </Routes>
            </NavigationContext.Provider>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
}

export default App;
