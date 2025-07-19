// Base64 encoded MP3 data
const alarmSound = 'data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFzdCBBbGFybSBDbG9jawAA';

// Create a function to decode and play the alarm
function playAlarm() {
  const audio = new Audio(alarmSound);
  audio.play();
}

export { playAlarm };
