import React from 'react';

import { watchApi } from '../shared/watchApi';
import { Actions } from './types';
import TypeWatch, { PurchaseType, User, AuthUser } from '../types/Watch';

export const addToFavourites = (watch: TypeWatch, dispatch: React.Dispatch<Actions>): void => {
  dispatch({ type: 'ADD_TO_FAVOURITES', watch });
}

export const removeFromFavourites = (watch: TypeWatch, dispatch: React.Dispatch<Actions>): void => {
  dispatch({ type: 'REMOVE_FROM_FAVOURITES', watch });
}

export const addToCart = (watch: TypeWatch, dispatch: React.Dispatch<Actions>): void => {
  dispatch({ type: 'ADD_TO_CART', watch });
}

export const changeCartItemsCount = (watch: TypeWatch, dispatch: React.Dispatch<Actions>): void => {
  dispatch({ type: 'CHANGE_CART_ITEMS_COUNT', watch });
}

export const clearMessage = (dispatch: React.Dispatch<Actions>): void => {
  dispatch({ type: 'CLEAR_MESSAGE' });
}

export const login = (email: string, password: string, dispatch: React.Dispatch<Actions>, callback: () => void): void => {
  clearMessage(dispatch);
  watchApi<User[]>('GET', '/users', (data) => {
    data.map((user) => {
      if (user.email === email && user.password === password) {
        dispatch({ type: 'LOGIN_SUCCESS', user: { email, auth: true } });
        callback();
      }
      else {
        dispatch({ type: 'LOGIN_FAILED' });
      }
    });

  });
}

export const signup = (email: string, password: string, dispatch: React.Dispatch<Actions>, callback: () => void): void => {
  clearMessage(dispatch);
  watchApi<User[]>('GET', '/users', (data) => {
    if (data.find((user) => user.email == email)) {
      dispatch({ type: 'SIGNUP_FAILED', errorMsg: 'Email bereits vorhanden' });
      return;
    }
    watchApi<User>('POST', '/users', () => {
      callback();
      dispatch({ type: 'LOGIN_SUCCESS', user: { email, auth: true } });
    }, { email, password, role: 'user' }
    );
  });
}

export const logout = (dispatch: React.Dispatch<Actions>): void => {
  dispatch({ type: 'LOGOUT' });
}

export const checkoutConfirmed = (cart: TypeWatch[], dispatch: React.Dispatch<Actions>, user: AuthUser): void => {
  const date = Date.now();
  const cartForDB = {
    watches: cart,
    email: user.email,
    time: date
  }
  watchApi<PurchaseType>('POST', '/purchases', () => dispatch({ type: 'CHECKOUT_CONFIRMED' }), cartForDB);
}