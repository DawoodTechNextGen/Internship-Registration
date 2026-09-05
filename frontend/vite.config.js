import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The production build lives inside WordPress, in the /internship-registration
// folder, so built assets must be requested from that folder. URLs are still
// routed from the domain root (see basename in main.jsx), which is why the dev
// server keeps base "/" — same URLs locally as in production.
// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/internship-registration/" : "/",
  plugins: [tailwindcss(), react()],
}));
