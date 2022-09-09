import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'

const HomeWorld = dynamic(() => import('@/worlds/HomeWorld'), { ssr: false })

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>T3X BabylonJS</title>
        <meta name="description" content="T3X BabylonJS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HomeWorld />
    </>
  )
}

export default Home
