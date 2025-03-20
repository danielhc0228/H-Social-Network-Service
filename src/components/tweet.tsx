import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
    margin-top: 10px;
`;

const Column = styled.div``;

const Photo = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 15px;
`;

const Username = styled.span`
    font-weight: 600;
    font-size: 15px;
`;

const Payload = styled.p`
    margin: 10px 0px;
    font-size: 18px;
`;

const DeleteButton = styled.button`
    background-color: transparent;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;

    svg {
        width: 16px; /* Adjust size as needed */
        height: 16px;
        stroke: white; /* Ensures the icon is white */
    }
`;

const ModifyButton = styled.button`
    background-color: transparent;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;

    svg {
        width: 16px; /* Adjust size as needed */
        height: 16px;
        stroke: white; /* Ensures the icon is white */
    }
`;

const EditInput = styled.input`
    width: 100%;
    padding: 8px 12px;
    font-size: 16px;
    border: 2px solid #ccc;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s ease-in-out;
    margin: 10px 0px;

    &:focus {
        border-color: #007bff;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
    const [isEdit, setIsEdit] = useState(false);
    const [newText, setNewText] = useState(tweet);

    const user = auth.currentUser;
    const onDelete = async () => {
        const ok = confirm("Are you sure you want to delete this tweet?");
        if (!ok || user?.uid !== userId) return;
        try {
            await deleteDoc(doc(db, "tweets", id));
            if (photo) {
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
                await deleteObject(photoRef);
            }
        } catch (e) {
            console.log(e);
        } finally {
            //
        }
    };

    const onModify = async () => {
        if (user?.uid !== userId) return;
        try {
            await updateDoc(doc(db, "tweets", id), { tweet: newText });
        } catch (e) {
            console.log(e);
        } finally {
            setIsEdit(!isEdit);
        }
    };
    return (
        <Wrapper>
            <Column>
                <Username>{username}</Username>
                {isEdit ? (
                    <EditInput
                        type='text'
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onModify()} // Save on Enter key
                        autoFocus
                    />
                ) : (
                    <Payload>{tweet}</Payload>
                )}
                {user?.uid === userId ? (
                    <div>
                        <DeleteButton onClick={onDelete}>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                className='size-6'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                                />
                            </svg>
                        </DeleteButton>
                        <ModifyButton onClick={onModify}>
                            {isEdit ? (
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className='size-6'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='m4.5 12.75 6 6 9-13.5'
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125'
                                    />
                                </svg>
                            )}
                        </ModifyButton>
                    </div>
                ) : null}
            </Column>
            {photo ? (
                <Column>
                    <Photo src={photo} />
                </Column>
            ) : null}
        </Wrapper>
    );
}
