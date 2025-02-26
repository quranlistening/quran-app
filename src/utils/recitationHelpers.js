// src/utils/recitationHelpers.js

import { normalizeArabicText } from "./normalizeArabicText";
import { calculateSimilarity, normatlizedData } from "./quranUtils"; // or wherever you keep it
import Fuse from "fuse.js";
import { useRecitation } from "../context/RecitationProvider"; // Adjust the import path as necessary

/**
 * Search the entire Quran data to find a surah & verse match for the given transcript.
 *
 * @param {string} transcript - The recognized text in normalized Arabic.
 * @param {object} params - All relevant state setters and data from context.
 */
export function searchInWholeQuran(
  transcript,
  {
    quranData,
    dataForWholeQuranSearchAbleFormat,
    surahFlag,
    surahId,
    setSurahName,
    currentSurahData,
    setCurrentVerseIndex,
    rollingWindowRef,
    translationRecognizedTextRef,
    setTranslations,
    setPreviousAyaList,
  }
) {
  console.log(
    "Searching in whole Quran with transcript:",
    dataForWholeQuranSearchAbleFormat
  );
  const searchableVerses = normatlizedData(dataForWholeQuranSearchAbleFormat);
  console.log("searchableVerses>>>", searchableVerses);
  const fuse = new Fuse(searchableVerses, {
    keys: ["normalizedText"],
    threshold: 0.3,
    includeScore: true,
  });

  const results = fuse?.search(transcript);
  console.log("Fuse search results:", results);

  if (results?.length > 0) {
    const bestMatch = results[0];
    console.log("Best match found:", bestMatch);

    const foundSurahName = bestMatch?.item?.name;
    const foundSurahId = bestMatch?.item?.surahId;
    const verseIndexFound = bestMatch?.item?.verseId;

    console.log("Found match details:", {
      surahName: foundSurahName,
      surahId: foundSurahId,
      verseIndex: verseIndexFound + 1,
    });

    // Set all state at once
    surahFlag.current = true;
    surahId.current = foundSurahId;
    setSurahName(foundSurahName);
    const surahDataItem = quranData[foundSurahId - 1];
    console.log("Found surah data:", surahDataItem);
    currentSurahData.current = surahDataItem;
    setCurrentVerseIndex(verseIndexFound);

    console.log("verseIndexFound", verseIndexFound);

    const newWindow = initRollingWindow(surahDataItem, verseIndexFound);
    rollingWindowRef.current = newWindow;
    // Set the matched verse text and translation
    const matchedVerse = surahDataItem?.verses[verseIndexFound];
    translationRecognizedTextRef.current = matchedVerse?.text;
    setTranslations([matchedVerse?.translation]);
  } else {
    console.log("No matches found in whole Quran search");
  }
}

/**
 * Creates and returns a new Fuse.js instance for a given list, threshold, etc.
 *
 * @param {Array} list             - The array of items to be searched.
 * @param {number} thresholdValue  - The threshold for fuzzy searching.
 * @returns {Fuse}                 - A Fuse.js instance.
 */
export function fuseInstanceFn(list, thresholdValue) {
  return new Fuse(list, {
    keys: ["normalizedText"],
    threshold: thresholdValue,
    includeScore: true,
    includeMatches: true,
  });
}

/**
 * Detects if the transcript starts with "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ" and handles the translation.
 *
 * @param {string} transcript - The recognized text in normalized Arabic.
 * @param {object} params - All relevant state setters and data from context.
 */
export const bismillahDetection = (transcript, speakTranslation, params) => {
  // Check if params is defined and has the required properties
  const {
    translationsArray = { current: new Set() }, // Default to an empty Set if undefined
    lastAyahIdRef,
    translationRecognizedTextRef,
    setTranslations,
    accumulatedTranscriptRef,
    setPreviousAyaList,
    isMutedRef,
    ttsRate,
    language,
    recognitionRef,
  } = params || {}; // Fallback to an empty object if params is undefined

  const bismillahTranslation =
    "In the name of Allah, the Entirely Merciful, the Especially Merciful";
  if (!translationsArray.current?.has(bismillahTranslation)) {
    translationsArray.current?.add(bismillahTranslation);
    lastAyahIdRef.current = 0; // Ensure setLastAyahId is a valid function
    // translationRecognizedTextRef.current = transcript;
    // setTranslations([bismillahTranslation]);
    accumulatedTranscriptRef.current = bismillahTranslation;
    setPreviousAyaList((prev) => [
      ...prev,
      {
        surahId: 0,
        verseId: 0,
        text: transcript,
        translation: bismillahTranslation,
      },
    ]);
    speakTranslation(bismillahTranslation, { isMutedRef, ttsRate: ttsRate.current, language });
  }
  recognitionRef.current.stop();
};

/**
 * Loads the next chunk of verses from a surah with normalized text and translations.
 *
 * @param {Object} params - Parameters object
 * @param {number} params.surahLength - Total number of verses in the surah
 * @param {Array} params.surahVerses - Array of verse objects from the surah
 * @param {number} params.currentChunkStart - Starting index for the current chunk
 * @param {number} params.chunkSize - Number of verses to load in each chunk
 * @param {Array} params.currentList - Current list of loaded verses
 * @param {Function} params.setVersesList - State setter function for verses list
 * @returns {Object} - Object containing the updated list and next chunk start position
 */
export const loadNextChunk = (
  surahLength,
  surahVerses,
  { currentSurahData, nextChunkStart }
) => {
  const chunkSize = 2;

  try {
    // Ensure nextChunkStart is initialized
    nextChunkStart.current = nextChunkStart.current || 0;

    // Ensure currentSurahData.current is an array
    if (!Array.isArray(currentSurahData.current)) {
      console.warn(
        "currentSurahData.current was not an array. Initializing..."
      );
      currentSurahData.current = [];
    }

    // Calculate the end of the current chunk
    const chunkEnd = Math.min(nextChunkStart.current + chunkSize, surahLength);
    console.log("chunkEnd>>>", chunkEnd);

    // Process the next chunk of verses
    const versesChunk = (Array.isArray(surahVerses) ? surahVerses : [])
      .slice(nextChunkStart.current, chunkEnd)
      .map((verse) => ({
        id: verse?.verseId,
        text: verse?.text || "",
        normalizedText: normalizeArabicText(verse?.text || ""),
        translation: verse?.translation || "",
      }));

    if (versesChunk.length === 0) {
      console.log(
        `No verses loaded. Current start: ${nextChunkStart.current}, End: ${chunkEnd}`
      );
    }

    // Append new verses to the array
    currentSurahData.current = [...currentSurahData.current, ...versesChunk];

    // Update next chunk start
    nextChunkStart.current = chunkEnd;
    console.log("nextChunkStart>>>", nextChunkStart.current);
  } catch (error) {
    console.error("Error loading next verses chunk:", error);
  }
};

/**
 * Speak out text (translation) using browser's SpeechSynthesis
 *
 * @param {string} textToSpeak
 * @param {object} params
 * @returns Promise that resolves when TTS finishes
 */
export function speakTranslation(text, { isMutedRef, ttsRate, language }) {
  const synth = window.speechSynthesis;
  if (!synth) {
    console.error("Speech synthesis not supported");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.volume = isMutedRef.current ? 0 : 1;
  utterance.lang = "en-US"; // Set to English
  const rate = typeof ttsRate === 'object' && ttsRate.current ? ttsRate.current : ttsRate;
  utterance.rate = Number(rate);
  utterance.pitch = 1.0; // Normal pitch

  utterance.onstart = () => console.log("Started speaking");
  utterance.onend = () => console.log("Finished speaking");
  utterance.onerror = (e) => console.error("Speech error:", e);

  synth.speak(utterance);
}

export const initRollingWindow = (surahData, startIndex) => {
  const firstTwo = surahData?.verses?.slice(startIndex, startIndex + 1);
  return firstTwo;
};

// Update processRecognition to use the rolling window

export const updateRollingWindow = (currentWindow, surahData, verseId) => {
   // Calculate remaining verses
   const remainingVerses = surahData?.verses?.length - verseId;
  
   // If we have 3 or fewer verses remaining, include all of them
   // This ensures we don't miss matches when nearing the end
   if (remainingVerses <= 3) {
     const remainingWindow = surahData?.verses?.slice(verseId);
     return remainingWindow;
   }
  const nextOne = surahData?.verses?.slice(verseId, verseId + 1);
  return nextOne;
};

export const processRecognition = (transcript, resetter, params) => {
  const {
    processedVersesRef,
    translationsArray,
    setTranslations,
    translationRecognizedTextRef,
    rollingWindowRef,
    lastAyahIdRef,
    currentSurahData,
    setPreviousAyaList,
    isMutedRef,
    ttsRate,
    language,
  } = params;

  if (!currentSurahData?.current?.verses) {
    console.warn("No valid surah data available");
    return;
  }

  // Get current rolling window verses
  const currentWindow = rollingWindowRef.current;

  // Prepare searchable format for current window only

  const searchableVerses = currentWindow?.map((verse) => ({
    ...verse,
    normalizedText: normalizeArabicText(verse.text),
  }));

  const normalizedTranscript = normalizeArabicText(transcript);
  console.log("searchableVerses>>>", normalizedTranscript);
  const fuseInstance = fuseInstanceFn(searchableVerses, 0.3);
  const results = findMultipleMatches(normalizedTranscript, fuseInstance);
  console.log("results123>>>", results);
  results?.forEach((el) => {
    
    if (processedVersesRef.current?.has(el?.verseId)) return;

    processedVersesRef.current = new Set(processedVersesRef.current).add(
      el?.verseId
    );
    
    if (!translationsArray?.current?.has(el?.translation)) {
      translationRecognizedTextRef.current = normalizeArabicText(el?.text);
      setTranslations([el?.translation]);
      translationsArray.current?.add(el?.translation);

      if (el?.verseId !== currentSurahData?.current?.verses?.length) {
        speakTranslation(el?.translation, {
          isMutedRef,
          ttsRate: ttsRate.current,
          language,
        });
      }
      console.log("setPreviousAyaList in processRecognition");
      setPreviousAyaList((prev) => [
        ...prev,
        { ...el, surahId: currentSurahData?.current?.surahId },
      ]);
    }

    lastAyahIdRef.current = el?.verseId;
    // Slide window forward after processing verse
    rollingWindowRef.current = updateRollingWindow(
      currentWindow,
      currentSurahData.current,
      el?.verseId
    );
  });
  console.log("lastAyahIdRef.current", lastAyahIdRef.current);

  if (lastAyahIdRef.current === currentSurahData?.current?.verses?.length) {
    console.log("Reached last verse of surah");
    translationRecognizedTextRef.current = "";
    setTranslations([]);

    const synth = window.speechSynthesis;
    const lastTranslation =
      currentSurahData?.current?.verses[lastAyahIdRef.current - 1]?.translation;
    console.log("lastTranslation", lastTranslation);
    if (synth && lastTranslation) {
      const utterance = new SpeechSynthesisUtterance(lastTranslation);
      utterance.lang = language === "english" ? "en-US" : "ar";
      utterance.rate = ttsRate.current;
      utterance.pitch = 1.0;
      utterance.volume = isMutedRef.current ? 0 : 1;
      utterance.onend = () => {
        console.log("Final translation finished speaking, resetting...");
        resetter();
      };
      synth.speak(utterance);
    } else {
      resetter();
    }
  }
};

export const findMultipleMatches = (transcript, fuseInstance) => {
  const words = transcript.split(" ").filter((word) => word.trim() !== "");
  const matches = [];
  let i = 0;
  while (i < words.length) {
    let matchFound = false;
    // Try to match from longest to shortest phrases starting at index i
    for (let j = words.length; j > i; j--) {
      const phrase = words.slice(i, j).join(" ");
      const normalizedPhrase = normalizeArabicText(phrase);
      const results = fuseInstance?.search(normalizedPhrase) || [];
      // Check for a match with a low enough score (high confidence)
      if (results?.length > 0 && results[0]?.score <= 0.3) {
        const matchedVerse = results[0]?.item;
        // Avoid duplicates by checking if the verse ID is already added
        if (
          !matches?.some((match) => match?.verseId === matchedVerse?.verseId)
        ) {
          matches.push(matchedVerse);
        }
        i = j; // Move past the matched words in the phrase
        matchFound = true;
        break;
      }
    }
    if (!matchFound) {
      // Move to the next word if no match found for this starting word
      i += 1;
    }
  }
  return matches;
};
