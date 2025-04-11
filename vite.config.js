import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss(),
  ],
  server: {
    allowedHosts: [
      '8a27-146-120-212-157.ngrok-free.app', // Добавьте эту строку
      'bd56-146-120-212-131.ngrok-free.app',
      '1fcf-146-120-212-131.ngrok-free.app',
      '199f-212-42-101-171.ngrok-free.app'
    ],
  },
})


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true, // Разрешает принимать внешние подключения
//     cors: true, // Включает CORS
//   },
// })
