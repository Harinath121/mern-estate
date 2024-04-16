import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store } from './redux/store.js'
import { Provider } from 'react-redux'


ReactDOM.createRoot(document.getElementById('root')).render(

// this teact.strictmode is reason for double rendering.
<React.StrictMode>

    {/* The Provider component ensures that the Redux store is available to all components in the application without having to pass it explicitly through each component's props. */}

    <Provider store={store}>
        <App />
    </Provider>
  </React.StrictMode>,
)
