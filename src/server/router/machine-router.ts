import { createRouter } from './context'
import { z } from 'zod'

export const machineRouter = createRouter()
  .query('data', {
    async resolve({ ctx }) {
      try {
        const machine = await ctx.prisma.machine.findFirst({
          where: { name: 'toggle' },
          select: { state: true, count: true },
        })
        return machine
      } catch (error) {
        console.log('error', error)
      }
    },
  })
  .mutation('toggle', {
    async resolve({ ctx }) {
      try {
        const toggleMachine = await ctx.prisma.machine.findFirst({
          select: { state: true, count: true },
          where: { name: 'toggle' },
        })
        if (!toggleMachine) return
        return await ctx.prisma.machine.updateMany({
          where: { name: 'toggle' },
          data: {
            state: toggleMachine.state === 'on' ? 'off' : 'on',
            count: toggleMachine.count + 1,
          },
        })
      } catch (error) {
        console.error('error', error)
      }
    },
  })
