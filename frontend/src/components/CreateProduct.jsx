import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createProduct } from "../features/Actios/productActions"; 
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography
} from "@mui/material";

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const categories = ["Accessories", "Networks", "Gaming"];
  const [selectedCategories, setSelectedCategories] = useState([]);
  const dispatch = useDispatch();
  const token = "your_jwt_token_here"; // Make sure to replace this with your actual token

  const handleCategory = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCategories(typeof value === "string" ? value.split(",") : value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      name,
      price,
      description,
      images,
      token,
    };
    dispatch(createProduct(productData));
  };

  return (
    <Container maxWidth="md">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 4,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          backgroundColor: "white",
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Create Product
        </Typography>
        <FormControl fullWidth variant="outlined">
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormControl>
        <FormControl fullWidth variant="outlined">
          <TextField
            label="Price"
            variant="outlined"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </FormControl>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Categories</InputLabel>
          <Select
            multiple
            value={selectedCategories}
            onChange={handleCategory}
            input={<OutlinedInput label="Categories" />}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined">
          <TextField
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined">
          <Button variant="contained" component="label">
            Upload Images
            <input
              type="file"
              hidden
              multiple
              onChange={(e) => setImages(e.target.files)}
            />
          </Button>
        </FormControl>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default CreateProduct;
