import React, { useContext } from "react"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import { useHistory } from "react-router-dom"
import {SketchContext} from "../sketch/SketchProvider"

export const SketchCard = (props) => {
  const {deleteSketch} = useContext(SketchContext)
  const history = useHistory()

  const handleDeleteSketch = (event) => {
    const [prefix, id] = event.target.id.split("--")

    //deletes the sketch from json as well as objects in the grids resource with the matching sketchId
    deleteSketch(parseInt(id))
  }

  return (
    <section className="sketchCard">
      <Card className="sketchCard__card">
        <Card.Body>
          <Card.Title>{props.sketch.name}</Card.Title>
          <Button className="btn-edit" onClick={() => {history.push(`/sketch/edit/${props.sketch.id}`)}}>Edit Sketch</Button>
          <Button className="btn-delete" id={`btn--${props.sketch.id}`} onClick={handleDeleteSketch}>Delete Sketch</Button>
        </Card.Body>
      </Card>
    </section>
  )
}