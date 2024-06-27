import React from 'react'
import TextCard from './components/TextCard'
import { Button } from '@mui/material';
import axios from 'axios';

// Defines the GetTexts component to fetch and display texts
function GetTexts() {
    // State to store fetched texts
    const [text, setText] = React.useState([]);

    //* useEffect hook to fetch texts on component mount
    React.useEffect(() => {
        // Fetch texts from the server
        fetch('http://localhost:3000/texts', {
            credentials: 'include' //* Include credentials for cross-origin requests
        })
        .then(response => response.json()) // Parse JSON response
        .then(data => setText(data)) // Update state with fetched texts
        .catch(error => console.error('Error occurred while fetching texts: ', error)); // Log errors
    }, []); // Empty dependency array means this effect runs once on mount

    // Logs the fetched texts for debugging
    console.log(text);

    // Handles user logout
    const handleLogout = (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Send a POST request to logout endpoint
        axios.post("http://localhost:3000/logout", {}, {
            withCredentials: true, //* Include credentials for cross-origin requests
        })
        .then(result => {
            if (result.status === 200) {
                // List of trusted URLs for redirection
                //TODO: Use better URL validation techniques in future
                const trustedUrls = ['http://localhost:5173/login', 'http://localhost:5173/', 'http://localhost:5173/register'];
                // Redirect if the URL is trusted
                if (trustedUrls.includes(result.data.redirect)) {
                    window.location.href = result.data.redirect;
                } else {
                    console.error('Untrusted redirect URL: ' + result.data.redirect);
                }
            }
        })
        .catch(error => console.log(error)); // Log errors
    }

    // Styles for the texts container
    const divStyle = {
        width: '90vw',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: '20px'
    }

    // Render the component
    return (
        <>
            <h1>Your texts:</h1>
            <div style={divStyle}>
                {/* Map over the texts state to render TextCard components for each text */}
                {text.map(texts => (
                    <TextCard key={texts._id} title={texts.title} content={texts.content} author={texts.author} />
                ))}
            </div>
            <form method="POST">
                {/* Logout button */}
                <Button onClick={handleLogout} variant='contained'>Logout</Button>
            </form>
        </>
    )
}

// Export the GetTexts component for use in other parts of the application
export default GetTexts