import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UserCart.module.css';
import { useDispatch } from 'react-redux';
import { addItemToCart, removeItemFromCart, checkout } from '../features/Actios/cartAction';
import { Link, useNavigate } from 'react-router-dom';
import { Buffer } from "buffer";

const UserCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get('https://basmeh-25qp.onrender.com/cart/mycart', {
          headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
        });
        setCart(response.data.cart);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleDecreaseQuantity = async (productId) => {
    try {
      await dispatch(removeItemFromCart(productId));
      const response = await axios.get('https://basmeh-25qp.onrender.com/cart/mycart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      });
      setCart(response.data.cart);
    } catch (err) {
      setError(err.message);
    }
  }

  const handleQuantityChange = async (productId) => {
    try {
      await dispatch(addItemToCart(productId));
      const response = await axios.get('https://basmeh-25qp.onrender.com/cart/mycart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      });
      setCart(response.data.cart);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckout = async () => {
    await dispatch(checkout());
    navigate("/");
  }

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!cart || cart.products.length === 0) return <div className={styles.empty}>Your Cart Is Empty 🛒</div>;

  return (
    <div className={styles.cartContainer}>
      <h2 className={styles.cartTitle}>Your Cart</h2>
      <div className={styles.cartItems}>
        {cart.products.map(item => (
          <div key={item.product._id} className={styles.cartItem}>
            {item.product.images && item.product.images.length > 0 && (
              <img
                src={`data:${item.product.images[0].contentType};base64,${Buffer.from(
                  item.product.images[0].data
                ).toString("base64")}`}
                alt={item.product.name}
                className={styles.productImage}
              />
            )}
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{item.product.name}</h3>
              <p className={styles.productPrice}>${item.product.price}</p>
            </div>
            <div className={styles.quantityControl}>
              <button onClick={() => handleDecreaseQuantity(item.product._id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleQuantityChange(item.product._id)}>+</button>
            </div>
            <p className={styles.itemTotal}>${item.product.price * item.quantity}</p>
          </div>
        ))}
      </div>
      <div className={styles.cartSummary}>
        <p className={styles.totalPrice}>Total Price: ${cart.totalPrice}</p>
        <button className={styles.checkoutButton} onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default UserCart;
