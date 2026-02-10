import React, { useEffect, useState } from "react";

import { useUserContext } from "./context/UserContext.jsx";
import Queue from "./components/layout/Queue.jsx";
import HomeSection from "./components/layout/HomeSection.jsx";
import ChatSection from "./components/layout/ChatSection.jsx";
import { Routes, Route } from "react-router-dom";
const App = () => {
  const { user, GetUser } = useUserContext();

  useEffect(() => {
    GetUser();
  }, []);

  return (
    <main className="w-full h-screen flex items-center justify-center">
      <Routes>
        <Route path="/" element={<HomeSection />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/chat" element={<ChatSection />} />
      </Routes>
    </main>
  );
};

export default App;
