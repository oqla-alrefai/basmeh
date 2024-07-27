import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from '@mui/material';

const AdminAllCarts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllCarts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/cart/allcarts', {
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

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
  if (error) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><Typography color="error">{error}</Typography></Box>;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>All Carts</Typography>
      {carts.length > 0 ? (
        carts.map(cart => (
          <Box key={cart._id} mb={3}>
            <Typography variant="h6">User: {cart.user}</Typography>
            <List>
              {cart.products.map(item => (
                <ListItem key={item.product._id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar src={item.product.image} alt={item.product.name} variant="square" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.product.name}
                    secondary={`${item.quantity} x $${item.product.price}`}
                  />
                  <Typography variant="body2">${item.product.price * item.quantity}</Typography>
                </ListItem>
              ))}
            </List>
            <Typography variant="h6">Total Price: ${cart.totalPrice}</Typography>
            <Divider />
          </Box>
        ))
      ) : (
        <Typography>No carts found</Typography>
      )}
    </Box>
  );
};

export default AdminAllCarts;
