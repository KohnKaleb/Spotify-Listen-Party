import react from 'react';

function Login() {
    const fetchLogin = async () => {
        window.location.href = 'http://localhost:3001/auth/login';
    }

    return (
        <>
            <h1>
                Welcome
            </h1>
            <button onClick={() => fetchLogin()}>
                login
            </button>
        </>
    )
}

export default Login;