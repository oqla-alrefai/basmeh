import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  getProducts,
  deleteProduct,
  updateProduct,
  addDiscount,
  removeDiscount,
} from "../features/Actios/productActions";
import { Buffer } from "buffer";
import styles from "./Products.module.css";
import CreateProduct from "./CreateProduct";

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
  const [showCreateProductPopup, setShowCreateProductPopup] = useState(false);

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
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch, products]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (product) => {
    setEditableProduct({ ...product });
    setOpenEditDialog(true);
    activeField.current = "name";
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
    const { images, ...productData } = editableProduct;
    dispatch(updateProduct(productData)).then(() => {
      dispatch(getProducts());
    });
    setEditableProduct(null);
    setOpenEditDialog(false);
    activeField.current = null;
  };

  const handleAddDiscount = () => {
    const { productId, percentage, startTime, endTime } = discountParams;
    dispatch(addDiscount({ productId, percentage, startTime, endTime })).then(
      () => {
        dispatch(getProducts());
      }
    );
    setDiscountParams({
      percentage: 0,
      startTime: "",
      endTime: "",
      productId: "",
    });
    setOpenEditDialog(false);
  };

  const handleRemoveDiscount = (productId) => {
    dispatch(removeDiscount(productId)).then(() => {
      dispatch(getProducts());
    });
  };

  useEffect(() => {
    if (
      editableProduct &&
      activeField.current &&
      inputRefs.current[activeField.current]
    ) {
      inputRefs.current[activeField.current].focus();
    }
  }, [editableProduct]);

  return (
    <div className={styles.paper}>
      <h2 className={styles.title}>Products</h2>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search Products"
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.createProductContainer}>
        <button
          onClick={() => setShowCreateProductPopup(true)}
          className={styles.createProductButton}
        >
          Create Product
        </button>
      </div>
      <div className={styles.productsGrid}>
        {loading ? (
          <div className={styles.spinner}></div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} className={styles.productCard}>
              <Carousel showThumbs={false} showStatus={false} infiniteLoop>
                {product.images.map((image, index) => (
                  <div key={index}>
                    <img
                      src={`data:${image.contentType};base64,${Buffer.from(
                        image.data
                      ).toString("base64")}`}
                      alt={product.name}
                      className={styles.productImage}
                    />
                  </div>
                ))}
              </Carousel>
              <div className={styles.productContent}>
                <div className={styles.productHeader}>
                  <div className={styles.avatar}>
                    {product.name.charAt(0).toUpperCase()}
                  </div>
                  <h3>{product.name}</h3>
                </div>
                <p className={styles.productPrice}>{product.price} $</p>
                <p className={styles.productDescription}>
                  {product.description}
                </p>
              </div>
              <div className={styles.productActions}>
                <button
                  onClick={() => handleEditClick(product)}
                  className={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => dispatch(deleteProduct(product._id))}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
                {product.discount ? (
                  <button
                    onClick={() => handleRemoveDiscount(product._id)}
                    className={styles.removeDiscountButton}
                  >
                    Remove Discount
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setDiscountParams({
                        ...discountParams,
                        productId: product._id,
                      });
                      setOpenEditDialog(true);
                    }}
                    className={styles.addDiscountButton}
                  >
                    Add Discount
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {openEditDialog && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>
              {discountParams.productId ? "Add Discount" : "Edit Product"}
            </h2>
            {discountParams.productId ? (
              <>
                <input
                  type="number"
                  placeholder="Discount Percentage"
                  value={discountParams.percentage}
                  onChange={(e) =>
                    setDiscountParams({
                      ...discountParams,
                      percentage: e.target.value,
                    })
                  }
                  className={styles.inputField}
                />
                <input
                  type="datetime-local"
                  value={discountParams.startTime}
                  onChange={(e) =>
                    setDiscountParams({
                      ...discountParams,
                      startTime: e.target.value,
                    })
                  }
                  className={styles.inputField}
                />
                <input
                  type="datetime-local"
                  value={discountParams.endTime}
                  onChange={(e) =>
                    setDiscountParams({
                      ...discountParams,
                      endTime: e.target.value,
                    })
                  }
                  className={styles.inputField}
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  value={editableProduct?.name || ""}
                  onChange={handleEditChange}
                  name="name"
                  ref={(el) => (inputRefs.current.name = el)}
                  className={styles.inputField}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={editableProduct?.price || ""}
                  onChange={handleEditChange}
                  name="price"
                  ref={(el) => (inputRefs.current.price = el)}
                  className={styles.inputField}
                />
                <textarea
                  placeholder="Description"
                  value={editableProduct?.description || ""}
                  onChange={handleEditChange}
                  name="description"
                  ref={(el) => (inputRefs.current.description = el)}
                  className={styles.inputField}
                />
              </>
            )}
            <div className={styles.modalActions}>
              <button
                onClick={() => setOpenEditDialog(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              {discountParams.productId ? (
                <button
                  onClick={handleAddDiscount}
                  className={styles.saveButton}
                >
                  Add Discount
                </button>
              ) : (
                <button
                  onClick={handleUpdateProduct}
                  className={styles.saveButton}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {showCreateProductPopup && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              onClick={() => setShowCreateProductPopup(false)}
              className={styles.closeButton}
            >
              &times;
            </button>
            <h2 className={styles.formTitle}>Create New Product</h2>
            <CreateProduct
              onProductCreated={() => {
                setShowCreateProductPopup(false);
                dispatch(getProducts());
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
