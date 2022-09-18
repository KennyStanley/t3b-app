import { useEffect } from 'react'
import * as BABYLON from '@babylonjs/core'

import { useCanvas } from '@/babylonjs/canvas'

export const PbrSkybox = () => {
  const { scene } = useCanvas()

  useEffect(() => {
    if (!scene) return
    const environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
      '/skyboxes/station_night_2k.env',
      scene
    )
    scene.environmentTexture = environmentTexture
    scene.environmentIntensity = 0.5

    const skybox = scene.createDefaultSkybox(environmentTexture, true)

    return () => {
      skybox?.dispose()
    }
  }, [scene])

  return <></>
}
