import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./features/store";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Profile from "./components/Profile";
import Admin from "./pages/Admin";
import Users from "./components/users";
import Products from "./components/Products";
import Carts from "./components/Carts";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CartPage from "./components/Cart";
import CreateProduct from "./components/CreateProduct";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/Home";


const routes = createBrowserRouter([

  {
    path:"/admin",
    children:[
      {
        path:"users",
        element:<Users/>
      },
      {
        path:"products",
        element:<Products/>
      },
      {
        path:"carts",
        element:<Carts/>
      }
    ],
    element:<Admin/>
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/signup",
    element:<Signup/>
  },
  {
    path:"/profile",
    element:<Profile/>
  },
  {
    path:"/cart",
    element: <CartPage/>
  },
  {
    path:"/test",
    element: <CreateProduct/>
  },
  {
    path:"/home",
    element:<HomePage/>
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={routes}>
      <App />
    </RouterProvider>
  </Provider>
);