// src/hooks/useSpeechRecognition.js
import { useEffect, useRef } from "react";
import { countArabicWords } from "../utils/quranUtils";
import { normalizeArabicText } from "../utils/normalizeArabicText";

export default function useSpeechRecognition({
  language,
  isListeningRef,
  recognizedText,
  setRecognizedText,
  pauseStartTime,
  setPauseStartTime,
  totalPausedTime,
  setTotalPausedTime,
  startTime,
  setStartTime,
  checkForMatches,
  adjustTtsSpeed,
  matchesFound,
  setInterruptFlag,
  setMatchesFound,
  setTranslations,
  totalArabicWords,
  setTotalArabicWords,
}) {
  const recognitionRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const accumulatedTranscriptRef = useRef(null);

  // How long to wait before stopping after silence
  const RECITATION_SILENCE_TIMEOUT = 5000;

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = language === "urdu" ? "ur-PK" : "ar-SA";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      isListeningRef.current = true;
      if (!startTime) setStartTime(new Date());
      console.log("Speech recognition started.");
    };

    recognition.onresult = (event) => {
      // Clear any existing silence timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      
      // Start new silence timer
      silenceTimerRef.current = setTimeout(() => {
        console.log("Silence detected => stopping recognition.");
        recognition.abort();
        isListeningRef.current = false;
        setInterruptFlag(true);
      }, RECITATION_SILENCE_TIMEOUT);

      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        interimTranscript += event.results[i][0].transcript + " ";
      }
      
      let finalNormalized = normalizeArabicText(interimTranscript.trim());
      accumulatedTranscriptRef.current = finalNormalized
      console.log("Normalized transcript:", finalNormalized);

      if (matchesFound) {
        setRecognizedText(interimTranscript.trim());
      }

      // Count words
      if (finalNormalized.length > 0) {
        // If user was paused, resume
        if (pauseStartTime) {
          const pausedDuration = new Date() - pauseStartTime;
          setTotalPausedTime((prev) => prev + pausedDuration);
          setPauseStartTime(null);
        }
        const recognizedWordsCount = countArabicWords(finalNormalized);
        const elapsedTimeMs = new Date() - startTime - totalPausedTime;
        setTotalArabicWords(recognizedWordsCount);
        adjustTtsSpeed(recognizedWordsCount, elapsedTimeMs);
      } else {
        if (!pauseStartTime) {
          setPauseStartTime(new Date());
        }
      }

      // Debounce the match check
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        console.log("ref value:", accumulatedTranscriptRef.current);
        checkForMatches(accumulatedTranscriptRef.current);
      }, 300);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      isListeningRef.current = false;

      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        // user blocked permission, handle if needed
      } else {
        // attempt to restart
        startRecognition();
      }
    };

    recognition.onend = () => {
      console.log("Speech recognition ended.");
      recognition.start();
    };

    return () => {
      recognition.stop();
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
    // eslint-disable-next-line
  }, [language]);

  function startRecognition() {
    console.log("isListening",isListeningRef.current)
    if(!recognitionRef.current) return;
    
    // Check if recognition is already in progress
    if (recognitionRef.current && isListeningRef.current) {
      console.log("starting recognition")
      try {
          recognitionRef.current.start();
      } catch (err) {
          console.error("Error starting recognition:", err);
      }
    }
  }

  function stopRecognition() {
    console.log("stopping recognition called")
    window.speechSynthesis.cancel();
    recognitionRef.current.stop();
  }

  return {
    recognitionRef,
    accumulatedTranscriptRef,
    startRecognition,
    stopRecognition,
  };
}
