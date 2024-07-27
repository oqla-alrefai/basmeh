import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const backendURL = "http://localhost:5000/product";

export const deleteProduct = createAsyncThunk(
  "product/delete/:productId",
  async (id, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      };
      await axios.delete(`${backendURL}/delete/${id}`, config);
      return id;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
export const updateProduct = createAsyncThunk(
  "product/update/:productId",
  async (product, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      };
      const {data} = await axios.put(`${backendURL}/update/${product._id}`, product, config);
      console.log(data);
      return data.product
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getProducts = createAsyncThunk(
  "product/allproducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${backendURL}/allproducts`);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getProduct = createAsyncThunk(
  "product/getProduct",
  async (name, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${backendURL}/product/name=${name}`);
      return data;
    } catch (error) {
      if (error.response && error.response.data.error) {
        return rejectWithValue(error.response.data.error);
      } else {
        return rejectWithValue("Failed to fetch user");
      }
    }
  }
);

export const createProduct = createAsyncThunk(
  "product/create",
  async (productData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("price", productData.price);
      formData.append("description", productData.description);

      for (let i = 0; i < productData.images.length; i++) {
        formData.append("images", productData.images[i]);
      }

      const response = await axios.post(
        "http://localhost:5000/product/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const addDiscount = createAsyncThunk(
  "product/addDiscount",
  async ({ productId, percentage, startTime, endTime }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      };
      const body = { percentage, startTime, endTime };
      const { data } = await axios.put(
        `${backendURL}/add-discount/${productId}`,
        body,
        config
      );
      return data.product;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const removeDiscount = createAsyncThunk(
  "product/removeDiscount",
  async (productId, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      };
      const { data } = await axios.put(
        `${backendURL}/remove-discount/${productId}`,
        {},
        config
      );
      return data.product;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);