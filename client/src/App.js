import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import NavBar from "./components/Navbar";
import Home from "./components/Home";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Productinfo from "./components/Productinfo";
import Profile from "./components/Profile"
import Login from "./components/Login";
import Register from "./components/Register";
import Checkout from "./components/Checkout";
import Cate from "./components/Cate";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Switch>

        <Route path="/" component={Home} exact />
        <Route path="/contact" component={Contact} exact />
        <Route path="/product/:id" component={Productinfo} exact />
        <Route path="/category/:id" component={Cate} exact />
        <Route path="/login" component={Login} exact />
        <Route path="/register" component={Register} exact />
        <Route path="/profile" component={Profile} exact />
        <Route path="/checkout" component={Checkout} exact />


      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
