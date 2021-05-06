import React, { ReactElement } from 'react'

interface Props {
  setSort?: React.Dispatch<React.SetStateAction<string>>,
  setOptionValue: React.Dispatch<React.SetStateAction<string>>,
  setSearchValue: React.Dispatch<React.SetStateAction<string>>
}

type Options = "all" | "article" | "glass" | "case" | "year" | "brand" | "model" | "type" | "clockwork" | "dial";


export default function Filter({ setSort, setOptionValue, setSearchValue }: Props): ReactElement {
  return (
    <div className="filter-wrapper">
      <h1>Uhren</h1>
      <div className="search-wrapper">
        <select name="searchIn" id="search-in" onChange={(e) => setOptionValue(e.target.value.toLowerCase().trim())}>
          <option value="all">All</option>
          <option value="article">Artikel</option>
          <option value="glass">Glas</option>
          <option value="case">Gehaeuse</option>
          <option value="year">Jahr</option>
          <option value="brand">Marke</option>
          <option value="model">Modell</option>
          <option value="type">Typ</option>
          <option value="price">Preis</option>
          <option value="clockwork">Uhrwerk</option>
          <option value="dial">Ziffernblatt</option>
        </select>
        <input type="text" name="search" id="input-search" onChange={(e) => setSearchValue(e.target.value.toLowerCase().trim())} />
      </div>
      <div className="filter">
        <p className="alphabetic-desc" onClick={() => setSort && setSort("alphabetic-desc")}></p>
        <p className="alphabetic-asc" onClick={() => setSort && setSort("alphabetic-asc")}></p>
        <p className="numeric-desc" onClick={() => setSort && setSort("numeric-desc")}></p>
        <p className="numeric-asc" onClick={() => setSort && setSort("numeric-asc")}></p>
      </div>
    </div>
  )
}
