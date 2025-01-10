import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
const ProductCard = ({
  image,
  title,
  brand,
  description,
  price,
  deliveryDate,
  matchPercentage,
  matching,
}) => {
  return (
    <Card
      sx={{
        maxWidth: "100%",
        borderRadius: "10px",
        boxShadow: 3,
        minHeight: "512px",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <StyledCardMedia component="img" image={image} alt={title} />
        {matching==="true" &&<Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "2px 8px",
            borderRadius: "20px",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          {matchPercentage}% Match
        </Box>}
        
      </Box>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        <Typography
          mb={2}
          variant="subtitle2"
          color="textSecondary"
          gutterBottom
        >
          {brand}
        </Typography>
        <Typography style={{ color: "#000000" }} variant="body2" paragraph>
          {description}
        </Typography>
        <StyledPriceBox>
          <Typography
            style={{ color: "green" }}
            variant="h6"
            fontWeight="bold"
          >
            ${price}
          </Typography>

          <Typography variant="body2" sx={{ ml: 1 }}>
            Delivers {deliveryDate}
          </Typography>
        </StyledPriceBox>
        <Button
          variant="contained"
          sx={{
            mt: 2,
            width: "100%",
            backgroundColor: "black",
            color: "white",
            borderRadius: "20px",
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

const StyledPriceBox = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});
const StyledCardMedia = styled(CardMedia)({
  objectFit: "cover",
  height: 230,
  "@media (max-width: 900px)": {
    height: 430,
  },
});

export default ProductCard;
