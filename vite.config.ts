import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        proxy: {
            "/form/api": {
                target: "http://localhost:3000",
                // For production, uncomment below and comment the local target
                // target: "https://rpcapplication.aiims.edu",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/form\/api/, "/form/api"),
                configure: (proxy) => {
                    proxy.on("proxyReq", (proxyReq, req) => {
                        console.log(
                            `[Proxy] Request: ${req.method} ${req.url}`
                        );
                    });
                    proxy.on("proxyRes", (proxyRes, req) => {
                        console.log(
                            `[Proxy] Response: ${req.method} ${req.url} -> ${proxyRes.statusCode}`
                        );
                    });
                    proxy.on("error", (err, req) => {
                        console.error(`[Proxy] Error: ${req.url}`, err);
                    });
                },
            },
        },
    },
});
