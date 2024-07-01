import { CustomThemeProvider } from '@repo/ui';
import { createRoot } from 'react-dom/client';
import App from './app';

createRoot(document.getElementById('root')!).render(
  <CustomThemeProvider>
    <App />
  </CustomThemeProvider>,
);
