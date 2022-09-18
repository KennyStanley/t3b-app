import { ArcRotateCamera } from '@/babylonjs/modules/cameras/ArcRotateCamera'
import { Skybox } from '@/babylonjs/modules/environment/Skybox'
import { HemisphereLight } from '@/babylonjs/modules/lights/HemisphereLight'
import { DynamicGround } from '@/babylonjs/modules/meshes/DynamicGround'
import { Welcome } from '@/babylonjs/modules/ui/Welcome'

const HomeWorld = () => {
  return (
    <>
      <ArcRotateCamera />
      <HemisphereLight />
      <Skybox />
      <DynamicGround />
      <Welcome />
    </>
  )
}

export default HomeWorld
