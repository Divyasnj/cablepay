import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes/router';

const CLIENT_ID = '84183438711-5f99ons606cd4t60q2718g0s49idr8sm.apps.googleusercontent.com'; // 🔁 Paste the actual client ID

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <RouterProvider router={router} />
     
    </GoogleOAuthProvider>
  </StrictMode>
);
