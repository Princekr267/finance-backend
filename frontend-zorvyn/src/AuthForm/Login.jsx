
import axios from 'axios';
function Login() {

    const client = axios.create({
        baseURL: `http://localhost:3000/api/v1`,
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
                    // localStorage.setItem("token", request.data.token);
                    // console.log("Logged In")
                    console.log("Logged in");
                }
                console.log(request.status);
                
            } catch (err) {
                if (err.response) {
                    console.log(err.response.data.message);
                } else {
                    console.log("Login failed:", err);
                }
            }
        }

    return ( 
        <>
            <label htmlFor="email">Email: </label>
            <input type="email" id='email' placeholder='Enter you email'/>
            <br />
            <label htmlFor="password">Password: </label>
            <input type="password" id='password' placeholder='Enter you password'/>
            <br />
            <button onClick={handleLogin}>Login</button>
        </>
    );
}

export default Login;