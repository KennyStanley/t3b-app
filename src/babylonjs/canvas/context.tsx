import { createContext, useContext } from 'react'
import { Scene } from '@babylonjs/core/scene'

type CanvasProviderProps = {
  children: React.ReactNode
  scene: Scene
  isHidden: boolean
  setIsHidden: (isHidden: boolean) => void
}

type CanvasContextValue = {
  scene: Scene
  isHidden: boolean
  setIsHidden: (isHidden: boolean) => void
}

export const CanvasContext = createContext<CanvasContextValue>({
  scene: {} as Scene,
  isHidden: false,
  setIsHidden: () => {},
})

export const CanvasProvider = ({
  children,
  scene,
  isHidden,
  setIsHidden,
}: CanvasProviderProps) => {
  return (
    <CanvasContext.Provider value={{ scene, isHidden, setIsHidden }}>
      {children}
    </CanvasContext.Provider>
  )
}
