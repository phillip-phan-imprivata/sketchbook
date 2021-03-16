import React, { createContext, useContext, useState } from "react"
import { GridContext } from "../grid/GridProvider"

export const SketchContext = createContext()

export const SketchProvider = (props) => {
  const {saveGrid} = useContext(GridContext)
  const [sketches, setSketches] = useState([])

  const getSketches = () => {
    return fetch("http://localhost:8088/sketches")
    .then(res => res.json())
    .then(setSketches)
  }

  const saveSketch = (obj) => {
    const savedSketch = {
      name: obj.name,
      userId: obj.userId
    }
    return fetch("http://localhost:8088/sketches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(savedSketch)
    })
    .then(res => res.json())
    .then(sketch => {
      obj.grid.map(gridItem => {
        saveGrid({
          sketchId: sketch.id,
          gridId: gridItem
        })
      })
    })
    .then(getSketches)
  }

  const updateSketch = (sketch) => {
    return fetch(`http://localhost:8088/sketches/${sketch.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(sketch)
    })
    .then(getSketches)
  }

  const getSketchById = (id) => {
    return fetch(`http://localhost:8088/sketches/${id}`)
    .then(res => res.json())
  }

  return (
    <SketchContext.Provider value={{
      sketches, getSketches, saveSketch, updateSketch, getSketchById
    }}>
      {props.children}
    </SketchContext.Provider>
  )
}