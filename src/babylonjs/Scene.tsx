import { createContext, useContext } from 'react'
import * as BABYLON from '@babylonjs/core'

type SceneProviderProps = {
  children: React.ReactNode
  scene: BABYLON.Scene
}

type SceneContextValue = {
  scene?: BABYLON.Scene
}

export const SceneContext = createContext<SceneContextValue>({})

export const SceneProvider = ({ children, scene }: SceneProviderProps) => {
  return (
    <SceneContext.Provider value={{ scene }}>{children}</SceneContext.Provider>
  )
}

export const useScene = () => useContext(SceneContext)
