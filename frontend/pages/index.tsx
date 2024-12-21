import React from "react";
import { Box, Typography, Button, Grid, Container } from "@mui/material";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css"

export default function Home() {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "50px" }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" gutterBottom>
        Bienvenido a <span className={styles.highlightText}>CleanStore</span>
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Gestión de productos y órdenes de manera sencilla y eficiente
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Box
            textAlign="center"
            p={4}
            border={1}
            borderColor="grey.300"
            borderRadius={2}
            boxShadow={3}
          >
            <Typography variant="h5" gutterBottom>
              Productos
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Gestiona tus productos, visualiza los detalles y actualiza su inventario.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigateTo("/products")}
            >
              Ver productos
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box
            textAlign="center"
            p={4}
            border={1}
            borderColor="grey.300"
            borderRadius={2}
            boxShadow={3}
          >
            <Typography variant="h5" gutterBottom>
              Órdenes
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Administra tus órdenes y monitorea las ventas de manera efectiva.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigateTo("/orders")}
            >
              Ver órdenes
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
