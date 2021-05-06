import React, { ReactElement } from 'react';
import TypeWatch from '../../types/Watch';

import DetailSlider from './DetailSlider';

interface Props {
  setShowDetails?: React.Dispatch<React.SetStateAction<boolean>>;
  showDetails?: boolean;
  setShowDetailsWatch?: React.Dispatch<React.SetStateAction<TypeWatch | undefined>>;
  watch?: TypeWatch | undefined;
}

export default function Details({
  setShowDetails,
  showDetails,
  setShowDetailsWatch,
  watch
}: Props): ReactElement {
  if (!watch) return <p>Somethin went wrong</p>;
  return (
    <div className="detail-popup">
      <span className="close" onClick={() => {
        setShowDetails && setShowDetails(false);
        setShowDetailsWatch && setShowDetailsWatch({} as TypeWatch)
      }}>X</span>
      <div className="detail-container">
        <DetailSlider watch={watch} />
        <div className="details">
          <h2>Produktdetails</h2>
          <div className="rows">
            { }
            <div className="row">
              <p>Marke:</p>
              <p>{watch.brand}</p>
            </div>
            <div className="row">
              <p>Modell:</p>
              <p>{watch.model}</p>
            </div>
            <div className="row">
              <p>Typ:</p>
              <p>{watch.type}</p>
            </div>
            <div className="row">
              <p>Jahr:</p>
              <p>{watch.year}</p>
            </div>
            <div className="row">
              <p>Gehäuse:</p>
              <p>{watch.case}</p>
            </div>
            <div className="row">
              <p>Armband:</p>
              <p>{watch.bracelet}</p>
            </div>
            <div className="row">
              <p>Uhrwerk:</p>
              <p>{watch.clockwork}</p>
            </div>
            <div className="row">
              <p>Ziffernblatt:</p>
              <p>{watch.dial}</p>
            </div>
            <div className="row">
              <p>Glas:</p>
              <p>{watch.glass}</p>
            </div>
            <div className="row">
              <p>Durchmesser:</p>
              <p>{watch.diameter}</p>
            </div>
            <div className="row">
              <p>Besonderheiten</p>
              <ul>
                {watch.features.map((feature, index) => <li key={index}>{feature}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
