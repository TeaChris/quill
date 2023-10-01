import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from './trpc'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { db } from '@/db'

export const appRouter = router({
  authCallback: publicProcedure.query(() => {
    const { getUser } = getKindeServerSession()
    const user = getUser()

    if (!user || !user.id) throw new TRPCError({ code: 'UNAUTHORIZED' })

    // check if the user is in the database
    // const dbUser = await db.user.findFirst

    return { success: true }
  }),
})

export type AppRouter = typeof appRouter
