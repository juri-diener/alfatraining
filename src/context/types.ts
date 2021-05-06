import React from 'react';
import { isTypeReferenceNode } from 'typescript';

import TypeWatch, { AuthUser } from '../types/Watch';

export interface Store {
  cart: TypeWatch[],
  favourites: TypeWatch[],
  authUser?: AuthUser | null,
  message?: string
}

interface ChangeCartItemsCount {
  type: 'CHANGE_CART_ITEMS_COUNT',
  watch: TypeWatch
}

interface AddToCart {
  type: 'ADD_TO_CART',
  watch: TypeWatch
}

interface AddToFavourites {
  type: 'ADD_TO_FAVOURITES',
  watch: TypeWatch
}

interface RemoveFromFavourites {
  type: 'REMOVE_FROM_FAVOURITES',
  watch: TypeWatch
}

export interface LoginFailed {
  type: 'LOGIN_FAILED'
}

export interface LoginSuccess {
  type: 'LOGIN_SUCCESS',
  user: AuthUser
}

export interface ClearMessage {
  type: 'CLEAR_MESSAGE'
}

export interface CheckoutConfirmed {
  type: 'CHECKOUT_CONFIRMED'
}

export interface Logout {
  type: 'LOGOUT'
}

export interface SignupFailed {
  type: 'SIGNUP_FAILED'
  errorMsg: string
}

export type ActionsWatch = AddToCart | ChangeCartItemsCount | AddToFavourites | RemoveFromFavourites;
export type Actions =
  AddToCart |
  ChangeCartItemsCount |
  AddToFavourites |
  RemoveFromFavourites |
  LoginFailed |
  ClearMessage |
  LoginSuccess |
  CheckoutConfirmed |
  Logout |
  SignupFailed;