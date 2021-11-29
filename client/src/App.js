import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import HomeIcon from "@material-ui/icons/Home";
import Comment from "./pages/Comment";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "./assets/images/index";
import { AccContext } from "./helpers/AccContext";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  const [avatarPath, setAvatarPath] = useState(0);

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
          setAvatarPath(response.data.id % 20);
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
                <Link to="/signin" className="buttons">
                  {" "}
                  Sign in
                </Link>
                <Link to="/signup" className="buttons">
                  {" "}
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="buttons">
                  <HomeIcon />
                </Link>
              </>
            )}
          </div>
          <div className="NavContainer">
            {authState.status && (
              <>
                <Link
                  className="userbox buttons"
                  to={`/profile/${authState.id}`}
                >
                  <img
                    className="avatar"
                    src={Avatar.filter((path, index) => {
                      return index === avatarPath;
                    })}
                    alt="avatar"
                  />
                  <div className="username">{authState.username}</div>
                </Link>

                <button className="buttons" onClick={logout}>
                  {" "}
                  Sign out
                </button>
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
            <Route path="/post/:id" element={<Comment />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="*" element={PageNotFound} />
          </Routes>
        </div>
      </AccContext.Provider>
    </div>
  );
}

export default App;
