import React, {
  createContext,
  Dispatch,
  ReactElement,
  useEffect,
  useReducer,
} from 'react';

import { Actions, Store } from './types';
import reducer from './reducer';

export interface ContextProps {
  store: Store,
  dispatch: Dispatch<Actions>
}

interface Props {
  children: ReactElement
  store?: Store
}

export const initialStore: Store = {
  cart: [],
  favourites: [],
}

export const StoreContext = createContext({} as ContextProps);

export const StoreProvider = (props: Props): ReactElement => {
  const localStore = window.localStorage.getItem('store')
    ? JSON.parse(window.localStorage.getItem('store') as string)
    : undefined;

  const [store, dispatch] = useReducer(reducer, props.store || localStore || initialStore);

  useEffect(() => {
    localStorage.setItem('store', JSON.stringify(store));
  }, [store])

  return (
    <StoreContext.Provider value={{ store, dispatch }}>
      {props.children}
    </StoreContext.Provider>
  )
}