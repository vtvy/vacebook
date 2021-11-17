import React, { useContext } from "react";
import { AccContext } from "./AccContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function RequireAuth() {
  const { authState } = useContext(AccContext);
  let location = useLocation();

  if (!authState.status) {
    return <Navigate to="/signUp" state={{ from: location }} />;
  }

  return <Outlet />;
}

export default RequireAuth;
