import { useState, useEffect, useRef } from "react";

const useMicrophone = () => {
  const [microphones, setMicrophones] = useState([]); // List of microphones
  const [speakers, setSpeakers] = useState([]); // List of speakers (audio output devices)
  const [selectedMic, setSelectedMic] = useState(""); // User-selected mic
  const [defaultMic, setDefaultMic] = useState(""); // Built-in default mic
  const [selectedSpeaker, setSelectedSpeaker] = useState(""); // User-selected speaker
  const [defaultSpeaker, setDefaultSpeaker] = useState(""); // Built-in speaker
  const [stream] = useState(null);

  const selectedSpeakerRef = useRef(""); // Keep track of latest selectedSpeaker

  // Fetch available microphones and speakers
  useEffect(() => {
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent); // Detect iOS

    const getDevices = async () => {
      try {
        // Check if mediaDevices is available
        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices.enumerateDevices
        ) {
          console.warn("🚨 MediaDevices API not supported in this browser.");
          alert("🚨 MediaDevices API not supported in this browser.");
          return;
        }
        const devices = await navigator.mediaDevices.enumerateDevices();

        // Filter Microphones
        const micList = devices.filter(
          (device) => device.kind === "audioinput"
        );
        setMicrophones(micList);

        // Set default microphone
        const builtInMic =
          micList.find(
            (mic) =>
              mic.label.toLowerCase().includes("internal") ||
              mic.deviceId === "default"
          ) || micList[0];

        if (builtInMic) {
          setDefaultMic(builtInMic.deviceId);
          setSelectedMic((prevMic) => prevMic || builtInMic.deviceId);
        }
        // Only try to fetch speakers on non-iOS devices

        if (!isIOS) {
          // Filter Speakers (Audio Output Devices)
          const speakerList = devices.filter(
            (device) => device.kind === "audiooutput"
          );
          setSpeakers(speakerList);

          // Set default speaker
          const builtInSpeaker =
            speakerList.find(
              (speaker) =>
                speaker.label.toLowerCase().includes("internal") ||
                speaker.deviceId === "default"
            ) || speakerList[0];

          if (builtInSpeaker) {
            setDefaultSpeaker(builtInSpeaker.deviceId);
            setSelectedSpeaker(
              (prevSpeaker) => prevSpeaker || builtInSpeaker.deviceId
            );
            selectedSpeakerRef.current = builtInSpeaker.deviceId; // Update ref
          }
        } else {
          console.warn("❌ Speaker selection is not supported on iOS.");
        }
      } catch (error) {
        console.error("❌ Error fetching devices:", error);
        alert(`❌ Error fetching devices:: ${error}`);
      }
    };

    getDevices();
    navigator.mediaDevices.addEventListener("devicechange", getDevices);

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", getDevices);
    };
  }, []);

  useEffect(() => {
    selectedSpeakerRef.current = selectedSpeaker; // Always keep ref updated
  }, [selectedSpeaker]);


  return {
    microphones,
    selectedMic,
    setSelectedMic,
    defaultMic,
    speakers,
    selectedSpeaker,
    setSelectedSpeaker,
    defaultSpeaker,
    stream, // Return the audio stream
    selectedSpeakerRef,
  };
};

export default useMicrophone;
