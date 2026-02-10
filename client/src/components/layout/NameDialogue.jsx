import { use, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useUserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const NameDialogue = ({ canVisible, onClose }) => {
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const { CreateUser } = useUserContext();

  return (
    <div
      className="dialog-wrapper"
      style={{ display: `${canVisible ? "block" : "none"}` }}
    >
      <div className="name-dialogue">
        <h3>Enter Your Name To Get Started With Strangers!</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Your Name"
        />
        <button 
        onClick={()=>{CreateUser(name)
            navigate("/queue")
        }}
        style={{ opacity: `${!name.trim() ? 0 : 1}` }}>
          <span>Start Chatting</span>
          <div className="icon">
            <ArrowRight size={16} />
          </div>
        </button>
      </div>
      <span onClick={onClose} id="dialogue-close">
        close
      </span>
    </div>
  );
};

export default NameDialogue;
