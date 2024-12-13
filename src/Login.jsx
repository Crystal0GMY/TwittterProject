import axios from "axios";
import { useEffect, useState } from "react";
import './Homepage.css';
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [usernameState, setUsernameState] = useState('');
    const [passwordState, setPasswordState] = useState('');
    const [errorState, setErrorState] = useState(null);
    const navigate = useNavigate();

    function onInputUsername(event) {
        const username = event.target.value;
        setUsernameState(username);        
    }

    function onInputPassword(event) {
        const password = event.target.value;
        setPasswordState(password);        
    }

    async function onSubmit() {
        try {
            const response = await axios.post('/api/user/login', {
                username: usernameState, 
                password: passwordState
            })
            if (response.status === 200) {
                navigate('/');
            }
        } catch(error) {
            setErrorState(error.response?.data?.message || 'Login failed. Please try again.');
        }
        

    }

    return (<div>
        <h1>Login Page</h1>
        <div>
            <h3>Username:</h3>
            <input value={usernameState} onChange={(event) => onInputUsername(event)}></input>
        </div>
        <div>
            <h3>Password:</h3>
            <input type='password' value={passwordState} onChange={(event) => onInputPassword(event)}></input>
        </div>
        {errorState && <div className="error-message">{errorState}</div>}
        <button onClick={() => onSubmit()}>Click here to login</button>
    </div>)


}