import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
    Form,
    Error,
    Input,
    Switcher,
    Title,
    Wrapper,
} from "../components/auth-styles";
import { auth } from "../firebase";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = e;
        if (name === "email") {
            setEmail(value);
        }
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading || email === "") return;
        try {
            setLoading(true);
            await sendPasswordResetEmail(auth, email);
            alert("Reset email Sent!");
            navigate("/login");
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <Wrapper>
            <Title>Reset Password</Title>
            <Form onSubmit={onSubmit}>
                <Input
                    onChange={onChange}
                    name='email'
                    value={email}
                    placeholder='Email'
                    type='email'
                    required
                />
                <Input
                    type='submit'
                    value={isLoading ? "Loading..." : "Reset Password"}
                />
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <Switcher>
                Don't have an account?{" "}
                <Link to={"/create-account"}>Create One &rarr;</Link>
            </Switcher>
            <Switcher>
                Already have an account? <Link to={"/login"}>Login &rarr;</Link>
            </Switcher>
        </Wrapper>
    );
}
