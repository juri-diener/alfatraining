import React, { useContext } from 'react';

import { ContextProps, StoreContext } from '../context/MyContext';

export const useStore = (): ContextProps => {
  return useContext(StoreContext)
}