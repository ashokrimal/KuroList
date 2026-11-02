import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { testFirestoreConnection } from './services/firebaseService.ts';

// Test Firestore connection on boot per Firebase integration requirements
testFirestoreConnection();

createRoot(document.getElementById('root')!).render(<App />);

