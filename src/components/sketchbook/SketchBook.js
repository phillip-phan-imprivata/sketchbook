import React, { useContext, useEffect } from "react"
import { SketchContext } from "../sketch/SketchProvider"

export const SketchBook = () => {
  const {sketches, getSketches} = useContext(SketchContext)

  useEffect(() => {
    getSketches()
  }, [])

  return (
    <div className="sketches">
    
    </div>
  )
}