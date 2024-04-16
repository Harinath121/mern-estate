import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({

  //here server is used to coonect the database link to where ever there is api call starting with 'api/
  // 'https://localhost:3000' added as prefix
  server :{
    proxy :{
      '/api':{
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },

  plugins: [react()],
})
