import React from 'react'
import TextCard from './components/TextCard'
import { Button } from '@mui/material';
import axios from 'axios';

function GetTexts() {

    const [text, setText] = React.useState([]);

    React.useEffect(() => {
        fetch('http://localhost:3000/texts', {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data=>setText(data))
        .catch(error => console.error('Error occured while fetching texts: ', error));
    }, []);

    console.log(text);

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

        <div>
            <h1>Your texts</h1>
            {/* {text.map(texts => {(
                <TextCard title={texts.title} content={texts.content} author={texts.author} />
            )})} */}
            {/* <TextCard title={text[0].title} content={text[0].content} author={text[0].author} /> */}
        </div>
    )
}

export default GetTexts