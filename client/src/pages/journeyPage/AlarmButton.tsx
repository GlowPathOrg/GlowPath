import { useState, useEffect, useRef } from "react";
import { AiOutlineSound } from "react-icons/ai";
import { IoVolumeMuteOutline } from "react-icons/io5";

const AlarmButton: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const alarmSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize the alarm sound only once
    alarmSoundRef.current = new Audio("/alarm.mp3");
    alarmSoundRef.current.loop = true;

    return () => {
      // Clean up the audio when the component unmounts
      if (alarmSoundRef.current) {
        alarmSoundRef.current.pause();
      }
    };
  }, []);

  const playAlarm = () => {
    if (alarmSoundRef.current) {
      alarmSoundRef.current.play().catch((err) => console.error("Audio playback error:", err));
      setIsPlaying(true);
    }
  };

  const stopAlarm = () => {
    if (alarmSoundRef.current) {
      alarmSoundRef.current.pause();
      alarmSoundRef.current.currentTime = 0; // Reset the playback position
      setIsPlaying(false);
    }
  };

  const toggleAlarm = () => {
    if (isPlaying) {
      stopAlarm();
    } else {
      playAlarm();
    }
  };

  const iconStyle = {
    fontSize: "40px",
    color: "#ebebeb",
    cursor: "pointer",
    transition: "transform 0.2s ease, filter 0.3s ease",
  };

  return (
    <div>
      {isPlaying ? (
        <AiOutlineSound
          onClick={toggleAlarm}
          style={{
            ...iconStyle,
            transform: isPlaying ? "scale(1.2)" : "none",
          }}
          title="Stop Alarm"
        />
      ) : (
        <IoVolumeMuteOutline
          onClick={toggleAlarm}
          style={{
            ...iconStyle,
            transform: !isPlaying ? "scale(1.2)" : "none",
          }}
          title="Play Alarm"
        />
      )}
    </div>
  );
};

export default AlarmButton;