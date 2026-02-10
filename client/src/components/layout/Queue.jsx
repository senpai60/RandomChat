import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import React, { useEffect, useState, useRef } from "react"; // useRef import kiya
import { useUserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const Queue = () => {
  const { user, GetUser, socket, setRoomId, setStrangerName } =
    useUserContext();
  const [matchFound, setMatchFound] = useState(false);
  const navigate = useNavigate();

  // LOCK: Ye ensure karega ki request bas ek baar jaye
  const hasJoined = useRef(false);

  // GSAP Animation
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

  // User details fetch karo
  useEffect(() => {
    GetUser();
  }, []);

  // Server ko join request bhejo (SIRF EK BAAR)
  useEffect(() => {
    if (user && !hasJoined.current) {
      console.log("Joining queue...");
      socket.emit("join-chat", user.name);
      hasJoined.current = true; // Lock laga diya
    }
  }, [user]);

  // Match milne ka wait karo
  useEffect(() => {
    const handleStartChat = ({ roomId, user1, user2 }) => {
      console.log("Match Found! Room:", roomId);
      setRoomId(roomId);

      const stranger = user1.id === socket.id ? user2 : user1;
      setStrangerName(stranger.username);

      setMatchFound(true);
    };

    socket.on("start-chat", handleStartChat);

    return () => {
      socket.off("start-chat", handleStartChat);
    };
  }, [socket, setRoomId]);

  // Navigate karo
  useEffect(() => {
    if (matchFound) {
      navigate("/chat");
    }
  }, [matchFound, navigate]);

  return (
    <section className="queue-section">
      <div className="queue-box">
        <div className="left-queue">
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
