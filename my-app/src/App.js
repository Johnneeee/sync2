import './App.css';
import React, { useRef, useState } from "react";
import YouTube from "react-youtube";

function App() {
  const playersRef = useRef([]);

  // Top video (fixed slot)
  const [topVideo, setTopVideo] = useState({ id: "9C_raiwz3n0", delay: 6100 });

  // Bottom videos (dynamic)
  const [videos, setVideos] = useState([
    { id: "8sJ2y6GX41o", delay: 5200 },
    { id: "ODZpZXt8kdY", delay: 900 },
    { id: "4nXLKNUFbm8", delay: 0 }
  ]);

  const opts = {
    height: "250",
    width: "400",
    playerVars: { autoplay: 0 },
  };

  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  const handleTopVideoChange = (value) => {
    setTopVideo({ ...topVideo, id: extractVideoId(value) });
  };

  const handleTopDelayChange = (value) => {
    setTopVideo({ ...topVideo, delay: Number(value) });
  };

  const handleVideoChange = (index, value) => {
    const updated = [...videos];
    updated[index].id = extractVideoId(value);
    setVideos(updated);
  };

  const handleDelayChange = (index, value) => {
    const updated = [...videos];
    updated[index].delay = Number(value);
    setVideos(updated);
  };

  const addVideo = () => setVideos([...videos, { id: "", delay: 0 }]);
  const removeVideo = (index) => {
    const updated = videos.filter((_, i) => i !== index);
    setVideos(updated);
    playersRef.current.splice(index + 1, 1); // shift for top video
  };

  const onReady = (event, index) => {
    playersRef.current[index] = event.target;
  };

  const handlePlayAll = () => {
    // Play top video first
    if (playersRef.current[0]) {
      setTimeout(() => playersRef.current[0].playVideo(), topVideo.delay);
    }

    // Play bottom videos
    playersRef.current.slice(1).forEach((player, i) => {
      if (player) {
        setTimeout(() => player.playVideo(), videos[i].delay);
      }
    });
  };

  const handleStopAll = () => {
    playersRef.current.forEach(player => player?.stopVideo());
  };

  return (
    <div className="app">

      <div className="controls">
        <button onClick={addVideo}>➕ Add Video</button>
        <button onClick={handlePlayAll}>▶ Play All</button>
        <button onClick={handleStopAll}>⏹ Stop All</button>
      </div>

      {/* Top Video */}
      <div className="top-video">
        <div className="video-wrapper">
          <input
            type="text"
            placeholder="Paste YouTube URL or ID"
            value={topVideo.id}
            onChange={(e) => handleTopVideoChange(e.target.value)}
          />

          {topVideo.id && (
            <YouTube
              videoId={topVideo.id}
              opts={opts}
              onReady={(event) => onReady(event, 0)}
            />
          )}

          <div className="delay-control">
            <label>Start Delay (ms): </label>
            <input
              type="number"
              min="0"
              step="100"
              value={topVideo.delay}
              onChange={(e) => handleTopDelayChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bottom Videos */}
      <div className="video-container">
        {videos.map((video, index) => (
          <div key={index} className="video-wrapper">
            <input
              type="text"
              placeholder="Paste YouTube URL or ID"
              value={video.id}
              onChange={(e) => handleVideoChange(index, e.target.value)}
            />

            {video.id && (
              <YouTube
                videoId={video.id}
                opts={opts}
                onReady={(event) => onReady(event, index + 1)} // +1 for top video
              />
            )}

            <div className="delay-control">
              <label>Start Delay (ms): </label>
              <input
                type="number"
                min="0"
                step="100"
                value={video.delay}
                onChange={(e) => handleDelayChange(index, e.target.value)}
              />
            </div>

            <button
              className="remove-btn"
              onClick={() => removeVideo(index)}
            >
              ❌ Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;