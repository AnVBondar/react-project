import { Outlet } from "react-router-dom";
import "./App.scss";
import { Navigation } from "./components/Navigation/Navigation";

const App = () => {
  return (
    <main className="main">
      <Navigation />
      <Outlet />
    </main>
  );
};

export default App;
