import React, { ReactElement, useState } from 'react';

import TypeWatch, { PurchaseType } from '../../types/Watch';

import { convertNumberInReadableStream, tax, shipping } from '../../shared/utiliesFunctions';

interface Props {
  purchase: PurchaseType,
}

export default function PurshaseItem({ purchase }: Props): ReactElement {
  const subtotal = () => {
    return purchase.watches.reduce((acc: number, watch: TypeWatch) => { return acc + (watch.price * watch.count) }, 0);
  }

  const taxTotal = () => {
    return (subtotal() * tax) / 100;
  }

  const total = () => Number((subtotal() + taxTotal() + shipping).toFixed(2));

  const getDate = () => {
    const optionsDate: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    const checkoutDate = new Date(purchase.time).toLocaleDateString('de-DE', optionsDate);

    const optionsTime: { hour: "2-digit", minute: "2-digit", second: "2-digit" } = { hour: "2-digit", minute: "2-digit", second: "2-digit" }
    const checkoutTime = new Date(purchase.time).toLocaleTimeString('de-De', optionsTime);

    return <p className="date">{checkoutDate} : <span>{checkoutTime}</span> Uhr</p>;
  }

  return (
    <div className="checkout-item">
      {getDate()}
      {
        purchase.watches.map((watch: TypeWatch) =>
          <div className="product" key={watch.id}>
            <div className="product-image">
              <img src={watch.images[0]} />
            </div>
            <div className="product-detail">
              <div className="title">
                <p>{watch.model}</p>
                <p>{watch.brand}</p>
              </div>
              <div className="bottom">
                <p>Stück: {watch.count}</p>
                <p>{convertNumberInReadableStream(watch.price * watch.count)} €</p>
              </div>
            </div>
          </div>
        )
      }
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
      </div>
    </div>
  )
}
