import { Store, Actions, ActionsWatch, LoginFailed, ClearMessage } from './types';

// const checkForDuplication = (store: Store, action: Exclude<Actions, LoginFailed | ClearMessage>, operation: string) => {
const checkForDuplication = (store: Store, action: ActionsWatch, operation: string) => {
  let watches = [];
  if (store.cart.find((_watch) => _watch.id === action.watch.id)) {
    watches = store.cart.map((_watch) => {
      const copyBook = { ..._watch }
      if (_watch.id === action.watch.id) {
        if (operation === 'add') {
          copyBook.count += 1;
        }
        if (operation === 'remove') {
          if (copyBook.count > 0) {
            copyBook.count -= 1;
          }
        }
        if (operation === 'change') {
          copyBook.count = action.watch.count;
        }
      }
      return copyBook;
    })
  }
  else {
    watches = [...store.cart, { ...action.watch, count: 1 }]
  }
  return watches.filter((_watch) => _watch.count > 0);
}

export default function reducer(store: Store, action: Actions): Store {
  switch (action.type) {
    case 'ADD_TO_FAVOURITES': {
      return {
        ...store,
        favourites: [
          ...store.favourites,
          action.watch
        ]
      }
    }
    case 'REMOVE_FROM_FAVOURITES': {
      return {
        ...store,
        favourites: [
          ...store.favourites.filter((_watch) => _watch.id != action.watch.id)
        ]
      }
    }
    case 'ADD_TO_CART': {
      const watches = checkForDuplication(store, action, 'add');
      return {
        ...store,
        cart: watches
      }
    }
    case 'CHANGE_CART_ITEMS_COUNT': {
      const watches = checkForDuplication(store, action, 'change');
      return {
        ...store,
        cart: watches
      }
    }
    case 'LOGIN_FAILED': {
      return {
        ...store,
        message: "Falsche Zugangsdaten"
      }
    }
    case 'LOGIN_SUCCESS': {
      return {
        ...store,
        authUser: action.user
      }
    }
    case 'CLEAR_MESSAGE': {
      return {
        ...store,
        message: ''
      }
    }
    case 'CHECKOUT_CONFIRMED': {
      return {
        ...store,
        cart: [],
        message: 'Vielen Dank für Ihren Einkauf.'
      }
    }
    case 'LOGOUT': {
      return {
        ...store,
        authUser: null
      }
    }
    case 'SIGNUP_FAILED': {
      return {
        ...store,
        message: action.errorMsg
      }
    }

    default:
      return {
        ...store
      }
  }
}