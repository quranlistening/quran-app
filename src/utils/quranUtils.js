import stringSimilarity from "string-similarity";
import { normalizeArabicText } from "./normalizeArabicText";

/** Calculate similarity using string-similarity library */
export function calculateSimilarity(str1, str2) {
    return stringSimilarity.compareTwoStrings(str1, str2);
  }
  
  /** Count Arabic words. Just splits on whitespace for simplicity. */
  export function countArabicWords(transcript) {
    return transcript.trim().split(/\s+/).length;
  }

  export const normatlizedData  = (currentWindow)=>{
    const   searchableVerses  = currentWindow?.map((verse) => ({
        ...verse,
        normalizedText: normalizeArabicText(verse.text),
      }));
      return searchableVerses;
  }
   