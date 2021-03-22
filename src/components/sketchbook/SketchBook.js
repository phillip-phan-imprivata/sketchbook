import React, { useContext, useEffect } from "react"
import { SketchContext } from "../sketch/SketchProvider"
import { SketchCard } from "./SketchCard"

export const SketchBook = () => {
  const {sketches, getSketches} = useContext(SketchContext)

  const userId = parseInt(sessionStorage.app_user_id)

  useEffect(() => {
    getSketches()
  }, [])

  return (
    <div className="sketches">
     {
       sketches.filter(sketch => sketch.userId === userId)
       .map(sketch => {
         return <SketchCard key={sketch.id} sketch={sketch} />
       })
     }
    </div>
  )
}