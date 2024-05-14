import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Header></Header>
      <main className=".test">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <Footer></Footer>
    </>
  );
}

export default App;
