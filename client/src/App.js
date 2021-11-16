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

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  const checkAuth = (nextState, replace, next) => {
    if (!authState.status) {
      replace({
        pathname: "/signIn",
        state: { nextPathname: nextState.location.pathname },
      });
    }
    next();
  };

  useEffect(() => {
    axios
      .get("http://localhost:9998//account/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
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
    localStorage.removeItem("accessToken");
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
            <Route path="/signUp" exact element={SignUp} />
            <Route path="/signIn" exact element={Login} />
            <Route path="/profile/:id" exact element={Profile} />
            <Route path="/" exact element={Home} onEnter={checkAuth()} />
            <Route
              path="/post/create"
              exact
              element={CreatePost}
              render={() => (
                isLoggedIn() ? (
                  <Redirect to="/front"/>
                ) : (
                  <Home />
                )}
            />
            <Route
              path="/post/:id"
              exact
              element={Post}
              onEnter={checkAuth()}
            />
            <Route
              path="/changePassword"
              exact
              element={ChangePassword}
              onEnter={checkAuth()}
            />
            <Route path="*" exact element={PageNotFound} />
          </Routes>
        </Router>
      </AccContext.Provider>
    </div>
  );
}

export default App;
