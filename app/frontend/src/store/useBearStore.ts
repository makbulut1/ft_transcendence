import { create, StateCreator } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'

interface User {
  id?: number;
  token?: string;
  fullName?: string;
  email?: string;
  login?: string;
}


type MyState = {
  token: string | undefined
  authenticated: boolean
  user? : User
  authenticate: (user: User) => Promise<void>
  unauthenticate: () => Promise<void>
}
type MyPersist = (
  config: StateCreator<MyState>,
  options: PersistOptions<MyState>
) => StateCreator<MyState>

const useStoreUser = create<MyState>(
  (persist as MyPersist)(
    (set) => ({
      token: undefined,
      authenticated: false,
      authenticate: async (user: User) => {
        set({ user })
        set({ authenticated: true })
      },
      unauthenticate: async () => {
        set({ user: undefined })
        set({ authenticated: false })
      }
    }),
    { name: 'auth-store' }
  )
)

export { useStoreUser }