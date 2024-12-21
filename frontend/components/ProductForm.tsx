import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onProductSaved: () => Promise<void>;
  initialData?: Product;
}

const ProductForm: React.FC<ProductFormProps> = ({
  open,
  onClose,
  onProductSaved,
  initialData,
}) => {
  const [productData, setProductData] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
  });

  useEffect(() => {
    // Al abrir el modal, establecer los valores iniciales (si los hay)
    if (initialData) {
      setProductData(initialData);
    } else {
      resetForm();
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: name === "price" || name === "stock" ? +value : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (productData.id) {
        // Actualizar producto existente
        await axiosInstance.put(`/products/${productData.id}`, productData);
      } else {
        // Crear nuevo producto
        await axiosInstance.post("/products", productData);
      }
      await onProductSaved();
      handleClose();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setProductData({
      name: "",
      description: "",
      price: 0,
      stock: 0,
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
          {productData.id ? "Editar Producto" : "Crear Producto"}
        </Typography>
        <TextField
          label="Nombre"
          name="name"
          value={productData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Descripción"
          name="description"
          value={productData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Precio"
          name="price"
          type="number"
          value={productData.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Stock"
          name="stock"
          type="number"
          value={productData.stock}
          onChange={handleChange}
          fullWidth
          margin="normal"
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

export default ProductForm;
