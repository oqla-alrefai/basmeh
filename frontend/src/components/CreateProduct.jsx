import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createProduct } from "../features/Actios/productActions"; 
import styles from "./CreateProduct.module.css";

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
    const value = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedCategories(value);
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
    <form onSubmit={handleSubmit}>
      <div className={styles.formField}>
        <label className={styles.formLabel} htmlFor="name">Product Name</label>
        <input
          id="name"
          className={styles.formInput}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className={styles.formField}>
        <label className={styles.formLabel} htmlFor="price">Price</label>
        <input
          id="price"
          className={styles.formInput}
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div className={styles.formField}>
        <label className={styles.formLabel} htmlFor="description">Description</label>
        <textarea
          id="description"
          className={styles.formTextarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className={styles.formField}>
        <label className={styles.formLabel} htmlFor="images">Images</label>
        <input
          id="images"
          className={styles.formInput}
          type="file"
          onChange={(e) => setImages(e.target.files)}
          multiple
        />
      </div>
      <button type="submit" className={styles.formSubmitButton}>
        Create Product
      </button>
    </form>
  );
};

export default CreateProduct;