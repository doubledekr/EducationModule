import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/800.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/material-icons";

createRoot(document.getElementById("root")!).render(<App />);
