import React, { createContext, useContext, useState } from "react"
import { GridContext } from "../grid/GridProvider"

export const SketchContext = createContext()

export const SketchProvider = (props) => {
  const {saveGrid, deleteGrid, getGrids, grids} = useContext(GridContext)
  const [sketches, setSketches] = useState([])

  const getSketches = () => {
    return fetch("http://localhost:8088/sketches")
    .then(res => res.json())
    .then(setSketches)
  }

  const saveSketch = (obj) => {
    const savedSketch = {
      name: obj.name,
      userId: obj.userId,
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
      obj.grid.reduce(
        (chain, block) => 
          chain.then(async () => await saveGrid({
            sketchId: sketch.id,
            blockId: block
          })),
          Promise.resolve()
      )
    })
  }

  const updateSketch = (obj) => {
    const updatedSketch = {
      id: obj.id,
      name: obj.name,
      userId: obj.userId
    }
    return fetch(`http://localhost:8088/sketches/${obj.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedSketch)
    })
    .then(res => res.json())
    // .then(async sketch => {
    //   await getGrids()
    //   let matchingGrids = grids.filter(grid => grid.sketchId === sketch.id)
    //   matchingGrids.reduce((chain, block) =>
    //     // append the promise creating function to the chain
    //     chain.then(() => 
    //       deleteGrid(block.id)), 
    //     // start the promise chain from a resolved promise
    //       Promise.resolve()
    // )
    // })
    .then(() => {
      obj.grid.reduce(
        (chain, block) => 
          chain.then(() => saveGrid({
            sketchId: obj.id,
            blockId: block
          })),
          Promise.resolve()
      )
    })
  }

  const deleteSketch = (id) => {
    return fetch(`http://localhost:8088/sketches/${id}`, {
      method: "DELETE"
    })
    .then(getSketches)
  }

  const getSketchById = (id) => {
    return fetch(`http://localhost:8088/sketches/${id}?_embed=grids`)
    .then(res => res.json())
  }

  return (
    <SketchContext.Provider value={{
      sketches, getSketches, saveSketch, updateSketch, getSketchById, deleteSketch
    }}>
      {props.children}
    </SketchContext.Provider>
  )
}