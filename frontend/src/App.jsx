import "./App.css";
import React, { useRef, useState, useEffect } from "react";
import YouTube from "react-youtube";
import { API_URL } from "./api.js";

function App() {
  const opts = {
    height: "250",
    width: "400",
    playerVars: { autoplay: 0 },
  };

  const topPlayersRef = useRef([]);
  const bottomPlayersRef = useRef([]);
  const [topVideos, setTopVideos] = useState([]);
  const [bottomVideos, setBottomVideos] = useState([]);
  const [currentSong, setCurrentSong] = useState([]);
  const [presets, setPresets] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true); // 👈 loading state
  const [message, setMessage] = useState(""); // 👈 loading state
  const [isDisabled, setIsDisabled] = useState(false);

  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        // const response = await fetch(`${API_URL}/videos3/songs`);
        const response = await fetch(`http://localhost:5000/videos3/songs`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const jsonSongs = await response.json();
        const listSongs = jsonSongs.map(video => ({ songname: video.songname, creator: video.creator }))

        setPresets(listSongs);
        setLoading(false);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  

  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };
  
  const setSong = async (songname) => {
    try {
      topPlayersRef.current = [];
      bottomPlayersRef.current = [];
      // const response = await fetch(`${API_URL}/videos3/${songname}`);
      const response = await fetch(`http://localhost:5000/videos3/${songname}`);
      const videos = await response.json();
      
      const topVideos = videos
        .filter(video => ["top"].includes(video.row_position))
        .map(video => ({ id: video.youtube_id, delay: video.start_time }));

      const bottomVideos = videos
        .filter(video => ["bot"].includes(video.row_position))
        .map(video => ({ id: video.youtube_id, delay: video.start_time }));

      setCurrentSong(songname)
      setTopVideos(topVideos);
      setBottomVideos(bottomVideos);
    } catch (err) {
      console.error(err.message)
    }
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

  
  const submitPreset = async () => {
    setIsDisabled(true);
    const randomNum = Math.floor(Math.random() * 100) + 1;

    // Helper function to map videos to request format
    const mapVideos = (videos, row) =>
      videos.map((video, index) => ({
        randomsongid: String(randomNum),
        youtube_id: video.id,
        start_time: video.delay,
        row_position: row,
        column_position: index + 1,
        creator: username,
      }));

    const payload = [
      ...mapVideos(topVideos, "top"),
      ...mapVideos(bottomVideos, "bot"),
    ];

    // Fetch the current queue length
    let rqQueue = 0;
    try {
      const response = await fetch("http://localhost:5000/songsRequested/songs");
      if (!response.ok) throw new Error("Failed to fetch data");

      const jsonSongs = await response.json();
      rqQueue = jsonSongs.length;
    } catch (err) {
      console.error("Error fetching queue:", err);
    }

    // Helper function to show messages
    const showMessage = (msg, duration = 3000) => {
      setMessage(msg);
      setTimeout(() => {
        setMessage("");
        setIsDisabled(false);
      }, duration);
    };

    if (rqQueue >= 3) {
      showMessage("Queue is full. Try again later");
      return;
    }

    // Send new song request
    try {
      const response = await fetch("http://localhost:5000/songsRequested/newSong", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit preset");

      showMessage("Request has been sent!");
    } catch (err) {
      console.error("Error submitting preset:", err);
      showMessage("Failed to send request. Please try again.");
    }
  };

  const handleUsername = (e) => {
    setUsername(e.target.value); // 2. update state on input change
  };

  return (
    <div className="app">

      <div className="flex-container"> {/*controls*/}


        <div className="flex-column"> 
          <button onClick={() => addVideo(setTopVideos, topVideos)}>➕ Add Top Video</button>
          <button onClick={() => addVideo(setBottomVideos, bottomVideos)}>➕ Add Bottom Video </button>
          <button onClick={buffer}>Buffer</button>
          <button onClick={setTime}>Set time</button>
          <button onClick={handlePlayAll}>▶ Play ALL Videos</button>
          <button onClick={handleStopAll}>⏹ Stop ALL Videos</button>
          <input type="text" placeholder="Enter username" style={{ width: "100px" }} value={username} onChange={handleUsername}/>
          <button onClick={submitPreset} disabled={isDisabled}>Submit this preset!</button>
          {message !== "" && `${message}`}
        </div>

        <div className="flex-column">
          <div>
            <select style={{ width: "200px" }} value={currentSong} onChange={(songname) => setSong(songname.target.value)}>
              <option value="" disabled hidden>
                {loading ? "Loading presets" : "Select a preset!"}
              </option>
              {presets.map((id) => (
                <option key={id.songname} value={id.songname} title={`created by ${id.creator}`}>
                  {id.songname}
                </option>
              ))}
            </select>

          </div>
        </div>
      </div>

      <div className="video-container"> {/*top videos*/}
        {topVideos.length === 0 && bottomVideos.length === 0 && (
          <p>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            Make your own sync or select a preset in the top right!
          </p>
        )}
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