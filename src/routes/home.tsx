import { auth } from "../firebase";

export default function Home() {
    const logOut = () => {
        auth.signOut();
        console.log(auth.currentUser);
    };
    return <button onClick={logOut}>Log out</button>;
}
