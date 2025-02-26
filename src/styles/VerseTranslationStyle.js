export let backgroundBg = {
  background: " linear-gradient(86.28deg, #0E190D 3.43%, #001A25 97.33%)",
  padding: "40px 30px 20px 40px",
  minHeight: "100vh",
};
export let contentWrapper = {
  padding: "20px",
  backgroundColor: "#11121B",
  borderRadius: "20px",
  minHeight: "80vh",
};
export let logoWarapper = {
  display: "flex",
  justifyContent: "center",
  alignIrems: "center",
  marginBottom: "30px",
};
export let welcomeCard = {
  background:
    "linear-gradient(270.23deg, #213723 0.22%, #294A34 49.32%, #2E8875 98.42%)",
  padding: "1px 0px 0px 30px",
  borderRadius: "20px",
  minHeight: "130px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  "@media (min-width: 768px) and (max-width: 1025px)": {
    paddingLeft: "10px",
  },
  "@media (max-width: 768px)": {
    flexDirection: "column",
    padding: "10px 10px 0px 10px",
    position: "relative",
    "& .time .today": {
      fontSize: "25px",
      textAlign: "center",
      marginTop: "10px",
    },
  },
};
export let timeStyle = {
  color: "#FFFFFF",
  fontSize: "36px",
  fontWeight: "600",
  "@media (min-width: 768px) and (max-width:1025px)": {
    fontSize: "28px",
    lineHeight: "30px",
    marginRight: "10px",
  },
};
export let mosqueImg = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-end",
  "@media (min-width: 768px) and (max-width: 820px)": {
    marginBottom: "-20px",
  },
  "@media (max-width: 768px)": {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    marginRight: "-10px",
  },
};
export let bodyXs = {
  fontSize: "11px",
  fontWeight: "500",
  color: "#ffffff",
};
export let bodyL = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#ffffff",
  marginTop: "10px",
};
export let h2 = {
  fontSize: "26px",
  fontWeight: "500",
  color: "#ffffff",
};
export let dateDouble = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
export let AyatBox = {
  color: "#ffffff",
  borderRadius: "5px",
  border: "1px solid #6F6F6F",
  backgroundColor: "#1E1F26",
  padding: "10px",
  minHeight: "300px",
  maxHeight: "300px",
  overflowY: "auto",
};
export let stopRecordingBtn = (hoverColor = "red") => {
  return {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    backgroundColor: hoverColor,
    "&:hover": {
      backgroundColor: hoverColor,
    },
  };
};

export let feedbackBox = {
  color: "#ffffff",
  marginTop: "20px",
  padding: "20px",
  maxWidth: "60%",
  border: "1px solid #6F6F6F",
  borderRadius: "10px",
  width: "100%",

  "@media (max-width:992px)": {
    maxWidth: "100%",
    padding: "10px",
    marginTop: "10px",
  },

  "& input": {
    color: "#ffffff",
    borderRadius: "5px",
    border: "1px solid #6F6F6F",
    backgroundColor: "#1E1F26",
    padding: "10px",
    marginBottom: "15px",
    width: "100%",
  },
  "& textarea": {
    color: "#ffffff",
    borderRadius: "5px",
    border: "1px solid #6F6F6F",
    backgroundColor: "#1E1F26",
    padding: "10px",
    width: "100%",
  },
  "& .feedback-submit-btn button": {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    color: "#4c4a4a",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    backgroundColor: "#ffffff",
    marginTop: "7px",
  },
};

export const loadingDotsStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "5px",
  my: 1,
  "& .dot": {
    width: "10px",
    height: "10px",
    backgroundColor: "#fff",
    borderRadius: "50%",
    animation: "bounce 1.4s infinite ease-in-out both",
  },
  "& .dot:nth-of-type(1)": { animationDelay: "-0.32s" },
  "& .dot:nth-of-type(2)": { animationDelay: "-0.16s" },
  "@keyframes bounce": {
    "0%, 80%, 100%": { transform: "scale(0)" },
    "40%": { transform: "scale(1)" },
  },
};
