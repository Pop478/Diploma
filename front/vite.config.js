import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
    base: '/',
    plugins: [react(), svgr()],
    server: {
        port: 443,
        https: {
            cert: readFileSync(
                resolve(
                    dirname(fileURLToPath(import.meta.url)),
                    './tma.internal.pem'
                )
            ),
            key: readFileSync(
                resolve(
                    dirname(fileURLToPath(import.meta.url)),
                    './tma.internal-key.pem'
                )
            ),
        },
        host: 'tma.internal',
    },
    publicDir: './public',
})
