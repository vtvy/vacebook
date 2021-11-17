import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/PostDetail";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import { useState, useEffect } from "react";
import axios from "axios";
import { AccContext } from "./helpers/AccContext";
import RequireAuth from "./helpers/RequireAuth";

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
          accessToken: localStorage.getItem("Token"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("Token");
    setAuthState({ username: "", id: 0, status: false });
  };

  return (
    <div className="App">
      <AccContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <div className="links">
              {!authState.status ? (
                <>
                  <Link to="/signIn"> Sign in</Link>
                  <Link to="/signUp"> Sign up</Link>
                </>
              ) : (
                <>
                  <Link to="/"> Home Page</Link>
                  <Link to="/post/create"> Create A Post</Link>
                </>
              )}
            </div>
            <div className="loggedInContainer">
              <h1>{authState.username} </h1>
              {authState.status && <button onClick={logout}> Sign out</button>}
            </div>
          </div>
          <Routes>
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/signIn" element={Login} />
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile/:id" element={<Profile />} />
            </Route>
            <Route path="/post/create" element={CreatePost} />
            <Route path="/post/:id" element={Post} />
            <Route path="/changePassword" element={ChangePassword} />
            <Route path="*" element={PageNotFound} />
          </Routes>
        </Router>
      </AccContext.Provider>
    </div>
  );
}

export default App;
