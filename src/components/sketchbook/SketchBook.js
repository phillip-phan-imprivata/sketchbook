import React, { useContext, useEffect } from "react"
import { SketchContext } from "../sketch/SketchProvider"
import { SketchCard } from "./SketchCard"

export const SketchBook = () => {
  const {sketches, getSketches} = useContext(SketchContext)

  useEffect(() => {
    getSketches()
  }, [])

  return (
    <div className="sketches">
     {
       sketches.map(sketch => {
         return <SketchCard key={sketch.id} sketch={sketch} />
       })
     }
    </div>
  )
}