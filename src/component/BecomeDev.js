import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BecomeDev = () => {
  const navigate = useNavigate();
  return <Box sx={{padding: "20px",
    backgroundColor: "#11121B",
    minHeight: "80vh",
    position: "relative"
  }}>
    <Box 
      onClick={() => navigate("/")} 
      sx={{
        backgroundColor: "rgba(17, 18, 27, 0.95)",
        position: "fixed",
        top: "20px",
        left: "0px",
        width: "100%",
        height: "40px",
        zIndex: "9999",
        backdropFilter: "blur(5px)",
      }}
    >
      <Button 
        startIcon={<ArrowBackIcon />}
        sx={{
          color: "white",
          marginLeft: "20px",
          "&:hover": {color: "#b3b3b3"}
        }}
      >
        Back to home
      </Button>
    </Box>
    <Box 
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        marginTop: "50px",
        position: "relative",
        zIndex: "1"
      }}
    >
      <iframe 
      title="Document Title"
        style={{
          maxWidth: "625px",
          width: "100%",
          height: "100%",
          border: "none",
          overflow: "auto",
        }}
        src="https://docs.google.com/document/d/e/2PACX-1vTH9K0JcUaxkMm_D_9PaLOAOW1qtCde9PWmkFYg2VMkIw6EdBLoQJZB9NQGbbkjVHG1SckimZF-R3XK/pub?embedded=true"
      /> 
    </Box>
  </Box>;
};

export default BecomeDev;