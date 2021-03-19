import { Route, Redirect } from "react-router-dom"
import { Login } from "./components/auth/Login"
import { Register } from "./components/auth/Register"
import { userStorageKey } from "./components/auth/authSettings"
import { Sketchbook } from "./components/Sketchbook"

function App() {
  return (
    <>
    <Route render={() => {
      if (sessionStorage.getItem(userStorageKey)) {
        return (
          <>
            <Sketchbook />
          </>
        )
      } else {
        return <Redirect to="/login" />;
      }
  }} />

  <Route path="/login">
    <Login />
  </Route>
  <Route path="/register">
    <Register />
  </Route>
  </>
  );
}

export default App;
