import React from 'react';
import Header from './components/Header';
import LandingScreen from './screens/LandingScreen';
import { Routes, Route } from "react-router-dom";
import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import './App.css';

const App = () => {
    return (
        <div className='App'>
            <Header/>
            <Routes>
                <Route path="/register" element={<SignUpScreen />} />
                <Route path="/login" element={<SignInScreen />} />
                <Route path="/" element={<LandingScreen />} />
            </Routes>
        </div>
    )
}

export default App;