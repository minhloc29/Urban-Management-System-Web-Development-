import { createRoot } from 'react-dom/client';
// import './index.css'
// project imports
import App from 'App';
import * as serviceWorker from 'serviceWorker';
import reportWebVitals from 'reportWebVitals';
import { ConfigProvider } from 'contexts/ConfigContext';
import { AuthProvider } from './contexts/AuthContext';
// style + assets
import 'assets/scss/style.scss';

// google-fonts
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/700.css';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

// ==============================|| REACT DOM RENDER ||============================== //

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <AuthProvider>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </AuthProvider>
);

serviceWorker.unregister();


reportWebVitals();
