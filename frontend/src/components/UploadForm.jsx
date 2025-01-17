import { Box, TextField, Typography, Button, Grid, Modal, CircularProgress, Container} from "@mui/material";
import { styled } from "@mui/system";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import axios from "axios"
import ProductCard from "./ProductCard";

const UploadForm = () => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [border, setBorder] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [cardData, setCardData]=useState([])
  const [imageFile, setImageFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    budget: "",
    quantity: 1,
    deliveryDate: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const postFormApi = async () => {
    try {
      const form = new FormData();
      form.append("budget", formData.budget);
      form.append("quantity", formData.quantity);
      form.append("deliveryDate", formData.deliveryDate);
      if (imageFile) {
        form.append("image", imageFile);
      }
  
      const response = await axios.post("http://localhost:8000/api/sofas/matching/", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response?.data) {
        setCardData(response?.data);
        setLoading(false);
  
        // Scroll to the container after the data is fetched
        if (containerRef.current) {
          containerRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      setErrorMessage(errorMessage);
    }
  };
  
  
  
  const uploadImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleFileSelection(file);
  };
  const handleFileSelection = (file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setImageFile(file); 
      setBorder(true);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    handleFileSelection(file);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setOpenModal(true);
    setCardData([])
  };

  const navigateToViewAll = () => {
    navigate("/viewAll");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setErrorMessage({errorMessage:''});
    
  };
const submitData=()=>{
  setLoading(true);
  postFormApi()
  setOpenModal(false);
}
  return (
    <>
      <ViewAllButton
        variant="contained"
        color="primary"
        sx={{ px: 4, backgroundColor: "#000", borderRadius: "20px" }}
        onClick={navigateToViewAll}
      >
        <Typography>View All</Typography>
        <ArrowForwardOutlinedIcon style={{ marginLeft: "10px" }} />
      </ViewAllButton>
      <FormContainer>
        <form onSubmit={handleFormSubmit}>
          <InnerBox border={border.toString()}>
            <UploadContainer
              onClick={uploadImage}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              dragging={dragging.toString()}
            >
              {selectedImage ? (
                <PreviewImage src={selectedImage} alt="Selected" />
              ) : (
                <>
                  <StyledImageBox>
                    <AddPhotoAlternateOutlinedIcon />
                  </StyledImageBox>
                  <Typography
                    variant="body1"
                    style={{ color: "black", fontWeight: 500 }}
                  >
                    {dragging
                      ? "Drop your image here"
                      : "Drag and drop an image"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    or click to upload
                  </Typography>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileChange}
              />
            </UploadContainer>
          </InnerBox>

          <Grid container spacing={2} sx={{ marginTop: "16px" }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Your Budget"
                type="number"
                fullWidth
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: <Typography variant="body1">$</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity Needed"
                type="number"
                fullWidth
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Desired Delivery Date"
                type="date"
                fullWidth
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
          </Grid>

          <CustomButton type="submit" fullWidth>
          {loading ?( <CircularProgress style={{color:'white'}} />):("Get Quotation")}
          </CustomButton>
        </form>
      </FormContainer>

      <Container py={4} style={{marginBottom:'20px'}}>
        {cardData.length==0 &&<Typography  style={{fontWeight:600,color:'black',fontSize:'25px',marginBottom:'10px',textAlign:'center'}}>{errorMessage}</Typography>}
      {cardData.length>1 && <Typography style={{fontWeight:600,color:'black',fontSize:'25px',marginBottom:'10px'}}>Your Perfect Matches</Typography>}
      <Grid container spacing={4}>
        {cardData.map((item, index) => {
          const sofa = item.sofa;
          return (
          
            <Grid item xs={12} sm={12} md={4} lg={4} key={index}>
              <ProductCard
                image={sofa.image}
                title={sofa.name}
                brand={`Discount: ${sofa.discount}%`}
                description={sofa.description || "No description available"}
                price={sofa.price.toFixed(2)}
                deliveryDate="3-5 days"
                matchPercentage={Math.floor(sofa.similarity_score)} 
                matching="true"
              />
            </Grid>
          );
        })}
      </Grid>
      
        </Container>
     
      <Modal open={openModal} onClose={handleCloseModal}>
        <ModalBox>
          <Typography style={{ fontWeight: 700 }} variant="h6" gutterBottom>
            Confirm Your Request
          </Typography>
          <Typography style={{ opacity: "60%" }}>
            We'll search for furniture matches based on your image and
            preferences. This may take a moment.
          </Typography>
          <Box mt={2}>
            <Typography>
              <strong>Budget:</strong> ${formData.budget}
            </Typography>
            <Typography>
              <strong>Quantity:</strong> {formData.quantity}
            </Typography>
            <Typography>
              <strong>Delivery Date:</strong> {formData.deliveryDate}
            </Typography>
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              onClick={handleCloseModal}
              variant="contained"
              color="black"
            >
              Back
            </Button>
            <Button
              variant="contained"
              style={{ background: "black", color: "white" }}
              onClick={submitData}
            >
              Proceed
            </Button>
          </Box>
        </ModalBox>
      </Modal>
    </>
  );
};

// Styled Components
const UploadContainer = styled(Box)(({ dragging }) => ({
  borderRadius: "8px",
  textAlign: "center",
  backgroundColor: " #bdedb7",
  border: dragging === "true" ? "3px dashed #00796b" : "",
  height: "400px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  transition: "background-color 0.3s, border-color 0.3s",
}));

const FormContainer = styled(Box)({
  maxWidth: "750px",
  margin: "auto",
  marginTop: "32px",
  padding: "24px",
  borderRadius: "8px",
  backgroundColor: "#fff",
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.5)",
  marginBottom: "20px",
});

const CustomButton = styled(Button)({
  marginTop: "24px",
  cursor: "pointer",
  backgroundColor: "#000",
  color: "#fff",
  padding: "12px 24px",
  borderRadius: "20px",
  "&:hover": {
    backgroundColor: "#333",
  },
  minHeight:'55px', 
});

const StyledImageBox = styled(Box)({
  display: "flex",
  cursor: "pointer",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "white",
  marginBottom: "10px",
  borderRadius: "50%",
  height: "64px",
  width: "64px",
});

const PreviewImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "8px",
});

const InnerBox = styled(Box)(({ border }) => ({
  border: border === "false" ? "4px double #ccc" : "4px double #000000",
  padding: "20px",
  borderRadius: "8px",
}));
const ViewAllButton = styled(Button)({
  height: "45px",
  boxShadow: "0 0 10px #bdedb7",
  display: "flex",
  alignItems: "center",
  margin: "20px auto -10px auto",
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
export default UploadForm;
