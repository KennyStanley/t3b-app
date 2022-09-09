import { useScene } from '@/babylonjs/Scene'

export const Welcome = () => {
  const { scene } = useScene()

  return (
    <section className="absolute top-0 left-0 w-screen h-screen">
      <div className="h-screen grid place-items-center">
        <div
          className="p-8 rounded-3xl text-center"
          style={{ backgroundColor: 'hsla(0, 0%, 0%, 0.5)' }}
        >
          <h1 className="text-4xl mb-3">Welcome</h1>
          <p>Scene is mounted: {scene ? 'true' : 'false'}</p>
        </div>
      </div>
    </section>
  )
}
