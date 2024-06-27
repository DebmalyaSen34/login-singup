import { Button, Grid, TextField } from '@mui/material';
import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// Defines the Home component
function Home() {
    // Hook to navigate programmatically
    const navigate = useNavigate();

    // Effect hook to check authentication status on component mount
    React.useEffect(() => {
        // Fetches authentication status
        fetch('http://localhost:3000/auth/status', { credentials: 'include'})
            .then(response => response.json())
            .then(data => {
                // If not logged in, redirect to login page
                if(!data.isLoggedIn){
                    navigate('/login');
                }
            })
            .catch(error => console.error('Authentication status failed', error));
    }, [navigate]);

    // State for storing user input
    const [userText, setUserText] = React.useState({
        title: '',
        content: ''
    });

    //* Handles input changes and updates state
    const handleChange = (event) => {
        setUserText({ ...userText, [event.target.name]: event.target.value });
    }

    //* Handles form submission
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevents default form submission behavior

        // Posts data to server
        axios.post("http://localhost:3000/userText", userText, {
            withCredentials: true //* Ensures credentials are included in the request
        })
            .then(result => {
                if (result.status === 200) {
                    console.log(result);
                    console.log('data successfully sent');
                }
            })
            .catch(error => {
                // Handles different types of errors
                if (error.response && error.response.status === 401) {
                    console.log(error.response.data.message);
                } else {
                    console.log(error.message);
                }
            })
        // Resets the userText state to clear the form
        setUserText({
            title: "",
            content: "",
        });
    }

    // Handles user logout
    const handleLogout = (event) => {
        event.preventDefault(); // Prevents default form submission behavior

        // Posts logout request to server
        axios.post("http://localhost:3000/logout", {}, {
            withCredentials: true, // Ensures credentials are included in the request
        })
        .then(result => {
            if(result.status === 200){
                // Redirects user based on server response
                const trustedUrls = ['http://localhost:5173/login', 'http://localhost:5173/', 'http://localhost:5173/register'];
                if(trustedUrls.includes(result.data.redirect)){
                    window.location.href = result.data.redirect;
                }else{
                    console.error('Untrusted redirect URL: ' + result.data.redirect);
                }
            }
        })
        .catch(error => console.log(error))
    }

    // Renders the component
    return (
        <>
            <form method='POST'>
                <Grid container spacing={2}>
                    {/* Form fields for user input */}
                    <Grid item>
                        <TextField name='title' value={userText.title} onChange={handleChange} required type="text" variant='outlined' label="title" />
                    </Grid>
                    <Grid item>
                        <TextField name='content' value={userText.content} onChange={handleChange} required type="text" variant='outlined' label="content" />
                    </Grid>
                    {/* Submit button */}
                    <Grid item>
                        <Button variant='contained' onClick={handleSubmit}>Submit</Button>
                    </Grid>
                </Grid>
            </form>
            {/* Logout button */}
            <form method="POST">
                <Button onClick={handleLogout} variant='contained'>Logout</Button>
            </form>
            {/* Link to view user's texts */}
            <Button variant='contained'>
                <Link to='/getTexts' style={{ color: 'white', textDecoration: "none" }}>Your texts</Link>
            </Button>
        </>
    )
}

// Exports the Home component for use in other parts of the application
export default Home;