import "./styles/variables.css";
import "./styles/global.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

function App() {
  return (
    <>
      <section id="center">
        <RouterProvider router={router} />
      </section>
    </>
  );
}

export default App;
