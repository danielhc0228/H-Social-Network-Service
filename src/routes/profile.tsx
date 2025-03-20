import { styled } from "styled-components";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
//  import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
//  import { updateProfile } from "firebase/auth";
import {
    addDoc,
    collection,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import { updateProfile } from "firebase/auth";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
`;
const AvatarUpload = styled.label`
    width: 80px;
    overflow: hidden;
    height: 80px;
    border-radius: 50%;
    background-color: #1d9bf0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        width: 50px;
    }
`;

const AvatarImg = styled.img`
    width: 100%;
`;
const AvatarInput = styled.input`
    display: none;
`;
const Name = styled.span`
    font-size: 22px;
`;

const Tweets = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 10px;
`;

const ModifyButton = styled.button`
    background-color: transparent;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 10px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
    display: inline-flex; /* Use inline-flex for alignment */
    align-items: center;
    margin-left: 10px; /* Space between input and button */

    svg {
        width: 16px; /* Adjust size as needed */
        height: 16px;
        stroke: white; /* Ensures the icon is white */
    }
`;

const EditInputContainer = styled.div`
    display: flex;
    justify-content: center; /* Center content horizontally */
    align-items: center; /* Align items vertically */
    width: 100%;
    margin-bottom: 10px;
`;

const EditInput = styled.input`
    width: 50%;
    padding: 0px 10px;
    font-size: 22px;
    border: none; /* Remove all borders */
    border-bottom: 2px solid white; /* Add white bottom border */
    background-color: transparent; /* Make the background transparent */
    color: white; /* Set text color to white */
    outline: none;
    transition: border-color 0.3s ease-in-out;
    margin-right: 10px; /* Space between input and modify button */

    &:focus {
        border-bottom: 2px solid white; /* Change border color on focus */
    }
`;

export default function Profile() {
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState<string | null>(null);
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const [isEdit, setIsEdit] = useState(false);
    const [newText, setNewText] = useState(user?.displayName);

    // Firebase storage implementation
    //    const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //      const { files } = e.target;
    //      if (!user) return;
    //      if (files && files.length === 1) {
    //        const file = files[0];
    //        const locationRef = ref(storage, `avatars/${user?.uid}`);
    //        const result = await uploadBytes(locationRef, file);
    //        const avatarUrl = await getDownloadURL(result.ref);
    //        setAvatar(avatarUrl);
    //        await updateProfile(user, {
    //          photoURL: avatarUrl,
    //        });
    //      }
    //    };

    useEffect(() => {
        if (!user) return;

        const usersCollectionRef = collection(db, "profileimg");
        const q = query(usersCollectionRef, where("userId", "==", user.uid));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const docs = querySnapshot.docs;

            if (docs.length > 0) {
                // if user data exists set profile image
                const userData = docs[0].data();
                setAvatar(userData.avatar || user?.photoURL || null);
            } else {
                // if not set default value
                setAvatar(user?.photoURL || null);
            }
        });

        return () => unsubscribe();
    }, [user]);

    const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (!files || files.length !== 1) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const fileData = reader.result as string;
            console.log("File data encoded:", fileData);

            if (!avatar) {
                // If avatar does not exist, create a new document
                await addDoc(collection(db, "profileimg"), {
                    avatar: fileData,
                    userId: user?.uid,
                });
            } else {
                // If avatar exists, update the existing document
                const usersCollectionRef = collection(db, "profileimg");
                const q = query(
                    usersCollectionRef,
                    where("userId", "==", user?.uid)
                );

                onSnapshot(q, (querySnapshot) => {
                    querySnapshot.docs.forEach((docSnapshot) => {
                        updateDoc(docSnapshot.ref, { avatar: fileData });
                    });
                });
            }

            setAvatar(fileData); // Update state
        };

        reader.readAsDataURL(files[0]);
    };

    const fetchTweets = async () => {
        const tweetQuery = query(
            collection(db, "tweets"),
            where("userId", "==", user?.uid),
            orderBy("createdAt", "desc"),
            limit(25)
        );
        const snapshot = await getDocs(tweetQuery);
        const tweets = snapshot.docs.map((doc) => {
            const { tweet, createdAt, userId, username, fileData } = doc.data();
            return {
                tweet,
                createdAt,
                userId,
                username,
                fileData,
                id: doc.id,
            };
        });
        setTweets(tweets);
    };
    useEffect(() => {
        fetchTweets();
    });

    const onModify = async () => {
        if (!user) return;
        try {
            updateProfile(user, { displayName: newText });
        } catch (e) {
            console.log(e);
        } finally {
            setIsEdit(!isEdit);
        }
    };

    return (
        <Wrapper>
            <AvatarUpload htmlFor='avatar'>
                {avatar ? (
                    <AvatarImg src={avatar} />
                ) : (
                    <svg
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                        aria-hidden='true'
                    >
                        <path d='M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z' />
                    </svg>
                )}
            </AvatarUpload>
            <AvatarInput
                onChange={onAvatarChange}
                id='avatar'
                type='file'
                accept='image/*'
            />
            <EditInputContainer>
                {isEdit ? (
                    <EditInput
                        type='text'
                        value={newText ?? ""}
                        onChange={(e) => setNewText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onModify()} // Save on Enter key
                        autoFocus
                    />
                ) : (
                    <Name>{user?.displayName ?? "Anonymous"}</Name>
                )}

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
            </EditInputContainer>
            <Tweets>
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} {...tweet} />
                ))}
            </Tweets>
        </Wrapper>
    );
}
