import React, { createContext, useContext, useState } from "react"
import { GridContext } from "../grid/GridProvider"

export const SketchContext = createContext()

export const SketchProvider = (props) => {
  const {saveGrid, deleteGrid} = useContext(GridContext)
  const [sketches, setSketches] = useState([])

  //timer to use with await in saveSketch
  //sets timeout to slow down promise execution
  const timer = ms => new Promise(res => setTimeout(res, ms))

  const getSketches = () => {
    return fetch("https://sketchbook-api.herokuapp.com/sketches?_embed=grids")
    .then(res => res.json())
    .then(setSketches)
  }

  const saveSketch = (obj) => {
    const savedSketch = {
      name: obj.name,
      userId: obj.userId,
      size: obj.size
    }
    return fetch("https://sketchbook-api.herokuapp.com/sketches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(savedSketch)
    })
    .then(res => res.json())
    .then(sketch => {
      //use reduce instead of map because the accumulator depends on the response of the previous return
      //promises have time to fulfill before moving on to the next
      //sometimes, promises still gave error, so timer was added to ensure ample time given
      obj.grid.reduce(
        (chain, block) => chain
        .then(async () => {
          saveGrid({
            sketchId: sketch.id,
            blockId: block.blockId,
            blockColor: block.blockColor
          })
          //halts execution of async function until timeout completes
          await timer(100)
          //Promise.resolve() is the initial value of the accumulator that returns a fulfilled Promise
          //this return value lets you use .then and starts the chain
          //.then returns the fulfilled saveGrid promise to "chain" (accumulator) and continues the iteration
        }), Promise.resolve()
      )
    })
  }

  const updateSketch = (obj) => {
    obj.erasedBlocks.reduce(
      (chain, block) =>
        chain.then(async () => {
          deleteGrid(block)
          await timer(100)
        }),
        Promise.resolve()
    )
    const updatedSketch = {
      id: obj.id,
      name: obj.name,
      userId: obj.userId,
      size: obj.size
    }
    return fetch(`https://sketchbook-api.herokuapp.com/sketches/${obj.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedSketch)
    })
    .then(res => res.json())
    .then(async () => {
      await timer(obj.erasedBlocks.length * 100)
      //same method as in saveSketch
      obj.grid.reduce(
        (chain, block) => 
          chain.then(async () => {
          saveGrid({
            sketchId: obj.id,
            blockId: block.blockId,
            blockColor: block.blockColor
          })
          await timer(100)
        }),
          Promise.resolve()
      )
    })
  }

  const deleteSketch = (id) => {
    return fetch(`https://sketchbook-api.herokuapp.com/sketches/${id}`, {
      method: "DELETE"
    })
    .then(getSketches)
  }

  const getSketchById = (id) => {
    return fetch(`https://sketchbook-api.herokuapp.com/sketches/${id}?_embed=grids`)
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