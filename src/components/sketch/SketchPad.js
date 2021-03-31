import React, { useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import "./SketchPad.css"
import { SketchContext } from "./SketchProvider"
import Button from "react-bootstrap/Button"
import ProgressBar from 'react-bootstrap/ProgressBar'
import Modal from "react-bootstrap/Modal"
import { GridContext } from "../grid/GridProvider"
import { BlockPicker } from "react-color/lib/index"

export const SketchPad = (props) => {
  const { saveSketch, getSketchById, updateSketch } = useContext(SketchContext)
  const { getGrids, grids, color, setColor } = useContext(GridContext)

  const userId = parseInt(sessionStorage.app_user_id)
  const { sketchId } = useParams()
  const history = useHistory()

  const [isLoading, setIsLoading] = useState(true);
  const [percentage, setPercentage] = useState(0)
  const [showLoading, setShowLoading] = useState(false)
  //when mode === true, user draws
  //when mode === false, user erases
  const [mode, setMode] = useState(true)
  const [savedGrid, setSavedGrid] = useState([])
  const [erasedBlocks, setErasedBlocks] = useState([])
  const [showColorPicker, setShowColorPicker] = useState(false)

  const [sketch, setSketch] = useState({
    name: "",
    size: parseInt(props.size),
    userId: userId,
    grid: []
  })

  //styling for grid container
  const gridStyle = {
    gridTemplateColumns: `repeat(${sketch.size}, 1fr)`,
    gridTemplateRows: `repeat(${sketch.size}, 1fr)`,
    height: "75vh",
    width: "75vh",
  }

  //returns a Promise that resolves after "ms" Milliseconds
  //sets timeout to slow down promise execution to match how fast objects are being saved in provider
  const timer = ms => new Promise(res => setTimeout(res, ms))

  //function to stop the page from redirecting before the sketch is finished saving
  const load = async () => {
    let matchingBlocks = []
    if (sketchId){
      matchingBlocks = erasedBlocks.map(block => {
        return block.id
        // let foundBlock = grids.find(gridItem => gridItem.blockId === block && gridItem.sketchId === sketch.id)
        // return foundBlock.id
      })
    }

    if (sketch.grid.length !== 0 || matchingBlocks.length !== 0){
      //makes the modal visible and show the progress bar
      setShowLoading(true)
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

  const handleSketchMode = (event) => {
    if (!event.target.className.includes("selected")){
      if (mode === true){
        setMode(false)
      } else {
        setMode(true)
      }
    }
  }

  const handleColorButton = (event) => {
    setShowColorPicker(!showColorPicker)
  }

  const handleColorChange = (color, event) => {
    setColor(color.hex)
    setShowColorPicker(!showColorPicker)
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
    const currentGridBlock = sketch.grid.find(block => block.blockId === parseInt(id))
    const savedGridBlock = savedGrid.find(block => block.blockId === parseInt(id))
    const foundErasedBlock = erasedBlocks.find(block => block.blockId === parseInt(id))
    
    if (mode === true){
      //changes the background color by changing the style of the block
      chosenItem.style.backgroundColor = color
      
      if (currentGridBlock === undefined) {
        sketch.grid.push({
            "blockId": parseInt(id),
            "blockColor": color
          })
      } else if (currentGridBlock !== undefined) {
        let newSketch = {...sketch}
        newSketch.grid = newSketch.grid.filter(block => block.blockId !== parseInt(id))
        newSketch.grid.push({
          "blockId": parseInt(id),
          "blockColor": color
        })
        setSketch(newSketch)
      }

      if (savedGridBlock !== undefined) {
        if (savedGridBlock.blockColor === color){
          let newSketch = {...sketch}
          newSketch.grid = newSketch.grid.filter(block => block.blockId !== parseInt(id))
          setSketch(newSketch)
        } else if (foundErasedBlock === undefined){
          erasedBlocks.push({
            "blockId": parseInt(id),
            "blockColor": savedGridBlock.blockColor,
            "id": savedGridBlock.id
          })
        }
      }

      if (foundErasedBlock !== undefined && foundErasedBlock.blockColor === color){
        setErasedBlocks([...erasedBlocks].filter(block => block.blockId !== parseInt(id)))
      }
    } else if (mode === false){
      chosenItem.style.backgroundColor = "#ffffff"

      if (foundErasedBlock === undefined && savedGridBlock !== undefined){
        erasedBlocks.push({
          "blockId": parseInt(id),
          "blockColor": savedGridBlock.blockColor,
          "id": savedGridBlock.id
        })
      }

      if (currentGridBlock !== undefined) {
        let newSketch = {...sketch}
        const newGrid = sketch.grid.filter(block => block.blockId !== parseInt(id))
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
          return block.id
          // let foundBlock = grids.find(gridItem => gridItem.blockId === block && gridItem.sketchId === sketch.id)
          // return foundBlock.id
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
      if (savedGrid.find(block => block.blockId === i) !== undefined) {
        const foundBlock = savedGrid.find(block => block.blockId === i)
        initialGrid.push(<div className="grid" style={{backgroundColor: foundBlock.blockColor}} key={i} id={`grid--${i}`} draggable="true" onDragStart={handleDragStart} onDragOver={handleGridDrag}></div>)
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
            // let matchingGrid = sketch.grids.map(grid => grid.blockId)
            setSavedGrid(sketch.grids)
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
      <div className="sketchpadContainer">
        <input type="text" id="name" className="sketch__input" autoComplete="off" defaultValue={sketch.name} placeholder={sketchId ? sketch.name : "New Sketch Name"} onChange={(event) => sketch.name = event.target.value} />
        <div className="container" style={gridStyle}>
          {createGrid(sketch.size)}
        </div>
        <Button onClick={() => {
          console.log("grid", sketch.grid)
          console.log("erased", erasedBlocks)
          console.log("savedGrid", savedGrid)
        }}>log</Button>
        <Button className="grid__newSketch" onClick={handleNewSketch}>New Sketch</Button>
        <Button className="grid__save" disabled={isLoading} onClick={handleSaveGrid}>Save Sketch</Button>
        <div>
          <div className="btn__settings">
            <div className="settings__pencil">
              <Button className={mode ? "grid__mode selected" : "grid__mode"} onClick={handleSketchMode}>Pencil</Button>
            </div>
            <div className="settings__eraser">
              <Button className={mode ? "grid__mode" : "grid__mode selected"} onClick={handleSketchMode}>Eraser</Button>
            </div>
            <div className="settings__color">
              <Button className="grid__color" onClick={handleColorButton} >Color</Button>
              {showColorPicker ? <BlockPicker color={color} onChangeComplete={handleColorChange} /> : null}
            </div>
          </div>
        </div>
      </div>
      <Modal animation={false} show={showLoading} size="lg" centered >
        <Modal.Body><ProgressBar animated now={percentage} label={`Saving: ${Math.round(percentage)}%`} ></ProgressBar></Modal.Body>
      </Modal>
    </>
  )
}
