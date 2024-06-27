import React from "react";
import TextField from '@mui/material/TextField';
import { Box, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

// Defines the SignUp component
export default function SignUp() {
    // Style for the form container
    const formStyle = {
        width: "50vw",
        gap: "2vh",
        display: "grid",
        placeContent: "center"
    }

    // State for form data
    const [form, setForm] = React.useState({
        username: "",
        email: "",
        password: ""
    });

    // State for form errors
    const [errors, setErrors] = React.useState({
        username: "",
        email: "",
        password: ""
    });

    //* Handles changes in form inputs and validates them
    const onChange = (event) => {
        // Updates form state with input values
        setForm({ ...form, [event.target.name]: event.target.value });

        //* Validates input and sets error messages accordingly
        //TODO: Learn better and robust validation methods
        switch (event.target.name) {
            case 'username':
                // Validates username
                setErrors({ ...errors, username: event.target.value ? '' : 'Username is required' })
                break;
            case 'email':
                // Validates email format
                const emailValid = event.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                setErrors({ ...errors, email: emailValid ? '' : 'Email is not valid' });
                break;
            case 'password':
                // Validates password length
                //! Use better techinques for password validation
                setErrors({ ...errors, password: event.target.value.length >= 6 ? '' : 'Password should be 6 characters or more' });
                break;
            default:
                break;
        }
    };

    //* Handles form submission
    const handleSubmit = (event) => {
        // Prevents the default form submission behavior
        event.preventDefault();

        //* Checks if all fields are filled
        if (!form.username || !form.email || !form.password) {
            setErrors({ ...errors, username: 'All fields are required' });
            return;
        } else {
            // Sends a POST request to the register endpoint with form data
            axios.post("http://localhost:3000/register", form, {
                withCredentials: true, //* Very important for the data to be transferred to server
            })
                .then(result => {
                    // List of trusted URLs for redirection
                    //TODO: Use better URL validation methods
                    const trustedUrls = ['http://localhost:5173/home', 'http://localhost:5173/login'];
                    // Redirects to the URL provided by the server if it's trusted
                    if(trustedUrls.includes(result.data.redirect)){
                        window.location.href = result.data.redirect;
                    }else{
                        // Logs an error if the redirect URL is not trusted
                        console.error('Untrusted redirect URL: ' + result.data.redirect);
                    }
                })
                .catch(error => console.log(error))
            // Resets the form state
            setForm({
                username: "",
                email: "",
                password: "",
            });
        }
    }

    // Renders the sign-up form
    return (
        <div style={{ display: "grid", placeContent: "center", width: "50vw", gap: "20px" }}>
            <form style={formStyle} method="POST">
                {/* Username input field */}
                <TextField error={!!errors.username} helperText={errors.username} onChange={onChange} id="outlined-basic" label="Username" variant="outlined" name="username" value={form.username} />
                {/* Email input field */}
                <TextField error={!!errors.email} helperText={errors.email} onChange={onChange} id="outlined-basic" label="Email" variant="outlined" name="email" value={form.email} />
                {/* Password input field */}
                <TextField error={!!errors.password} helperText={errors.password} onChange={onChange} id="outlined-basic" label="Password" variant="outlined" name="password" value={form.password} />
                {/* Submit button */}
                <Button variant="contained" onClick={handleSubmit}>Sign up</Button>
            </form>
            {/* Link to the login page for existing users */}
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