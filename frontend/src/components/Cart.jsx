import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UserCart.module.css';
import { useDispatch } from 'react-redux';
import { addItemToCart, removeItemFromCart, checkout } from '../features/Actios/cartAction';
import { Link, useNavigate } from 'react-router-dom';

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

  if (loading) return <div className={styles.loadingContainer}><div>Loading...</div></div>;
  if (error) return <div className={styles.errorContainer}><div>Your Cart Is Empty <Link to="/">🛒</Link></div></div>;

  return (
    <div className={styles.container}>
      <div className={styles.cartTitle}>Your Cart</div>
      {cart ? (
        <ul className={styles.cartList}>
          {cart.products.map(item => (
            <li key={item.product._id} className={styles.cartListItem}>
              <img 
                src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : '/path/to/default/image.jpg'} 
                alt={item.product.name} 
                className={styles.avatar}
              />
              <div className={styles.itemDetails}>
                <div>{item.product.name}</div>
                <div>
                  ${item.product.price} x {item.quantity}
                </div>
                <div className={styles.itemPrice}>
                  <button onClick={() => handleDecreaseQuantity(item.product._id)}> - </button>
                  <span className={styles.itemQuantity}>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.product._id)}> + </button>
                </div>
              </div>
              <div>${item.product.price * item.quantity}</div>
            </li>
          ))}
          <div className={styles.totalContainer}>
            <div className={styles.totalPrice}>Total Price: ${cart.totalPrice}</div>
            <button className={styles.checkoutButton} onClick={() => handleCheckout()}>
              Checkout
            </button>
          </div>
        </ul>
      ) : (
        <div>Your cart is empty</div>
      )}
    </div>
  );
};

export default UserCart;
