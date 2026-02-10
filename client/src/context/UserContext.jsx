import { createContext, useContext, useState, useMemo } from "react";
import { io } from "socket.io-client";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [strangerName, setStrangerName] = useState(null);

  // Socket connection
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const GetUser = () => {
    // Tera existing logic to get user from localstorage
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUser(savedUser);
  };

  const CreateUser = (name) => {
    const newUser = { name, id: socket.id };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        CreateUser,
        GetUser,
        socket,
        roomId,
        setRoomId,
        strangerName,
        setStrangerName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
