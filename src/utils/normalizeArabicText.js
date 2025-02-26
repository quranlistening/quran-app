// Helper function to normalize Arabic text
export const normalizeArabicText = (text) => {
  return text
    .replace(
      /[\u0610-\u061A\u064B-\u065F\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g,
      ""
    ) // Remove diacritics
    .replace(/الف\s+لام\s+ميم/g, "الم") // Convert "الف لام ميم" to "الم" (optional)
    .replace(/كاف\s+ها\s+يا\s+عين\s+صاد/g, "كهيعص")
    .replace(/كاف\s+هاء\s+يا\s+عين\s+صاد/g, "كهيعص")
    .replace(/كيف\s+هي\s+عين\s+صاد/g, "كهيعص")
    .replace(/[\u0622-\u0623\u0671\u0624\u0625\u0626]/g, "ا") // Normalize special characters
    .replace(/[\u0640]/g, "") // Remove Tatweel
    .replace(/ٱ/g, "ا") // Replace "ٱ" with "ا"
    .replace(/ٰ/g, "") // Remove superscript Alif
    .replace(/ياسين/g, "يسٓ") // Convert "ياسين" to "يسٓ"
    .trim();
};
