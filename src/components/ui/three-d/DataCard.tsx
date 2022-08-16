import { Mesh, MeshBuilder } from '@babylonjs/core'
import { AdvancedDynamicTexture, TextBlock } from '@babylonjs/gui'
import { useEffect, useRef } from 'react'
import { useMachineContext } from '../../../context/MachineContext'

export const DataCard = () => {
  const [state] = useMachineContext()

  const textRef = useRef<TextBlock | null>(null)

  useEffect(() => {
    const { scene } = state.context
    if (!scene) return
    if (textRef.current) {
      textRef.current.text = `state: ${state?.context?.data?.state}\n`
      textRef.current.text += `count: ${state?.context?.data?.count}`
      return
    }

    const dataCard = MeshBuilder.CreatePlane('dataCard', {
      height: 2,
      width: 2,
      sideOrientation: Mesh.DOUBLESIDE,
    })

    dataCard.position.y = 1.5

    const advancedTexture = AdvancedDynamicTexture.CreateForMesh(
      dataCard,
      1024,
      1024,
      false
    )
    const text = new TextBlock('DataCardText')
    text.text = `state: ${state?.context?.data?.state}\n`
    text.text += `count: ${state?.context?.data?.count}`
    text.color = 'white'
    text.fontSize = 200
    advancedTexture.addControl(text)

    textRef.current = text

    console.log('DataCard rendered')
  }, [state.context])

  return <></>
}
