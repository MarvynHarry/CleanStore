import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import axiosInstance from "../utils/axiosInstance";
import OrderForm from "./OrderForm";

interface Order {
  id: number;
  productId: number;
  quantity: number;
  total: number;
  date: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error al cargar órdenes:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const getProductName = (productId: number): string => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : "Producto desconocido";
  };

  const handleOpenCreateModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const navigateTo = (path: string) => {
    window.location.href = path; // Simula una navegación simple
  };

  return (
    <Box>
      {/* Barra de Navegación */}
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            onClick={() => navigateTo("/")}
          >
            Inicio
          </Button>
        </Toolbar>
      </AppBar>

      {/* Contenido Principal */}
      <Box margin={5}>
        <Typography variant="h4" gutterBottom>
          Lista de Órdenes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenCreateModal}
          sx={{ mb: 2 }}
          startIcon={<AddIcon />}
        >
          Crear Orden
        </Button>
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Producto: {getProductName(order.productId)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Cantidad: {order.quantity}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total: ${order.total}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Fecha: {new Date(order.date).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <OrderForm open={isModalOpen} onClose={handleCloseModal} onOrderSaved={fetchOrders} />
      </Box>
    </Box>
  );
};

export default OrderList;
