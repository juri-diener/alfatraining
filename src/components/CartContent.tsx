import React, { Dispatch, ReactElement, SetStateAction, useEffect } from 'react'
import Hero from './utils/Hero';
import CartItem from './utils/CartItem';
import { useStore } from '../hooks/useStore';

import {
  changeCartItemsCount,
  checkoutConfirmed,
  clearMessage
} from '../context/actions';

import TypeWatch from '../types/Watch';
import Checkout from './utils/Checkout';

interface Props {
  setShowAuthPopup: Dispatch<SetStateAction<boolean>>
}

export default function CartContent({ setShowAuthPopup }: Props): ReactElement {
  const { store, dispatch } = useStore();

  useEffect(() => {
    clearMessage(dispatch);
  }, [dispatch])

  const onChangeCartItemCount = (event: React.ChangeEvent<HTMLInputElement>, watch: TypeWatch) => {
    const itemVal = Number(event.target.value);
    changeCartItemsCount({ ...watch, count: itemVal }, dispatch);
  }

  const buyWatches = () => {
    if (store.authUser) {

      checkoutConfirmed(store.cart, dispatch, store.authUser);
    }
  }

  return (
    <>
      <Hero slider={true} />
      <section className="content">
        <div className="center">

          <h1>Warenkorb</h1>
          <div className="cart-wrapper">
            <div className="cart-items">

              {
                store.cart.map((watch) =>
                  <CartItem
                    key={watch.id}
                    watch={watch}
                    onChangeCartItemCount={onChangeCartItemCount}
                  />
                )
              }

              {store.cart.length > 0 && <Checkout setShowAuthPopup={setShowAuthPopup} buyWatches={buyWatches} />}
              {store.cart.length === 0 && !store.message && <p>Ihr Warenkorb ist leer.</p>}
              {store.cart.length === 0 && store.message && <p>{store.message}</p>}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
