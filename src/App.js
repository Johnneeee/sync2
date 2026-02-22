import "./App.css";
import React, { useRef, useState } from "react";
import YouTube from "react-youtube";

function App() {
  const topPlayersRef = useRef([]);
  const bottomPlayersRef = useRef([]);

  const songs = {
    ParamoreStillIntoYou: {
      song: "Still into you",
      artist: "Paramore",
      topVideos: [
        { id: "5z-lcBJK-FE", delay: 7400},
        { id: "wrCxfWVuDXU", delay: 0}
      ],
      bottomVideos: [
        { id: "OzYDa3m75Es", delay: 8600 },
        { id: "qp8etdQjHPo", delay: 7500 },
        { id: "xA3s3PHr0uA", delay: 10600 }
      ]
    },
    ParamoreBrickByBoringBrick: {
      song: "Brick by boring brick",
      artist: "Paramore",
      topVideos: [
        { id: "9C_raiwz3n0", delay: 6100 },
      ],
      bottomVideos: [
        { id: "8sJ2y6GX41o", delay: 5200 },
        { id: "ODZpZXt8kdY", delay: 900 },
        { id: "4nXLKNUFbm8", delay: 0 }
      ]
    }
  }

  const [topVideos, setTopVideos] = useState([
    { id: "9C_raiwz3n0", delay: 6100 },
  ]);

  const [bottomVideos, setBottomVideos] = useState([
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


  const setSong = (value) => {
    topPlayersRef.current = [];
    bottomPlayersRef.current = [];

    setTopVideos(songs[value].topVideos);
    setBottomVideos(songs[value].bottomVideos);
  };
  
  const handleVideoChange = (rowSetter, rowVideos, index, value) => {
    const updated = [...rowVideos];
    updated[index].id = extractVideoId(value);
    rowSetter(updated);
  };
  
  const handleDelayChange = (rowSetter, rowVideos, index, value) => {
    const updated = [...rowVideos];
    updated[index].delay = Number(value);
    rowSetter(updated);
  };

  const addVideo = (rowSetter, rowVideos) => {
    rowSetter([...rowVideos, { id: "", delay: 0 }]);
  };

  const removeVideo = (rowSetter, rowVideos, playersRef, index) => {
    rowSetter(rowVideos.filter((_, i) => i !== index));
    playersRef.current.splice(index, 1);
  };

  const handlePlayAll = () => {
    // Top row
    topPlayersRef.current.forEach((player, i) => {
      if (player) {
        setTimeout(() => player.playVideo(), topVideos[i]?.delay || 0);
      }
    });

    // Bottom row
    bottomPlayersRef.current.forEach((player, i) => {
      if (player) {
        setTimeout(() => player.playVideo(), bottomVideos[i]?.delay || 0);
      }
    });
  };

  const handleStopAll = () => {
    [...topPlayersRef.current, ...bottomPlayersRef.current].forEach(player =>
      player?.stopVideo()
    );
  };

  const onReady = (playersRef, event, index) => {
    playersRef.current[index] = event.target;
  };

  return (
    <div className="app">
      <div class="flex-container"> 
        <div class="flex-column"> 
          <button onClick={() => addVideo(setTopVideos, topVideos)}>➕ Add Top Video</button>
          <button onClick={() => addVideo(setBottomVideos, bottomVideos)}>➕ Add Bottom Video </button>
          <button onClick={handlePlayAll}>▶ Play ALL Videos</button>
          <button onClick={handleStopAll}>⏹ Stop ALL Videos</button>
        </div>
        <div class="flex-column">
          Presets:
          <button onClick={() => setSong("ParamoreBrickByBoringBrick")}>Paramore - Brick by Boring Brick</button>
          <button onClick={() => setSong("ParamoreStillIntoYou")}>Paramore - Still into you</button>
        </div>
      </div>



      <div className="video-container">
        {topVideos.map((video, index) => (
          <div key={index} className="video-wrapper">
            <input
              type="text"
              placeholder="YouTube URL or ID"
              value={video.id}
              onChange={(e) =>
                handleVideoChange(setTopVideos, topVideos, index, e.target.value)
              }
            />

            {video.id && (
              <YouTube
                videoId={video.id}
                opts={opts}
                onReady={(event) => onReady(topPlayersRef, event, index)}
              />
            )}
            Start delay (ms)
            <input
              type="number"
              value={video.delay}
              onChange={(e) =>
                handleDelayChange(setTopVideos, topVideos, index, e.target.value)
              }
            />
            <br></br>
            <button
              onClick={() =>
                removeVideo(setTopVideos, topVideos, topPlayersRef, index)
              }
            >
              ❌ Remove
            </button>
          </div>
        ))}
      </div>

      <div className="video-container">
        {bottomVideos.map((video, index) => (
          <div key={index} className="video-wrapper">
            <input
              type="text"
              placeholder="YouTube URL or ID"
              value={video.id}
              onChange={(e) =>
                handleVideoChange(
                  setBottomVideos,
                  bottomVideos,
                  index,
                  e.target.value
                )
              }
            />

            {video.id && (
              <YouTube
                videoId={video.id}
                opts={opts}
                onReady={(event) => onReady(bottomPlayersRef, event, index)}
              />
            )}
            Start delay (ms)
            <input
              type="number"
              value={video.delay}
              onChange={(e) =>
                handleDelayChange(
                  setBottomVideos,
                  bottomVideos,
                  index,
                  e.target.value
                )
              }
            />
            <br></br>
            <button
              onClick={() =>
                removeVideo(
                  setBottomVideos,
                  bottomVideos,
                  bottomPlayersRef,
                  index
                )
              }
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