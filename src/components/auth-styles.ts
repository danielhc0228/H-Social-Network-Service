import { styled } from "styled-components";

export const Wrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 420px;
    padding: 50px 0px;

    @media (max-width: 768px) {
        width: 90%; /* Adjust width for smaller screens */
        padding: 30px 20px; /* Reduce padding */
        justify-content: center;
    }
`;

export const Title = styled.h1`
    font-size: 42px;

    @media (max-width: 768px) {
        font-size: 36px; /* Slightly smaller on mobile */
    }
`;

export const Form = styled.form`
    margin-top: 50px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;

    @media (max-width: 768px) {
        margin-top: 30px; /* Reduce margin */
        gap: 8px;
    }
`;

export const Input = styled.input`
    padding: 10px 20px;
    border-radius: 50px;
    border: none;
    width: 100%;
    font-size: 16px;

    &[type="submit"] {
        cursor: pointer;
        &:hover {
            opacity: 0.8;
        }
    }

    @media (max-width: 768px) {
        padding: 12px 18px;
        font-size: 14px;
    }
`;

export const Error = styled.span`
    font-weight: 600;
    color: tomato;

    @media (max-width: 768px) {
        font-size: 14px; /* Adjust font size for readability */
    }
`;

export const Switcher = styled.span`
    margin-top: 20px;
    text-align: center;
    font-size: 14px;

    a {
        color: #1d9bf0;
    }

    @media (max-width: 768px) {
        font-size: 13px;
        margin-top: 15px;
    }
`;
