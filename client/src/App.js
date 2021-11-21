import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/PostDetail";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import { useState, useEffect } from "react";
import axios from "axios";
import { AccContext } from "./helpers/AccContext";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:9998/account/auth", {
        headers: {
          Token: localStorage.getItem("Token"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ username: "", id: 0, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  let navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("Token");
    setAuthState({ username: "", id: 0, status: false });
    navigate("/signin");
  };

  return (
    <div className="App">
      <AccContext.Provider value={{ authState, setAuthState }}>
        <div className="vacebook-navbar navbar-dark bg-dark">
          <div className="links">
            {!authState.status ? (
              <>
                <Link to="/signin"> Sign in</Link>
                <Link to="/signup"> Sign up</Link>
              </>
            ) : (
              <>
                <Link to="/"> Home Page</Link>
              </>
            )}
          </div>
          <div className="NavContainer">
            {authState.status && (
              <>
                <h1>{authState.username} </h1>
                <button onClick={logout}> Sign out</button>
              </>
            )}
          </div>
        </div>
        <div className="vacebook-container">
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/" element={<Home />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/post/:id" element={Post} />
            <Route path="/changepassword" element={ChangePassword} />
            <Route path="*" element={PageNotFound} />
          </Routes>
        </div>
      </AccContext.Provider>
    </div>
  );
}

export default App;
