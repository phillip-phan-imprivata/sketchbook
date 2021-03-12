import React from "react"
import { ApplicationViews } from "./ApplicationViews"
import { NavBar } from "./nav/NavBar"

export const Sketchbook = () => {
  sessionStorage.sketch_user = 1
  return (
    <>
      <NavBar />
      <ApplicationViews />
    </>
  )
}