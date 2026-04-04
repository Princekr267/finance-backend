import React, {useState} from "react";
import axios from "axios";

const Authenticate = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const client = axios.create({
        baseURL: `http://localhost:3000/api/auth`,
        withCredentials: true
    });
    
    const handleLogin = async () => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                let request = await client.post("/login", {
                    email: email,
                    password: password
                });
                if(request.status === 202){
                    localStorage.setItem("token", request.data.token);
                    setIsLoggedIn(true);
                    console.log("Logged in");
                }
                console.log(request.status);
            } catch (err) {
                // console.log(err.response.data);
                if (err.response) {
                    console.log(err.response.data);
                } else {
                    console.log("Login failed:", err);
                }
            }
        }

    
    const handleRegister = async () => {

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        console.log(name, email, password, role);
        
        try {
            let request = await client.post("/register", {
                name: name,
                email: email,
                password: password,
                role: role
            });
            console.log(request.status);
            if(request.status === 200){
                // localStorage.setItem("token", request.data.token);
                // console.log("Logged In")
                console.log("Registered");
            }
            console.log(request.status);
            
        } catch (err) {
            if (err.response) {
                console.log(err.response.data.message);
            } else {
                console.log("Registeration failed:", err);
            }
        }

        // console.log("Registered");   
    }

    const handleLogout = async () => {
        await client.get("/logout");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
    }
    
    return (
        <>
          {!isLoggedIn ? 
            <>
                <h3>Login</h3>
                <label htmlFor="email">Email: </label>
                <input type="email" id='email' placeholder='Enter you email'/>
                <br />
                <label htmlFor="password">Password: </label>
                <input type="password" id='password' placeholder='Enter you password'/>
                <br />
                <button onClick={handleLogin}>Login</button>

                <br /><hr /><br /> 
                </> : <>

                <h3>Register</h3>
                <label htmlFor="name">Name: </label>
                <input type="text" id='name' placeholder='Enter you name'/>
                <br />
                <label htmlFor="email">Email: </label>
                <input type="email" id='email' placeholder='Enter you email'/>
                <br />
                <label htmlFor="password">Password: </label>
                <input type="password" id='password' placeholder='Enter you password'/>
                <br />
                <label htmlFor="role">Role: </label>
                <input type="text" id='role' placeholder='Enter you role'/>
                <br />
                <button onClick={handleRegister}>Register</button>

                {/* <h3>You are logged in!</h3> */}
                <button onClick={handleLogout}>Logout</button>
            </>
          }
        </>
    )
}

export default Authenticate;