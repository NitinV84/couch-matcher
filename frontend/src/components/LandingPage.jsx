import { Box, Typography, Button, Container } from "@mui/material";
import { styled, keyframes } from "@mui/system";
import SofaImage from "../assets/images/sofa.jpg";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UploadForm from "./UploadForm";
import { useRef } from "react";
const LandingPage = () => {
  const uploadFormRef = useRef(null);

  const scrollToUploadForm = () => {
    if (uploadFormRef.current) {
      uploadFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      <Background style={{ backgroundImage: `url(${SofaImage})` }}>
        <Overlay />
        <Content maxWidth="md">
          <HeadingTypography fontWeight="bold">
            Find furniture matching your design
          </HeadingTypography>
          <DecriptionTypography>
            Upload an image of your dream furniture and let our AI find the
            closest match in your budget
          </DecriptionTypography>
          <StyledButton
            variant="contained"
            color="primary"
            sx={{ px: 4, backgroundColor: "#000", borderRadius: "20px" }}
            onClick={scrollToUploadForm}
          >
            <Typography>Get Quotation</Typography>
            <ArrowDownwardIcon style={{ marginLeft: "10px" }} />
          </StyledButton>
        </Content>
      </Background>
      <div ref={uploadFormRef}>
        <UploadForm />
      </div>
    </>
  );
};
// Styled Components
const bounceAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px); 
  }
`;
const Background = styled(Box)({
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const Overlay = styled(Box)({
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
});

const Content = styled(Container)({
  position: "relative",
  zIndex: 1,
  textAlign: "center",
  color: "#fff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
});
const HeadingTypography = styled(Typography)({
  fontSize: "60px",
  marginBottom: "20px",
  lineHeight: 1,
});
const DecriptionTypography = styled(Typography)({
  fontSize: "24px",
  marginBottom: "30px",
});
const StyledButton = styled(Button)({
  height: "45px",
  animation: `${bounceAnimation} 1.5s infinite ease-in-out`,
  "&:hover": {
    backgroundColor: "#333",
  },
  boxShadow: "0 0 10px white",
  display: "flex",
  alignItems: "center",
});

export default LandingPage;
