import React, { ReactElement, useCallback, useEffect, useState } from 'react';

import { useStore } from '../../hooks/useStore';
import {
  addToFavourites,
  removeFromFavourites,
  addToCart
} from '../../context/actions';
import TypeWatch from '../../types/Watch';

interface Props {
  watch: TypeWatch;
  setShowDetails?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDetailsWatch?: React.Dispatch<React.SetStateAction<TypeWatch | undefined>>;
}

export default function Watch({ watch, setShowDetails, setShowDetailsWatch }: Props): ReactElement {

  const [isActiveFavourite, setIsActiveFavourite] = useState(false);
  const { store, dispatch } = useStore();


  const isWatchInfavourites = useCallback((watchID: string) => {
    return store.favourites.find((_watch) => _watch.id === watchID);
  }, [store.favourites]);


  useEffect(() => {
    if (isWatchInfavourites(watch.id)) {
      setIsActiveFavourite(true);
    } else {
      setIsActiveFavourite(false);
    }
  }, [isWatchInfavourites, watch.id]);


  const onAddToFavourites = (watch: TypeWatch) => {
    if (!isWatchInfavourites(watch.id)) {
      addToFavourites(watch, dispatch);
      setIsActiveFavourite(true);
    } else {
      removeFromFavourites(watch, dispatch);
      setIsActiveFavourite(false)
    }
  }

  const onAddTocart = (watch: TypeWatch) => {
    addToCart(watch, dispatch);
  }

  return (
    <div className="watch">
      <div className="watch-img" onClick={() => {
        setShowDetails && setShowDetails(true)
        setShowDetailsWatch && setShowDetailsWatch(watch)
      }}>
        <img src={watch.images[0]} />
      </div>
      <div className="watch-detail">
        <div className="label">
          <div>
            <p>{watch.brand}</p>
            <p>{watch.model}</p>
          </div>
          <div>
            <span
              className={isActiveFavourite ? "favourite favour" : "favourite"}
              onClick={() => onAddToFavourites(watch)}>
            </span>
          </div>
        </div>
        <div className="info">
          <button className="cart" onClick={() => onAddTocart(watch)}>In den Warenkorb</button>
          <p>{watch.price} €</p>
        </div>
      </div>
    </div>
  )
}
