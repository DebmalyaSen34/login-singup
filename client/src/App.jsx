import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUp from './SignUp';
import LogIn from './LogIn';
import Home from './Home';
import GetTexts from './GetTexts';
import './app.module.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate replace to="/home" />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/home' element={<Home />} />
        <Route path='/getTexts' element={<GetTexts />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
