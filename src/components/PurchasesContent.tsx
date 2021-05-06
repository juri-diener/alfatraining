import React, { ReactElement, useEffect, useState } from 'react'
import { watchApi } from '../shared/watchApi';
import Hero from './utils/Hero'

import { useStore } from '../hooks/useStore';
import PurchaseItem from './utils/PurshaseItem';

import { PurchaseType } from '../types/Watch';

export default function PurchasesContent(): ReactElement {
  const [purchases, setPurchases] = useState<PurchaseType[]>();

  const { store } = useStore();

  useEffect(() => {
    watchApi<PurchaseType[]>('GET', '/purchases', (data) => {
      setPurchases(data.filter((user) => user.email === store.authUser?.email))
    });
  }, [store.authUser?.email]);

  if (!purchases) return <p>Lade...</p>

  return (
    <>
      <Hero slider={true} />
      <section className="content">
        <div className="center">
          <h1>Meine Käufe</h1>
          <div className="checkout-wrapper">
            {purchases.map((purchase: PurchaseType) => <PurchaseItem key={purchase.time} purchase={purchase} />).reverse()}
          </div>
        </div>
      </section>
    </>
  )
}
