import React, { useState, useEffect } from "react";
import HomeView from "./components/HomeView";
import ClipView from "./components/ClipView";
import { auth } from "./firebase/firebaseConfig";
import { signInAnonymously } from "firebase/auth";
import "./App.css";

export default function App() {
  const [clipId, setClipId] = useState(null);

  useEffect(() => {
    signInAnonymously(auth);

    const pathClipId = window.location.pathname.slice(1);
    if (pathClipId) setClipId(pathClipId);
  }, []);

  const handleSetClip = (newClipId) => {
    window.history.pushState({}, "", `/${encodeURIComponent(newClipId)}`);
    setClipId(newClipId);
  };

  return (
    <div className="app">
      {clipId ? <ClipView clipId={clipId} /> : <HomeView onGoToClip={handleSetClip} />}
    </div>
  );
}
