import { Buffer } from "buffer";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/product/gets");
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card>
                <CardContent>
                  <Carousel
                    showThumbs={false} // Hide thumbnail navigation
                    showStatus={false} // Hide status indicator
                    infiniteLoop // Enable infinite loop
                  >
                    {product.images.map((image, index) => (
                      <div key={index}>
                        <img
                          src={`data:${image.contentType};base64,${Buffer.from(
                            image.data
                          ).toString("base64")}`}
                          alt={product.name}
                          style={{ width: "100%", height: "300px" }}
                        />
                      </div>
                    ))}
                  </Carousel>
                  <Typography variant="h5">{product.name}</Typography>
                  <Typography variant="body1">
                    Price: {product.price} $
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProductList;
