import React, { ReactElement, useState } from 'react';

import Body from './Body';
import HomeContent from './HomeContent';

import TypeWatch from '../types/Watch';

export default function Home(): ReactElement {
  const [showDetails, setShowDetails] = useState(false);
  const [showDetailsWatch, setShowDetailsWatch] = useState<TypeWatch>();

  return (
    <Body
      showDetails={showDetails}
      setShowDetails={setShowDetails}
      showDetailsWatch={showDetailsWatch}
      setShowDetailsWatch={setShowDetailsWatch}
    >
      < HomeContent
        setShowDetails={setShowDetails}
        setShowDetailsWatch={setShowDetailsWatch}
      />
    </Body>
  )
}
