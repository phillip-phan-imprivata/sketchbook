import React, { useContext, useEffect } from "react"
import { SketchContext } from "../sketch/SketchProvider"
import { SketchCard } from "./SketchCard"
import "./SketchBook.css"

export const SketchBook = () => {
  const {sketches, getSketches} = useContext(SketchContext)

  const userId = parseInt(sessionStorage.app_user_id)

  useEffect(() => {
    getSketches()
  }, [])

  return (
    <div className="sketches">
     {
       //filters sketches for ones that have the current user's id
       sketches.filter(sketch => sketch.userId === userId)
       //then maps that array to render each sketch's information
       .map(sketch => {
         return <SketchCard key={sketch.id} sketch={sketch} />
       })
     }
    </div>
  )
}