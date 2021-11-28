import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ShowPost from "../components/ShowPost";
import { AccContext } from "../helpers/AccContext";

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
          cText: newComment,
          Username: authState.username,
        };
        setComments([...comments, commentToAdd]);
        setNewComment("");
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: { Token: localStorage.getItem("Token") },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id != id;
          })
        );
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter New Title:");
      axios.put(
        "http://localhost:3001/posts/title",
        {
          newTitle: newTitle,
          id: id,
        },
        {
          headers: { Token: localStorage.getItem("Token") },
        }
      );

      setPost({ ...post, title: newTitle });
    } else {
      let newPostText = prompt("Enter New Text:");
      axios.put(
        "http://localhost:3001/posts/postText",
        {
          newText: newPostText,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      setPost({ ...post, postText: newPostText });
    }
  };

  return (
    <div className="commentPage">
      {/* <div className="leftSide">
         <div className="post" id="individual">
          <div
            className="title"
            onClick={() => {
              if (authState.username === postObject.username) {
                editPost("title");
              }
            }}
          >
            {postObject.title}
          </div>
          <div
            className="body"
            onClick={() => {
              if (authState.username === postObject.username) {
                editPost("body");
              }
            }}
          >
            {postObject.postText}
          </div>
          <div className="footer">
            {postObject.username}
            {authState.username === postObject.username && (
              <button
                onClick={() => {
                  deletePost(postObject.id);
                }}
              >
                {" "}
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div> */}
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
          <button className="buttonComment" onClick={addComment}>
            {" "}
            Add Comment
          </button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                {comment.cText}
                <label> Username: {comment.Username}</label>
                {authState.username === comment.Username && (
                  <button
                    onClick={() => {
                      deleteComment(comment.id);
                    }}
                  >
                    X
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Comment;
