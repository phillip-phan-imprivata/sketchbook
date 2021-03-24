import React, { useContext, useState } from "react"
import { SketchPad } from "./SketchPad"
import Modal from "react-bootstrap/Modal"
import InputGroup from "react-bootstrap/InputGroup"
import FormControl from "react-bootstrap/FormControl"
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"
import { useHistory } from "react-router"
import { GridContext } from "../grid/GridProvider"

export const SketchForm = () => {
  const [showAlert, setShowAlert] = useState(false)
  const {gridInput, setGridInput} = useContext(GridContext)

  const history = useHistory()

  //function for button click
  const handleCreateGrid = (event) => {
    //redirects user to sketch page and renders sketchpad based on size in input
    if (parseInt(gridInput) <= 50 && parseInt(gridInput) > 0) {
      history.push("/sketch")
    //shows alert
    } else {
      setShowAlert(true)
    }
  }

  //state variable in GridProvider changes when input value changes
  const handleInputChange = (event) => {
    setGridInput(event.target.value)
  }

  return (
    <>
    <div className="row">
      <div className="text-center col-sm-6 offset-sm-3">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>Grid Size: </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl type="number" aria-label="Grid Size" aria-describedby="basic-addon1" placeholder="Number between 1-50" onChange={handleInputChange} />
          <InputGroup.Append>
            <Button onClick={handleCreateGrid}>Create Grid</Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
    </div>
    <Alert variant="danger" className="col-sm-4 offset-sm-4" show={showAlert} onClose={() => setShowAlert(false)} transition={false} dismissible>
      That's not a usable number!
    </Alert>
    </>
  )
}