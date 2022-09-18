import { useEffect } from 'react'
import * as BABYLON from '@babylonjs/core'

import { useCanvas } from '@/babylonjs/canvas'

const skyboxUrls = {
  '1': 'https://www.babylonjs-playground.com/textures/TropicalSunnyDay',
  '2': 'https://www.babylonjs-playground.com/textures/skybox',
  '3': 'https://www.babylonjs-playground.com/textures/skybox2',
  '4': 'https://www.babylonjs-playground.com/textures/skybox3',
  '5': 'https://www.babylonjs-playground.com/textures/skybox4',
}

export const Skybox = () => {
  const { scene } = useCanvas()

  useEffect(() => {
    if (!scene) return
    const skyboxTexture = new BABYLON.CubeTexture(skyboxUrls['3'], scene)

    // Skybox
    var skybox = BABYLON.MeshBuilder.CreateBox(
      'skyBox',
      { size: 1000.0 },
      scene
    )
    var skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene)
    skyboxMaterial.backFaceCulling = false
    skyboxMaterial.reflectionTexture = skyboxTexture
    skyboxMaterial.reflectionTexture.coordinatesMode =
      BABYLON.Texture.SKYBOX_MODE
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
    skyboxMaterial.disableLighting = true
    skybox.material = skyboxMaterial

    // This makes the skybox follow the camera's position
    skybox.infiniteDistance = true

    return () => {
      console.log('Skybox dispose')
      skybox.dispose()
      skyboxMaterial.dispose()
    }
  }, [scene])

  return <></>
}
