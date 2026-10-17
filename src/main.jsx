import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { Provider } from 'react-redux'
import {store, persistor } from './redux/store/index.js'
import { PersistGate } from 'redux-persist/integration/react'
import { NotificheProvider } from './components/Notifiche.jsx'


createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <NotificheProvider>
                <App />
            </NotificheProvider>
        </PersistGate>
    </Provider>
 
)
