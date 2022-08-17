import { Mesh, MeshBuilder } from '@babylonjs/core'
import { AdvancedDynamicTexture, TextBlock } from '@babylonjs/gui'
import { useEffect, useRef } from 'react'
import { useMachineContext } from '../../contexts/MachineContext'

export const DataCard = () => {
  const [state] = useMachineContext()

  const textRef = useRef<TextBlock | null>(null)

  useEffect(() => {
    // Get scene from machine and return if not there  
    const { scene } = state.context
    if (!scene) return

    // After first render, just change the text
    if (textRef.current) {
      textRef.current.text = `state: ${state?.context?.data?.state}\n`
      textRef.current.text += `count: ${state?.context?.data?.count}`
      return
    }

    // Create Plane for DataCard
    const dataCard = MeshBuilder.CreatePlane('dataCard', {
      height: 2,
      width: 2,
      sideOrientation: Mesh.DOUBLESIDE,
    })

    dataCard.position.y = 1.5

    // BabylonJS GUI Element
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

    // Set reference to TextBlock on initial render
    textRef.current = text

  }, [state.context])

  return <></>
}
