import React, { useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import "./SketchPad.css"
import { SketchContext } from "./SketchProvider"
import Button from "react-bootstrap/Button"
import ProgressBar from 'react-bootstrap/ProgressBar'
import Modal from "react-bootstrap/Modal"
import { GridContext } from "../grid/GridProvider"

export const SketchPad = (props) => {
  const { saveSketch, getSketchById, updateSketch } = useContext(SketchContext)
  const { getGrids, grids } = useContext(GridContext)

  const userId = parseInt(sessionStorage.app_user_id)
  const { sketchId } = useParams()
  const history = useHistory()

  const [isLoading, setIsLoading] = useState(true);
  const [percentage, setPercentage] = useState(0)
  const [show, setShow] = useState(false)
  const [mode, setMode] = useState(true)
  const [savedGrid, setSavedGrid] = useState([])
  const [erasedBlocks, setErasedBlocks] = useState([])

  const [sketch, setSketch] = useState({
    name: "",
    size: parseInt(props.size),
    userId: userId,
    grid: []
  })

  //returns a Promise that resolves after "ms" Milliseconds
  //sets timeout to slow down promise execution to match how fast objects are being saved in provider
  const timer = ms => new Promise(res => setTimeout(res, ms))

  //function to stop the page from redirecting before the sketch is finished saving
  const load = async () => {
    let matchingBlocks = []
    if (sketchId){
      matchingBlocks = erasedBlocks.map(block => {
        let foundBlock = grids.find(gridItem => gridItem.blockId === block && gridItem.sketchId === sketch.id)
        return foundBlock.id
      })
    }

    if (sketch.grid.length !== 0 || matchingBlocks.length !== 0){
      //makes the modal visible and show the progress bar
      setShow(true)
      //for loop that is the length of the amount of blocks being saved
      for (var i = 0; i <= (sketch.grid.length + matchingBlocks.length); i++) {
        //updates the state variable percentage to match the progress of blocks being saved since the timing is constant
        setPercentage((100/(sketch.grid.length + matchingBlocks.length)) * i)
        //halts execution of async function until timeout completes
        await timer(100);
      }      
    }
    //after the loop completes, the user is taken to sketchbook
    history.push("/sketchbook")
  }

  //styling for grid container
  const gridStyle = {
    gridTemplateColumns: `repeat(${sketch.size}, 1fr)`,
    gridTemplateRows: `repeat(${sketch.size}, 1fr)`,
    height: "500px",
    width: "500px",
  }

  const handleSketchMode = (event) => {
    if (mode === true){
      setMode(false)
    } else {
      setMode(true)
    }
  }

  //function to get rid of ghost image when dragging a block
  const handleDragStart = (event) => {
    //creates a new, blank image for the item being dragged
    event.dataTransfer.setDragImage(new Image(), 0, 0)
  }
  
  //function to change the color of the block that is dragged over
  const handleGridDrag = (event) => {
    const chosenItem = event.target
    const [prefix, id] = chosenItem.id.split("--")
    
    if (mode === true){
      //changes the background color by adding a class to the block
      chosenItem.className = "grid color"
      
      //adds the block's id to the state variable's "grid" array if the id is not in there yet
      if (sketch.grid.includes(parseInt(id)) === false && !savedGrid.includes(parseInt(id))) {
        sketch.grid.push(parseInt(id))
      }

      if (erasedBlocks.includes(parseInt(id))){
        let newErasedBlocks = [...erasedBlocks].filter(block => block !== parseInt(id))
        setErasedBlocks(newErasedBlocks)
      }
    } else if (mode === false){
      chosenItem.className = "grid"

      if (!erasedBlocks.includes(parseInt(id)) && savedGrid.includes(parseInt(id))){
        let newErasedBlocks = [...erasedBlocks]
        newErasedBlocks.push(parseInt(id))
        setErasedBlocks(newErasedBlocks)
      }

      if (sketch.grid.includes(parseInt(id)) === true) {
        let newSketch = {...sketch}
        const newGrid = sketch.grid.filter(block => block !== parseInt(id))
        newSketch.grid = newGrid
        setSketch(newSketch)
        
      }

    }
  }

  //function to save the current grid when save button is clicked
  const handleSaveGrid = (event) => {
    //watches to see if the name input is empty
    if (sketch.name === "") {
      alert("Name your sketch before saving")
    } else {
      setIsLoading(true)
      //check to see if there is a sketchId to determine if editing or saving new sketch
      if (sketchId) {
        let matchingBlocks = erasedBlocks.map(block => {
          let foundBlock = grids.find(gridItem => gridItem.blockId === block && gridItem.sketchId === sketch.id)
          return foundBlock.id
        })
        //save the updated name and new blocks that were colored
        updateSketch({
          id: sketch.id,
          name: sketch.name,
          size: sketch.size,
          userId: sketch.userId,
          grid: sketch.grid,
          erasedBlocks: matchingBlocks
        })
        .then(load())
      } else {
        const newSketch = {
          name: sketch.name,
          size: sketch.size,
          userId: userId,
          grid: sketch.grid
        }

        saveSketch(newSketch)
        .then(load())
      }
    }
  }
  
  const handleNewSketch = (event) => {
    history.push("/sketchform")
  }

  //function to generate the initial grid
  const createGrid = (size) => {
    let initialGrid = []
    
    //for loop to repeatedly create blocks to cover the area of the grid container
    for (let i = 1; i <= size * size; i++) {
      //if the grid was loaded for editing, savedGrid will contain the id's of colored grids
      //creates a colored block if the grid id is included in the savedGrid array
      if (savedGrid.includes(i)) {
        initialGrid.push(<div className="grid color" key={i} id={`grid--${i}`} draggable="true" onDragStart={handleDragStart} onDragOver={handleGridDrag}></div>)
      } else {
        initialGrid.push(<div className="grid" key={i} id={`grid--${i}`} draggable="true" onDragStart={handleDragStart} onDragOver={handleGridDrag}></div>)
      }
    }
    return initialGrid
  }

  useEffect(() => {
    setIsLoading(true)
    getGrids()
    .then(() => {
      //check to see if there is a sketchId to determine if editing or saving new sketch
      if (sketchId) {
        getSketchById(sketchId)
          .then(sketch => {
            let editSketch = {
              id: sketch.id,
              name: sketch.name,
              size: sketch.size,
              userId: sketch.userId,
              grid: []
            }
            //takes the associated blocks from grids resource and puts it into an array, which is set to the state variable savedGrid
            let matchingGrid = sketch.grids.map(grid => grid.blockId)
            setSavedGrid(matchingGrid)
            //sets state variable sketch to contain the information of the sketch that the user wants to edit
            setSketch(editSketch)
            setIsLoading(false)
          })
      } else {
        setIsLoading(false)
      }
    })
  }, [])

  return (
    <>
      <div className="text-center">
        <input type="text" id="name" autoComplete="off" defaultValue={sketch.name} placeholder={sketchId ? sketch.name : "New Sketch Name"} onChange={(event) => sketch.name = event.target.value} />
        <div className="container" style={gridStyle}>
          {createGrid(sketch.size)}
        </div>
        <Button className="grid__newSketch" onClick={handleNewSketch}>New Sketch</Button>
        <Button onClick={() => {
          console.log("erasedBlocks", erasedBlocks)
          console.log("coloredBlocks", sketch.grid)
          console.log("savedGrid", savedGrid)
        }}>log</Button>
        {mode === true ? <Button className="grid__mode" onClick={handleSketchMode}>Eraser</Button> : <Button className="grid__mode" onClick={handleSketchMode}>Pencil</Button>}
        <Button className="grid__saveSketch" disabled={isLoading} onClick={handleSaveGrid}>Save Sketch</Button>
      </div>
      <Modal animation={false} show={show} size="lg" centered >
        <Modal.Body><ProgressBar animated now={percentage} label={`Saving: ${Math.round(percentage)}%`} ></ProgressBar></Modal.Body>
      </Modal>
    </>
  )
}
