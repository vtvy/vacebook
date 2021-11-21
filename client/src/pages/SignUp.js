import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { AccContext } from "../helpers/AccContext";

function SignUp() {
  const initialValues = {
    username: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(30).required(),
    password: Yup.string().min(4).max(20).required(),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });

  const { setAuthState } = useContext(AccContext);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    axios.post("http://localhost:9998/account", data).then((response) => {
      if (!response.data) {
        alert("Username exist!");
      } else {
        localStorage.setItem("Token", response.data.token);
        setAuthState({
          username: data.username,
          id: response.data.id,
          status: true,
        });
        navigate("/");
      }
    });
  };

  return (
    <div>
      <div className="card shadow-2-strong sign-card">
        <div className="card-body p-5 text-center">
          <h3 className="mb-5">Sign up</h3>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form className="SignContainer">
              <label className="form-label">Username: </label>
              <ErrorMessage name="username" component="span" />
              <Field
                autoComplete="off"
                id="inputCreatePost"
                name="username"
                placeholder="(Ex. John123...)"
              />

              <label>Password: </label>
              <ErrorMessage name="password" component="span" />
              <Field
                autoComplete="off"
                type="password"
                id="inputCreatePost"
                name="password"
                placeholder="Your Password..."
              />

              <label>Confirm Password: </label>
              <ErrorMessage name="confirmPassword" component="span" />
              <Field
                autoComplete="off"
                type="password"
                id="inputCreatePost"
                name="confirmPassword"
                placeholder="Confirm Your Password..."
              />

              <button className="btn btn-primary btn-lg" type="submit">
                {" "}
                Register
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
