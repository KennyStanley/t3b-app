// src/server/router/index.ts
import { createRouter } from './context'
import superjson from 'superjson'

import { machineRouter } from './machine-router'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('machine.', machineRouter)

// export type definition of API
export type AppRouter = typeof appRouter
