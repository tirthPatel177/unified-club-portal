import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Helpers/reducers/reducers'

const store = configureStore({ reducer: authReducer })

export default store;