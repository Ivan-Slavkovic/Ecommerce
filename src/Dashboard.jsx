import React, { useEffect } from "react";

let Dashboard = (props) => {
  useEffect(() => {
    document.title = "Dashboard - eCommerce";
  }, []);

  return <h4>Dashboard</h4>;
};

export default Dashboard;
