import "./styles/variables.css"; // Import variables first
import "./styles/global.css";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <>
      <section id="center">
        <LoginPage />
      </section>
    </>
  );
}

export default App;
