import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProduct, getProducts } from "../features/Actios/productActions";
import { Box, Typography, Paper, Grid, Card, CardContent, Avatar, styled, AppBar, Toolbar, InputBase, IconButton, Badge } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getUserFromToken } from "../utils/token";

const Home = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  const products = useSelector((state) => state.product.products);
  const user = getUserFromToken();
  console.log(user)
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      dispatch(getProduct(searchQuery));
    }
  };

  const CardContainer = styled(Card)({
    height: '250px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  });

  return (
    <Paper>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            بصمة
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
              <Avatar sx={{ marginRight: 2 }}>
                {user.full_name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6">
                {user.full_name}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
            <InputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ color: 'inherit', marginRight: 2 }}
            />
            <IconButton color="inherit" onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          </Box>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Typography variant="h5" gutterBottom padding={2}>
        Products
      </Typography>
      <Box padding={2}>
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <CardContainer>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography color="text.secondary">
                    ${product.price}
                  </Typography>
                </CardContent>
              </CardContainer>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default Home;
