import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHome, FiSlash } from "react-icons/fi";
import RoutePaths from "../routes/routePaths";
import "../styles/pages/notFound.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="not-found-page">
      <div className="not-found-backdrop " />
      <div className="not-found-backdrop " />

      <section className="not-found-card" aria-labelledby="not-found-title">
        <p className="not-found-code">404</p>
        <h1 id="not-found-title" className="not-found-title">
          The page you are looking for does not exist.
        </h1>
        <p className="not-found-copy">
          The link may be broken, the page may have moved, or the URL may have
          been typed incorrectly.
        </p>

        <div className="not-found-actions">
          <button
            type="button"
            className="not-found-secondary"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft />
            Go back
          </button>
          <button
            type="button"
            className="not-found-primary"
            onClick={() => navigate(RoutePaths.ROOT)}
          >
            <FiHome />
            Go home
          </button>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
