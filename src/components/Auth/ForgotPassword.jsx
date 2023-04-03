import React, { useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom';
import { FetchUrl } from '../../requestMethod';
import swal from 'sweetalert';
function ForgotPassword() {
  const [eyeToggle,setEyeToggle] = useState(false)
  const [eyeConfirmToggle,setConfirmEyeToggle] = useState(false)
  const [phoneNumber,setPhoneNumber] = useState("")
  const [verifyOTP,setVerifyOTP] = useState("")
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [passwordError, setPasswordError] = useState(false);

  const [showVerifScreen,setShowVerifScreen] = useState(false)
  const [showResetPassword,setShowResetPassword] = useState(false)
  let history = useHistory();

  const showPassword = () => {
    var x = document.getElementById('password')
    x.type === "password"? x.type= "text" : x.type = "password";
  }
  const showConfirmPassword = () => {
    var x = document.getElementById('confirmPassword')
    x.type === "password"? x.type= "text" : x.type = "password";
  }
  async function sendOTP(credentials) {
    let phoneNumber = credentials
    return fetch(FetchUrl + 'Authenticate/send-otp-to-user-phone-number?phoneNumber='+phoneNumber, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
      },
      body: JSON.stringify(phoneNumber),
    }).then((data) => data.json());
  }
 
  const submitOTP = async () => {
    var loginForm = document.querySelector('form');
    loginForm.addEventListener('submit', (e)=>{e.preventDefault();}); 
    if (phoneNumber) {
      const response = await sendOTP(
        phoneNumber
      );
      if (response.status === 'Success') {
        swal('Success', response.message, 'success', {
          buttons: false,
          timer: 2000,
        });
        setShowVerifScreen(true)
      } else {
        swal('Error', response.message, 'error');
      }
    } else {
      // setError('Please Fill all the fields');
    }
  };
  async function ChangePassword(credentials) {
    return fetch(FetchUrl + 'Authenticate/ResetPassword', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
    
      body: JSON.stringify(credentials),
    }).then((data) => data.json());
  }
  const submitChanges = async () => {
    var loginForm = document.querySelector('form');
    loginForm.addEventListener('submit', (e)=>{e.preventDefault();}); 
    
    if (newPassword !== confirmPassword) {
      setPasswordError(true);
    }
    let phoneNo = phoneNumber
    if (phoneNo && newPassword && newPassword === confirmPassword) {
      const response = await ChangePassword({
        phoneNo,
        newPassword,
        confirmPassword,
      });
      if (response.status === 'Success') {
        swal('Success', response.message, 'success', {
          buttons: false,
          timer: 2000,
        });
        setPasswordError(false);
        setPhoneNumber('');
        setNewPassword('');
        history.push("/login");
        setConfirmPassword('').then((value) => {});
      } else {
        swal('Error', response.message, 'error');
      }
    } else {
      // setError('Please Fill all the fields');
    }
  };
  const submitVerifyOTP = () => {
    var loginForm = document.querySelector('form');
    loginForm.addEventListener('submit', (e)=>{e.preventDefault();}); 
    setShowResetPassword(true);
  }
  const backToLogin = () => {
    setShowResetPassword(false);
    setShowVerifScreen(false);
  }
  return (
    <div>
        <div className='registration-auth mb-4'>
      <div className='container'>
        <div className="fadeInDown">
            <br></br>
            <div className='row'>
                <div className='col-lg-2 col-md-1'></div>
                <div className='col-lg-8 col-md-11 col-sm-12 display-cell'>
                    <div className='d-flex justify-content-center'> 
                       <span className='create-account d-inline'>Forgot Password? </span>
                    </div>
                    <br/>
                    {/* {invalidLogin?<span style={{color:"red"}}>Error: Invalid Phone Number or Password.</span> :""}
                    {fillFields?<span style={{color:"red"}}>Error: please fill all the fields.</span> :""} */}
                    <br/>
                    <div className='row forgetFormContainer bgColor' style={{height:"100%"}}>
                      {!showVerifScreen?
                                <>
                                  <p style={{fontWeight:"500",fontSize:"20px", textAlign:"center"}} className='mt-4'>Password Reset </p>
                                  <form onSubmit="return false">
                                    <div style={{width:"100%"}}>
                                        <label className="label">Phone Number</label>
                                        <input 
                                        type="tel" 
                                        className="assign-input" 
                                        onChange={(e)=>setPhoneNumber(e.target.value)}
                                        placeholder="Please enter your phone number here"
                                        minLength={11}
                                        required
                                        pattern="[0-9]+"
                                        />
                                        <div className='row'>
                                          <div className='col-xs-0 col-sm-0 col-md-0 col-lg-6'></div>
                                          <div className='d-flex justify-content-between col-xs-12 col-sm-12 col-md-12 col-lg-6'>
                                            <button type='submit' style={{marginTop:"14px", height:"50px"}} className="signup-btn c-pointer" onClick={submitOTP}>Submit</button> &nbsp;&nbsp;&nbsp;&nbsp;
                                            <button onClick={backToLogin} style={{marginTop:"14px", height:"50px"}} className="signup-btn c-pointer"><NavLink to="/login">Back to Login</NavLink></button>
                                          </div>
                                        </div>
                                    </div>
                                  </form>
                                </>
                                :
                                <>
                                  {!showResetPassword?
                                    <>
                                      <p style={{textAlign:"center"}} className='mt-4'>Verify OTP sent on your phone number </p>
                                      <form >
                                        <div style={{width:"100%"}}>
                                          <label className="label">Enter OTP</label>
                                          <input 
                                          type="text" 
                                          value={verifyOTP}
                                          className="assign-input" 
                                          onChange={(e)=>setVerifyOTP(e.target.value)}
                                          placeholder="Please enter OTP number here"
                                          />
                                          <div className='row'>
                                            <div className='col-xs-0 col-sm-0 col-md-6 col-lg-6'></div>
                                            <div className='d-flex justify-content-between col-xs-12 col-sm-12 col-md-6 col-lg-6'>
                                                <button type='submit' style={{marginTop:"14px", height:"50px"}} className="signup-btn c-pointer" onClick={submitVerifyOTP}>Verify</button> &nbsp;&nbsp;&nbsp;&nbsp;
                                                
                                                <button style={{marginTop:"14px", height:"50px"}} className="signup-btn c-pointer"><NavLink to="/login">Back to Login</NavLink></button>
                                                
                                            </div>
                                          </div>
                                        </div>
                                      </form>
                                    </>
                                  :
                                    <>
                                    <form>
                                      <div style={{witdh:"100%"}}>
                                        <p style={{textAlign:"center"}} className='mt-4'>Password Reset </p>
                                        <div>
                                        {passwordError ? <span style={{ color: 'red' }}>Error: New Password and Confirm Password do not match.</span> : ''}
                                        </div>
                                        <label className="label">Phone Number</label>
                                        <input 
                                        type="tel" 
                                        className="assign-input" 
                                        value={phoneNumber}
                                        onChange={(e)=>setPhoneNumber(e.target.value)}
                                        placeholder="Please enter your phone number here"
                                        minLength={11}
                                        required
                                        pattern="[0-9]+"
                                        />
                                        <label className="label">New Password</label>
                                        <div className="assign-input" >
                                          <div className='row'>
                                            <div className='col-10'>
                                              <input 
                                              type="password"
                                              className="passwordInputField"
                                              id="password"
                                              value={newPassword}
                                              onChange={(e) => setNewPassword(e.target.value)}
                                              placeholder="Please enter your new password here"
                                              required
                                              minLength="8"
                                              />
                                            </div>
                                            <div className='col-2'>
                                              {eyeToggle?
                                                <i style={{fontSize:"25px",float:"right",marginRight:"10px",marginTop:"5px",cursor:"pointer"}} onClick={() => {showPassword(); setEyeToggle(false)}} className="fa fa-eye"></i>
                                                :
                                                <i style={{fontSize:"25px",float:"right",marginRight:"10px",marginTop:"5px",cursor:"pointer"}} onClick={() => {showPassword(); setEyeToggle(true)}} className="fa fa-eye-slash"></i>
                                              }
                                            </div>
                                          </div>
                                        </div>
                                        <label className="label">Confirm Password</label>
                                        <div className="assign-input">
                                          <div className='row'>
                                            <div className='col-10'>
                                              <input 
                                              type="password" 
                                              className="passwordInputField"
                                              id="confirmPassword" 
                                              value={confirmPassword}
                                              onChange={(e) => setConfirmPassword(e.target.value)}
                                              placeholder="Please confirm your password"
                                              required
                                              minLength="8"
                                              />
                                            </div>
                                            <div className='col-2'>
                                              {eyeConfirmToggle?
                                                <i style={{fontSize:"25px",float:"right",marginRight:"10px",marginTop:"5px",cursor:"pointer"}} onClick={() => {showConfirmPassword(); setConfirmEyeToggle(false)}} className="fa fa-eye"></i>
                                                :
                                                <i style={{fontSize:"25px",float:"right",marginRight:"10px",marginTop:"5px",cursor:"pointer"}} onClick={() => {showConfirmPassword(); setConfirmEyeToggle(true)}} className="fa fa-eye-slash"></i>
                                              }
                                            </div>
                                          </div>
                                        </div>
                                        <div className='row'>
                                          <div className='col-xs-0 col-sm-0 col-md-6 col-lg-6'></div>
                                          <div className='d-flex justify-content-between col-xs-12 col-sm-12 col-md-6 col-lg-6'>
                                              <button type='submit' style={{marginTop:"14px", height:"50px"}} className="signup-btn c-pointer" onClick={submitChanges}>Submit</button> &nbsp;&nbsp;&nbsp;&nbsp;
                                              
                                              <button onClick={backToLogin} style={{marginTop:"14px", height:"50px"}} className="signup-btn c-pointer"><NavLink to="/login">Back to Login</NavLink></button>
                                          </div>
                                        </div>
                                      </div>
                                    </form>
                                    </>
                                  }
                                </>
                                }                           
                                {/*                                 
                                <label className="label">password</label>
                                <br/>
                                <input 
                                type="password" 
                                className="assign-input" 
                                placeholder="Minimum 6 characters with a number and a letter"
                                minLength="6"
                                />
                                {/* <div className="code-by-sms">
                                </div> 
                                <br></br>
                                <span className='d-flex justify-content-start mt-4'>New member?&nbsp;
                                  <NavLink to="/register">
                                  <button className="already-user-btn">Register here</button> 
                                  </NavLink>
                                </span>
                                <br></br> */}


                                {/* <div className='col-xs-0 col-sm-0 col-md-6 col-lg-6'></div>
                                <div className='d-flex justify-content-between col-xs-12 col-sm-12 col-md-6 col-lg-6'>
                                    <button style={{marginTop:"14px"}} className="signup-btn" onClick={(e)=> submitOTP(e)}>Submit</button> &nbsp;&nbsp;&nbsp;&nbsp;
                                    
                                    <button style={{marginTop:"14px"}} className="signup-btn"><NavLink to="/login">Back to Login</NavLink></button>
                                    
                                </div> */}
                                
                    </div>
                </div>
                <div className='col-lg-2 col-md-1'></div>
            </div>
        </div>
        <br></br>
        <br></br>
      </div>
      <br></br><br></br><br></br>
    </div>
    </div>
  )
}

export default ForgotPassword