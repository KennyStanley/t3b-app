import {
  ArcRotateCamera,
  Color3,
  CreateSphere,
  HemisphericLight,
  Scene,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core'
import { assign, createMachine, Interpreter } from 'xstate'
import { EngineType } from '../components/canvas/Canvas'
import { Typegen0 } from './appMachine.typegen'

export type AppData = {
  state: 'on' | 'off'
  count: number
}

export type AppMachineContext = {
  data: AppData
  engine?: EngineType
  scene?: Scene
  toggleSphere?: any
}

export type AppMachineEvent =
  | {
      type: 'TOGGLE'
    }
  | {
      type: 'UPDATE_DATA'
      data: AppData
    }
  | {
      type: 'CANVAS_MOUNTED'
      engine: EngineType
    }
  | {
      type: 'CANVAS_UNMOUNTED'
    }

export type AppMachineState = {
  context: AppMachineContext
  matches: (state: Typegen0['matchesStates']) => boolean
}
export type AppMachineSend = (event: AppMachineEvent) => void
export type AppMachineService = Interpreter<
  AppMachineContext,
  any,
  AppMachineEvent
>

export const appMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEMAOqB0BLAdlgLlsgDZYBeuUAxAKoAKAIgIIAqAogPrMtOKioB7WASwCcfEAA9EARgBsAVgxyADAE4AzAoAsAJgUbVGtQoA0IAJ6IAHGoxqHa6-usB2a9rnyAvt-NpMAFsBAFccQhwoAGFkHAA3ZFgqKKYAOQA1JgBlDgBZAHkaVPYGCUFhQjEJaQRtTQwZNzrtFVddbQVnOXMrBFt7R2dO908fPxAAjABjACcwZAioLKmwHDAqMqERKqQpRA1DZXUNd1cVbVcZLTNLRFdPDBUn8+cPVzk5NV9-dAw55AgFgwsAsOCmlGWq3WmwqonEuxqZ2sGFcCmeHzkHg82h6iDkHUez201gMMnu7m+E1+-0BVBY+QA4gyADJsGHbeGgRHaGT2VSaBT497aA642qowlPDTWGSdHRObSUyY0iy0RisTjcXi7coc6p3XQaBr6FQyFquVxqGTyMXS1wDBz4lT43TuQ2+cY4AQQOASSa4EQkciUdmVTl7Wq6MUyFRGxwmaxud6W93jSbBMKLGLxRKhuH6hAaXQqDAKWUKBzOs4qG69GNxxydJNyFMaJW-WbzRaQtZ5nZcxAKVxiz5KZ4qazStGmtrtzAqjACABmS774ZqnSNr3kaJjamd3VuCBbvOnVx5MbkGllc7+80Bi-DurDBf3RpNT3u6j0bTFrmMpbPGc0omEOXxptS95AiCYIQisvY6lsL4IoOChKPuci6Go2gdIomFqH+AHTq0sa2Ghlq3iqa4FqS9jOlhOGCoKWFikORrPNauj6LozhmnO1EoQgjTRtYHreEAA */
  createMachine(
    {
      context: {
        data: {
          state: 'off',
          count: 0,
        },
        toggleSphereMachine: undefined,
      } as AppMachineContext,
      tsTypes: {} as import('./appMachine.typegen').Typegen0,
      schema: {
        events: {} as AppMachineEvent,
      },
      predictableActionArguments: true,
      id: 'app',
      initial: 'initializing',
      states: {
        initializing: {
          on: {
            UPDATE_DATA: {
              actions: 'updateData',
              target: 'mountingCanvas',
            },
          },
        },
        mountingCanvas: {
          on: {
            CANVAS_MOUNTED: {
              actions: 'assignEngineToContext',
              target: 'creatingScene',
            },
          },
        },
        creatingScene: {
          entry: ['createScene', 'configureScene', 'setCameraArcRotate'],
          exit: 'runRenderLoop',
          always: {
            actions: ['addMesh', 'attachClickHandler'],
            target: 'ready',
          },
        },
        ready: {
          initial: 'syncingScene',
          states: {
            off: {},
            on: {},
            syncingScene: {
              always: [
                {
                  actions: 'turnMeshOn',
                  cond: 'isOn',
                  target: 'on',
                },
                {
                  actions: 'turnMeshOff',
                  target: 'off',
                },
              ],
            },
          },
          on: {
            TOGGLE: {
              actions: 'toggle',
            },
            UPDATE_DATA: {
              actions: 'updateData',
              target: 'ready',
              internal: false,
            },
          },
        },
      },
    },
    {
      actions: {
        updateData: assign({
          data: (_, event) => {
            return event.data
          },
        }),
        assignEngineToContext: assign({
          engine: (_, event) => {
            console.log('assigning engine to context')
            return event.engine
          },
        }),
        runRenderLoop: context => {
          const { scene } = context
          if (!scene) return
          const engine = scene.getEngine() as EngineType
          engine.runRenderLoop(engine.renderLoop)
          console.log('render loop started')
        },
        createScene: assign({
          scene: context => {
            const { engine } = context
            if (!engine) return
            const scene = new Scene(engine)
            return scene
          },
        }),
        configureScene: async context => {
          const { scene } = context
          if (!scene) return
          // Create a hemisphere light
          const light = new HemisphericLight(
            'Light',
            new Vector3(0.33, 1, -0.67),
            scene
          )
          light.intensity = 0.7
          console.log('scene configured')
        },
        setCameraArcRotate: async context => {
          const { scene } = context
          if (!scene) return

          const camera = new ArcRotateCamera(
            'main-camera', // camera name
            -Math.PI / 2, // alpha
            Math.PI / 2, // beta
            10, // radius
            new Vector3(0, 0, 0), // target position
            scene
          )

          const canvas = scene.getEngine().getRenderingCanvas()

          camera.attachControl(canvas, true)

          console.log('camera configured')
        },
        addMesh: context => {
          const { scene } = context
          if (!scene) return
          console.log('Scene:', scene)
          const mesh = CreateSphere(
            'sphere',
            { segments: 16, diameter: 2 },
            scene
          )

          console.log('mesh added')
        },
        turnMeshOn: context => {
          const { scene } = context
          if (!scene) return
          const mesh = scene.getMeshByName('sphere')
          if (!mesh) return
          var material = new StandardMaterial('blueMaterial', scene)
          material.alpha = 1
          material.diffuseColor = new Color3(0, 0, 0.8)
          mesh.material = material
        },
        turnMeshOff: context => {
          const { scene } = context
          if (!scene) return
          const mesh = scene.getMeshByName('sphere')
          if (!mesh) return
          var material = new StandardMaterial('grayMaterial', scene)
          material.alpha = 1
          material.diffuseColor = new Color3(0.2, 0.2, 0.2)
          mesh.material = material
        },
      },
      guards: {
        isOn: context => {
          return context.data.state === 'on'
        },
      },
    }
  )
