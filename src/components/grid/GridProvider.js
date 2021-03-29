import React, { createContext, useState } from "react"

export const GridContext = createContext()

export const GridProvider = (props) => {
  const [grids, setGrids] = useState([])
  const [gridInput, setGridInput] = useState(0)

  const getGrids = () => {
    return fetch("http://localhost:8088/grids")
    .then(res => res.json())
    .then(setGrids)
  }

  const saveGrid = (obj) => {
    return fetch("http://localhost:8088/grids", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(obj)
    })
  }

  const deleteGrid = (id) => {
    return fetch(`http://localhost:8088/grids/${id}`, {
      method: "DELETE",
    })
  }

  return (
    <GridContext.Provider value={{
      grids, getGrids, saveGrid, gridInput, setGridInput, deleteGrid
    }}>
      {props.children}
    </GridContext.Provider>
  )
}