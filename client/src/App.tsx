import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Guest from "./components/Guest";
import Verify from "./pages/Verify";
import Authenticated from "./components/Authenticated";
import EmailVerification from "./pages/EmailVerification";
import Settings from "./pages/Settings";
import Profile from "./components/Profile";

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
              <Route path="/email/verify" element={<Verify />}></Route>
            </Route>
          </Route>
          <Route path="/verify-email" element={<EmailVerification />}></Route>
          <Route element={<Authenticated />}>
            <Route path="/settings" element={<Settings />}>
              <Route index element={<Navigate to="profile" />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
