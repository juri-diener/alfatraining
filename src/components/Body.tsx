import React, { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react';

import Header from './utils/Header';
import Footer from './utils/Footer';
import Favourites from './utils/Favourites';
import Auth from './utils/Auth';
import Details from './utils/Details';
import TypeWatch from '../types/Watch';

interface Props {
  children?: ReactElement;
  showAuthPopup?: boolean;
  setShowAuthPopup?: Dispatch<SetStateAction<boolean>>;
  setShowDetails?: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails?: boolean;
  setShowDetailsWatch?: React.Dispatch<React.SetStateAction<TypeWatch | undefined>>;
  showDetailsWatch?: TypeWatch | undefined;
}

export default function Body({
  children,
  showAuthPopup,
  setShowAuthPopup,
  setShowDetails,
  showDetails,
  setShowDetailsWatch,
  showDetailsWatch
}: Props): ReactElement {
  const [showFavouritesPopup, setShowFavouritesPopup] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const fixHeader = () => {
    if (window.scrollY > 150) {
      // if (!scrolled) {
      setScrolled(true);
      // }
    } else {
      // if (scrolled) {
      setScrolled(false)
      // }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', fixHeader)
    return () => {
      window.removeEventListener('scroll', fixHeader)
    }
  }, [])

  const onClickShowfavourites = () => {
    setShowFavouritesPopup(!showFavouritesPopup);
  }

  return (
    <>
      <Header onClickShowfavourites={onClickShowfavourites} scrolled={scrolled} />
      <main>
        {/* {children(setShowAuthpopup)} */}
        {children}
      </main>
      <Footer />
      <Favourites showFavouritesPopup={showFavouritesPopup} setShowFavouritesPopup={setShowFavouritesPopup} />
      <Auth setShowAuthPopup={setShowAuthPopup} showAuthPopup={showAuthPopup} />
      {showDetails && <Details
        setShowDetails={setShowDetails}
        showDetails={showDetails}
        setShowDetailsWatch={setShowDetailsWatch}
        watch={showDetailsWatch}
      />}
    </>
  )
}
