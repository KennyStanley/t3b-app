import { createContext, useContext } from 'react'
import { useActor } from '@xstate/react'

type MachineProviderProps = {
  children: React.ReactNode
  service: any
}

const MachineContext = createContext([] as any)

export const MachineProvider = ({
  children,
  service,
}: MachineProviderProps) => {
  const [state, send] = useActor(service)

  return (
    <MachineContext.Provider value={[state, send]}>
      {children}
    </MachineContext.Provider>
  )
}

export const useMachineContext = () => useContext(MachineContext)
