import React, { useState, useEffect } from "react";

let Login = () => {
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  //executes on each render(initial render and state upadates)
  useEffect(() => {
    //console.log(email, password);
  });

  //executes only on state updates of "email" only (and also with initial render)
  useEffect(() => {
    //validation on email only
    if (email.indexOf("@") > 0) {
      console.log("valid");
    } else {
      console.log("Invalid");
    }
  }, [email, password]);
  return (
    <div className="row">
      <div className="col-lg-5 col-md-7 mx-auto">
        <div className="card border-success shadow-lg my-2">
          <div className="card-header border-bottom border-success">
            <h4
              style={{ fontSize: "40px" }}
              className="text-success text-center"
            >
              Login
            </h4>
          </div>
          <div className="card-body border-bottom border-success">
            {/* email starts*/}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                className="form-control"
                id="email"
                value={email}
                placeholder="Email"
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              ></input>
            </div>
            {/* email ends*/}

            {/* password starts*/}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              ></input>
            </div>
            {/* password ends*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
