// src/components/RecitationContainer.js
import React, { useContext, useRef, useEffect, useState } from "react";
import RecitationContext from "../context/RecitationContext";
import {
  Box,
  Button,
  Grid,
  Option,
  Select,
  selectClasses,
  Typography,
  Checkbox,
} from "@mui/joy";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";

import kalima from "../assets/img/kalima.svg";
import mosque from "../assets/img/mosque2.svg";
import start from "../assets/img/start-icon.svg";
import muteIcon from "../assets/img/mute1.png";
import unmuteIcon from "../assets/img/unmute1.png";
import microphone from "../assets/img/microphone.png";

// Styles
import {
  AyatBox,
  backgroundBg,
  bodyXs,
  contentWrapper,
  dateDouble,
  h2,
  timeStyle,
  welcomeCard,
  mosqueImg,
  stopRecordingBtn,
} from "../styles/VerseTranslationStyle.js";

// Hooks & components
import useMicrophone from "../hooks/useMicrophones";
import LiveMicVisualizer from "./LiveMicVisualizer";
import FeedbackForm from "./FeedbackForm";

const RecitationContainer = () => {
  const {
    // States
    recognizedText,
    translationRecognizedTextRef,
    language,
    previousAyaList,
    currentSurahData,
    ttsRate,
    isMutedRef,
    checkdCheckBox,
    matchesFound,
    flag,

    // Setters
    setLanguage,
    setCheckdCheckBox,

    // Methods
    startListening,
    stopListening,
    handleMute,
  } = useContext(RecitationContext);

  const {
    microphones,
    selectedMic,
    setSelectedMic,
    speakers,
    selectedSpeaker,
    setSelectedSpeaker,
  } = useMicrophone();

  const ayatListRef = useRef(null);
  const [ttsRateState, setTtsRateState] = useState(ttsRate.current);

  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent); // Detect iOS

  // Add new state for start text visibility
  const [showStartText, setShowStartText] = useState(true);

  const [arabicRecognizedText, setArabicRecognizedText] = useState("");
  const [isMuted, setIsMuted] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (ayatListRef.current) {
      ayatListRef.current.scrollTo({
        top: ayatListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [previousAyaList]);

  // For date/time display
  const date = new Date();
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const day = date.toLocaleDateString("en-US", { day: "numeric" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.toLocaleDateString("en-US", { year: "numeric" });
  const formattedDate = `${weekday}, ${day} ${month} ${year}`;

  const handleLanguageChange = (event, value) => {
    setLanguage(value);
  };

  const handleCheckBoxChange = () => {
    setCheckdCheckBox((prev) => !prev);
  };

  const handleMuteChange = () => {
    handleMute();
    setIsMuted((prev) => !prev);
  };

  useEffect(() => {
    setArabicRecognizedText(translationRecognizedTextRef.current);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translationRecognizedTextRef.current]);

    useEffect(() => {
      setIsMuted(isMutedRef.current);
       // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMutedRef.current]);

  useEffect(() => {
    setTtsRateState(ttsRate.current);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ttsRate.current]);

  // Add effect to hide start text when Arabic is detected
  useEffect(() => {
    
    if (recognizedText && showStartText) {
      setShowStartText(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recognizedText]);

  const handleDevClick = () => {
    navigate(`/dev`);
  };

  // Render
  return (
    <Box sx={backgroundBg}>
      <Box sx={contentWrapper}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <img src={kalima} alt="Logo" />
        </Box>

        <Box sx={welcomeCard}>
          <Box className="time">
            <Box sx={{ marginBottom: "0px", ...bodyXs }} className="today">
              Today
            </Box>
            <Box sx={timeStyle}>
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Box>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Box sx={h2}>
              Welcome to the Real-time Quran Listening Application
            </Box>
            <Box sx={{ marginTop: "2px", ...bodyXs }}>
              This app will help you understand the divine message of the Holy
              Quran by translating live Arabic recitation.
            </Box>
            <Box sx={dateDouble}>
              <Box sx={{ marginTop: "10px", ...bodyXs }}>{formattedDate}</Box>
            </Box>
          </Box>
          <Box sx={mosqueImg}>
            <img
              src={mosque}
              alt="Mosque"
              style={{ borderBottomRightRadius: "20px" }}
            />
          </Box>
        </Box>

        {flag ? (
          // ---------------- LIVE MODE ----------------
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box
                    sx={{
                      color: "#fff",
                      marginBottom: "20px",
                      marginTop: "20px",
                      textAlign: "center",
                      fontSize: "12px",
                      maxWidth: "800px",
                    }}
                  >
                    The app may not detect Arabic correctly and give incorrect
                    search results. Please always match the search results
                    before listening to the translation. You can restart
                    searching and turn off the mic access by reloading the page
                  </Box>

                  <Box
                    sx={{
                      color: "#fff",
                      textAlign: "center",
                      fontSize: "12px",
                      maxWidth: "800px",
                    }}
                  >
                    You can help improve this app. Contact us below using the
                    feedback form and indicate you would like to help improve
                    this app
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    my: 1,
                  }}
                >
                  <Box
                    sx={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img src={microphone} alt="Mic" width={25} height={25} />
                    <Box ml={2} mt={1}>
                      <LiveMicVisualizer />
                    </Box>
                  </Box>
                  <Box
                    onClick={handleMuteChange}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      id="muteIcon"
                      src={isMuted ? muteIcon : unmuteIcon}
                      alt={isMuted ? "Unmute" : "Mute"}
                      width={25}
                      height={25}
                    />
                  </Box>
                </Box>

                <Box sx={AyatBox} ref={ayatListRef}>
                {matchesFound && (
                    <Box sx={{ 
                      direction: "rtl", 
                      color: "#fff",
                      position: "sticky",
                      top: "-10px",
                      right: "-5px",
                      minHeight: "30px",
                      backgroundColor: "#1E1F26",
                      padding: "10px",
                      zIndex: 1,
                    }}>
                      {showStartText ? (
                        "Start Reciting. Turn on speaker to listen to translation"
                      ) : (
                        recognizedText
                      )}
                    </Box>
                  )}
                  {arabicRecognizedText?.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        fontSize: "18px",
                        marginBottom: "10px",
                      }}
                    >
                      Surah: {currentSurahData.current?.name}
                    </Box>
                  )}
                  <Box>
                    {previousAyaList?.length === 0 &&
                      currentSurahData?.name && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            fontSize: "18px",
                            marginBottom: "10px",
                          }}
                        >
                          Surah: {currentSurahData?.name}
                        </Box>
                      )}

                    {previousAyaList?.length > 0 ? (
                      previousAyaList?.map(
                        (
                          {
                            surahId,
                            verseId,
                            surahName,
                            ayahs,
                            normalizedText,
                            translation,
                            text,
                          },
                          idx
                        ) => (
                          <Box key={idx}>
                            <Box
                              sx={{
                                direction: "rtl",
                                color: "#fff",
                                marginTop: "10px",
                              }}
                            >
                              <span
                                style={{
                                  background:
                                    previousAyaList?.length === idx + 1
                                      ? "#535353"
                                      : "transparent",
                                }}
                              >
                                {`[${surahId}:${verseId}] - ${text}`}
                              </span>
                            </Box>

                            <Box sx={{ color: "#fff", marginTop: "10px" }}>
                              <span
                                style={{
                                  color: "#fff",
                                  backgroundColor:
                                    previousAyaList?.length === idx + 1
                                      ? "#535353"
                                      : "transparent",
                                }}
                              >
                                {`[${surahId}:${verseId}] - ${translation}`}
                              </span>
                            </Box>
                          </Box>
                        )
                      )
                    ) : (
                      <Box>
                        <Box
                          sx={{
                            direction: "rtl",
                            color: "#fff",
                            marginTop: "10px",
                          }}
                        >
                          <p style={{ color: "#fff" }}>
                            No Quran verse matched yet
                          </p>
                        </Box>

                        <Box sx={{ color: "#fff", marginTop: "10px" }}>
                          <p style={{ color: "#fff" }}>
                            No translation available.
                          </p>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={4}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    color: "#fff",
                  }}
                >
                  <Typography sx={{ color: "#fff" }}>
                    Select Microphone
                  </Typography>
                  <Select
                    fullWidth
                    placeholder="Select Microphone"
                    value={selectedMic}
                    onChange={(event, val) => setSelectedMic(val)}
                    indicator={<KeyboardArrowDown />}
                    sx={{
                      width: "100%",
                      marginTop: "5px",
                      backgroundColor: "#2C5741",
                      border: "1px solid #fff",
                      color: "#fff",
                      "&:hover ": {
                        backgroundColor: "#2C5741",
                      },
                      [`& .${selectClasses.indicator}`]: {
                        transition: "0.2s",
                        [`&.${selectClasses.expanded}`]: {
                          transform: "rotate(-180deg)",
                        },
                      },
                    }}
                  >
                    {microphones.map((mic) => (
                      <Option key={mic.deviceId} value={mic.deviceId}>
                        {mic.label || `Mic ${mic.deviceId}`}
                      </Option>
                    ))}
                  </Select>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "#fff",
                  }}
                >
                  {isIOS ? (
                    <p>
                      🔊 On iPhone, change the output speaker manually using the
                      Control Center.
                    </p>
                  ) : (
                    <Box sx={{ width: "100%" }}>
                      <Typography sx={{ color: "#fff" }}>
                        Select Speaker{" "}
                      </Typography>

                      <Select
                        fullWidth
                        placeholder="Select Speaker "
                        value={selectedSpeaker}
                        onChange={(event, val) => setSelectedSpeaker(val)}
                        indicator={<KeyboardArrowDown />}
                        sx={{
                          width: "100%",
                          marginTop: "5px",
                          backgroundColor: "#2C5741",
                          border: "1px solid #fff",
                          color: "#fff",
                          "&:hover ": {
                            backgroundColor: "#2C5741",
                          },
                          [`& .${selectClasses.indicator}`]: {
                            transition: "0.2s",
                            [`&.${selectClasses.expanded}`]: {
                              transform: "rotate(-180deg)",
                            },
                          },
                        }}
                      >
                        {speakers?.length > 0 &&
                          speakers?.map((mic, index) => (
                            <Option key={index} value={mic.deviceId}>
                              {mic.label || `🎤 Microphone ${mic.deviceId}`}
                            </Option>
                          ))}
                      </Select>
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={4}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    color: "#fff",
                  }}
                >
                  <Typography mr={1} sx={{ color: "#fff" }}>
                    Translation Speed = {ttsRateState.toFixed(2)}
                  </Typography>
                  <Checkbox
                    sx={{
                      color: "#fff",
                      "&.Mui-checked": {
                        color: "#fff", // Color when checked
                      },
                    }}
                    checked={checkdCheckBox}
                    onChange={handleCheckBoxChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                  <Typography sx={{ color: "#fff", marginLeft: "5px" }}>
                    Auto
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "30px",
              }}
            >
              <Box sx={{ marginTop: "20px" }}>
                <Button
                  sx={stopRecordingBtn("#8a1225")}
                  onClick={stopListening}
                >
                  Stop Listening
                </Button>
              </Box>
              <Box
                sx={{
                  marginTop: "30px",
                  fontSize: "32px",
                  color: "#fff",
                  fontWeight: "500",
                }}
              >
                Listening...
              </Box>

              <FeedbackForm />
            </Box>
           
          </Box>
        ) : (
          // ---------------- INITIAL MODE ----------------
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginTop: "30px",
            }}
          >
            <Select
              placeholder="Select Language"
              value={language}
              onChange={handleLanguageChange}
              indicator={<KeyboardArrowDown />}
              sx={{
                width: 240,
                backgroundColor: "#2C5741",
                border: "1px solid #fff",
                color: "#fff",
                "&:hover ": {
                  backgroundColor: "#2C5741",
                },
                [`& .${selectClasses.indicator}`]: {
                  transition: "0.2s",
                  [`&.${selectClasses.expanded}`]: {
                    transform: "rotate(-180deg)",
                  },
                },
              }}
            >
              <Option value="english">English</Option>
            </Select>

            <Box
              sx={{ marginTop: "20px", cursor: "pointer" }}
              onClick={startListening}
            >
              <img src={start} alt="Start" />
            </Box>
            <Box
              sx={{
                marginTop: "30px",
                fontSize: "32px",
                color: "#fff",
                fontWeight: "500",
              }}
            >
              Start Translating
            </Box>
            <Box sx={{ marginTop: "30px" }}>
              <Button
                onClick={handleDevClick}
                sx={{
                  color: '#999696',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Become a developer click here
              </Button>
            </Box>
          </Box>
          
        )}
        
      </Box>
      
    </Box>
  );
};

export default RecitationContainer;
