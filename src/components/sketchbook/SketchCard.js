import React from "react"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import { useHistory } from "react-router-dom"

export const SketchCard = (props) => {

  const history = useHistory()

  return (
    <section className="sketch">
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>{props.sketch.name}</Card.Title>
          <Button onClick={() => {history.push(`/sketch/edit/${props.sketch.id}`)}}>Edit Sketch</Button>
        </Card.Body>
      </Card>
    </section>
  )
}