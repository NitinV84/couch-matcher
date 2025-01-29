import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Modal,
} from "@mui/material";
import { styled } from "@mui/system";
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
  const [openModal, setOpenModal] = useState(false);
  const handleDeatils=()=>{
    setOpenModal(true)
  }
  const  handleCloseModal=()=>{
    setOpenModal(false)
  }
 
  return (
    <>
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
          {matching === "true" && (
            <Box
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
            </Box>
          )}
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
            onClick={handleDeatils}
          >
            Contact us
          </Button>
        </CardContent>
      </Card>
    
      <Modal open={openModal} onClose={handleCloseModal}>
        <ModalBox>
          <Typography style={{ fontWeight: 700 }} variant="h6" gutterBottom>
            Contact Details
          </Typography>
          <Box mt={2}>
            <StyledBox style={{ display: "flex" }}>
            <StyledTypography variant="body1">
              Name: 
            </StyledTypography>
            <Typography>Nitin Verma</Typography>
            </StyledBox>
            <StyledBox>
            <StyledTypography variant="body1" >
              Email: 
            </StyledTypography>
            <Typography>nitin@yopmail.com</Typography>
            </StyledBox>
            <StyledBox>
            <StyledTypography variant="body1" >
              Contact Number: 
            </StyledTypography>
            <Typography>+9178964598XX</Typography>
            </StyledBox>
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              style={{ background: "black", color: "white" }}
              onClick={handleCloseModal}
            >
              Ok
            </Button>
          </Box>
        </ModalBox>
      </Modal>
    </>
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
const ModalBox = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "500px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  padding: "24px",
  outline: "none",
});
const StyledBox =styled(Box)({
  display: "flex",
  gap:'10px'
})
const StyledTypography =styled(Typography)({
  fontWeight:700
})
export default ProductCard;
