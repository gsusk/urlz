import Shortener from "../components/Shortener";

function Home() {
  return (
    <div>
      <section className="main-container">
        <div className="presentation">
          <h1 className="title">
            <span>U</span>
            <span>R</span>
            <span>L</span>
            <span>Z</span>
            <span>Y</span>
          </h1>
          <small>
            <i>Shorten Any Link</i>
          </small>
          <div className="main-description">
            <p>
              Introducing , the ultimate URL shortening tool designed to
              simplify your links and streamline your online experience. With
              [Your Project Name], long and cumbersome URLs become concise and
              shareable with just a click
            </p>
          </div>
        </div>
      </section>
      <section className="main-container">
        <Shortener />
        <div>asd</div>
      </section>
    </div>
  );
}

export default Home;
