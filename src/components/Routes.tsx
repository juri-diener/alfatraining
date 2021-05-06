import React, { ReactElement, } from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import Cart from './Cart';
import Purchases from './Purchases';

export default function Routes(): ReactElement {
  return (
    <Switch>
      <Route path="/purshases">
        <Purchases />
      </Route>
      <Route path="/cart">
        <Cart />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  )
}
