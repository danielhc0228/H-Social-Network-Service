# twitter-clone
=======

## Challenges:
Implementing reset password feature using email
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
Implementing modify button
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


```js

```


>>>>>>> bf50bd4 (Initial commit with layout component and routes)
