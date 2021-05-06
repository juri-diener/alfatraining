import React, { ReactElement } from 'react';

import { useStore } from '../../hooks/useStore';
import Watch from '../../components/utils/Watch';

interface Props {
  showFavouritesPopup: boolean,
  setShowFavouritesPopup: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Favourites({ showFavouritesPopup, setShowFavouritesPopup }: Props): ReactElement {

  const { store, dispatch } = useStore();

  return (
    <div className={showFavouritesPopup ? "favourites-popup visible" : "favourites-popup"}>
      <div className="favourites">
        {store.favourites.map((watch) => <Watch key={watch.id} watch={watch} />)}
        {store.favourites.length === 0 &&
          <>
            <p className="empty">Deine Favouriten Liste ist leer.</p>
            <p>Du kannst über das Herz Icon deine Favouriten setzen.</p>
          </>
        }
      </div>
      <p className="close-fav" onClick={() => setShowFavouritesPopup(false)}>Close</p>
    </div>
  )
}
