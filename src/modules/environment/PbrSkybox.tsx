import { useEffect } from 'react'
import * as BABYLON from '@babylonjs/core'

import { useScene } from '@/babylonjs/Scene'

export const PbrSkybox = () => {
  const { scene } = useScene()

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
