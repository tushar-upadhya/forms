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
    // server: {
    //     proxy: {
    //         "/form/api": {
    //             target: "https://rpcapplication.aiims.edu",
    //             changeOrigin: true,
    //             secure: false,
    //             rewrite: (path) => path.replace(/^\/form\/api/, "/form/api"),
    //         },
    //     },
    // },
});
