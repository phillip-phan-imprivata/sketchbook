import React, { useContext } from "react"
import { GridContext } from "../grid/GridProvider"
import { SketchPad } from "./SketchPad"

export const Sketch = () => {
  const {gridInput} = useContext(GridContext)

  return (
    <div className="sketch">
      <SketchPad size={gridInput} />
    </div>
  )
}