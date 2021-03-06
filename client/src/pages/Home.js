import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AccContext } from "../helpers/AccContext";
import ShowPost from "../components/ShowPost";
import CancelIcon from "@material-ui/icons/Cancel";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

function Home() {
  const initialValues = {
    title: "",
    Text: "",
  };

  let navigate = useNavigate();
  const { authState } = useContext(AccContext);
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("Token")) {
      navigate("/signin");
    } else {
      axios
        .get("http://localhost:9998/posts/list", {
          headers: { Token: localStorage.getItem("Token") },
        })
        .then((response) => {
          setListOfPosts(response.data);
        });
    }
  }, []);

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
        const postToAdd = {
          id: authState.id,
          pText: data.Text,
          pusername: authState.username,
          PID: response.data,
          title: data.title,
          numLike: 0,
          isLike: 0,
        };
        setListOfPosts([postToAdd, ...listOfPosts]);
      });
  };

  const [showOrHide, handleModal] = useState(false);

  return (
    <div className="homeContent">
      <div
        className="home-nav buttons"
        onClick={() => {
          handleModal(true);
        }}
      >
        Hey{" "}
        {authState.username.charAt(0).toUpperCase() +
          authState.username.slice(1)}
        , what do you think now?
      </div>
      <div className={showOrHide ? "modal open" : "modal"}>
        <div className="createPostPage ">
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
              onSubmit(values);
              actions.resetForm({
                values: {
                  title: "",
                  Text: "",
                },
              });
            }}
            validationSchema={validationSchema}
          >
            <Form className="formContainer">
              <div className="cancel-button">
                <CancelIcon
                  onClick={() => {
                    handleModal(false);
                  }}
                />
              </div>
              <label className="form-label" htmlFor="inputTitlePost">
                Title:{" "}
              </label>
              <ErrorMessage name="title" component="span" />
              <Field
                autoComplete="off"
                id="inputTitlePost"
                name="title"
                placeholder="(Ex. Title...)"
                className="vacebook-input"
              />
              <label className="form-label" htmlFor="inputCreatePost">
                Post:{" "}
              </label>
              <ErrorMessage name="Text" component="span" />
              <Field
                autoComplete="off"
                id="inputCreatePost"
                name="Text"
                placeholder="(Ex. Post...)"
                className="vacebook-input"
              />
              <button
                type="submit"
                onClick={() => {
                  handleModal(false);
                }}
                className="btn btn-primary btn-lg"
              >
                {" "}
                Create Post
              </button>{" "}
            </Form>
          </Formik>
        </div>
      </div>
      <ShowPost listOfPosts={listOfPosts} setListOfPosts={setListOfPosts} />
    </div>
  );
}

export default Home;
