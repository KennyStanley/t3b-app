// External
import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import * as BABYLON from '@babylonjs/core'
// Internal
import { SceneProvider } from './Scene'

export const Canvas = ({ children }: { children?: React.ReactNode }) => {
  // Keeps track of the canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Keep track of the scene
  const [scene, setScene] = useState<BABYLON.Scene>()

  // Handles creating and disposing of the Babylon engine and scene
  useEffect(() => {
    // return if the canvas is not mounted
    if (!canvasRef.current) return

    // Create the Babylon engine
    const engine = new BABYLON.Engine(canvasRef.current, true)

    // Create a scene
    const scene = new BABYLON.Scene(engine)

    // Run the render loop
    engine.runRenderLoop(() => {
      if (scene.activeCamera) scene.render()
    })

    // Set the scene state
    setScene(scene)
    console.log('Scene created')

    // Attach a resize event handler to the window
    const resize = () => scene.getEngine().resize()
    window.addEventListener('resize', resize)

    return () => {
      // Dispose the scene, engine, and resize handler when the component unmounts
      scene.dispose()
      engine.dispose()
      window.removeEventListener('resize', resize)
      console.log('Scene disposed')
    }
  }, [canvasRef, setScene])

  return (
    <>
      <div
        id="canvasContainer"
        className="absolute w-screen h-screen top-0 left-0"
      >
        <Script src="https://code.jquery.com/pep/0.4.3/pep.min.js" />
        <canvas
          id="renderCanvas"
          ref={canvasRef}
          className="w-screen h-screen touch-none"
        />
      </div>
      {/* Render the children under the scene provider once the scene is ready */}
      {scene && (
        <SceneProvider scene={scene}>
          {/* add pointer-events-auto to any child UI modules that you want to click on */}
          <span className="pointer-events-none">{children}</span>
        </SceneProvider>
      )}
    </>
  )
}

export default Canvas
