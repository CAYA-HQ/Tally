import "./styles/variables.css";
import "./styles/global.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <section id="center">
        <RouterProvider router={router} />
      </section>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
