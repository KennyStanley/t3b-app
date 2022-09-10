import { useEffect } from 'react'
import * as BABYLON from '@babylonjs/core'

import { noise } from '@/babylonjs/extensions/NoiseLibrary'

import { useScene } from '@/babylonjs/Scene'

export const DynamicGround = () => {
  const { scene } = useScene()

  useEffect(() => {
    if (!scene) return

    // Map data creation
    // The map is a flat array of successive 3D coordinates (x, y, z).
    // It's defined by a number of points on its width : mapSubX
    // and a number of points on its height : mapSubZ

    var mapSubX = 1000 // point number on X axis
    var mapSubZ = 800 // point number on Z axis
    var seed = 0.3 // seed
    var noiseScale = 0.03 // noise frequency
    var elevationScale = 6.0
    noise.seed(seed)
    var mapData = new Float32Array(mapSubX * mapSubZ * 3) // 3 float values per point : x, y and z

    var paths = [] // array for the ribbon model
    for (var l = 0; l < mapSubZ; l++) {
      var path = [] // only for the ribbon
      for (var w = 0; w < mapSubX; w++) {
        var x = (w - mapSubX * 0.5) * 2.0
        var z = (l - mapSubZ * 0.5) * 2.0
        var y = noise.simplex2(x * noiseScale, z * noiseScale)
        y *= (0.5 + y) * y * elevationScale // let's increase a bit the noise computed altitude

        mapData[3 * (l * mapSubX + w)] = x
        mapData[3 * (l * mapSubX + w) + 1] = y
        mapData[3 * (l * mapSubX + w) + 2] = z

        path.push(new BABYLON.Vector3(x, y, z))
      }
      paths.push(path)
    }

    var map = BABYLON.MeshBuilder.CreateRibbon(
      'm',
      { pathArray: paths, sideOrientation: 2 },
      scene
    )
    map.position.y = -1.0
    var mapMaterial = new BABYLON.StandardMaterial('mm', scene)
    map.material = mapMaterial

    return () => {
      map.dispose()
      mapMaterial.dispose()
    }
  }, [scene])

  return <></>
}
