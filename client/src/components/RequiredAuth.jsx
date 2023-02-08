import { useAuth } from "./auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function RequiredAuth({ children }) {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.user || auth.user == null) {
      navigate("/");
    }
  }, []);

  return children;
}
