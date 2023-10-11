import userSlice from './slice/user.slice';
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import authSlice, { isSignedIn, signOut } from './slice/auth.slice';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
 

const userPersistConfig = {
  key: 'user',
  storage,
}

const authPersistConfig = {
  key: 'auth',
  storage
}

const userReducer = persistReducer(userPersistConfig, userSlice)
const authReducer = persistReducer(authPersistConfig, authSlice)

const rootReducer = combineReducers({
    userReducer,
    authReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }),
})

export const persistor = persistStore(store)  
  
  // Infer the `RootState` and `AppDispatch` types from the store itself
  export type RootState = ReturnType<typeof store.getState>
  // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
  export type AppDispatch = typeof store.dispatch