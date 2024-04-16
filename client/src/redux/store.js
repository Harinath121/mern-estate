import { combineReducers, configureStore } from '@reduxjs/toolkit'

//redux toolkit is used to build redux logic

import userReducer from './user/userSlice';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage'
import persistStore from 'redux-persist/es/persistStore';

const rootReducer = combineReducers({user:userReducer})

const persistConfig = {
    key : 'root',
    storage,
    version:1,
}

const persistedReducer = persistReducer(persistConfig,rootReducer)



export const store = configureStore({
  reducer: persistedReducer,
  
  //Basically reduxTool is synchronus but adding a middleware makes it asynchronus which is what we are doing below.

  middleware:(getDefaultMiddleware)=>
  getDefaultMiddleware({
    serializableCheck:false,
  }),
});

export const persistor = persistStore(store);

// Basically redux is used to store the state of the whole application (imagine like storing varibales as global) sucht the state stored in redux is access throughout the application.