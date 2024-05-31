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
              Shorten and manage your <span className="denote">Urls</span> with
              ease
            </h1>
            <small>
              <i>Make short and reliable urls.</i>
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
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
