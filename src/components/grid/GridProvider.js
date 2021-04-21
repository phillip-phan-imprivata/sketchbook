import React, { createContext, useState } from "react"

export const GridContext = createContext()

export const GridProvider = (props) => {
  const [grids, setGrids] = useState([])
  const [gridInput, setGridInput] = useState(0)
  const [color, setColor] = useState("#000000")

  const getGrids = () => {
    return fetch("https://sketchbook-api.herokuapp.com/grids")
    .then(res => res.json())
    .then(setGrids)
  }

  const saveGrid = (obj) => {
    return fetch("https://sketchbook-api.herokuapp.com/grids", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(obj)
    })
  }

  const deleteGrid = (id) => {
    return fetch(`https://sketchbook-api.herokuapp.com/grids/${id}`, {
      method: "DELETE",
    })
  }

  return (
    <GridContext.Provider value={{
      grids, getGrids, saveGrid, gridInput, setGridInput, deleteGrid, color, setColor
    }}>
      {props.children}
    </GridContext.Provider>
  )
}