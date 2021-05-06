import React, { ReactElement } from 'react';
import { useHistory } from 'react-router-dom';

import { useStore } from '../../hooks/useStore';

import { logout } from '../../context/actions';

interface Props {
  onClickShowfavourites: () => void,
  scrolled: boolean
}

export default function Header({ onClickShowfavourites, scrolled }: Props): ReactElement {
  const { store, dispatch } = useStore();
  const history = useHistory();

  const onLogout = () => {
    logout(dispatch);
    history.push('/');
  }

  return (
    <header className={scrolled ? "scrolled" : ""}>
      <div className="center">
        <div className="wrapper">
          <div className="logo">
            <a href="/">
              <img src="images/logo-white.png" />
            </a>
          </div>
          <div className="menu">
            {store.authUser && <>
              <a id="logout" onClick={onLogout}>Logout</a>
              <a id="checkout" onClick={() => history.push('/purshases')}>Mein Käufe</a>
            </>}
          </div>
          <div className="nav-items">
            <a href="/cart">
              <span
                className="cart-icon"
                data-length={store.cart.length}
                onClick={() => history.push('/cart')}
              ></span>
            </a>
            <span
              className={store.favourites.length > 0 ? "favourite-icon has" : "favourite-icon"}
              onClick={onClickShowfavourites}
              data-length={store.favourites.length}
            ></span>
          </div>
        </div>
      </div>
    </header>
  )
}
