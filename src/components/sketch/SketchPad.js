import React, { useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { GridContext } from "../grid/GridProvider"
import "./SketchPad.css"
import { SketchContext } from "./SketchProvider"

export const SketchPad = (props) => {
  const {sketches, getSketches, saveSketch, getSketchById, updateSketch} = useContext(SketchContext)
  const {grids, getGrids, saveGrid} = useContext(GridContext)

  const [isLoading, setIsLoading] = useState(true);
  const userId = parseInt(sessionStorage.sketch_user)

  const [sketch, setSketch] = useState({
    name: "",
    userId: userId,
    grid: []
  })

  const {sketchId} = useParams()
  const history = useHistory()

  let initialGrid = []

  const gridStyle = {
    gridTemplateColumns: `repeat(${props.size}, 1fr)`,
    gridTemplateRows: `repeat(${props.size}, 1fr)`,
    height: "600px",
    width: "600px"
  }
  
  const handleSaveGrid = (event) => {
    if (sketch.name === "") {
      alert("Name your sketch before saving")
    } else {
      setIsLoading(true)

      if (sketchId) {
        updateSketch({
          id: sketch.id,
          name: sketch.name,
          userId: sketch.userId,
        })
        .then(() => history.push("/sketchbook"))
      } else {
        const newSketch = {
          name: sketch.name,
          userId: userId,
          grid: sketch.grid
        }

        saveSketch(newSketch)
        .then(() => history.push("/sketchbook"))
      }
    }
  }

  const handleClearGrid = (event) => {
    initialGrid = []
    setSketch({
      grid: []
    })
  }

  const handleDragStart = (event) => {
    event.dataTransfer.setDragImage(new Image(), 0, 0)
  }
  
  const handleGridDrag = (event) => {
    const chosenItem = event.target
    const [prefix, id] = event.target.id.split("--")
    
    chosenItem.className = "grid color"
    
    if (sketch.grid.includes(parseInt(id)) === false){
      sketch.grid.push(parseInt(id))
    }
  }
  
  const createGrid = (size) => {
    for (let i = 1; i<= size * size; i++){
      if (sketch.grid.includes(i)){
        initialGrid.push(<div className="grid color" key={i} id={`grid--${i}`} draggable="true" onDragStart={handleDragStart} onDragOver={handleGridDrag}></div>)
      } else {
        initialGrid.push(<div className="grid" key={i} id={`grid--${i}`} draggable="true" onDragStart={handleDragStart} onDragOver={handleGridDrag}></div>)
      }
    }
    return initialGrid
  }
  
  useEffect(() => {
    getGrids()
  }, [])

  useEffect(() => {
    if (sketchId) {
      getSketchById(sketchId)
      .then(sketch => {
        let editSketch = { ...sketch }
        let matchingGrid = grids.filter(grid => grid.sketchId === editSketch.id)
        matchingGrid = matchingGrid.map(grid => {
          return grid.gridId
        })
        editSketch.grid = matchingGrid
        setSketch(editSketch)
        setIsLoading(false)
      })
    } else {
      setIsLoading(false)
    }
  }, [grids])

  return (
    <>
    <input type="text" id="name" defaultValue={sketch.name} placeholder={sketchId ? sketch.name : "New Sketch Name"} onChange={(event) => sketch.name = event.target.value}/>
    <div className="container" style={gridStyle}>
      {createGrid(props.size)}
    </div>
    <button className="grid__clear" onClick={handleClearGrid}>Clear Sketch</button>
    <button className="grid__save" disabled={isLoading} onClick={handleSaveGrid}>Save Sketch</button>
    </>
  )
}