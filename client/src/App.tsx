import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Guest from "./components/Guest";
import Verify from "./pages/Verify";
import Authenticated from "./components/Authenticated";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route element={<Guest />}>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Route>
            <Route element={<Authenticated />}>
              <Route path="/verify-email" element={<Verify />}></Route>
            </Route>
          </Route>
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
