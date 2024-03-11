import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './components/Auth/Auth';
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

const router = createBrowserRouter([
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/',
        element: <BaseView />,
        children: [
          {
            path: '/zaaktypen/',
            element: <Outlet />,
            handle: {
              labelTemplate: 'Zaaktypen',
            },
            children: [
              {
                path: '',
                element: <DashboardView />,
              },
              {
                path: ':zaaktypeUuid',
                element: <ZaaktypeView />,
                handle: {
                  labelTemplate: 'Zaaktype ({zaaktypeUuid})',
                },
              },
              {
                path: '/zaaktypen/:zaaktypeUuid/wijzigen',
                element: <ZaaktypeEditView />,
                handle: {
                  labelTemplate: 'Zaaktype bewerken ({zaaktypeUuid})',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  { path: '/login', element: <LoginView /> },
]);

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
            <RouterProvider router={router}></RouterProvider>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
}

export default App;
