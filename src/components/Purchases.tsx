import React, { ReactElement } from 'react';

import Body from './Body';
import PurchasesContent from './PurchasesContent'

export default function Purchases(): ReactElement {
  return (
    <Body>
      <PurchasesContent />
    </Body>
  )
}
