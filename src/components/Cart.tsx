import React, { ReactElement, useState } from 'react'
import Body from './Body'
import CartContent from './CartContent';

export default function Cart(): ReactElement {
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  return (
    <Body setShowAuthPopup={setShowAuthPopup} showAuthPopup={showAuthPopup}>
      {/* {setter => <CartContent setter={setter} />}
      Liefert eine function die aufgerufen wird und ein Parameter zurückgibt, und JSX CartContent rendert
      */}
      <CartContent setShowAuthPopup={setShowAuthPopup} />
    </Body>
  )
}
