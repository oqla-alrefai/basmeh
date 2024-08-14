import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AdminAllCarts.module.css';

const AdminAllCarts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllCarts = async () => {
      try {
        const response = await axios.get('https://basmeh-25qp.onrender.com/cart/allcarts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
        });
        setCarts(response.data.carts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCarts();
  }, []);

  if (loading) return <div className={styles.loadingContainer}><div className={styles.spinner}></div></div>;
  if (error) return <div className={styles.errorContainer}><p className={styles.error}>{error}</p></div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Carts</h1>
      {carts.length > 0 ? (
        carts.map(cart => (
          <div key={cart._id} className={styles.cartContainer}>
            <h2 className={styles.userTitle}>User: {cart.user}</h2>
            <ul className={styles.productList}>
              {cart.products.map(item => (
                <li key={item.product._id} className={styles.productItem}>
                  <div className={styles.productImageContainer}>
                    <img src={item.product.image} alt={item.product.name} className={styles.productImage} />
                  </div>
                  <div className={styles.productInfo}>
                    <p className={styles.productName}>{item.product.name}</p>
                    <p className={styles.productQuantity}>{item.quantity} x ${item.product.price}</p>
                  </div>
                  <p className={styles.productTotal}>${item.product.price * item.quantity}</p>
                </li>
              ))}
            </ul>
            <h3 className={styles.totalPrice}>Total Price: ${cart.totalPrice}</h3>
            <hr className={styles.divider} />
          </div>
        ))
      ) : (
        <p className={styles.noCartsMessage}>No carts found</p>
      )}
    </div>
  );
};

export default AdminAllCarts;