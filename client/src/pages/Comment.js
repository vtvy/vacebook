import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";
import ShowPost from "../components/ShowPost";
import { AccContext } from "../helpers/AccContext";
import { Link } from "react-router-dom";
import Avatar from "../assets/images/index";

function Comment() {
  let { id } = useParams();
  let navigate = useNavigate();

  const [post, setPost] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AccContext);

  useEffect(() => {
    if (!localStorage.getItem("Token")) {
      navigate("/signin");
    } else {
      axios
        .get(`http://localhost:9998/posts/byId/${id}`, {
          headers: { Token: localStorage.getItem("Token") },
        })
        .then((response) => {
          setPost(response.data);
        });

      axios.get(`http://localhost:9998/comments/${id}`).then((response) => {
        setComments(response.data);
      });
    }
  }, []);

  const addComment = () => {
    if (newComment !== "") {
      axios
        .post(
          "http://localhost:9998/comment/create",
          {
            cmtText: newComment,
            PostId: id,
          },
          {
            headers: {
              Token: localStorage.getItem("Token"),
            },
          }
        )
        .then((res) => {
          const commentToAdd = {
            id: authState.id,
            cmtId: res.data,
            cText: newComment,
            Username: authState.username,
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        });
    } else {
      alert("You has not comment yet");
    }
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:9998/comment/${id}`, {
        headers: { Token: localStorage.getItem("Token") },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.cmtId !== id;
          })
        );
      });
  };

  return (
    <div className="commentPage">
      <ShowPost listOfPosts={post} setListOfPosts={setPost} />
      <div className="commentPart">
        <div className="addCommentContainer">
          <input
            className="inputComment"
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button className="buttons buttonComment " onClick={addComment}>
            Add Comment
          </button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                <div className="userinfo">
                  <Link
                    className="userbox buttons"
                    to={`/profile/${comment.id}`}
                  >
                    <img
                      className="avatar"
                      src={Avatar.filter((path, index) => {
                        return index === comment.id % 20;
                      })}
                      alt="avatar"
                    />
                    <div className="username">{comment.Username}</div>
                  </Link>
                  {authState.id === comment.id && (
                    <div
                      onClick={() => {
                        deleteComment(comment.cmtId);
                      }}
                      className="buttons"
                    >
                      <DeleteIcon />
                    </div>
                  )}
                </div>
                <div className="cmtText">{comment.cText}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Comment;
