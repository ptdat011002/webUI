import { ModalProvider } from '@packages/react-modal';
import { allRoutes } from 'configs/router';
import { GlobalProvider } from 'modules/_shared';
import { ThemeProvider } from 'modules/_shared/providers';
import { AuthProvider } from 'modules/auth/providers';
import React, { Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'configs/i18next';
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import { setupMockAdapter } from 'configs/fetchers/mock-api';
import { MediaProvider } from 'modules/_shared/providers/MediaProvider';

setupMockAdapter();

function App() {
  const router = createBrowserRouter(allRoutes as RouteObject[]);

  return (
    <React.Fragment>
      <MediaProvider>
        <ThemeProvider>
          <I18nextProvider i18n={i18n} defaultNS={'translation'}>
            <Suspense>
              <ModalProvider>
                <GlobalProvider>
                  <AuthProvider>
                    <RouterProvider router={router} />
                  </AuthProvider>
                </GlobalProvider>
              </ModalProvider>
            </Suspense>
          </I18nextProvider>
        </ThemeProvider>
      </MediaProvider>
    </React.Fragment>
  );
}

export default App;
