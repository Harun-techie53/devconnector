import React, { useState } from 'react';
import api from "../config";
import { Link } from 'react-router-dom';
import "../css/styles.css";

const SignUpScreen = () => {
  const [ inputFields, setInputFields ] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });
  const handleUserRegisterSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, password2 } = inputFields;
    if(password !== password2) {
      return console.log("Password do not match");
    }
    try {
      const res = await api.post(
        "/api/users",
        {
          name,
          email,
          password
        }
      );

      console.log(res);
    } catch (error) {
      console.error(error.message);
    }
  }
  return (
    <section className="container">
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form 
        className="form"
        onSubmit={handleUserRegisterSubmit}
      >
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Name" 
            name="name" 
            required 
            value={inputFields.name}
            onChange={(e) => setInputFields({
              ...inputFields,
              name: e.target.value
            })}
          />
        </div>
        <div className="form-group">
          <input 
            type="email" 
            placeholder="Email Address" 
            name="email"
            value={inputFields.email}
            onChange={(e) => setInputFields({
              ...inputFields,
              email: e.target.value
            })} 
          />
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="8"
            value={inputFields.password}
            onChange={(e) => setInputFields({
              ...inputFields,
              password: e.target.value
            })} 
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="8"
            value={inputFields.password2}
            onChange={(e) => setInputFields({
              ...inputFields,
              password2: e.target.value
            })} 
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? 
        <Link to="/login">
          Sign In
        </Link>
      </p>
    </section>
  )
}

export default SignUpScreen;