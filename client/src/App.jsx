import React, { useEffect, useState } from "react";
import PrimaryButton from "./components/ui/PrimaryButton";
import NameDialogue from "./components/layout/NameDialogue";
import { useUserContext } from "./context/UserContext.jsx";
const App = () => {
  const [nameDialogueVisible, setNameDialogueVisible] = useState(true);
  const { user, GetUser } = useUserContext();

  useEffect(() => {
    GetUser();
  }, []);

  return (
    <main className="w-full h-screen flex items-center justify-center">
      <PrimaryButton onClick={() => setNameDialogueVisible(true)}>
        Start Chat
      </PrimaryButton>
      <NameDialogue
        onClose={() => setNameDialogueVisible(false)}
        canVisible={nameDialogueVisible}
      />
    </main>
  );
};

export default App;
