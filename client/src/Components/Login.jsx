import React, { useState } from 'react'
import './style.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    // 1. Added 'error' to state to prevent the "white page" crash
    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState(null) 
    
    const navigate = useNavigate()
    const API_URL = import.meta.env.VITE_API_URL

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError(null) // Clear previous errors

        try {
            // 2. Only ONE axios call here. 
            // Ensure withCredentials is true for session handling
            const result = await axios.post(`${API_URL}/auth/adminlogin`, values, { 
                withCredentials: true 
            })

            if (result.data.loginStatus) {
                localStorage.setItem("valid", "true")
                navigate('/dashboard')
            } else {
                // 3. Set error state instead of just an alert
                setError(result.data.Error || "Invalid email or password")
            }
        } catch (err) {
            console.error("Login Error:", err)
            // 4. Handle 403 or Network errors gracefully
            if (err.response && err.response.status === 403) {
                setError("Access Forbidden (403): Check Backend CORS settings.")
            } else {
                setError("Server connection failed. Please try again later.")
            }
        }
    }

    return (
        <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
            <div className='p-3 rounded w-25 border loginForm'>
                {/* 5. This now works because 'error' is defined above */}
                <div className='text-danger text-center mb-2'>
                    {error && <strong>{error}</strong>}
                </div>
                
                <h2 className='text-center'>Login Page</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email:</strong></label>
                        <input 
                            type="email" 
                            name='email' 
                            autoComplete='off' 
                            placeholder='Enter Email' 
                            onChange={(e) => setValues({...values, email : e.target.value})} 
                            className='form-control rounded-0'
                            required
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password:</strong></label>
                        <input 
                            type="password" 
                            name='password' 
                            placeholder='Enter Password' 
                            onChange={(e) => setValues({...values, password : e.target.value})} 
                            className='form-control rounded-0'
                            required
                        />
                    </div>
                    <button className='btn btn-success w-100 rounded-0 mb-2'>Log in</button>
                    <div className='mb-1'>
                        <input type="checkbox" name="tick" id="tick" className='me-2' required/>
                        <label htmlFor="tick">You agree with terms & conditions</label>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login