# Social Network Service by Daniel Chung
_Front-end_ handled by React.js and TypeScript\
_Back-end_ handled by Firebase.

This project features a social network service that works similar to X, previously known as Twitter.

I have not studied backed deeply in university so I have no technique regarding it.\
However Firebase has allowed me to build applications that require back-end skills without needing me to study any back-end skills.


## Challenges:
__Implementing Upload Image feature.__\
This could have been done using Firebase's storage feature however that requires payment. 
So I have implemented it using Firebase's database feature which was free and that's where I stored all the users' tweets and profile data. 
And by converting the image address to base64 string format and use that address to display image to the screen.
Only upto 1MB of image is allowed.

```js
    const [file, setFile] = useState<string | null>(null);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length === 1) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                console.log("File data encoded:", result);
                setFile(result);
            };
            reader.readAsDataURL(files[0]);
        }
    };
```
__Uploading/Editing User Profile Image feature__\
Used the same mechanism as I did with uploading tweets with images.
Change the image to base64 string and use the converted address to bring the image.
```js
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

```

__Editing User Profile Name feature__\
Used updateProfile function in the Firebase document to implement the feature.
```js
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
```
__Implementing reset password feature using email__\
Used sendPasswordResetEmail function in the Firebase document to implement the feature.
```js
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
```
__Implementing modify button__\
Referenced modify button in my trello-clone project.
```js
const [isEdit, setIsEdit] = useState(false);
const [newText, setNewText] = useState(tweet);

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
// ...
// ... return
//...
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

// ...

                        <ModifyButton onClick={onModify}>
                            {isEdit ? (
                                <svg>
                            ) : (
                                <svg>
                            )}
                        </ModifyButton>
```

__Mobile Implementation__\
Used ChatGPT to modify styled components for mobile implementation of the project.\
Much quicker than when I edit my CSS which increases my work efficiency.

