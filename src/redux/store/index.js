import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { adminReducer } from "../reducers/admin";
import { persistStore, persistReducer } from 'redux-persist';
import { authReducer } from "../reducers/auth";

import storage from 'redux-persist/lib/storage'; 
import { draggedEventReducers } from "../reducers/dragEvent";




const persistConfig = {
    key: 'auth',
    storage,
}


const persistedAuthREducer = persistReducer(persistConfig, authReducer)

const allReducers = combineReducers({
    admin: adminReducer,
    draggedEvent: draggedEventReducers,
    auth: persistedAuthREducer
})


const store = configureStore({
    reducer: allReducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
          },
        }),
})
const persistor = persistStore(store)

export { store, persistor}