import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AccContext } from "../helpers/AccContext";
import ShowPost from "../components/ShowPost";
import ShowDeletedPost from "../components/ShowDeletedPost";
import Avatar from "../assets/images/index";

function Profile() {
  let { id } = useParams();
  let navigate = useNavigate();
  const [userState, setUserState] = useState({
    username: "",
    userId: id,
  });
  const [listOfPosts, setListOfPosts] = useState([]);
  const [listOfDelPosts, setListOfDelPosts] = useState([]);
  const [isOpenDel, setIsOpenDel] = useState(false);
  const { authState } = useContext(AccContext);

  useEffect(() => {
    axios
      .get(`http://localhost:9998/user/info/${id}`, {
        headers: { Token: localStorage.getItem("Token") },
      })
      .then((response) => {
        if (response.data.err) {
          navigate("/signin");
        } else {
          setUserState({ ...userState, username: response.data });
        }
      });

    axios
      .get(`http://localhost:9998/posts/byuserId/${id}`, {
        headers: { Token: localStorage.getItem("Token") },
      })
      .then((response) => {
        setListOfPosts(response.data);
      });
  }, []);

  const ShowDelPost = () => {
    axios
      .get(`http://localhost:9998/deleted/posts/${authState.id}`, {
        headers: { Token: localStorage.getItem("Token") },
      })
      .then((response) => {
        setListOfDelPosts(response.data);
        setIsOpenDel(true);
      });
  };

  return (
    <div className="profileContainer">
      <div className="basicInfo">
        {" "}
        <div className="userbox ">
          <img
            className="avatar"
            src={Avatar.filter((path, index) => {
              return index === userState.userId % 20;
            })}
            alt="avatar"
          />
          <div className="username">{authState.username}</div>
        </div>
        {authState.username === userState.username && (
          <>
            <button
              className="ChangePassBtn"
              onClick={() => {
                navigate("/changepassword");
              }}
            >
              {" "}
              Change My Password
            </button>
            {isOpenDel ? (
              <button
                className="ShowDelPostBtn"
                onClick={() => setIsOpenDel(false)}
              >
                {" "}
                Show profile posts
              </button>
            ) : (
              <button className="ShowDelPostBtn" onClick={ShowDelPost}>
                {" "}
                Show delete posts
              </button>
            )}
          </>
        )}
      </div>
      {isOpenDel ? (
        <ShowDeletedPost
          listOfDelPosts={listOfDelPosts}
          setListOfDelPosts={setListOfDelPosts}
        />
      ) : (
        <ShowPost listOfPosts={listOfPosts} setListOfPosts={setListOfPosts} />
      )}
    </div>
  );
}

export default Profile;
