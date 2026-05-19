import "./styles/variables.css";
import "./styles/global.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InventoryProvider } from "./context/InventoryContext";

function App() {
  return (
    <InventoryProvider>
      <>
        <section id="center">
          <RouterProvider router={router} />
        </section>
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    </InventoryProvider>
  );
}

export default App;
