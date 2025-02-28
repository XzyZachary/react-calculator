import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("app") as any);

root.render(<App />);
