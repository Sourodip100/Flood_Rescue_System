export default function Login(){
    return (
        <>
            <h1>Login</h1>
            <form action="/api/auth/login" method="POST">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />
                <br />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
                <br />
                <button type="submit">Login</button>
            </form>
        </>
    )
}