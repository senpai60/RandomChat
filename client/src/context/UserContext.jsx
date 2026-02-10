import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const CreateUser = (name) => {
    if (!name.trim() || name.trim().length < 2) return;
    const id = Math.random().toString(16).slice(2) + Date.now().toString(16);
    const currentUser = { name, id };
    setUser(currentUser);
    localStorage.setItem("user", JSON.stringify(currentUser));
  };

  const GetUser = () => {
    const currentUser = localStorage.getItem("user");

    setUser(JSON.parse(currentUser ? currentUser : null));
  };

  return (
    <UserContext.Provider value={{ GetUser, CreateUser, user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
