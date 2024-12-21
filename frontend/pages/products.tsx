import React from "react";
import { Box, Container } from "@mui/material";
import ProductList from "../components/ProductList";

const ProductsPage: React.FC = () => {
  return (
    <Container>
      <Box mt={2}>
        <ProductList />
      </Box>
    </Container>
  );
};

export default ProductsPage;
