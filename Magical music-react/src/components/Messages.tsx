import axios from "axios";
import { useState, useRef } from "react";
import "./Messages.css";

import successSound from "../audio/scale-d6-106129.mp3"; // דאג שהקובץ יהיה בתיקייה

export default function ContactForm() {
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    content: ""
  });

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("idle");
    

    try {
      await axios.post("https://localhost:7157/api/messages", formData);
      setFormData({ senderName: "", senderEmail: "", content: "" });
      setStatus("success");
      
// אפקט הבהוב
document.body.classList.add("flash");
setTimeout(() => {
  document.body.classList.remove("flash");
}, 400);
const form = document.querySelector(".contact-form");
form?.classList.add("shake");
setTimeout(() => {
  form?.classList.remove("shake");
}, 500);


// reset animation
setTimeout(() => setStatus("idle"), 3000);
      audioRef.current?.play();

    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };
  function getRandomColor() {
    const colors = ["#ec4899", "#60a5fa", "#fbbf24", "#34d399", "#f472b6", "#a78bfa"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  return (
    <form onSubmit={handleSubmit} className={`contact-form ${status}`}>
      <p className="contact-title">שאלה? משאלה? אנחנו כאן לכל דבר!</p>
      <div className="form-row">
        <input
          name="senderName"
          value={formData.senderName}
          onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
          placeholder="שם"
          required
          className="input-field half-width"
        />
        <input
          name="senderEmail"
          type="email"
          value={formData.senderEmail}
          onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
          placeholder="אימייל"
          required
          className="input-field half-width"
        />
      </div>
      <textarea
        name="content"
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        placeholder="הגיגיך"
        required
        className="input-field message-field"
      />
      <button type="submit" className="contact-button"> לחץ לשיגור 🚀</button>

      {/* אפקטים */}
      <div className="animation-layer">
      {status === "success" && (
  <>
    <div className="success-text">הודעתך שוגרה בהצלחה!</div>
    {Array.from({ length: 15 }).map((_, i) => (
      <div
        key={i}
        className="confetti-bolt"
        style={{
          top: `${Math.random() * 80 + 10}%`,
          animationDelay: `${i * 0.1}s`,
          backgroundColor: getRandomColor(),
        }}
      />
    ))}
    <audio autoPlay>
      <source src="/sounds/success-tone.mp3" type="audio/mpeg" />
    </audio>
  </>
)}

      </div>
      <audio ref={audioRef} src={successSound} />
    </form>
  );
}
