import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages (sitio de proyecto): rutas relativas.
  // Funciona bajo https://<usuario>.github.io/<repo>/ sin saber el nombre exacto del repo.
  // Como el hub navega por estado interno (sin rutas en la URL), './' es seguro.
  base: './',
})