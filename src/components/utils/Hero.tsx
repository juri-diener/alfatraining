import { url } from 'inspector';
import React, { ReactElement, useEffect, useState } from 'react';

interface Props {
  slider?: boolean,
  timer?: number
  images?: string[]
}

export default function Hero({ slider = false, timer = 3000, images }: Props): ReactElement {

  const [heroImageCounter, setHeroImageCounter] = useState(0);
  const [heroImages] = useState(images || [
    '../../images/rolex2.jpg',
    '../../images/rolex1.jpg',
    '../../images/rolex3.jpg',
  ]);

  useEffect(() => {
    if (slider) {
      const intervalID = window.setInterval(() => {
        setHeroImageCounter((_heroImageCounter) => _heroImageCounter == heroImages.length - 1 ? 0 : _heroImageCounter + 1)
      }, timer);

      return () => {
        window.clearInterval(intervalID);
      }
    }
  }, [timer, heroImages, slider]);

  return (
    <section className="hero">
      {heroImages.map((heroImage, index) =>
        <div
          key={index}
          style={{
            opacity: heroImageCounter == index ? 1 : 0,
            backgroundImage: `url(${heroImage})`
          }}></div>
      )}
    </section>
  )
}
