import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  Container,
  Button,
} from "@mui/material";
import ProductCard from "./ProductCard";
import axios from "axios";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { useNavigate } from "react-router-dom";

const AllProducts = () => {
  const [sofas, setSofas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchSofas();
  }, [page]);


  const navigateToHome =()=>{
    navigate("/")
  }
  const fetchSofas = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/sofas/?page=${page}`
      );
      setSofas((prev) => [...prev, ...data.results]);
      setHasMore(data.next !== null); 
    } catch (error) {
      console.error("Error fetching sofas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      if (hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <>
      <Button onClick={navigateToHome} sx={{ mb: 2 }}>
    <ArrowBackOutlinedIcon />
    <Typography style={{ marginLeft: "10px" }}>Back to home</Typography>
  </Button>
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {sofas.map((sofa, index) => (
          <Grid item xs={12} sm={12} md={4} lg={4} key={index}>
            <ProductCard
              image={sofa.image}
              title={sofa.name}
              brand={`Discount: ${sofa.discount}%`}
              description={sofa.description || "No description available"}
              price={sofa.price.toFixed(2)}
              deliveryDate="3-5 days"
              matching="false"
            />
          </Grid>
        ))}
      </Grid>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {!hasMore && (
        <Typography align="center" sx={{ mt: 4, color: "gray" }}>
          No more items to load
        </Typography>
      )}
    </Container>
    </>
  
  );
};

export default AllProducts;
