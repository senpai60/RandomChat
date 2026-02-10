import PrimaryButton from "../ui/PrimaryButton";
import NameDialogue from "./NameDialogue";
import { useState } from "react";
import { useUserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";    

const HomeSection = () => {
  const [nameDialogueVisible, setNameDialogueVisible] = useState(false);
  const { user } = useUserContext();
  const navigate = useNavigate();
  const handleToggleDialogue = () => {
    if (user) {
      setNameDialogueVisible(false);
      navigate("/queue");
    } else {
      setNameDialogueVisible(true);
    }
  };

  return (
    <>
      <PrimaryButton onClick={handleToggleDialogue}>Start Chat</PrimaryButton>

      <NameDialogue
        onClose={() => setNameDialogueVisible(false)}
        canVisible={nameDialogueVisible}
      />
    </>
  );
};

export default HomeSection;
