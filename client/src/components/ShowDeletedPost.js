import { useContext } from "react";
import axios from "axios";
import DeleteIcon from "@material-ui/icons/Delete";
import { Link } from "react-router-dom";
import Avatar from "../assets/images/index";
import { AccContext } from "../helpers/AccContext";

function ShowDeletedPost(props) {
  const { authState } = useContext(AccContext);

  const delelePostPermant = (id) => {
    axios
      .delete(`http://localhost:9998/post/delete/permant/${id}`, {
        headers: { Token: localStorage.getItem("Token") },
      })
      .then((res) => {
        alert(res.data);
        props.setListOfDelPosts(
          props.listOfDelPosts.filter((val) => {
            return val.PID !== id;
          })
        );
      });
  };

  return (
    <>
      {props.listOfDelPosts.map((value, key) => {
        return (
          <div key={key} className="post">
            <div className="header">
              <div className="userinfo">
                <Link className="userbox buttons" to={`/profile/${value.id}`}>
                  <img
                    className="avatar"
                    src={Avatar.filter((path, index) => {
                      return index === authState.id % 20;
                    })}
                    alt="avatar"
                  />
                  <div className="username">{authState.username}</div>
                </Link>
                <div
                  onClick={() => {
                    delelePostPermant(value.PID);
                  }}
                  className="buttons"
                >
                  <DeleteIcon />
                </div>
              </div>
              <div className="title">{value.title}</div>
            </div>
            <div className="body">{value.dText}</div>
          </div>
        );
      })}
    </>
  );
}

export default ShowDeletedPost;
