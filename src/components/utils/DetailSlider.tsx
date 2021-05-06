import React, { ReactElement, useEffect, useState } from 'react';
import TypeWatch from '../../types/Watch';

interface Props {
  watch: TypeWatch | undefined
}

export default function DetailSlider({ watch }: Props): ReactElement {
  const [currentSlide, setCurrentSlide] = useState(0);

  // setCurrentSlide((_currentSlide) => _currentSlide == watch && watch.images.length - 1 ? 0 : _currentSlide + 1)

  const prevSlide = () => {
    setCurrentSlide((_currentSlide) => watch && _currentSlide == 0 ? watch.images.length - 1 : _currentSlide - 1);
  }
  const nextSlide = () => {
    setCurrentSlide((_currentSlide) => watch && _currentSlide == watch.images.length - 1 ? 0 : _currentSlide + 1);
  }

  return (
    <div className="detail-slider">
      <div className="slider-images">
        {watch?.images.map((imageUrl, index) =>
          <img src={imageUrl} key={index} style={{
            opacity: currentSlide == index ? 1 : 0,
          }} />
        )}
      </div>
      <div className="buttons">
        <span className="prev" onClick={prevSlide}></span>
        <span className="next" onClick={nextSlide}></span>
      </div>
    </div>
  )
}
