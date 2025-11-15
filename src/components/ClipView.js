import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";

const ClipView = ({ clipId }) => {
  const [text, setText] = useState("");
  const [notification, setNotification] = useState("");
  const [saveState, setSaveState] = useState("idle"); // idle, saving, saved, error

  // This ref is still useful to prevent an update loop if you edit
  // a clip while another user is also editing it.
  const isUpdatingFromFirestore = useRef(false);

  // EFFECT 1: This is unchanged. It still LISTENS for real-time updates from Firestore.
  useEffect(() => {
    const docRef = doc(db, "clips", clipId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const newText = docSnap.data().content || "";
        setText((prevText) => {
          if (prevText !== newText) {
            isUpdatingFromFirestore.current = true;
            return newText;
          }
          return prevText;
        });
      }
    });

    return () => unsubscribe();
  }, [clipId]);

  // EFFECT 2: The auto-save useEffect has been REMOVED.

  // NEW: This function handles the manual save when the button is clicked.
  const handleSaveClip = async () => {
    setSaveState("saving");
    const docRef = doc(db, "clips", clipId);
    try {
      await setDoc(docRef, { content: text, lastModified: serverTimestamp() }, { merge: true });
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000); // Reset button text after 2s
    } catch (error) {
      console.error("Error saving document:", error);
      setSaveState("error");
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setNotification("URL copied!");
    setTimeout(() => setNotification(""), 2000);
  };

  const getSaveButtonText = () => {
    switch (saveState) {
      case "saving":
        return "Saving...";
      case "saved":
        return "Saved!";
      case "error":
        return "Error! Retry";
      default:
        return "Save Clip";
    }
  };

  return (
    <div className="clip-container">
      <div className="clip-header">
        <p>Your clip URL: <span>/{clipId}</span></p>
        <div className="buttons">
          {/* NEW: Save Clip button added here */}
          <button onClick={handleSaveClip} disabled={saveState === 'saving'}>
            {getSaveButtonText()}
          </button>
          <button onClick={handleCopyUrl}>Copy URL</button>
          <a href="/">New Clip</a>
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setSaveState("idle"); // If user types again, reset save button
        }}
        placeholder="Start typing..."
      />
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default ClipView;