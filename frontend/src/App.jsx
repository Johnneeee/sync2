import "./App.css";
import React, { useRef, useState, useEffect } from "react";
import YouTube from "react-youtube";
import { API_URL } from "./api.js";

function App() {
  const songs = {
    ParamoreStillIntoYou: {
      song: "Still into you",
      artist: "Paramore",
      topVideos: [
        { id: "5z-lcBJK-FE", delay: 2.8},
        { id: "wrCxfWVuDXU", delay: 10.6}
      ],
      bottomVideos: [
        { id: "OzYDa3m75Es", delay: 2 },
        { id: "qp8etdQjHPo", delay: 2.8},
        { id: "xA3s3PHr0uA", delay: 0 }
      ]
    },
    ParamoreBrickByBoringBrick: {
      song: "Brick by boring brick",
      artist: "Paramore",
      topVideos: [
        { id: "9C_raiwz3n0", delay: 0},
      ],
      bottomVideos: [
        { id: "8sJ2y6GX41o", delay: 1.1},
        { id: "ODZpZXt8kdY", delay: 5.5},
        { id: "4nXLKNUFbm8", delay: 6.5}
      ]
    }
  }

  const opts = {
    height: "250",
    width: "400",
    playerVars: { autoplay: 0 },
  };

  const topPlayersRef = useRef([]);
  const bottomPlayersRef = useRef([]);
  const [topVideos, setTopVideos] = useState([]);
  const [bottomVideos, setBottomVideos] = useState([]);

  useEffect(() => {
    setSong("ParamoreBrickByBoringBrick");
  }, []);

  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };


  const setSong = (songname) => {
    topPlayersRef.current = [];
    bottomPlayersRef.current = [];
    setTopVideos(songs[songname].topVideos);
    setBottomVideos(songs[songname].bottomVideos);
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

  const buffer = () => {
    // Start playing all players
    [...topPlayersRef.current, ...bottomPlayersRef.current].forEach(player =>
      player?.playVideo()
    );

    // Set a timeout to pause and seek after 5 seconds
    const timer = setTimeout(() => {
      // Pause all players
      [...topPlayersRef.current, ...bottomPlayersRef.current].forEach(player =>
        player?.pauseVideo()
      );

    }, 500);
  };


  
  const setTime = () => {
    topPlayersRef.current.forEach((player, i) => {
      if (player) {
        player.seekTo(topVideos[i]?.delay || 0, true); // true = precise seek
      }
    });

    // Seek bottom players
    bottomPlayersRef.current.forEach((player, i) => {
      if (player) {
        player.seekTo(bottomVideos[i]?.delay || 0, true);
      }
    });
    
  };

  const handlePlayAll = () => {
  
    [...topPlayersRef.current, ...bottomPlayersRef.current].forEach(player =>
      player?.playVideo()
    );
  };

  const handleStopAll = () => {
    [...topPlayersRef.current, ...bottomPlayersRef.current].forEach(player =>
      player?.pauseVideo()
    );
  };

  const onReady = (playersRef, event, index) => {
    playersRef.current[index] = event.target;

    const isFirstRef = playersRef === topPlayersRef;
    const isFirstVideo = index === 0;

    if (isFirstRef && isFirstVideo) {
      event.target.unMute();   // 🔊 Only first video of first ref
    } else {
      event.target.mute();     // 🔇 Everything else
    }
  };
  
  return (
    <div className="app">

      <div class="flex-container"> {/*controls*/}
        <div class="flex-column"> 
        
          <button onClick={() => addVideo(setTopVideos, topVideos)}>➕ Add Top Video</button>
          <button onClick={() => addVideo(setBottomVideos, bottomVideos)}>➕ Add Bottom Video </button>
          <button onClick={buffer}>Buffer</button>
          <button onClick={setTime}>Set time</button>
          <button onClick={handlePlayAll}>▶ Play ALL Videos</button>
          <button onClick={handleStopAll}>⏹ Stop ALL Videos</button>
        </div>
        <div class="flex-column">
          Presets:
          <button onClick={() => setSong("ParamoreBrickByBoringBrick")}>Paramore - Brick by Boring Brick</button>
          <button onClick={() => setSong("ParamoreStillIntoYou")}>Paramore - Still into you</button>
        </div>
      </div>

      <div className="video-container"> {/*top videos*/}
        {topVideos.map((video, index) => (
          <div key={index} className="video-wrapper">
            
            <input
              type="text" placeholder="YouTube URL or ID" value={video.id}
              onChange={(e) =>handleVideoChange(setTopVideos, topVideos, index, e.target.value)}
            />

            {video.id && (<YouTube videoId={video.id} opts={opts} onReady={(event) => onReady(topPlayersRef, event, index)}/>)}
            Start at:
            <input type="number" value={video.delay} onChange={(e) => handleDelayChange(setTopVideos, topVideos, index, e.target.value)}/>
            s
            <br></br>
            <button onClick={() => removeVideo(setTopVideos, topVideos, topPlayersRef, index)}> ❌ Remove </button>
          </div>
        ))}
      </div>

      <div className="video-container"> {/*bot videos*/}
        {bottomVideos.map((video, index) => (
          <div key={index} className="video-wrapper">

            <input type="text" placeholder="YouTube URL or ID" value={video.id}
            onChange={(e) =>handleVideoChange(setBottomVideos,bottomVideos,index,e.target.value)}
            />

            {video.id && (<YouTube videoId={video.id} opts={opts} onReady={(event) => onReady(bottomPlayersRef, event, index)}/>)}
            Start at 
            <input type="number" value={video.delay} onChange={(e) => handleDelayChange( setBottomVideos, bottomVideos, index, e.target.value)}/>
            s
            <br></br>
            <button onClick={() => removeVideo(setBottomVideos, bottomVideos, bottomPlayersRef, index)}> ❌ Remove </button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;