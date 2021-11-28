import { useContext } from "react";
import axios from "axios";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../assets/images/index";
import { AccContext } from "../helpers/AccContext";

function ShowPost(props) {
  let navigate = useNavigate();
  const { authState } = useContext(AccContext);

  const delelePost = (id) => {
    axios
      .delete(`http://localhost:9998/post/delete/${id}`, {
        headers: { Token: localStorage.getItem("Token") },
      })
      .then((res) => {
        if (res.data.error) {
          alert(res.data.error);
        } else {
          navigate("/");
          props.setListOfPosts(
            props.listOfPosts.filter((val) => {
              return val.PID !== id;
            })
          );
        }
      });
  };

  //   const likeAPost = (postId) => {
  //     axios
  //       .post(
  //         "http://localhost:3001/likes",
  //         { PostId: postId },
  //         { headers: { accessToken: localStorage.getItem("Token") } }
  //       )
  //       .then((response) => {
  //         setListOfPosts(
  //           listOfPosts.map((post) => {
  //             if (post.id === postId) {
  //               if (response.data.liked) {
  //                 return { ...post, Likes: [...post.Likes, 0] };
  //               } else {
  //                 const likesArray = post.Likes;
  //                 likesArray.pop();
  //                 return { ...post, Likes: likesArray };
  //               }
  //             } else {
  //               return post;
  //             }
  //           })
  //         );

  //         if (likedPosts.includes(postId)) {
  //           setLikedPosts(
  //             likedPosts.filter((id) => {
  //               return id != postId;
  //             })
  //           );
  //         } else {
  //           setLikedPosts([...likedPosts, postId]);
  //         }
  //       });
  //   };

  return (
    <>
      {props.listOfPosts.map((value, key) => {
        return (
          <div key={key} className="post">
            <div className="header">
              <div className="userinfo">
                <Link className="userbox" to="/">
                  <img
                    className="avatar"
                    src={Avatar.filter((path, index) => {
                      return index === value.id % 20;
                    })}
                    alt="avatar"
                  />
                  <div className="username">{value.pusername}</div>
                </Link>
                {authState.id === value.id && (
                  <div
                    onClick={() => {
                      delelePost(value.PID);
                    }}
                    className="buttons"
                  >
                    <DeleteIcon />
                  </div>
                )}
              </div>
              <div className="title">{value.title}</div>
            </div>
            <div className="body">{value.pText}</div>
            <div className="footer">
              <div className="buttons">
                {/* <label className="numLike">{value.numLike}</label> */}
                <ThumbUpAltIcon
                  // onClick={() => {
                  //   likeAPost(value.id);
                  // }}
                  className={value.isLike ? "likeBttn" : "unlikeBttn"}
                />
                <div className="footer-text">Like</div>
              </div>
              <div
                className="buttons"
                onClick={() => {
                  navigate(`/post/${value.PID}`);
                }}
              >
                <ChatBubbleOutlineIcon
                  className={value.isLike ? "likeBttn" : "unlikeBttn"}
                />
                <div className="footer-text">Comment</div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default ShowPost;
