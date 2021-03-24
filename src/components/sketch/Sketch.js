import React, { useContext } from "react"
import { GridContext } from "../grid/GridProvider"
import { SketchPad } from "./SketchPad"

export const Sketch = () => {
  const {gridInput} = useContext(GridContext)

  //when user clicks button on form, the number in the state variable determines the size of the grid
  return (
    <div className="sketch">
      <SketchPad size={gridInput} />
    </div>
  )
}