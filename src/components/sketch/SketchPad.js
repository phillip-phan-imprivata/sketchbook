import React, { useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import "./SketchPad.css"
import { SketchContext } from "./SketchProvider"
import Button from "react-bootstrap/Button"

export const SketchPad = (props) => {
  const {saveSketch, getSketchById, updateSketch} = useContext(SketchContext)

  const [isLoading, setIsLoading] = useState(true);
  const userId = parseInt(sessionStorage.app_user_id)

  const [sketch, setSketch] = useState({
    name: "",
    userId: userId,
    grid: []
  })

  const [savedGrid, setSavedGrid] = useState([])

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
        const newGrid = sketch.grid.map(block => {
          if (savedGrid.includes(block) === false) {
            return block
          }
        })
        
        updateSketch({
          id: sketch.id,
          name: sketch.name,
          userId: sketch.userId,
          grid: newGrid
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
    const [prefix, id] = chosenItem.id.split("--")
    
    chosenItem.className = "grid color"
    
    if (sketch.grid.includes(parseInt(id)) === false){
      sketch.grid.push(parseInt(id))
    }
  }
  
  const createGrid = (size) => {
    for (let i = 1; i<= size * size; i++){
      if (savedGrid.includes(i)){
        initialGrid.push(<div className="grid color" key={i} id={`grid--${i}`} draggable="true" onDragStart={handleDragStart} onDragOver={handleGridDrag}></div>)
      } else {
        initialGrid.push(<div className="grid" key={i} id={`grid--${i}`} draggable="true" onDragStart={handleDragStart} onDragOver={handleGridDrag}></div>)
      }
    }
    return initialGrid
  }

  useEffect(() => {
    if (sketchId) {
      getSketchById(sketchId)
      .then(sketch => {
        let editSketch = {
          id: sketch.id,
          name: sketch.name,
          userId: sketch.userId,
          grid: []
        }
        let matchingGrid = sketch.grids.map(grid => grid.blockId)
        setSavedGrid(matchingGrid)
        setSketch(editSketch)
        setIsLoading(false)
      })
    } else {
      setIsLoading(false)
    }
  }, [])

  return (
    <>
    <input type="text" id="name" defaultValue={sketch.name} placeholder={sketchId ? sketch.name : "New Sketch Name"} onChange={(event) => sketch.name = event.target.value}/>
    <div className="container" style={gridStyle}>
      {createGrid(props.size)}
    </div>
    <Button className="grid__clear" onClick={handleClearGrid}>Clear Sketch</Button>
    <Button className="grid__save" disabled={isLoading} onClick={handleSaveGrid}>Save Sketch</Button>
    </>
  )
}