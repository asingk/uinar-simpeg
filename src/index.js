import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import App from './App'
import store from './store'
import './i18n'
import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,
})

keycloak
  .init({ onLoad: 'login-required' })
  .then((auth) => {
    if (!auth) {
      console.debug('User is not authenticated')
      window.location.reload()
    } else {
      console.debug('User is authenticated')
    }

    createRoot(document.getElementById('root')).render(
      <Provider store={store}>
        <App keycloak={keycloak} />
      </Provider>,
    )

    setInterval(() => {
      keycloak
        .updateToken(70)
        .then((refreshed) => {
          if (refreshed) {
            console.debug('Token refreshed ' + refreshed)
          } else {
            console.debug(
              'Token not refreshed, valid for ' +
                Math.round(
                  keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000,
                ) +
                ' seconds',
            )
          }
        })
        .catch(() => {
          console.error('Failed to refresh token')
        })
    }, 60000)
  })
  .catch((error) => {
    console.error('Failed to initialize adapter:', error)
  })
