import React, { useState } from "react"
import { SketchPad } from "./SketchPad"
import Modal from "react-bootstrap/Modal"
import InputGroup from "react-bootstrap/InputGroup"
import FormControl from "react-bootstrap/FormControl"
import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"

export const SketchForm = () => {
  const [show, setShow] = useState(true)
  const [showAlert, setShowAlert] = useState(false)
  const [gridInput, setGridInput] = useState("")

  const handleCreateGrid = (event) => {
    if (parseInt(gridInput) <= 100 && parseInt(gridInput) > 0) {
      setShow(false)
    } else {
      setShowAlert(true)
    }
  }

  const handleInputChange = (event) => {
    setGridInput(event.target.value)
  }

  if (show === true) {
    return (
      <>
      <div className="row">
        <div className="text-center col-sm-4 offset-sm-4">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Grid Size: </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl aria-label="Grid Size" aria-describedby="basic-addon1" placeholder="Number between 1-100" onChange={handleInputChange} />
            <InputGroup.Append>
              <Button onClick={handleCreateGrid}>Create Grid</Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
      </div>
      <Alert variant="danger" className="col-sm-4 offset-sm-4" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
        That's not a usable number!
      </Alert>
      </>
    )
  } else if (show === false) {
    return (
      <div>
        <SketchPad size={parseInt(gridInput)} />
      </div>
    )
  }
}