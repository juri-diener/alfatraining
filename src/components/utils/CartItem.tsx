import React, { ReactElement, useState } from 'react';

import TypeWatch from '../../types/Watch';

import { convertNumberInReadableStream } from '../../shared/utiliesFunctions';

interface Props {
  watch: TypeWatch,
  onChangeCartItemCount: (event: React.ChangeEvent<HTMLInputElement>, watch: TypeWatch) => void
}

export default function CartItem({ watch, onChangeCartItemCount }: Props): ReactElement {

  const [itemCount, setItemCount] = useState(watch.count);

  const onChangeCount = (event: React.ChangeEvent<HTMLInputElement>, watch: TypeWatch) => {
    setItemCount(Number(event.target.value));
    onChangeCartItemCount(event, watch)
  }

  return (
    <div className="product">
      <div className="product-image">
        <img src={watch.images[0]} />
      </div>
      <div className="product-detail">
        <div className="title">
          <p>{watch.model}</p>
          <p>{watch.brand}</p>
        </div>
        <div className="bottom">
          <input
            type="number"
            min="0"
            value={itemCount}
            onChange={(event) => onChangeCount(event, watch)} />
          <p>{convertNumberInReadableStream(watch.price * watch.count)} €</p>
        </div>
      </div>
    </div>
  )
}
