import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import NoMatchPage from "./NoMatchPage";
import Dashboard from "./Dashboard";
import { HashRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import NavBar from "./NavBar";
import { UserContext } from "./UserContext";
import Store from "./Store";

function App() {
  let [user, setUser] = useState({
    isLoggedIn: false,
    currentUserId: null,
    currentUserName: null,
  });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <HashRouter>
        <div className="container-fluid">
          <NavBar />
          <Switch>
            <Route path="/" exact={true} component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/store" component={Store} />
            <Route path="*" component={NoMatchPage} />
          </Switch>
        </div>
      </HashRouter>
    </UserContext.Provider>
  );
}

export default App;

// You need to watch 21
