import {
  ActionManager,
  ArcRotateCamera,
  Color3,
  Color4,
  CreateSphere,
  ExecuteCodeAction,
  HemisphericLight,
  Scene,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core'
import { TRPCClient } from '@trpc/client'
import { assign, createMachine, Interpreter, send, spawn, State } from 'xstate'
import { EngineType } from '../components/canvas/Canvas'
import { AppRouter } from '../server/router'

export type AppData = {
  state: 'on' | 'off'
  count: number
}

export type AppMachineContext = {
  trpcClient?: TRPCClient<AppRouter>
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
      type: 'SETUP'
      trpcClient: TRPCClient<AppRouter>
      data: AppData
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

export type AppMachineState = State<AppMachineContext, AppMachineEvent, any>
export type AppMachineSend = (event: AppMachineEvent) => void
export type AppMachineService = Interpreter<
  AppMachineContext,
  any,
  AppMachineEvent
>

export const appMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEMAOqB0BLAdlgLlsgDZYBeuUAxAMoCiAKgKoAKioqA9rAVpzuxAAPRAEYAbAFYM4gAwBOAMwB2AByKALBsXyATBIA0IAJ6J5sjLKtXRq1aN27Zk5QF9XRtJgC2nAK44hDhQAMLIOABuyLBUIQCCAHIAanE0APoAsgDyTAkMdAAiglw8hPyCIgga8qIYSsrV1eoaoraSRqYIorIaGJLWsrb2js7i7p7oGADGAE5gyEFQNFNgOGBUxdy85UjCiIqK4jIKOv3i4oqSusodiMoNdfJPyvKSqlfKB+MgXhhzyBBjBhYMYcFNKMtVutNqU+AJdpVlLJVBgGk8lIpWvo3rcEOIHgNZOJVPI1Mj5N9fv9AVQGFkAOL0gAydBh23hoEqdhRoiu4leDWU1wUuP60je5kUunk2iUGgalMm1OMVFYBTi+TS6oYcTZZQ5ewQQsUGAc1VJ1VESMk8lxLSO6KexPEGguug07g8IBwnAgcEEv1wvBI5EoerhFUQGl0uNaKPNT1U2l0mPEukVPn8gUoYUi0XDO05+1E8gwuikaftOlkMZMYlsfQGoldmOUvLcXt+s3mi0hawLBsqLlxQt6hJ6qnuKYpnaV80BGE4ADMlwPIwg3ibVLp7ApWi0VO060arBgE-cLtp7qoM3950DCyASuz15Ky+bPu6NKoLqIR8Sz0de4rE+WQOwmTBlWBUFwWCPswDXBFEEkFC6iJL95GaVpbWPZQAITUkkTAxQwNvZVEKLDdMTQysmk0bDcTkXRLGsS4pUkZsSwzCjDVsWMb09IA */
  createMachine(
    {
      context: {
        trpcClient: undefined,
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
            SETUP: {
              actions: ['setTrpcClient', 'updateData'],
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
        setTrpcClient: assign({
          trpcClient: (_, event) => {
            return event.trpcClient
          },
        }),
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
