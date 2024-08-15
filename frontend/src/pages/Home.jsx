import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../features/Actios/productActions"; // Adjust the path as needed
import { addItemToCart } from "../features/Actios/cartAction"; // Adjust the path as needed
import { logoutUser } from "../features/slices/userSlice"; // Adjust the path as needed
import styles from "./Home.module.css"; // Import the CSS Module
import { Buffer } from "buffer";

const StoreFront = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.product.products);
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("userToken");
  useEffect(() => {
    const fetchProducts = async () => {
      await dispatch(getProducts());
      setLoading(false);
    };

    fetchProducts();

    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.role === "admin") {
        setIsAdmin(true);
      }
      setIsLoggedIn(true);
    }
  }, [dispatch]);

  const handleAddToCart = (productId) => {
    if(token){
      console.log("hi")
      dispatch(addItemToCart(productId));
    }else{
      navigate("/login")
    }
  };
      

  const decodeToken = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sidebarContent = (
    <div className={styles.sidebarContent}>
      <ul>
        <li>Accessories</li>
        <li>Network</li>
        <li>Gaming</li>
      </ul>
      <div className={styles.offerCard}>
        <h2>Today's Offer</h2>
        <div className={styles.cardContent}>
          <p>Nooni Sprout Smoothing Toner</p>
          <h3>30% OFF</h3>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <header className={styles.header}>
        <button className={styles.menuButton} onClick={toggleDrawer(true)}>
          Menu
        </button>
        <h1>Bassma Store</h1>
        <div className={styles.headerButtons}>
          {isLoggedIn ? (
            <>
              <Link to="/profile">Profile</Link>
              {isAdmin && <Link to="/admin">Admin</Link>}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
          <Link to="/cart">Cart</Link>
        </div>
      </header>

      <div
        className={
          drawerOpen ? `${styles.drawer} ${styles.drawerOpen}` : styles.drawer
        }
      >
        <button className={styles.closeButton} onClick={toggleDrawer(false)}>
          X
        </button>
        <aside className={styles.sidebar}>{sidebarContent}</aside>
      </div>

      <div className={styles.container}>
        <aside className={styles.sidebar}>{sidebarContent}</aside>

        <main className={styles.mainContent}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search products by name"
              value={searchQuery}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          </div>
          {loading ? (
            <div className={styles.spinner}></div>
          ) : (
            <div className={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <div className={styles.productCard} key={product._id}>
                  <Carousel showThumbs={false} showStatus={false} infiniteLoop>
                    {product.images.map((image, index) => (
                      <div key={index}>
                        <img
                          src={`data:${image.contentType};base64,${Buffer.from(
                            image.data
                          ).toString("base64")}`}
                          alt={product.name}
                          className={styles.productImage}
                        />
                      </div>
                    ))}
                  </Carousel>
                  <div className={styles.productInfo}>
                    <h3>{product.name}</h3>
                    <p>{product.price} $</p>
                    <button onClick={() => handleAddToCart(product._id)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StoreFront;
