import { useEffect } from 'react'
import * as BABYLON from '@babylonjs/core'

import { useCanvas } from '@/babylonjs/canvas'

export const ArcRotateCamera = () => {
  const { scene } = useCanvas()
  console.log('scene', scene)

  useEffect(() => {
    if (!scene) return
    const camera = new BABYLON.ArcRotateCamera(
      'Camera',
      Math.PI / 2,
      Math.PI / 2.2,
      50,
      BABYLON.Vector3.Zero(),
      scene
    )

    camera.attachControl(
      scene.getEngine().getRenderingCanvas() as HTMLCanvasElement,
      true
    )

    return () => {
      camera.dispose()
    }
  }, [scene])

  return <></>
}
