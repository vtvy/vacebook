import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AccContext } from "../helpers/AccContext";

function CreatePost(props) {
  let navigate = useNavigate();
  const initialValues = {
    title: "",
    Text: "",
  };

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

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must input a Title!"),
    Text: Yup.string().required("You must input your status!"),
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:9998/post/create", data);
  };

  return (
    <div className="createPostPage">
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

          <button type="submit"> Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
