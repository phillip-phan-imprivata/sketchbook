import React, { useContext, useState } from "react"
import InputGroup from "react-bootstrap/InputGroup"
import FormControl from "react-bootstrap/FormControl"
import Alert from "react-bootstrap/Alert"
import { useHistory } from "react-router"
import { GridContext } from "../grid/GridProvider"
import Button from "react-bootstrap/Button"
import "./SketchForm.css"

export const SketchForm = () => {
  const [showAlert, setShowAlert] = useState(false)
  const {gridInput, setGridInput} = useContext(GridContext)

  const history = useHistory()

  //function for button click
  const handleCreateGrid = (event) => {
    //redirects user to sketch page and renders sketchpad based on size in input
    if (parseInt(gridInput) <= 10 && parseInt(gridInput) > 0) {
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
    <div className="formContainer">
      <div className="logo">SketchBook</div>
      <div className="row">
        <div className="text-center col-sm-6 offset-sm-3">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text className="form_label">SketchPad Size: </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl type="number" className="form_input" aria-label="Grid Size" aria-describedby="basic-addon1" placeholder="Number between 1-10" onChange={handleInputChange} autoFocus />
            <InputGroup.Append>
              <Button className="form_btn" onClick={handleCreateGrid}>Start Sketch</Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
      </div>
      <Alert variant="danger" className="col-sm-4 offset-sm-4" show={showAlert} onClose={() => setShowAlert(false)} transition={false} dismissible>
        That's not a usable number!
      </Alert>
    </div>
    </>
  )
}