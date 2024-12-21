import React from "react";
import { Box, Container } from "@mui/material";
import OrderList from "../components/OrderList";

const orders: React.FC = () => {
  return (
    <Container>
      <Box mt={2}>
        <OrderList />
      </Box>
    </Container>
  );
};

export default orders;
