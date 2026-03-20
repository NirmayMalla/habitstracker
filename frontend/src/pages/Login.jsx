import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css";

function Login() {

	const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => { 

        e.preventDefault();

        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) { 
            console.log("Error:", data.message);
            return;
        }
        
		console.log("Success:", data.message);
		navigate("/dashboard", {
			state: {
				username: data.username,
				userid: data.userid	
			}
		});
    }

    function handleUsernameChange(e) { 
        setUsername(e.target.value);
    }

    function handlePasswordChange(e) {
		setPassword(e.target.value);
	}

    return (
		<div className='Login-container'>
			<form className='Login-form' onSubmit={handleSubmit}>
				<h1 className='Login-header'>Login</h1>
				<input
					className='Username'
					type='text'
					placeholder='Username'
					value={username}
					onChange={handleUsernameChange}
				/>
				<input
					className='Password'
					type='password'
					name='password'
					placeholder='Password'
					value={password}
					onChange={handlePasswordChange}
				/>
				<button className='Submit-btn' type='submit'>
					Submit
				</button>
			</form>
		</div>
	);
}

export default Login