import { useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useMachine } from '@xstate/react'
import { appMachine, AppMachineState } from '../machines/appMachine'
import { trpc } from '../utils/trpc'
import { Canvas } from '../components/canvas/Canvas'
import { MachineProvider } from '../context/MachineContext'
import { Header } from '../components/ui/two-d/Header'
import { ActionManager, ExecuteCodeAction } from '@babylonjs/core'
import { DataCard } from '../components/ui/three-d/DataCard'

// import { inspect } from '@xstate/inspect'
// if (typeof window !== 'undefined') {
//   inspect({
//     url: 'https://stately.ai/viz?inspect',
//     iframe: false,
//   })
// }

const Home: NextPage = () => {
  // Setup trpc client
  const utils = trpc.useContext()

  const machine = trpc.useQuery(['machine.data'])
  const machineToggle = trpc.useMutation(['machine.toggle'], {
    onSuccess() {
      utils.invalidateQueries(['machine.data'])
      console.log('Machine toggled')
    },
  }).mutate

  // Setup the machine
  const [state, send, machineService] = useMachine(appMachine, {
    devTools: false,
    actions: {
      toggle: () => machineToggle(),
      attachClickHandler: context => {
        const { scene } = context
        if (!scene) return
        const mesh = scene.getMeshByName('sphere')
        if (!mesh) return
        mesh.isPickable = true
        mesh.actionManager = new ActionManager(scene)

        mesh.actionManager.registerAction(
          new ExecuteCodeAction(ActionManager.OnPickTrigger, async ev => {
            console.log(ev)
            send({ type: 'TOGGLE' })
          })
        )
      },
    },
  })

  // Runs first time the component is rendered to setup the machine
  useEffect(() => {
    if (utils.client && machine.data) {
      send('SETUP', {
        trpcClient: utils.client,
        data: machine.data,
      })
    }
  }, [utils.client, machine.data, send])

  // Runs when the trpc data changes
  useEffect(() => {
    if (machine.data) {
      send('UPDATE_DATA', {
        data: machine.data,
      })
    }
  }, [machine.data, send])

  return (
    <>
      <Head>
        <title>T3X BabylonJS</title>
        <meta name="description" content="T3X BabylonJS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="pointer-events-none">
        <Canvas state={state as unknown as AppMachineState} send={send} />
        <MachineProvider service={machineService}>
          <Header />
          <DataCard />
        </MachineProvider>
      </main>
    </>
  )
}

export default Home
