// src/context/RecitationProvider.js

import React, { useState, useEffect, useRef } from "react";
import RecitationContext from "./RecitationContext";

// Custom hooks
import useSpeechRecognition from "../hooks/useSpeechRecognition";

// Helpers
import {
  searchInWholeQuran,
  checkRollingWindowMatch,
  speakTranslation,
  fuseInstanceFn,
  processRecognition,
  bismillahDetection,
  initRollingWindow,
  findMultipleMatches,
  loadNextChunk,
} from "../utils/recitationHelpers";

// Utilities

// Data
import quran_eng from "../data/quran_eng.json";
import {
  surahNameArray,
  dataForWholeQuranSearchAbleFormat,
} from "../data/static";

// External library for surah detection
import Fuse from "fuse.js";
import { normalizeArabicText } from "../utils/normalizeArabicText";
/**
 * The RecitationProvider manages all global states and methods
 * for real-time Quranic recitation & translation.
 */
export const RecitationProvider = ({ children }) => {
  // ------------------- Global States -------------------
  const [recognizedText, setRecognizedText] = useState("");
  const [translations, setTranslations] = useState([]);
  const [language, setLanguage] = useState("english");

  // Surah detection
  const [fuse, setFuse] = useState(null);

  const [surahName, setSurahName] = useState("");
  const [translationsArray, setTranslationsArray] = useState("");
  const [surahData] = useState(surahNameArray);
  // const [versesList, setVersesList] = useState([]);

  // References
  const isListeningRef = useRef(false);
  const translationRecognizedTextRef = useRef("");
  const versesList = useRef([]);
  const surahFlag = useRef(false);
  const surahId = useRef(0);
  const currentSurahData = useRef(null);
  const processedVersesRef = useRef(new Set());
  const lastAyahIdRef = useRef(0);
  const fuseRef = useRef(null);
  const nextChunkStart = useRef(0);
  const isMutedRef = useRef(true);
  const rollingWindowRef = useRef([]);
  const bismillahFoundRef = useRef(false);
  const AllahoHoAkbarFoundRef = useRef(false);
  const ttsRate = useRef(1.0);

  // "Next verse" matching
  const [rollingWindow, setRollingWindow] = useState([]);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const ROLLING_WINDOW_SIZE = 2;

  // For displaying previously matched verses
  const [previousAyaList, setPreviousAyaList] = useState([]);

  // TTS speed and auto
  const [checkdCheckBox, setCheckdCheckBox] = useState(true);

  // Mute/unmute TTS

  // Control partial recognized text
  const [matchesFound, setMatchesFound] = useState(true);

  // Time tracking
  const [startTime, setStartTime] = useState(null);
  const [pauseStartTime, setPauseStartTime] = useState(null);
  const [totalPausedTime, setTotalPausedTime] = useState(0);
  const [totalArabicWords, setTotalArabicWords] = useState(0);
  const [currentChunkStart, setCurrentChunkStart] = useState(0);

  // Control flags
  const [flag, setFlag] = useState(false); // "live" mode UI
  const [interruptFlag, setInterruptFlag] = useState(false);

  // Quran data
  const [quranData] = useState(quran_eng);

  // --------------- 1) Create Fuse for Surah detection ---------------

  useEffect(() => {
    // Add console.log to debug surahData
    if (!surahData || surahData.length === 0) return;
    const verses = [];

    // Changed from optional chaining to direct access since we checked for existence
    surahData.forEach((verse) => {
      const normalizedText = normalizeArabicText(verse.text);
      verses.push({
        name: verse.name,
        id: verse.surahId,
        text: verse.text,
        normalizedText,
        translation: verse.translation,
      });
    });

    versesList.current = verses;

    const fuseInstance = fuseInstanceFn(versesList.current, 0.2);
    setFuse(fuseInstance);
    fuseRef.current = fuseInstance;
  }, [surahData]);

  // --------------- 2) Adjust TTS Speed ---------------
  const adjustTtsSpeed = (wordsCount, elapsedTimeMs) => {
    if (!checkdCheckBox) return; // user disabled "auto"
    if (!wordsCount || elapsedTimeMs <= 1000) return;

    const wpm = wordsCount / (elapsedTimeMs / 60000); // words per minute
    let newRate = 1.0;
    if (wpm > 200) newRate = 2.0;
    else if (wpm > 150) newRate = 1.75;
    else if (wpm > 120) newRate = 1.5;
    else if (wpm > 100) newRate = 1.25;
    else if (wpm > 70) newRate = 1.0;
    else newRate = 0.85;

    ttsRate.current = newRate;
  };

  // --------------- 4) Wrappers for recitationHelpers ---------------
  const doSearchInWholeQuran = (transcript) => {
    searchInWholeQuran(transcript, {
      quranData,
      dataForWholeQuranSearchAbleFormat,
      surahFlag,
      setSurahName,
      surahId,
      currentSurahData,
      rollingWindowRef,
      setCurrentVerseIndex,
      setRollingWindow,
      translationRecognizedTextRef,
      setTranslations,
      setPreviousAyaList,
      setRollingWindow,
      stopRecognitionAndReset,
    });
  };

  const doProcessRecognition = (transcript) => {
    processRecognition(transcript, resetter, {
      processedVersesRef,
      translationsArray,
      setTranslationsArray,
      accumulatedTranscriptRef,
      setTranslations,
      translationRecognizedTextRef,
      rollingWindowRef,
      recognitionRef,
      lastAyahIdRef,
      currentSurahData,
      setRollingWindow, // Add this to access the rolling window setter
      currentChunkStart, // Assuming this is also provided
      quranData, // Assuming this is also provided
      ROLLING_WINDOW_SIZE,
      setPreviousAyaList,
      isMutedRef,
      ttsRate,
      language,
    });
  };

  const doLoadNextChunk = (surahLength, surahVerses) => {
    loadNextChunk(surahLength, surahVerses, {
      currentSurahData,
      nextChunkStart,
    });
  };

  const doSpeakTranslation = (textToSpeak) => {
    speakTranslation(textToSpeak, {
      isMutedRef,
      ttsRate,
      language,
    });
  };

  const checkForMatches = (transcript) => {
    const AllahoakbarTranscript = "الله اكبر";
    const Allahoakbar = "اللّٰهُ أَكْبَرْ";
    const AllahoakbarTranslation = "Allah is the Greatest";
    if (
      transcript?.includes(AllahoakbarTranscript) &&
      !AllahoHoAkbarFoundRef.current
    ) {
      speakTranslation(AllahoakbarTranslation, {
        isMutedRef,
        ttsRate: ttsRate.current,
        language,
      });
      setPreviousAyaList((prev) => [
        ...prev,
        {
          surahId: 0,
          verseId: 0,
          text: Allahoakbar,
          translation: AllahoakbarTranslation,
        },
      ]);
      AllahoHoAkbarFoundRef.current = true;
      setTimeout(() => {
        resetter();
        AllahoHoAkbarFoundRef.current = false;
      }, [2000]);
      return;
    }
    // Split on any whitespace and remove empty entries
    const words = transcript.trim().split(/\s+/).filter(Boolean);
    if (words.length < 3) {
      return;
    }

    if (!surahFlag.current && surahId.current < 1) {
      console.log("No surah detected yet, searching for surah...");

      // Initialize word queue for progressive matching
      let wordQueue = [];
      let matchFound = false;

      // Try matching with increasing number of words
      for (let i = 0; i < words.length && !matchFound; i++) {
        wordQueue.push(words[i]);
        const searchPhrase = wordQueue.join(" ");
        const normalizedPhrase = normalizeArabicText(searchPhrase);
        console.log("fuseRef.current>>>", fuseRef.current);
        const fuseResults = fuseRef.current?.search(normalizedPhrase);
        console.log("fuseResults", fuseResults);

        if (fuseResults && fuseResults.length > 0) {
          if (fuseResults.length === 1) {
            // Unique match found
            matchFound = true;
            const foundItem = fuseResults[0].item;
            console.log("bismillah found:", bismillahFoundRef.current);
            if (foundItem?.id === 0) {
              // bismillahDetection detected
              if (!bismillahFoundRef.current) {
                bismillahFoundRef.current = true;
                const bismillahTranscript =
                  "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ";
                bismillahDetection(bismillahTranscript, doSpeakTranslation, {
                  translationsArray,
                  lastAyahIdRef,
                  translationRecognizedTextRef,
                  setTranslations,
                  accumulatedTranscriptRef,
                  setPreviousAyaList,
                  isMutedRef,
                  ttsRate: ttsRate.current,
                  language,
                  recognitionRef,
                });
                wordQueue = [];
                recognitionRef.current.stop();
                return;
              }
            } else {
              AllahoHoAkbarFoundRef.current = false;
              bismillahFoundRef.current = false;
              const surahDataItem = quranData[foundItem.id - 1];
              console.log("surahDataItem", surahDataItem);
              currentSurahData.current = surahDataItem;
              
              setSurahName(foundItem?.name);
              surahId.current = foundItem?.id;
              console.log("surahDataItem", surahDataItem);
              const surahDataItemNormalizedText = normalizeArabicText(
                surahDataItem?.verses?.[0]?.text
              );
              console.log("setPreviousAyaList in checkForMatches");

              setPreviousAyaList((prev) => [
                ...prev,
                {
                  text: surahDataItem?.verses?.[0]?.text,
                  translation: surahDataItem?.verses?.[0]?.translation,
                  surahId: surahDataItem?.surahId,
                  verseId: surahDataItem?.verses?.[0]?.verseId,
                },
              ]);
              lastAyahIdRef.current = surahDataItem?.verses?.[0]?.verseId;
              surahFlag.current = true;
              speakTranslation(foundItem?.translation, {
                isMutedRef,
                ttsRate: ttsRate.current,
                language,
              });
              console.log("ini>>>", surahDataItem);
              // Initialize rolling window
              const newWindow = initRollingWindow(surahDataItem, 1);
              console.log("newWindow1>>>", newWindow);
              rollingWindowRef.current = newWindow;
              break;
            }
            // Set states for the found surah
          } else {
            console.log(`Found ${fuseResults.length} matches, continuing...`);
          }
        } else if (i === words.length - 1) {
          // No matches found after trying all words
          console.log("No surah match found, searching whole Quran...");
          doSearchInWholeQuran(transcript);
        }
      }
    } else {
      // We already have a Surah => check rolling window for next verse
      console.log("Surah already detected, proceeding to process");
      doProcessRecognition(transcript);
    }
  };

  const stopRecognitionAndReset = () => {
    stopListening();
  };

  const resetter = () => {
    console.log("resetter");
    stopRecognition();
    // Reset Surah states
    surahFlag.current = false;
    surahId.current = 0;
    // setSurahName("");

    // Reset recognized text
    // setTranslations([]);
    setRecognizedText("");
    // translationRecognizedTextRef.current = "";
    // setPreviousAyaList([]);
    currentSurahData.current = null;
    setCurrentVerseIndex(0);
    setRollingWindow([]);
    // setMatchesFound(false);

    // Reset times
    setStartTime(null);
    setPauseStartTime(null);
    setTotalPausedTime(0);
    setTotalArabicWords(0);
    // setInterruptFlag(false);
    accumulatedTranscriptRef.current = "";

    processedVersesRef.current = new Set();
  };

  // --------------- 6) Mute/unmute TTS ---------------
  const handleMute = () => {
    isMutedRef.current = !isMutedRef.current;
  };

  // --------------- 7) Start + Stop Listening ---------------
  const startListening = () => {
    // small TTS to un-block on iOS
    doSpeakTranslation(" ");

    if (!isListeningRef.current) {
      console.log("starting recognition");
      isListeningRef.current = true;
      setFlag(true); // switch UI to "live" mode
      startRecognition(); // from our custom hook
    }
  };

  const stopListening = () => {
    stopRecognition(); // from our custom hook
    isListeningRef.current = false;
    setFlag(false);
    window.speechSynthesis.cancel();
    window.location.reload();
  };

  // --------------- 8) Use the custom hook: useSpeechRecognition ---------------
  // This hook handles the actual browser speech recognition events
  const {
    startRecognition,
    stopRecognition,
    recognitionRef,
    accumulatedTranscriptRef,
  } = useSpeechRecognition({
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
  });

  // --------------- 9) Provide all states & methods ---------------
  const providerValue = {
    // States
    isListeningRef,
    recognizedText,
    translationRecognizedTextRef,
    translations,
    language,
    fuse,
    surahFlag,
    surahName,
    surahId,
    lastAyahIdRef,
    rollingWindow,
    currentSurahData,
    rollingWindowRef,
    currentVerseIndex,
    previousAyaList,
    ttsRate,
    isMutedRef,
    checkdCheckBox,
    matchesFound,
    flag,
    startTime,
    totalPausedTime,
    totalArabicWords,
    interruptFlag,

    // Constants
    ROLLING_WINDOW_SIZE,

    // Setters
    setLanguage,

    setCheckdCheckBox,
    setMatchesFound,

    // Methods
    checkForMatches,
    stopRecognitionAndReset,
    handleMute,
    startListening,
    stopListening,
    resetter,
    doSpeakTranslation, // if you need to speak a custom text anytime
  };

  return (
    <RecitationContext.Provider value={providerValue}>
      {children}
    </RecitationContext.Provider>
  );
};
