import { Button, Grid, TextField } from '@mui/material';
import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
function Home() {

    const navigate = useNavigate();

    React.useEffect(() => {
        fetch('http://localhost:3000/auth/status', { credentials: 'include'})
            .then(response => response.json())
            .then(data => {
                if(!data.isLoggedIn){
                    navigate('/login');
                }
            })
            .catch(error => console.error('Authentication status failed', error));
    }, [navigate]);

    const [userText, setUserText] = React.useState({
        title: '',
        content: ''
    });

    const handleChange = (event) => {
        setUserText({ ...userText, [event.target.name]: event.target.value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post("http://localhost:3000/userText", userText, {
            withCredentials: true //* Very important for data to be sent over cookie/session
        })
            .then(result => {
                if (result.status === 200) {
                    console.log(result);
                    console.log('data successfully sent');
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    console.log(error.response.data.message);
                } else {
                    console.log(error.message);
                }
            })
        setUserText({
            title: "",
            content: "",
        });
    }

    const handleLogout = (event) => {
        event.preventDefault();

        axios.post("http://localhost:3000/logout", {}, {
            withCredentials: true,
        })
        .then(result => {
            if(result.status === 200){
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

    return (
        <>
            <form method='POST'>
                <Grid container spacing={2}>
                    <Grid item>
                        <TextField name='title' value={userText.title} onChange={handleChange} required type="text" variant='outlined' label="title" />
                    </Grid>
                    <Grid item>
                        <TextField name='content' value={userText.content} onChange={handleChange} required type="text" variant='outlined' label="content" />
                    </Grid>
                    <Grid item>
                        <Button variant='contained' onClick={handleSubmit}>Submit</Button>
                    </Grid>
                </Grid>
            </form>
            <form method="POST">
                <Button onClick={handleLogout} variant='contained'>Logout</Button>
            </form>
            <Button variant='contained'>
                <Link to='/getTexts' style={{ color: 'white', textDecoration: "none" }}>Your texts</Link>
            </Button>
        </>
    )
}

export default Home;