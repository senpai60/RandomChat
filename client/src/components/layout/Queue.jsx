import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import React, { useEffect, useState } from "react";
import { useUserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const Queue = () => {
  const { user, GetUser, socket, setRoomId } = useUserContext(); // setRoomId chahiye context se
  const [matchFound, setMatchFound] = useState(false); // Naming thoda clear kiya
  const navigate = useNavigate();

  // GSAP Animation (Same as yours - Good stuff!)
  useGSAP(() => {
    const chars = gsap.utils.toArray(".chars h1");
    gsap.set(chars, { opacity: 0, yPercent: (i) => 50 + i * 5 });
    gsap.to(chars, {
      yPercent: (i) => -250 - i * 5,
      opacity: 1,
      duration: 1.2,
      ease: "power2.inOut",
      stagger: 0.1,
      repeat: -1,
      yoyo: true,
    });
  });

  useEffect(() => {
    GetUser();

    // Server ko bolo: "Main line mein laga hu"
    if (user) {
      socket.emit("join-chat", user.name);
    }

    // Cleanup: Agar user queue chhod ke back chala jaye
    return () => {
      // Optional: socket.emit("leave-queue");
    };
  }, [user]); // User load hone par trigger karein

  useEffect(() => {
    // Listener: Jab match mil jaye
    const handleStartChat = ({ roomId }) => {
      console.log("Match Found! Room:", roomId);
      setRoomId(roomId); // Context mein Room ID save karo
      setMatchFound(true); // Trigger navigation
    };

    socket.on("start-chat", handleStartChat);

    return () => {
      socket.off("start-chat", handleStartChat);
    };
  }, [socket, setRoomId]);

  // Navigation Effect
  useEffect(() => {
    if (matchFound) {
      navigate("/chat");
    }
  }, [matchFound, navigate]);

  return (
    <section className="queue-section">
      <div className="queue-box">
        <div className="left-queue">
          {/* Safety check: User might be null initially */}
          <h3>{user?.name ? user.name.split("")[0] : "?"}</h3>
        </div>
        <div className="queue-divider"></div>
        <div className="right-queue">
          <div className="chars">
            {"searching...".split("").map((char, i) => (
              <h1 key={i}>{char}</h1>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Queue;
