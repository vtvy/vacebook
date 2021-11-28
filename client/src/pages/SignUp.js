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
      <div className="card sign-card">
        <div className="card-body mb-5 text-center">
          <h3 className="mb-2">Sign up</h3>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form className="SignContainer">
              <label htmlFor="signup-username">Username:</label>
              <ErrorMessage name="username" component="span" />
              <Field
                autoComplete="off"
                id="signup-username"
                name="username"
                placeholder="(Ex. John123...)"
                className="vacebook-input"
              />

              <label htmlFor="signup-password">Password: </label>
              <ErrorMessage name="password" component="span" />
              <Field
                autoComplete="off"
                type="password"
                id="signup-password"
                name="password"
                placeholder="Your Password..."
                className="vacebook-input"
              />

              <label htmlFor="signup-cf-password">Confirm Password: </label>
              <ErrorMessage name="confirmPassword" component="span" />
              <Field
                autoComplete="off"
                type="password"
                id="signup-cf-password"
                name="confirmPassword"
                placeholder="Confirm Your Password..."
                className="vacebook-input"
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
