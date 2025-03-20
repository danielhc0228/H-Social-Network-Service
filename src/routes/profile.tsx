import { styled } from "styled-components";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
//  import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
//  import { updateProfile } from "firebase/auth";
import {
    addDoc,
    collection,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "firebase/firestore";

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

export default function Profile() {
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState<string | null>(null);

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
            <Name>{user?.displayName ?? "Anonymous"}</Name>
        </Wrapper>
    );
}
