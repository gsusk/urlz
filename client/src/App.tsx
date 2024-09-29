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
import { lazy, Suspense } from "react";

const Stats = lazy(() => import("./pages/Stats"));
const Urls = lazy(() => import("./pages/Urls"));
const Profile = lazy(() => import("./components/Profile"));
const Security = lazy(() => import("./components/Security"));

function App() {
  return (
    <>
      <div className="App">



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
                <Route
                  path="profile"
                  element={
                    <Suspense fallback={<div>loading profile...</div>}>
                      <Profile />
                    </Suspense>
                  }
                />
                <Route
                  path="security"
                  element={
                    <Suspense fallback={<div>loading security...</div>}>
                      <Security />
                    </Suspense>
                  }
                ></Route>
              </Route>
              <Route
                path="/my-urls"
                element={
                  <Suspense fallback={<div>loading...</div>}>
                    <Urls />
                  </Suspense>
                }
              ></Route>
              <Route
                path="/stats"
                element={
                  <Suspense fallback={<div>LOADING...</div>}>
                    <Stats />
                  </Suspense>
                }
              ></Route>
            </Route>
            {/* <Route path="*" element={<Navigate to="/" />} /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
