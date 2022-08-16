import { useMachineContext } from '../../../context/MachineContext'

export const Header = () => {
  const [state, send] = useMachineContext()

  return (
    <div className="absolute top-0 left-0 right-0">
      <div className="flex gap-10 w-max mx-auto">
        <h1 className="grow text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-200">
          <span className="text-purple-400">T3X</span> BabylonJS
        </h1>
        <div className="text-lg text-blue-400 flex justify-center items-center">
          {state ? (
            <div className="flex flex-col items-center border-2 rounded-xl p-2">
              <p>state: {state?.context?.data?.state}</p>
              <p>count: {state?.context?.data?.count}</p>
            </div>
          ) : (
            <p>Loading..</p>
          )}
        </div>
      </div>
      <div className="text-center">
        <p>Click the sphere to change the server state</p>
      </div>
    </div>
  )
}
