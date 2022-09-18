import { useEffect } from 'react'
import * as BABYLON from '@babylonjs/core'

import { useCanvas } from '@/babylonjs/canvas'

export const HemisphereLight = () => {
  const { scene } = useCanvas()

  useEffect(() => {
    if (!scene) return
    const light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(0, 1, 0),
      scene
    )
    light.intensity = 0.7

    return () => {
      light.dispose()
    }
  }, [scene])

  return <></>
}
