import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  AppBar,
  Toolbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import axiosInstance from "../utils/axiosInstance";
import ProductForm from "./ProductForm";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
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
          <Button
            color="inherit"
            startIcon={<ShoppingCartIcon />}
            onClick={() => navigateTo("/orders")}
            sx={{ ml: 2 }}
          >
            Órdenes
          </Button>
        </Toolbar>
      </AppBar>

      {/* Contenido Principal */}
      <Box margin={5}>
        <Typography variant="h4" gutterBottom>
          Lista de Productos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenCreateModal}
          sx={{ mb: 2 }}
        >
          Crear Producto
        </Button>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Precio: ${product.price}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Stock: {product.stock}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenEditModal(product)}
                  >
                    Editar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <ProductForm
          open={isModalOpen}
          onClose={handleCloseModal}
          onProductSaved={fetchProducts}
          initialData={selectedProduct || undefined}
        />
      </Box>
    </Box>
  );
};

export default ProductList;
