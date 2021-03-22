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

    deleteSketch(parseInt(id))
  }

  return (
    <section className="sketch">
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>{props.sketch.name}</Card.Title>
          <Button onClick={() => {history.push(`/sketch/edit/${props.sketch.id}`)}}>Edit Sketch</Button>
          <Button id={`btn--${props.sketch.id}`} onClick={handleDeleteSketch}>Delete Sketch</Button>
        </Card.Body>
      </Card>
    </section>
  )
}