import React from "react";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { Link, useNavigate } from "react-router-dom";
import { AccContext } from "../helpers/AccContext";

function IndividualPost(props) {
  let navigate = useNavigate();

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
    <div key={props.key} className="post">
      {/* <div className="title"> {props.title} </div>
      <div
        className="body"
        onClick={() => {
          navigate(`/post/${props.id}`);
        }}
      >
        {props.postText}
      </div>
      <div className="footer">
        <div className="username">
          <Link to={`/profile/${props.username}`}> {props.username} </Link>
        </div>
        <div className="buttons">
          <ThumbUpAltIcon
            onClick={() => {
              likeAPost(value.id);
            }}
            className={
              likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
            }
          />

          <label> {value.Likes.length}</label>
        </div>
      </div> */}
    </div>
  );
}

export default IndividualPost;
