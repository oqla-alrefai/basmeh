import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import {
  getProducts,
  deleteProduct,
  updateProduct,
  addDiscount,
  removeDiscount,
} from "../features/Actios/productActions";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Avatar,
  styled,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Buffer } from 'buffer';

const Products = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const [searchQuery, setSearchQuery] = useState("");
  const [editableProduct, setEditableProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const inputRefs = useRef({ name: null, price: null, description: null });
  const activeField = useRef(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [discountParams, setDiscountParams] = useState({
    percentage: 0,
    startTime: "",
    endTime: "",
    productId: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      await dispatch(getProducts());
      setLoading(false);
    };

    fetchProducts();
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      products.forEach((product) => {
        if (product.discount && new Date(product.discount.endTime) <= now) {
          dispatch(removeDiscount(product._id)).then(() => {
            dispatch(getProducts());
          });
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [dispatch, products]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const CardContainer = styled(Card)({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  });

  const handleEditClick = (product) => {
    setEditableProduct({ ...product });
    setOpenEditDialog(true);
    activeField.current = 'name';
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditableProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
    activeField.current = name;
  };

  const handleCancelEdit = () => {
    setEditableProduct(null);
    setOpenEditDialog(false);
    activeField.current = null;
  };

  const handleUpdateProduct = () => {
    // Exclude images from editableProduct
    const { images, ...productData } = editableProduct;
    dispatch(updateProduct(productData)).then(() => {
      dispatch(getProducts()); // Refetch products after updating
    });
    setEditableProduct(null);
    setOpenEditDialog(false);
    activeField.current = null;
  };

  const handleAddDiscount = () => {
    const { productId, percentage, startTime, endTime } = discountParams;
    dispatch(addDiscount({ productId, percentage, startTime, endTime })).then(() => {
      dispatch(getProducts()); // Refetch products after adding discount
    });
    setDiscountParams({
      percentage: 0,
      startTime: "",
      endTime: "",
      productId: "",
    });
    setOpenEditDialog(false); // Close the dialog after adding discount
  };

  const handleRemoveDiscount = (productId) => {
    dispatch(removeDiscount(productId)).then(() => {
      dispatch(getProducts()); // Refetch products after removing discount
    });
  };

  useEffect(() => {
    if (editableProduct && activeField.current && inputRefs.current[activeField.current]) {
      inputRefs.current[activeField.current].focus();
    }
  }, [editableProduct]);

  return (
    <Paper>
      <Typography variant="h5" gutterBottom padding={2}>
        Products
      </Typography>
      <Box padding={2}>
        <TextField
          label="Search Products"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Box>
      <Box padding={2}>
        <Grid container spacing={2}>
          {loading ? (
            <CircularProgress />
          ) : (
            filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <CardContainer>
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
                    {editableProduct && editableProduct._id === product._id ? (
                      <>
                        <TextField
                          name="name"
                          label="Name"
                          fullWidth
                          value={editableProduct.name}
                          onChange={handleEditChange}
                          inputRef={(el) => (inputRefs.current.name = el)}
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          name="price"
                          label="Price"
                          fullWidth
                          value={editableProduct.price}
                          onChange={handleEditChange}
                          inputRef={(el) => (inputRefs.current.price = el)}
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          name="description"
                          label="Description"
                          fullWidth
                          value={editableProduct.description}
                          onChange={handleEditChange}
                          inputRef={(el) => (inputRefs.current.description = el)}
                          sx={{ mb: 2 }}
                        />
                      </>
                    ) : (
                      <>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 3,
                          }}
                        >
                          <Avatar sx={{ marginRight: 2 }}>
                            {product.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="h6" component="div">
                            {product.name}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "center",
                            marginBottom: 1,
                          }}
                          color="text.secondary"
                        >
                          {product.price} $
                        </Typography>
                        <Typography
                          color="text.secondary"
                          sx={{
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "center",
                            marginBottom: 1,
                          }}
                        >
                          {product.description}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                  <CardActions
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {editableProduct && editableProduct._id === product._id ? (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleUpdateProduct}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <IconButton
                          onClick={() => handleEditClick(product)}
                          aria-label="edit"
                          color="success"
                        >
                          <ModeEditOutlineIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            dispatch(deleteProduct(product._id));
                          }}
                          aria-label="delete"
                          color="error"
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </>
                    )}
                    {/* Display add/remove discount buttons */}
                    {product.discount ? (
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleRemoveDiscount(product._id)}
                      >
                        Remove Discount
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setDiscountParams({ ...discountParams, productId: product._id });
                          setOpenEditDialog(true);
                        }}
                      >
                        Add Discount
                      </Button>
                    )}
                  </CardActions>
                </CardContainer>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
      {/* Edit Product or Add Discount Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>{discountParams.productId ? "Add Discount" : "Edit Product"}</DialogTitle>
        <DialogContent>
          {discountParams.productId ? (
            <>
              <TextField
                name="percentage"
                label="Discount Percentage"
                fullWidth
                type="number"
                value={discountParams.percentage}
                onChange={(e) => setDiscountParams({ ...discountParams, percentage: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                name="startTime"
                label="Start Time"
                fullWidth
                type="datetime-local"
                value={discountParams.startTime}
                onChange={(e) => setDiscountParams({ ...discountParams, startTime: e.target.value })}
                sx={{ mb: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                name="endTime"
                label="End Time"
                fullWidth
                type="datetime-local"
                value={discountParams.endTime}
                onChange={(e) => setDiscountParams({ ...discountParams, endTime: e.target.value })}
                sx={{ mb: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </>
          ) : (
            <>
              <TextField
                name="name"
                label="Name"
                fullWidth
                value={editableProduct?.name || ""}
                onChange={handleEditChange}
                inputRef={(el) => (inputRefs.current.name = el)}
                sx={{ mb: 2 }}
              />
              <TextField
                name="price"
                label="Price"
                fullWidth
                value={editableProduct?.price || ""}
                onChange={handleEditChange}
                inputRef={(el) => (inputRefs.current.price = el)}
                sx={{ mb: 2 }}
              />
              <TextField
                name="description"
                label="Description"
                fullWidth
                value={editableProduct?.description || ""}
                onChange={handleEditChange}
                inputRef={(el) => (inputRefs.current.description = el)}
                sx={{ mb: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancel
          </Button>
          {discountParams.productId ? (
            <Button onClick={handleAddDiscount} color="primary">
              Add Discount
            </Button>
          ) : (
            <Button onClick={handleUpdateProduct} color="primary">
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Products;
