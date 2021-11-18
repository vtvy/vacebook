import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

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

  const onSubmit = (data) => {
    axios.post("http://localhost:9998/account", data).then((response) => {
      console.log(response);
    });
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="SignContainer">
          <label>Username: </label>
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
  );
}

export default SignUp;
