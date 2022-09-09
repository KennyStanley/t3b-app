import { Canvas } from '@/babylonjs/Canvas'
import { ArcRotateCamera } from '@/modules/cameras/ArcRotateCamera'
import { HemisphereLight } from '@/modules/lights/HemisphereLight'
import { Skybox } from '@/modules/meshes/Skybox'
import { DynamicGround } from '@/modules/meshes/DynamicGround'
import { Welcome } from '@/modules/ui/Welcome'

const HomeWorld = () => {
  return (
    <Canvas>
      <ArcRotateCamera />
      <HemisphereLight />
      <Skybox />
      <DynamicGround />
      <Welcome />
    </Canvas>
  )
}

export default HomeWorld
