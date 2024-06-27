import { Button, Grid, TextField } from '@mui/material';
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Defines the LogIn component
export default function LogIn() {
    // State to hold login credentials
    const [login, setLogin] = React.useState({
        username: '',
        password: ''
    });

    //* Handles changes in the login form inputs
    const handleChange = (event) => {
        // Updates the login state with input values
        setLogin({ ...login, [event.target.name]: event.target.value });
    }

    //* Handles the login submission
    const handlelogin = (event) => {
        // Prevents the default form submission behavior
        event.preventDefault();

        // Sends a POST request to the login endpoint with credentials
        axios.post("http://localhost:3000/login", login, {
            withCredentials: true //* Enables credentials to persist the session
        })
            .then(result => {
                // Checks if login was successful
                if (result.status === 200) {
                    // List of trusted URLs for redirection
                    //TODO: Find better methods to validate URLs
                    const trustedUrls = ['http://localhost:5173/home', 'http://localhost:3000/home', 'http://localhost:5173/register', 'http://localhost:5173/profile'];
                    // Redirects to the URL provided by the server if it's trusted
                    if (trustedUrls.includes(result.data.redirect)) {
                        window.location.href = result.data.redirect;
                    } else {
                        // Logs an error if the redirect URL is not trusted
                        console.error('Untrusted redirect URL: ' + result.data.redirect);
                    }
                }
            })
            .catch(error => {
                // Handles errors, including incorrect login credentials
                if (error.response && error.response.status === 401) {
                    console.log(error.response.data.message);
                } else {
                    console.log(error.message);
                }
            })
        // Resets the login state to clear the form
        setLogin({
            username: "",
            password: "",
        });
    }

    // Renders the login form
    return (
        <>
            <h1>Login</h1>
            <form method='POST'>
                <Grid container spacing={2}>
                    {/* Username input */}
                    <Grid item>
                        <TextField name='username' value={login.username} onChange={handleChange} required type="text" variant='outlined' label="Username" />
                    </Grid>
                    {/* Password input */}
                    <Grid item>
                        <TextField name='password' value={login.password} onChange={handleChange} required type="password" variant='outlined' label="Password" />
                    </Grid>
                    {/* Submit button */}
                    <Grid item>
                        <Button variant='contained' onClick={handlelogin}>Submit</Button>
                    </Grid>
                </Grid>
            </form>
            {/* Link to the registration page */}
            <Button variant='contained'>
                <Link to='/register' style={{ color: 'white', textDecoration: "none" }}>Register</Link>
            </Button>
        </>
    )
}