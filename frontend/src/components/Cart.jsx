import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Typography, List, ListItem, ListItemText, IconButton, Button, ListItemAvatar, Avatar } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
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
        const response = await axios.get('http://localhost:5000/cart/mycart', {
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
      // Re-fetch cart after quantity change
      const response = await axios.get('http://localhost:5000/cart/mycart', {
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
      // Re-fetch cart after quantity change
      const response = await axios.get('http://localhost:5000/cart/mycart', {
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

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
  if (error) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><Typography color="error">Your Cart Is Empty <Link to="/">🛒</Link></Typography></Box>;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Your Cart</Typography>
      {cart ? (
        <List>
          {cart.products.map(item => (
            <ListItem key={item.product._id} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar 
                  src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : '/path/to/default/image.jpg'} 
                  // src={`data:${item.product.images[0].contentType};base64,${item.product.Buffer.from(item.product.images[0].data).toString('base64')}`}
                  alt={item.product.name} 
                  variant="square" 
                  />
                  {console.log(item.product.image.Buffer)}
              </ListItemAvatar>
              <ListItemText
                primary={item.product.name}
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="body2" color="textPrimary">
                      ${item.product.price} x {item.quantity}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <IconButton onClick={() => handleDecreaseQuantity(item.product._id)} >
                        <Remove />
                      </IconButton>
                      <Typography>{item.quantity}</Typography>
                      <IconButton onClick={() => handleQuantityChange(item.product._id)}>
                        <Add />
                      </IconButton>
                    </Box>
                  </React.Fragment>
                }
              />
              <Typography variant="body2">${item.product.price * item.quantity}</Typography>
            </ListItem>
          ))}
          <Box mt={2} display="flex" justifyContent="space-between">
            <Typography variant="h6">Total Price: ${cart.totalPrice}</Typography>
            <Button variant="contained" color="primary" onClick={() => handleCheckout()}>
              Checkout
            </Button>
          </Box>
        </List>
      ) : (
        <Typography>Your cart is empty</Typography>
      )}
    </Box>
  );
};

export default UserCart;
