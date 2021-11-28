import { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AccContext } from "../helpers/AccContext";

function SignIn() {
  const initialValues = {
    username: "",
    password: "",
  };
  const { setAuthState } = useContext(AccContext);
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(30).required(),
    password: Yup.string().min(4).max(20).required(),
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:9998/signin", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
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
          <h3 className="mb-5">Sign in</h3>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form className="SignContainer">
              <label className="form-label" htmlFor="inputUsername">
                Username:{" "}
              </label>
              <ErrorMessage name="username" component="span" />
              <Field
                autoComplete="off"
                id="inputUsername"
                name="username"
                placeholder="(Ex. John123...)"
                className="vacebook-input"
              />

              <label htmlFor="inputPassword" className="form-label">
                Password:{" "}
              </label>
              <ErrorMessage name="password" component="span" />
              <Field
                autoComplete="off"
                type="password"
                id="inputPassword"
                name="password"
                placeholder="Your Password..."
                className="vacebook-input"
              />

              <button className="btn btn-primary btn-lg" type="submit">
                {" "}
                Sign in
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
