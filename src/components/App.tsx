import React, { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

// COMPONENTS IMPORT
import Routes from './Routes';
import { StoreProvider } from '../context/MyContext';

export default function App(): ReactElement {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </StoreProvider>
  );
}