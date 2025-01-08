import { Provider } from 'react-redux'
import ReactDom from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from "@mui/material/styles"
import { store } from './app/store'
import App from './app/App'
import theme from './app/materialStyle';
import React from 'react';
import { socket, socketContext } from "./app/components/Context/socketIo"

const root = ReactDom.createRoot(document.getElementById('root')!)

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <Router>
          <socketContext.Provider value={socket}>
            <App />
          </socketContext.Provider>
        </Router>
      </ThemeProvider>
    </React.StrictMode>
  </Provider>, 
)