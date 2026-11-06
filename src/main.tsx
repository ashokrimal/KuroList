import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { testFirestoreConnection } from './services/firebaseService.ts';

import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker with auto-update
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[KuroList SW] New version available, reloading...');
  },
  onOfflineReady() {
    console.log('[KuroList SW] App cached & ready to work offline');
  },
});

// Test Firestore connection on boot per Firebase integration requirements
testFirestoreConnection();

createRoot(document.getElementById('root')!).render(<App />);

