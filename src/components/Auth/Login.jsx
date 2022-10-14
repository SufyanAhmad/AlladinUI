import React, { useState } from 'react';
import './auth.css';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { login } from '../../redux/apiCalls';
import { useDispatch } from 'react-redux';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
const Login = ({ reloadPage, setReloadPage }) => {
  const [phone, setphone] = useState('');
  const [password, setpassword] = useState();
  const dispatch = useDispatch();
  const [invalidLogin, setInvalidLogin] = useState(false);
  const [fillFields, setFillFields] = useState(false);
  const [eyeToggle,setEyeToggle] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    // e.preventDefault();
    setLoading(true)
    setTimeout(()=>{if (phone && password) {
      login(dispatch, { phone, password }, setInvalidLogin);
      setLoading(false)
    } else {
      setFillFields(true);
      setLoading(false)
    }},1000);
    
    
  };
  const showPassword = () => {
    var x = document.getElementById('password');
    x.type === 'password' ? (x.type = 'text') : (x.type = 'password');
  };
  const Loading = () => {
    return (
      <>
        <div className="col-md-6" style={{ lineHeight: 2 }}>
          <Skeleton height={400} />
        </div>
        <div className="col-md-6">
          <Skeleton height={50} width={300} />
          <Skeleton height={70} />
          <Skeleton height={25} width={150} />
          <Skeleton height={50} />
          <Skeleton height={150} />
          <Skeleton height={50} width={100} />
          <Skeleton height={50} width={100} />
        </div>
      </>
    );
  };
  return (
    <div className="registration-auth mb-4">
      <div className="container">
        <div className="fadeInDown">
          <br></br>
          <div>{loading ? <Loading /> 
          : 
          <div className="row">
          <div className="col-lg-2 col-md-1 col-sm-1"></div>
          <div className="col-lg-8 col-md-11 col-sm-11 display-cell">
            <div className="d-flex justify-content-between">
              <span className="create-account d-inline">Welcome to Alladin.pk! Please login.</span>
            </div>
            <br />
            {invalidLogin ? <span style={{ color: 'red' }}>Error: Invalid Phone Number or Password.</span> : ''}
            {fillFields ? <span style={{ color: 'red' }}>Error: please fill all the fields.</span> : ''}
            <br />
            <div className="row bgColor" style={{ height: '100%' }}>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <label className="label">Phone Number</label>
                <br />

                <input
                  type="tel"
                  className="assign-input "
                  style={{paddingLeft:"5px"}}
                  placeholder="Please enter your phone number here"
                  minLength={11}
                  pattern="[0-9]+"
                  onChange={(e) => setphone(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleClick();
                    }
                  }}
                />

                <label className="label">Password</label>
                <br />
                <div className="assign-input">
                <div className="row ">
                  <div className='col-9'>
                    <input
                      type="password"
                      className="passwordInputField"
                      placeholder="Password"
                      minLength="8"
                      id="password"
                      onChange={(e) => setpassword(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleClick();
                        }
                      }}
                    />
                  </div>
                  <div className='col-3'>
                    {eyeToggle?
                      <i style={{fontSize:"25px",float:"right",marginRight:"10px",marginTop:"5px",cursor:"pointer"}} onClick={() => {showPassword(); setEyeToggle(false)}} className="fa fa-eye"></i>
                      :
                      <i style={{fontSize:"25px",float:"right",marginRight:"10px",marginTop:"5px",cursor:"pointer"}} onClick={() => {showPassword(); setEyeToggle(true)}} className="fa fa-eye-slash"></i>
                    }
                  </div>
                </div>
                </div>
                {/* <div className="code-by-sms">
                              </div> */}
                <br></br>
                <span style={{ width: '100%' }} className="d-flex mt-4">
                  New member?&nbsp;
                  <NavLink style={{ marginLeft: 'auto', order: '2' }} to="/register">
                    <button className="already-user-btn">Register here</button>
                  </NavLink>
                </span>
                <NavLink to="/forgotPassword">
                  <span style={{ color: 'blue' }} className="d-flex">
                    Forgot Password?
                  </span>
                </NavLink>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{ marginTop: '6px' }}>
                <br></br>
                {phone.length >= 11 && password ? (
                  <button style={{ marginTop: '14px' }} onClick={handleClick} className="signup-btn">
                    Login
                  </button>
                ) : (
                  <button style={{ backgroundColor: 'gray', marginTop: '14px' }} disabled className="signup-btn">
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
            <div className="col-lg-2 col-md-1 col-sm-1"></div>
          </div>
           }
           </div>
          
        </div>
        <br></br>
      </div>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
};
export default Login;
