import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import { useAppDispatch, useAppSelector } from "./hooks/appSelector";
import { useEffect } from "react";
import { signIn } from "./redux/auth/auth";

function App() {
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);
  const dispatch = useAppDispatch();
  return (
    <>
      <Header></Header>
      <main className="">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <Footer></Footer>
    </>
  );
}

export default App;
