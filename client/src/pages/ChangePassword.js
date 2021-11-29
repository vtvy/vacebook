import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const initialValues = {
    oldPassword: "",
    newPassword: "",
  };
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().min(4).max(20).required(),
    newPassword: Yup.string().min(4).max(20).required(),
  });

  const changePassword = (data) => {
    axios
      .put(
        "http://localhost:9998/user/changepassword",
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            Token: localStorage.getItem("Token"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          alert(response.data);
          navigate("/");
        }
      });
  };

  return (
    <div>
      <div className="card shadow-2-strong sign-card">
        <div className="card-body p-5 text-center">
          <h4 className="mb-5">Change your password</h4>
          <Formik
            initialValues={initialValues}
            onSubmit={changePassword}
            validationSchema={validationSchema}
          >
            <Form className="SignContainer">
              <label className="form-label" htmlFor="inputOldPassword">
                Old Password:{" "}
              </label>
              <ErrorMessage name="oldPassword" component="span" />
              <Field
                autoComplete="off"
                id="inputOldPassword"
                type="password"
                name="oldPassword"
                placeholder="(Ex. John123...)"
                className="vacebook-input"
              />

              <label htmlFor="inputNewPassword" className="form-label">
                Password:{" "}
              </label>
              <ErrorMessage name="newPassword" component="span" />
              <Field
                autoComplete="off"
                type="password"
                id="inputNewPassword"
                name="newPassword"
                placeholder="Your Password..."
                className="vacebook-input"
              />

              <button className="btn btn-primary btn-lg" type="submit">
                {" "}
                Save change
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
