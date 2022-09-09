import { useEffect } from 'react'
import * as BABYLON from '@babylonjs/core'

import { useScene } from '@/babylonjs/Scene'

export const HemisphereLight = () => {
  const { scene } = useScene()

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
