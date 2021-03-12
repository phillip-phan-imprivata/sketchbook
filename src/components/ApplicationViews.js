import React from "react"
import { Route } from "react-router-dom"
import { Sketch } from "./sketch/Sketch"
import { SketchProvider } from "./sketch/SketchProvider"
import { SketchBook } from "./sketchbook/SketchBook"

export const ApplicationViews = () => {
  return (
    <SketchProvider>
      <Route exact path="/sketch">
        <Sketch />
      </Route>

      <Route exact path="/sketchbook">
        <SketchBook />
      </Route>
    </SketchProvider>
  )
}