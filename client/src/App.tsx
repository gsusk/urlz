import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import { useAppDispatch, useAppSelector } from "./hooks/appSelector";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);
  const dispatch = useAppDispatch();

  return (
    <>
      <Header></Header>
      <main>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </main>
      <Footer></Footer>
    </>
  );
}

export default App;
