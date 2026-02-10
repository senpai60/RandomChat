import { useGSAP } from "@gsap/react";
import { gsap } from "gsap/gsap-core";
import React, { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
const Queue = () => {
  const { user,GetUser } = useUserContext();
  console.log(user);
  
  
  useGSAP(() => {
    const chars = gsap.utils.toArray(".chars h1");

    // initial state
    gsap.set(chars, {
      opacity: 0,
      yPercent: (i) => 50 + i * 5,
    });

    // animation
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
  }, []);

  return (
    <section className="queue-section">
      <div className="queue-box">
        <div className="left-queue">
          <h3>{user?.name.split("")[0]}</h3>
        </div>
        <div className="queue-divider"></div>
        <div className="right-queue">
          <div className="chars">
            {"hyiovsggkebgse".split("").map((char, i) => (
              <h1 key={i}>{char}</h1>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Queue;
