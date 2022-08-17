import { createContext, useContext } from 'react'
import { useActor } from '@xstate/react'
import { AppMachineSend, AppMachineState } from '../machines/appMachine'

type MachineProviderProps = {
  children: React.ReactNode
  service: any
}

const MachineContext = createContext<[AppMachineState, AppMachineSend]>(
  [] as any
)

export const MachineProvider = ({
  children,
  service,
}: MachineProviderProps) => {
  const [state, send] = useActor(service)

  return (
    <MachineContext.Provider
      value={[state, send] as [AppMachineState, AppMachineSend]}
    >
      {children}
    </MachineContext.Provider>
  )
}

export const useMachineContext = () => useContext(MachineContext)
