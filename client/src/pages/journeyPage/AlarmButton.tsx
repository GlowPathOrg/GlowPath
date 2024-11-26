import { useState } from 'react';

const AlarmButton: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false); 
  const alarmSound = new Audio('/path/'); 

  // Play the alarm sound
  const playAlarm = () => {
    alarmSound.loop = true; //loop here ensures the alarm is on until manually stopped
    alarmSound.play();
    setIsPlaying(true);
  };

  // Stop the alarm sound
  const stopAlarm = () => {
    alarmSound.pause();
    alarmSound.currentTime = 0; // Reset the playback position
    setIsPlaying(false);
  };

  return (
    <div>
      {isPlaying ? (
        <button onClick={stopAlarm} className="alarm-button stop">
          Stop Alarm
        </button>
      ) : (
        <button onClick={playAlarm} className="alarm-button play">
          Play Alarm
        </button>
      )}
    </div>
  );
};

export default AlarmButton;