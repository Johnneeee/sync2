import logo from './logo.svg';
import './App.css';
import React, { useRef, useState } from "react";
import YouTube from "react-youtube";

function App() {
  const playersRef = useRef([]); 
  const [delays, setDelays] = useState([0, 0, 0, 0]); // delay per video (ms)

  const topVideo = "9C_raiwz3n0"

  const videos = [
    "8sJ2y6GX41o",
    "ODZpZXt8kdY",
    "4nXLKNUFbm8"
  ];

  const opts = {
    height: "250",
    width: "400",
    playerVars: {
      autoplay: 0,
    },
  };

  const onReady = (event, index) => {
    playersRef.current[index] = event.target;
  };

  const handleDelayChange = (index, value) => {
    const newDelays = [...delays];
    newDelays[index] = Number(value);
    setDelays(newDelays);
  };

  const handlePlayAll = () => {
    playersRef.current.forEach((player, index) => {
      if (player) {
        setTimeout(() => {
          player.playVideo();
        }, delays[index]); // already milliseconds
      }
    });
  };

  const handleStopAll = () => {
    playersRef.current.forEach(player => {
      player?.stopVideo();
    });
  };

  return (
    <div className="app">
      
      <button onClick={handlePlayAll}>Play All Videos</button>
      <button onClick={handleStopAll}>Stop All Videos</button>
      
      {/* 🔥 TOP VIDEO (index 0) */}
      <div className="top-video">
        <div className="video-wrapper">
          <YouTube
            videoId={topVideo}
            opts={opts}
            onReady={(event) => onReady(event, 0)}
          />

          <div className="delay-control">
            <label>Start Delay (ms): </label>
            <input
              type="number"
              min="0"
              step="100"
              value={delays[0]}
              onChange={(e) =>
                handleDelayChange(0, e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* Bottom Row Videos (start at index 1) */}
      <div className="video-container">
        {videos.map((id, i) => {
          const index = i + 1; // shift index
          return (
            <div key={id} className="video-wrapper">
              <YouTube
                videoId={id}
                opts={opts}
                onReady={(event) => onReady(event, index)}
              />

              <div className="delay-control">
                <label>Start Delay (ms): </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={delays[index]}
                  onChange={(e) =>
                    handleDelayChange(index, e.target.value)
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;

      // <iframe width="560" height="315" src="https://www.youtube.com/embed/8sJ2y6GX41o?si=nSIb6C1A0pN22GeZ" title="YouTube video player"></iframe>
      // <iframe width="560" height="315" src="https://www.youtube.com/embed/ODZpZXt8kdY?si=aOqmxwB3uOHzO6q5" title="YouTube video player"></iframe>
      // <iframe width="560" height="315" src="https://www.youtube.com/embed/4nXLKNUFbm8?si=DBnWIlwd1pT5r1X0" title="YouTube video player"></iframe>

