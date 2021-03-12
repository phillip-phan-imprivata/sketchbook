import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import "./SketchPad.css"
import { SketchContext } from "./SketchProvider"

export const SketchPad = (props) => {
  const {sketches, getSketches, saveSketch} = useContext(SketchContext)

  const history = useHistory()

  const userId = parseInt(sessionStorage.sketch_user)
  let grid = []
  let coloredGridId = []

  const gridStyle = {
    gridTemplateColumns: `repeat(${props.size}, 1fr)`,
    gridTemplateRows: `repeat(${props.size}, 1fr)`,
    height: "600px",
    width: "600px"
  }

  const handleSaveGrid = (event) => {
    const newSketch = {
      userId: userId,
      grid: coloredGridId
    }
    saveSketch(newSketch)
    .then(history.push("/sketchbook"))
  }

  const handleGridHover = (event) => {
    const chosenItem = event.target
    const [prefix, id] = event.target.id.split("--")

    chosenItem.className = "grid color"

    if (coloredGridId.includes(parseInt(id)) === false){
      coloredGridId.push(parseInt(id))
    }
  }

  const createGrid = (size) => {
    for (let i = 1; i <= size * size; i++){
      grid.push(<div className="grid" key={i} id={`grid--${i}`} onMouseOver={handleGridHover}></div>)
    }
    return grid
  }

  return (
    <>
    <div className="container" style={gridStyle}>
      {createGrid(props.size)}
    </div>
    <button className="grid__clear">Clear Sketch</button>
    <button className="grid__save" onClick={handleSaveGrid}>Save Sketch</button>
    </>
  )
}