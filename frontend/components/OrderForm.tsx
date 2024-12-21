import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

interface Order {
  productId: number;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  stock: number;
}

interface OrderFormProps {
  open: boolean;
  onClose: () => void;
  onOrderSaved: () => Promise<void>;
}

const OrderForm: React.FC<OrderFormProps> = ({
  open,
  onClose,
  onOrderSaved,
}) => {
  const [orderData, setOrderData] = useState<Order>({
    productId: 0,
    quantity: 1,
  });
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
    resetForm(); // Resetear el formulario cuando se abre o se cierra el modal
  }, [open]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderData((prevData) => ({
      ...prevData,
      [name]: name === "quantity" ? +value : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const updatedOrderData = {
        ...orderData,
        date: new Date().toISOString(),
      };

      await axiosInstance.post("/orders", updatedOrderData);
      await onOrderSaved();
      handleClose();
    } catch (error) {
      console.error("Error al guardar la orden:", error);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setOrderData({
      productId: 0,
      quantity: 1,
    });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Crear Orden
        </Typography>
        <TextField
          select
          label="Producto"
          name="productId"
          value={orderData.productId}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.name} (Stock: {product.stock})
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Cantidad"
          name="quantity"
          type="number"
          value={orderData.quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
          inputProps={{ min: 1 }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="contained" onClick={handleSubmit} color="primary">
            Guardar
          </Button>
          <Button variant="outlined" onClick={handleClose} color="secondary">
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default OrderForm;
