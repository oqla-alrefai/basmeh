import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  List,
  ListItem,
  Divider,
  Drawer,
  Box
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Buffer } from 'buffer';
import { logoutUser } from '../../features/slices/userSlice';
import { getProducts } from '../../features/Actios/productActions';
import { addItemToCart } from '../../features/Actios/cartAction';
import { Link, useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFD700',
    },
    secondary: {
      main: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
  },
});

const StoreFront = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.product.products);
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      await dispatch(getProducts());
      setLoading(false);
    };

    fetchProducts();

    const token = localStorage.getItem('userToken');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.role === 'admin') {
        setIsAdmin(true);
      }
      setIsLoggedIn(true);
    }
  }, [dispatch]);

  const handleAddToCart = (productId) => {
    dispatch(addItemToCart({ productId }));
  };

  const decodeToken = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/login');
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
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
    <Box
      sx={{ width: { xs: 250, sm: 'auto' }, padding: '20px' }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button>Accessories</ListItem>
        <ListItem button>Network</ListItem>
        <ListItem button>Gaming</ListItem>
      </List>
      <Divider />
      <Typography variant="h6">Today's Offer</Typography>
      <Card>
        <CardContent>
          <Typography variant="body2">Nooni Sprout Smoothing Toner</Typography>
          <Typography variant="h4" color="primary">30% OFF</Typography>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Bassma Store
            </Typography>
            {isLoggedIn ? (
              <>
              <Button color="inherit"><Link style={{color:"inherit", textDecoration:"none"}} to="/profile">My account</Link></Button>
                {isAdmin && <Button color="inherit"><Link to="/admin">Admin</Link></Button>}
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Button color="inherit"><Link to="/login">Login</Link></Button>
            )}
            <IconButton color="inherit">
              <Link to="/cart"><ShoppingCartIcon /></Link>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          sx={{ display: { sm: 'none' } }}
        >
          {sidebarContent}
        </Drawer>

        <div style={{ padding: '20px', display: 'flex', alignItems: 'center' }}>
          <InputBase
            placeholder="Search products by name"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ flex: 1, padding: '0 10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <IconButton type="submit" aria-label="search">
            <SearchIcon />
          </IconButton>
        </div>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
            {sidebarContent}
          </Grid>

          <Grid item xs={12} sm={10}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Grid container spacing={2}>
                {filteredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id}>
                    <Card>
                      <CardContent>
                        <Carousel showThumbs={false} showStatus={false} infiniteLoop>
                          {product.images.map((image, index) => (
                            <div key={index}>
                              <img
                                src={`data:${image.contentType};base64,${Buffer.from(image.data).toString('base64')}`}
                                alt={product.name}
                                style={{ width: '100%', height: '300px' }}
                              />
                            </div>
                          ))}
                        </Carousel>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
                          <Typography variant="h5">{product.name}</Typography>
                          <Typography variant="body1">
                            {product.price} $
                          </Typography>
                        </div>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAddToCart(product._id)}
                        >
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
};

export default StoreFront;
