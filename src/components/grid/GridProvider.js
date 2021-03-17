import React, { createContext, useState } from "react"

export const GridContext = createContext()

export const GridProvider = (props) => {
  const [grids, setGrids] = useState([])

  const getGrids = () => {
    return fetch("http://localhost:8088/grids")
    .then(res => res.json())
    .then(setGrids)
  }

  const saveGrid = (obj) => {
    fetch("http://localhost:8088/grids", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(obj)
    })
  }

  return (
    <GridContext.Provider value={{
      grids, getGrids, saveGrid
    }}>
      {props.children}
    </GridContext.Provider>
  )
}