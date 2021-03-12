import React, { createContext, useState } from "react"

export const SketchContext = createContext()

export const SketchProvider = (props) => {
  const [sketches, setSketches] = useState([])

  const getSketches = () => {
    return fetch("http://localhost:8088/sketches")
    .then(res => res.json())
    .then(setSketches)
  }

  const saveSketch = (obj) => {
    return fetch("http://localhost:8088/sketches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(obj)
    })
    .then(getSketches)
  }

  return (
    <SketchContext.Provider value={{
      sketches, getSketches, saveSketch
    }}>
      {props.children}
    </SketchContext.Provider>
  )
}