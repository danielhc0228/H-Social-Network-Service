import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
// import { onAuthStateChanged } from "firebase/auth";

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    // onAuthStateChanged(auth, (user) => {})
    const user = auth.currentUser;
    if (user === null) {
        return <Navigate to='/login' />;
    }
    return children;
}
