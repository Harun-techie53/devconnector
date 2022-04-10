import React, {useState, useEffect} from 'react';
import api from './config';
import './App.css';

const App = () => {
    const [ text, setText ] = useState('');
    const fetchResponse = async () => {
       try {
           const res = await api.get('/api/auth');
            setText(res.data);
       } catch (error) {
           console.log(error);
       }
    }
    useEffect(() => {
        fetchResponse();
    }, []);
    return (
        <div className='App'>
            {text}
        </div>
    )
}

export default App;