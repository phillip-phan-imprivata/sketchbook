import React, { useContext, useState } from "react"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import { useHistory } from "react-router-dom"
import {SketchContext} from "../sketch/SketchProvider"

export const SketchCard = (props) => {
  const {deleteSketch} = useContext(SketchContext)

  const history = useHistory()

  const gridStyle = {
    gridTemplateColumns: `repeat(${props.sketch.size}, 1fr)`,
    gridTemplateRows: `repeat(${props.sketch.size}, 1fr)`,
    height: "20vh",
    width: "20vh",
  }

  const handleDeleteSketch = (event) => {
    const [prefix, id] = event.target.id.split("--")

    //deletes the sketch from json as well as objects in the grids resource with the matching sketchId
    deleteSketch(parseInt(id))
  }

  const createGrid = (size) => {
    let initialGrid = []
    let savedGrid = props.sketch.grids
    
    //for loop to repeatedly create blocks to cover the area of the grid container
    for (let i = 1; i <= size * size; i++) {
      //if the grid was loaded for editing, savedGrid will contain the id's of colored grids
      //creates a colored block if the grid id is included in the savedGrid array
      if (savedGrid.find(block => block.blockId === i) !== undefined) {
        const foundBlock = savedGrid.find(block => block.blockId === i)
        initialGrid.push(<div className="grid" style={{backgroundColor: foundBlock.blockColor}} key={i} id={`grid--${i}`}></div>)
      } else {
        initialGrid.push(<div className="grid" key={i} id={`grid--${i}`}></div>)
      }
    }
    return initialGrid
  }

  return (
    <section className="sketchCard">
      <Card className="sketchCard__card">
        <Card.Body>
          <Card.Title>{props.sketch.name}</Card.Title>
          <div className="previewContainer" style={gridStyle}>
            {createGrid(props.sketch.size)}
          </div>
          <Button className="btn-edit" onClick={() => {history.push(`/sketch/edit/${props.sketch.id}`)}}>Edit Sketch</Button>
          <Button className="btn-delete" id={`btn--${props.sketch.id}`} onClick={handleDeleteSketch}>Delete Sketch</Button>
        </Card.Body>
      </Card>
    </section>
  )
}