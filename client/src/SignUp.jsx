import React from "react";
import TextField from '@mui/material/TextField';
import { Box, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function SignUp() {

    const formStyle = {
        width: "50vw",
        gap: "2vh",
        display: "grid",
        placeContent: "center"
    }

    const [form, setForm] = React.useState({
        username: "",
        email: "",
        password: ""
    });
    const [errors, setErrors] = React.useState({
        username: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();

    const onChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });

        switch (event.target.name) {
            case 'username':
                setErrors({ ...errors, username: event.target.value ? '' : 'Username is not required' })
                break;
            case 'email':
                const emailValid = event.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                setErrors({ ...errors, email: emailValid ? '' : 'Email is not valid' });
                break;
            case 'password':
                setErrors({ ...errors, password: event.target.value.length >= 6 ? '' : 'Password should be 6 characters or more' });
                break;
            default:
                break;
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!form.username || !form.email || !form.password) {
            setErrors({ ...errors, username: 'All fields are required' });
            return;
        } else {
            axios.post("http://localhost:3000/register", form, {
                withCredentials: true,
            })
                .then(result => {
                    const trustedUrls = ['http://localhost:5173/home', 'http://localhost:5173/login'];
                    if(trustedUrls.includes(result.data.redirect)){
                        window.location.href = result.data.redirect;
                    }else{
                        console.error('Untrusted redirect URL: ' + result.data.redirect);
                    }
                })
                .catch(error => console.log(error))
            setForm({
                username: "",
                email: "",
                password: "",
            });
        }
    }

    return (
        <div style={{ display: "grid", placeContent: "center", width: "50vw", gap: "20px" }}>
            <form style={formStyle} method="POST">
                <TextField error={!!errors.username} helperText={errors.username} onChange={onChange} id="outlined-basic" label="Username" variant="outlined" name="username" value={form.username} />
                <TextField error={!!errors.email} helperText={errors.email} onChange={onChange} id="outlined-basic" label="Email" variant="outlined" name="email" value={form.email} />
                <TextField error={!!errors.password} helperText={errors.password} onChange={onChange} id="outlined-basic" label="Password" variant="outlined" name="password" value={form.password} />
                <Button variant="contained" onClick={handleSubmit}>Sign up</Button>
            </form>
            <Box
                height="fit-content"
                width="50vw"
                my={2}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
                p={2}
            >
                <p>Already have an account?</p>
                <Button variant="contained">
                    <Link to="/login" style={{ color: 'white', textDecoration: "none" }}>Log in</Link>
                </Button>
            </Box>
        </div>
    )
}