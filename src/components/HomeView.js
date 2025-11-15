import React, { useState } from "react";
import "../App.css";

// Replaced the SVG with an <img> tag pointing to the new image
const Icon = () => (
  <img src="clipboard-icon.jpg" alt="Clipboard Icon" className="home-image-icon" />
);


const HomeView = ({ onGoToClip }) => {
  const [clipIdInput, setClipIdInput] = useState("");

  const handleGoClick = () => {
    const newClipId = clipIdInput.trim().replace(/\s+/g, "-");
    if (newClipId) onGoToClip(newClipId);
    else onGoToClip(Math.random().toString(36).substring(2, 8));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleGoClick();
  };

  return (
    <div className="home-container">
      <Icon />
      <h1 className="title">L1ve Clipboard</h1>
      <p className="subtitle">
        Create a unique URL to paste, share, and edit text in real-time.
      </p>
      <div className="input-container">
        <input
          type="text"
          value={clipIdInput}
          onChange={(e) => setClipIdInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="your-unique-url"
        />
        <button onClick={handleGoClick}>Go to Clip</button>
      </div>
    </div>
  );
};

export default HomeView;