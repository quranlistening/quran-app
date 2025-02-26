# Real-time Quran Listening & Translation Application

Welcome to the **Real-time Quran Listening & Translation** app! This project uses the Web Speech API (both **Speech Recognition** and **Speech Synthesis**) to capture live Arabic recitation of the Quran, identify the corresponding verses in real time, and provide translations (in English or Urdu).

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Known Limitations](#known-limitations)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

1. **Main Objective**  
   Listen to Arabic recitations, detect surah/ayah live, and display/transmit translations.

2. **Speech Recognition**  
   Utilizes the browser’s built-in Speech Recognition API (Web Speech API) to capture audio input.

3. **Translation**  
   Converts matched verses into either English or Urdu text and optionally speaks them aloud.

4. **UI & Styling**  
   Powered by React, Material UI, and Joy UI

---

## Features

- **Live Speech Recognition**  
  Continuously processes Arabic recitation from your microphone.

- **Real-Time Verse Detection**  
  Uses fuzzy matching (Fuse.js) to find the closest Quranic verse to the recognized text.

- **Text-to-Speech (TTS)**  
  Speaks out the verse translations (supports muting, unmuting, and rate adjustments).

- **Device Selection**  
  Allows selecting different microphones and speakers (limited on iOS).

- **Feedback Form**  
  Users can submit feedback or requests for improvement directly from the interface.

- **Auto-Adjust TTS Rate**  
  Dynamically updates reading speed based on the pace of your recitation.

---

## How It Works

1. **Permissions & Initialization**  
   Upon clicking “Start Translating,” the app requests microphone access. Once granted, speech recognition begins.

2. **Recognition & Normalization**  
   The recognized Arabic text is stripped of diacritics to maximize matching accuracy.

3. **Verse Matching**  
   The recognized text is continuously compared against preprocessed Quranic data. When a verse is confidently matched, it’s displayed and spoken (if unmuted).

4. **Adaptive TTS**  
   The app measures the speed of recitation (words per minute) and dynamically adjusts the TTS rate (if “Auto” is checked).

5. **Stopping & Reset**  
   You can stop listening at any time, or simply refresh the page to reset everything (like reloading your personal translator).

---

## Tech Stack

- **React** (CRA)
- **Material UI + Joy UI** (for component styling)
- **Web Speech API** (SpeechRecognition & SpeechSynthesis)
- **Fuse.js** (fuzzy text matching for verse detection)
- **JavaScript** (primary logic)
- **HTML / CSS** (styling & layout)
- **Node / npm** (for dependency management)

---

## Getting Started

1. **Clone the Repository**

   ```bash
   git clone https://github.com/YourUsername/quranlistening/quran-app.git

   ```

2. **Install Dependencies**

   ```bash
   cd quran-app
   npm install

   ```

3. **Start the Development Server**

   ```bash
   npm start

   The app is now live at [http://localhost:3000](http://localhost:3000) (by default).
   ```

---

## Usage

1. **Open the App**  
   Navigate to the site in your modern browser (Chrome recommended).

2. **Select Language**  
   Choose English

3. **Microphone Permissions**  
   Click **Start Translating**; your browser will prompt for microphone access.

4. **Speak or Recite**  
   Recite Quranic verses. The app attempts to find the corresponding verses.

5. **View & Hear Translations**

   - The last matched verse text shows up on screen (in Arabic).
   - The translation is read out loud unless muted.

6. **Stop Listening**  
   Click **Stop Listening** to end recognition (or refresh the page to reset everything).

> **Tip**: If you hear nothing, check your volume, speaker selection, or ensure you’ve not muted the TTS. We can’t do the listening _and_ the hearing for you!

---

## Known Limitations

- **Browser Support**  
  The Web Speech API can be finicky; currently best in Chromium-based browsers (Chrome/Edge). Safari may have partial or limited support.

- **iOS Speaker Selection**  
  iOS does not allow custom audio device selection.

- **Arabic Diacritics**  
  Diacritic-based detection might still cause mismatches, especially with partial recitations.

- **Accuracy**  
  Not a definitive Quran research tool—use with caution. Always verify the recognized verses.

- **Performance**  
  Real-time matching can be resource-intensive, especially for large data sets.

---

## Contributing

Feeling helpful? Want to fix a bug, improve the matching algorithm, or add new translations? Contributions are welcome:

1. **Fork the Repo**
2. **Create a new branch**

   ```bash
   git checkout -b feature-awesome-improvement

   ```

3. **Make your changes**, commit, and push
4. **Open a Pull Request** describing your enhancements

---

## License

This project is licensed under an open-source license(MIT Licencse). Feel free to use, adapt, and share responsibly. Remember to keep it respectful and beneficial—spreading knowledge is the goal!

---

## Contact

**Developers / Maintainers**

- Your Name (quranlisteningapp@gmail.com)

Or just open an issue in this repository!

If you’d like to contribute major changes or discuss long-term enhancements, we’d love to hear from you. And by all means, if you find any creative bugs or improvements, let us know—bugs don’t fix themselves (though we wish they did).

Thanks for stopping by, and we hope this app helps enhance your Quranic studies! Remember: technology can be helpful, but it’s no substitute for authenticity and deeper comprehension. Keep learning, stay curious, and may your recitations be ever more enlightened.
