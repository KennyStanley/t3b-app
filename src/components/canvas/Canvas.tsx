import React, { useCallback, useEffect, useRef } from 'react'
import Script from 'next/script'
import { useActor } from '@xstate/react'
import { Engine, Scene } from '@babylonjs/core'
import { useMachineContext } from '../../context/MachineContext'
import { AppMachineSend, AppMachineState } from '../../machines/appMachine'

export interface EngineType extends Engine {
  renderLoop: () => void
}

export const Canvas = ({
  state,
  send,
}: {
  state: AppMachineState
  send: AppMachineSend
}) => {
  useEffect(() => {
    console.log('State:', state)
  }, [state])

  const canvasHtmlElement = useRef<HTMLCanvasElement>(null)

  const createEngine = useCallback((canvas: HTMLCanvasElement) => {
    const engine = new Engine(canvas, true) as EngineType
    engine.renderLoop = () =>
      engine.scenes.forEach(scene => {
        if (scene?.activeCamera) {
          scene?.render()
        }
      })
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        engine.resize()
        // send({ type: 'CANVAS_RESIZE' })
      })
    }
    return engine
  }, [])

  useEffect(() => {
    if (!canvasHtmlElement.current) return
    if (!state?.matches('mountingCanvas') || state?.context?.engine) return

    const engine = createEngine(canvasHtmlElement.current)

    send({ type: 'CANVAS_MOUNTED', engine })
    console.log('CANVAS_MOUNTED', engine)
  }, [canvasHtmlElement, state, send, createEngine])

  return (
    <div
      id="canvasContainer"
      className="absolute w-screen h-screen top-0 left-0 pointer-events-auto"
    >
      <Script src="https://code.jquery.com/pep/0.4.3/pep.min.js" />
      <canvas
        id="renderCanvas"
        ref={canvasHtmlElement}
        className="w-screen h-screen touch-none"
      />
    </div>
  )
}
