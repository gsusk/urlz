import { Outlet } from "react-router-dom";
import Shortener from "../components/Shortener";

function Home() {
  return (
    <>
      <Outlet />
      <div className="h-container">
        <section className="main-container bmt">
          <div className="presentation">
            <h1 className="title">
              <span>U</span>
              <span>R</span>
              <span>L</span>
              <span>Z</span>
              <span>Y</span>
            </h1>
            <small>
              <i>Shorten Any Url</i>
            </small>
            <div className="main-description">
              <p>
                Introducing URLZY, the ultimate URL shortening tool designed to
                simplify your links and streamline your online experience.
              </p>
            </div>
          </div>
          <div>
            <Shortener />
            <div>asd</div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
