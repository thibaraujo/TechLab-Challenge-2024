import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { ThemeProvider } from '@emotion/react';
import { darkTheme, lightTheme, MaterialUISwitch} from './themes/default.js';
import { Router } from './Router.js';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthenticationProvider } from './contexts/AuthenticationContext.js';
import { useState } from "react";

const queryClient = new QueryClient()

export function App() {
  const [light, setLight] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      
      <ThemeProvider theme={light ? lightTheme : darkTheme}>
        
        <CssBaseline />
        <AuthenticationProvider>
          <MaterialUISwitch checked={light} onChange={() => setLight(prev => !prev)}/>
          <Router />
        </AuthenticationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
