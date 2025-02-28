import { Box, Grid } from "@mui/material";
import { useState } from "react";
import { feedbackBox } from "../styles/VerseTranslationStyle";

export default function FeedbackForm() {
  const [result, setResult] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  // const [message, setMessage] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "178a9ea4-f90b-4012-b47b-34d8c8112bc0");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      setResult("Form Submitted Successfully");
      setTimeout(() => {
        setResult(" ");
      }, 2000);
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };
  const handleRatingChange = (newRating) => {
    console.log("Start rating", newRating);
    setRating(newRating);
  };
  return (
    <Grid className="feedback-grid" sx={feedbackBox}>
      <Box mb={1}>Give us your feedback</Box>
      <Box mb={1}>
        <span>Rating : </span>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleRatingChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            style={{
              cursor: "pointer",
              color: star <= (hover || rating) ? "gold" : "gray",
            }}
          >
            ★
          </span>
        ))}
      </Box>
      <form onSubmit={onSubmit}>
        <Box>
          <input
            type="text"
            name="name"
            required
            placeholder="name"
            style={{ boxSizing: "border-box" }}
          />
        </Box>
        <Box>
          <input
            type="email"
            name="email"
            placeholder="Your Email (optional)"
            style={{ marginRight: "10px", boxSizing: "border-box" }}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone Number (optional)"
            style={{ boxSizing: "border-box" }}
          />
        </Box>
        <input
          type="text"
          name="rating"
          className="rating-style"
          readOnly
          value={rating}
          style={{ display: "none", boxSizing: "border-box" }}
        />
        <textarea
          name="message"
          required
          placeholder="Leave your feedback here..."
          rows={"4"}
          style={{ boxSizing: "border-box" }}
        ></textarea>
        <Box
          className="feedback-submit-btn"
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <button type="submit">Submit Form</button>
          <Box sx={{ marginTop: "2px" }}>Requires Internet connection</Box>
        </Box>
      </form>
      <span>{result}</span>
    </Grid>
  );
}
