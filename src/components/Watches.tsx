import React, { ReactElement, useEffect, useState } from 'react';

import TypeWatch from '../types/Watch';

import Watch from './utils/Watch';

interface Props {
  sort?: string,
  optionValue: string;
  searchValue: string;
  setShowDetails?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDetailsWatch?: React.Dispatch<React.SetStateAction<TypeWatch | undefined>>;
  watches: TypeWatch[] | undefined;
}

type Watch = { [key: string]: TypeWatch[keyof TypeWatch] }

export default function Watches({
  sort,
  optionValue,
  searchValue,
  setShowDetails,
  setShowDetailsWatch,
  watches
}: Props): ReactElement {

  const [foundWatches, setFoundWatches] = useState(watches);
  const [foundSize, setFoundSize] = useState(0);

  useEffect(() => {
    if (sort === "alphabetic-desc") {
      setFoundWatches((curWatches) => {
        const copyWatches = [...(curWatches || [])];
        return copyWatches.sort((a, b) => {
          if (a.model.toLowerCase() > b.model.toLowerCase()) {
            return -1;
          }
          if (a.model.toLowerCase() < b.model.toLowerCase()) {
            return 1;
          }
          return 0;
        })
      });
    }

    if (sort === "alphabetic-asc") {
      setFoundWatches((curWatches) => {
        const copyWatches = [...(curWatches || [])];
        return copyWatches.sort((a, b) => {
          if (a.model.toLowerCase() < b.model.toLowerCase()) {
            return -1;
          }
          if (a.model.toLowerCase() > b.model.toLowerCase()) {
            return 1;
          }
          return 0;
        })
      });
    }

    if (sort === 'numeric-asc') {
      setFoundWatches((curWatches) => {
        const copyWatches = [...(curWatches || [])];
        return copyWatches.sort((a, b) => {
          if (a.price - b.price == 0) {
            if (a.model.toLowerCase() > b.model.toLowerCase()) {
              return -1;
            }
            if (a.model.toLowerCase() < b.model.toLowerCase()) {
              return 1;
            }
            return 0;
          }
          else {
            return a.price - b.price;
          }
        })
      });
    }

    if (sort === 'numeric-desc') {
      setFoundWatches((curWatches) => {
        const copyWatches = [...(curWatches || [])];
        return copyWatches.sort((a, b) => {
          if (b.price - a.price == 0) {
            if (a.model.toLowerCase() > b.model.toLowerCase()) {
              return -1;
            }
            if (a.model.toLowerCase() < b.model.toLowerCase()) {
              return 1;
            }
            return 0;
          }
          else {
            return b.price - a.price;
          }
        })
      });
    }


  }, [sort]);

  useEffect(() => {
    console.log('FIND')
    if (watches && searchValue.length > 2) {
      const copyWatches = [...watches];

      const findWatches = copyWatches.filter(el => {

        const objectValues = Object.values(el);
        if (optionValue == 'all') {
          for (let i = 0; i < objectValues.length; i++) {
            if (!Array.isArray(objectValues[i]) && isNaN(objectValues[i])) {
              if (objectValues[i].toLowerCase().indexOf(searchValue) != -1) {
                return el;
              }
            }
            if (searchValue.match(/\d+/)) {
              if (objectValues[i] == searchValue) {
                return el;
              }
            }
          }
        } else if (typeof el[optionValue as keyof TypeWatch] === "string"
          && (el[optionValue as keyof TypeWatch] as string).toLowerCase().indexOf(searchValue) != -1) {
          return el;
        } else if (typeof el[optionValue as keyof TypeWatch] === "number") {

          if (searchValue.match(/\d+/)) {
            if (el[optionValue as keyof TypeWatch] == searchValue) {
              return el;
            }
          }
        }


        if (searchValue[0] == '>') {
          if (el.price > Number(searchValue.split('>')[1].trim())) {
            return el;
          }
        }
        if (searchValue[0] == '<') {
          if (el.price < Number(searchValue.split('<')[1].trim())) {
            return el;
          }
        }
        if (searchValue.trim()[0].indexOf('>') != -1 && searchValue.indexOf('<') != -1) {
          const num1 = Number(searchValue.split('<')[0].split('>')[1].trim());
          const num2 = Number(searchValue.split('<')[1].trim());
          if (el.price > num1 && el.price < num2) {
            return el;
          }
        }

      }).sort((a, b) => a.price - b.price);

      if (findWatches.length != foundSize) {
        setFoundSize(findWatches.length);
        setFoundWatches(findWatches);
      }
      if (findWatches.length == 0) {
        setFoundWatches(findWatches);
      }
    }
    if (searchValue.length === 0) {
      setFoundSize(0);
      setFoundWatches(watches);
    }

  }, [optionValue, searchValue, watches, foundSize])

  if (!foundWatches) return <p>Lade...</p>

  return (
    <div className="watches">
      {
        foundWatches && foundWatches.map((watch) =>
          <Watch
            key={watch.id}
            watch={watch}
            setShowDetails={setShowDetails}
            setShowDetailsWatch={setShowDetailsWatch}
          />
        )
      }
    </div>
  )
}