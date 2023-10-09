import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { UserModel } from '../../types/userModel'

// Define a type for the slice state
interface UserState {
  value: UserModel
}

// Define the initial state using that type
const initialState: UserModel = new UserModel()

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUser: (state, actions: PayloadAction<UserModel>) => {
      state = actions.payload
      return state
    },
    clearUser: (state) => {
      state = new UserModel()
      return state
    },
  },
})

export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer