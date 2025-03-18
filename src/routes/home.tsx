import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Home() {
    const navigate = useNavigate();
    const logOut = () => {
        auth.signOut();
        alert("Signed out successfully!");
        navigate("/login");
    };
    return <button onClick={logOut}>Log out</button>;
}
