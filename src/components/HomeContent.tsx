import React, { ReactElement, useEffect, useState } from 'react';

import Hero from './utils/Hero';
import Filter from './utils/Filter';
import Watches from './Watches';
import TypeWatch from '../types/Watch';
import { watchApi } from '../shared/watchApi';

interface Props {
  setShowDetails?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDetailsWatch?: React.Dispatch<React.SetStateAction<TypeWatch | undefined>>;
}

export default function HomeContent({ setShowDetails, setShowDetailsWatch }: Props): ReactElement {
  const [sort, setSort] = useState("");
  const [optionValue, setOptionValue] = useState("all");
  const [searchValue, setSearchValue] = useState("");

  const [watches, setWatches] = useState<TypeWatch[]>();

  useEffect(() => {
    watchApi<TypeWatch[]>('GET', '/watches', setWatches);
  }, []);

  if (!watches) return <p>Lade...</p>

  return (
    <>
      <Hero slider={true} />
      <section className="content">
        <div className="center">
          <Filter setSort={setSort} setOptionValue={setOptionValue} setSearchValue={setSearchValue} />
          <Watches
            sort={sort}
            optionValue={optionValue}
            searchValue={searchValue}
            setShowDetails={setShowDetails}
            setShowDetailsWatch={setShowDetailsWatch}
            watches={watches}
          />

        </div>
      </section>
    </>
  )
}
