import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const manifest = {
  name: 'GlowPath',
  short_name: 'GlowPath',
  description: 'This is where the app description goes',
  icons: [
    {
      src: 'icon-32.png',
      sizes: '32x32',
      type: 'image/png'
    },
    {
      src: 'icon-72.png',
      sizes: '72x72',
      type: 'image/png'
    },
    {
      src: 'icon-128.png',
      sizes: '128x128',
      type: 'image/png'
    },
    {
      src: 'icon-144.png',
      sizes: '144x144',
      type: 'image/png'
    },
    {
      src: 'icon-192.png',
      sizes: '192x192',
      type: 'image/png'
    },
    {
      src: 'icon-512.png',
      sizes: '512x512',
      type: 'image/png'
    },
  ]
}

// https://vite.dev/config/
export default defineConfig(({command}) => {
  if (command === "serve") {
    return {
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          // Enable this to get dev friendly versions of the service worker when running npm run build
          /* devOptions: {
            enabled: true
          }, */
          manifest: manifest
        })
      ]
    }
  } else {
    return {
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          // Enable this to get dev friendly versions of the service worker when running npm run build
          /* devOptions: {
            enabled: true
          }, */
          manifest: manifest
        })
      ],
      base: "/GlowPath/"
    }
  }
})





