import React, { useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
let Dashboard = (props) => {
  useEffect(() => {
    document.title = "Dashboard - eCommerce";
  }, []);
  //get context
  let userContext = useContext(UserContext);
  console.log(userContext);

  return <h4>Dashboard</h4>;
};

export default Dashboard;
