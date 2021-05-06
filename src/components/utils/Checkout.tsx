import React, { Dispatch, ReactElement, SetStateAction } from 'react'
import { useStore } from '../../hooks/useStore';
import { convertNumberInReadableStream, tax, shipping } from '../../shared/utiliesFunctions';

import { clearMessage } from '../../context/actions';

interface Props {
  setShowAuthPopup: Dispatch<SetStateAction<boolean>>
  buyWatches: () => void
}

export default function Checkout({ setShowAuthPopup, buyWatches }: Props): ReactElement {
  const { store, dispatch } = useStore();

  const subtotal = () => {
    return store.cart.reduce((acc, watch) => { return acc + (watch.price * watch.count) }, 0);
  }

  const taxTotal = () => {
    return (subtotal() * tax) / 100;
  }

  const total = () => Number((subtotal() + taxTotal() + shipping).toFixed(2));

  const isAuth = () => {
    clearMessage(dispatch);
    if (!store.authUser) {
      setShowAuthPopup(true)
    } else {
      buyWatches();
    }
  }

  return (
    <div className="checkout">
      <div className="top-row">
        <p>Zwischensumme</p>
        <p>{convertNumberInReadableStream(subtotal())} €</p>
      </div>
      <div className="top-row">
        <p>Steuer</p>
        <p>{convertNumberInReadableStream(taxTotal())} €</p>
      </div>
      <div className="top-row">
        <p>Versand</p>
        <p>{shipping}  €</p>
      </div>
      <div className="top-row">
        <p></p>
        <p>{convertNumberInReadableStream(total())} €</p>
      </div>
      <button onClick={isAuth}>Kaufen</button>
    </div>
  )
}
