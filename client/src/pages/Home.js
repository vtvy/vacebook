import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AccContext } from "../helpers/AccContext";
import IndividualPost from "../components/IndividualPost";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

function Home() {
  const initialValues = {
    title: "",
    Text: "",
  };
  let navigate = useNavigate();
  const { authState } = useContext(AccContext);

  useEffect(() => {
    if (!localStorage.getItem("Token")) {
      navigate("/signin");
    } else {
      // axios
      //   .get("http://localhost:3001/posts", {
      //     headers: { accessToken: localStorage.getItem("accessToken") },
      //   })
      //   .then((response) => {
      //     setListOfPosts(response.data.listOfPosts);
      //     setLikedPosts(
      //       response.data.likedPosts.map((like) => {
      //         return like.PostId;
      //       })
      //     );
      //   });
    }
  }, []);

  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [isOpen, setOpen] = useState(false);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must input a Title!"),
    Text: Yup.string().required("You must input your status!"),
  });

  const onSubmit = (data) => {
    axios
      .post("http://localhost:9998/post/create", data, {
        headers: { Token: localStorage.getItem("Token") },
      })
      .then((response) => {
        setListOfPosts({
          listOfPosts: listOfPosts.unshift(data),
        });
        console.log("Createpost ne");
      });
  };

  // useEffect(() => {

  //     axios
  //       .get("http", {
  //         headers: { Token: localStorage.getItem("Token") },
  //       })
  //       .then((response) => {
  //         setListOfPosts(response.data.listOfPosts);
  //         setLikedPosts(
  //           response.data.likedPosts.map((like) => {
  //             return like.PostId;
  //           })
  //         );
  //       });
  // }, []);

  const [showOrHide, handleModal] = useState(false);

  return (
    <div>
      <div
        className="home-nav"
        onClick={() => {
          handleModal(true);
        }}
      >
        Hey {authState.username.toUpperCase()}, what do you think now?
      </div>
      <div className={showOrHide ? "modal open" : "modal"}>
        <div className="createPostPage ">
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form className="formContainer">
              <label>Title: </label>
              <ErrorMessage name="title" component="span" />
              <Field
                autocomplete="off"
                id="inputCreatePost"
                name="title"
                placeholder="(Ex. Title...)"
              />
              <label>Post: </label>
              <ErrorMessage name="Text" component="span" />
              <Field
                autocomplete="off"
                id="inputCreatePost"
                name="Text"
                placeholder="(Ex. Post...)"
              />
              <div className="createPostFooter">
                <button
                  onClick={() => {
                    handleModal(false);
                  }}
                >
                  {" "}
                  Close
                </button>
                <button
                  type="submit"
                  onClick={() => {
                    handleModal(false);
                  }}
                >
                  {" "}
                  Create Post
                </button>{" "}
              </div>
            </Form>
          </Formik>
        </div>
      </div>

      {/* {listOfPosts.map((value, key) => {
        return (
          <IndividualPost
            key={key}
            title={value.title}
            id={value.id}
            username={value.username}
            numLike={value.numLike}
            isLike={value.isLike}
          />
        );
      })} */}
    </div>
  );
}

export default Home;
