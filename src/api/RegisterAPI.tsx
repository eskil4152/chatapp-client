export default async function RegisterAPI(username: string, password: string) {
    return await fetch(`http://localhost:5050/api/register`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
        credentials: "include",
    });
}