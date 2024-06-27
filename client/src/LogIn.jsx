import { Button, Grid, TextField } from '@mui/material';
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function LogIn() {

    const [login, setLogin] = React.useState({
        username: '',
        password: ''
    });

    const handleChange = (event) => {
        setLogin({ ...login, [event.target.name]: event.target.value });
    }

    const handlelogin = (event) => {
        event.preventDefault();

        axios.post("http://localhost:3000/login", login, {
            withCredentials: true //Very important for cookie to store data and persist the session!
        })
            .then(result => {
                if (result.status === 200) {
                    const trustedUrls = ['http://localhost:5173/home', 'http://localhost:3000/home', 'http://localhost:5173/register', 'http://localhost:5173/profile'];
                    if (trustedUrls.includes(result.data.redirect)) {
                        window.location.href = result.data.redirect;
                    } else {
                        console.error('Untrusted redirect URL: ' + result.data.redirect);
                    }
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    console.log(error.response.data.message);
                } else {
                    console.log(error.message);
                }
            })
        setLogin({
            username: "",
            password: "",
        });
    }

    return (
        <>
            <h1>Login</h1>
            <form method='POST'>
                <Grid container spacing={2}>
                    <Grid item>
                        <TextField name='username' value={login.username} onChange={handleChange} required type="text" variant='outlined' label="Username" />
                    </Grid>
                    <Grid item>
                        <TextField name='password' value={login.password} onChange={handleChange} required type="password" variant='outlined' label="Password" />
                    </Grid>
                    <Grid item>
                        <Button variant='contained' onClick={handlelogin}>Submit</Button>
                    </Grid>
                </Grid>
            </form>
            <Button variant='contained'>
                <Link to='/register' style={{ color: 'white', textDecoration: "none" }}>Register</Link>
            </Button>
        </>
    )
}