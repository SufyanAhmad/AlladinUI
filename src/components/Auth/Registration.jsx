import React,{useState} from 'react';
import { NavLink,useHistory } from 'react-router-dom';
import { FetchUrl } from "../../requestMethod";
import swal from 'sweetalert';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
  async function RegisterUser(credentials) {
    return fetch(FetchUrl + 'Authenticate/Register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }
const Registration = () => {
    const [phoneNumber, setPhoneNumber] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [firstname, setFirstname] = useState();
    const [lastname, setLastname] = useState();
    const [fillFields,setFillFields] = useState(false);
    const [passwordError,setPasswordError] = useState(false);
    const [phoneError,setPhoneError] = useState(false);
    const [eyeToggle,setEyeToggle] = useState(false);
    const [eyeConfirmToggle,setConfirmEyeToggle] = useState(false);
    const [sentOTP,setSentOTP] = useState(false);
    const [oTP,setOTP] = useState(null);
    const [loading, setLoading] = useState(false);

    const [verfiyOTPToggle,setVerfiyOTPToggle] = useState(false)

    const [verificationToggle,setVerificationToggle] = useState(false)
    let history = useHistory();
  const handleSubmit = async e => {
    // setLoading(true);
    if(phoneNumber.length >10){
        // setLoading(false);
        setPhoneError(true);
    }
    // var regularExpression  =  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    // if (!regularExpression.test(password)) {
    //   setPasswordError(true)
    // }
    if(password !== confirmPassword){
        // setLoading(false);
        setPasswordError(true);
    }
    e.preventDefault();
    if(phoneNumber && password === confirmPassword && firstname && lastname){
    const response = await RegisterUser({
      phoneNumber,
      password,
      firstname,
      lastname
    });
    if (response.status ==="Success") {
      swal("Success", response.message, "success", {
        buttons: false,
        timer: 2000,
      })
      .then((value) => {
        // setLoading(false);
        history.push("/login");
        setSentOTP(false);

      });
    }else{
      swal("Error", response.message, "error");
      // setLoading(true);
    }
  }
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
  const submitOTP = async (e) => {
    // e.preventDefault();
    if (phoneNumber) {
      const response = await sendOTP(
        phoneNumber
      );
      if (response.status === 'Success') {
        swal('Success', response.message, 'success', {
          buttons: false,
          timer: 2000,
        });
        setSentOTP(true)
      } else {
        swal('Error', response.message, 'error');
      }
    } else {
      // setError('Please Fill all the fields');
    }
  };

  async function VerifyOTP(credentials) {
    debugger
    let phoneNumber = credentials.phoneNumber;
    let oTPCode = credentials.oTP;
    return fetch(FetchUrl + 'Authenticate/is-otp-valid?phoneNumber='+phoneNumber+'&oTPCode='+oTPCode, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
      },
      body: JSON.stringify({phoneNumber,oTPCode}),
    }).then((data) => data.json());
  }
  const verifyOTP = async (e) => {
    // e.preventDefault();
    if (phoneNumber && oTP) {
      const response = await VerifyOTP({
        phoneNumber,
        oTP
      });
      if (response.status === 'Success') {
        swal('Success', response.message, 'success', {
          buttons: false,
          timer: 2000,
        });
        if(response.data === "true"){
          setVerfiyOTPToggle(true)
        }
      } else {
        swal('Error', response.message, 'error');
      }
    } else {
      // setError('"ERROR: Please Fill all the fields"');
    }
  };

  const showPassword = () => {
    var x = document.getElementById('password');
    x.type === 'password' ? (x.type = 'text') : (x.type = 'password');
  };
  const showConfirmPassword = () => {
    var x = document.getElementById('confirmPassword')
    x.type === "password"? x.type= "text" : x.type = "password";
  }
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
      <div className='registration-auth '>
        {/* <form onSubmit={handleSubmit}> */}
          <div className='container'>
            <div className="fadeInDown">
                <br></br>
                {/* {!verificationToggle?
                <div className='verficationContent'>
                  <div>
                    <p style={{fontSize:"24px",fontWeight:"700"}} className='d-flex justify-content-center'>Please verify by entering OTP sent on your Phone Number </p>
                  </div>
                  <div style={{marginTop:"50px"}} className='row'>
                    <div className='col-4'></div>
                    <div className='col-4'>
                      <label>Verify OTP</label><br />
                      <input style={{width:"100%",padding:"5px"}} placeholder="Enter OTP here" type="text" name="" id="" />
                      <div style={{float:"right",marginTop:"20px"}}>
                        <button style={{width:"60px",height:"35px"}} className="signup-btn c-pointer">
                          Verify
                        </button>&nbsp;&nbsp;&nbsp;
                        <button style={{width:"125px",height:"35px"}} className="signup-btn c-pointer">
                        <NavLink to="/login">
                          back to login
                          </NavLink>
                        </button>
                      </div>
                    </div>
                    <div className='col-4'></div>
                  </div>
                </div>
                : */}
                  <div className="row">{loading ? <Loading /> 
                : 
                  <div className='row'>
                  <div className='col-lg-2 col-md-1 col-sm-1'></div>
                  <div className='col-lg-8 col-md-11 col-sm-11 display-cell'>
                      <div className='d-flex justify-content-between'>
                        <span className='create-account d-inline'>Create your Alladin.pk Account</span>
                        {fillFields?<><br /><span style={{color:"red"}}>Error: please fill all the fields.</span></> :""}
                      </div>
                      <br></br>
                      <div className='bgColor' style={{height:"100%"}}>
                        <form>
                          <div>
                          <div className='row bgColor' style={{height:"100%"}}> 
                                  <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6 p-1'>
                                      <label className="label">First Name</label>
                                      <br/>
                                      <input 
                                      type="text"  
                                      className="assign-input "
                                      style={{paddingLeft:"5px"}} 
                                      placeholder="Enter your first name"
                                      id="fname"
                                      name="username"
                                      required
                                      onChange={e => setFirstname(e.target.value)}
                                      />
                                      <label className="label">Last Name</label>
                                      <br/>
                                      <input type="text"
                                      className="assign-input "
                                      style={{paddingLeft:"5px"}} 
                                      placeholder="Enter your last name"
                                      id="lname"
                                      name="username"
                                      required
                                      onChange={e => setLastname(e.target.value)}
                                      />
                                      <label className="label">Phone Number</label>
                                      <br/>
                                      <input 
                                      type="text"
                                      style={{paddingLeft:"5px"}}
                                      className="assign-input " 
                                      placeholder="Please enter your phone number here"
                                      id="phoneNumber"
                                      name="phoneNumber" 
                                      minLength="10"
                                      required
                                      onChange={e => setPhoneNumber(e.target.value)}
                                      />
                                      {/* <br></br> */}
                                      
                                  </div>
                                  <div className='registPassword col-xs-12 col-sm-12 col-md-6 col-lg-6 p-1'>
                                      <label label className="label">Password</label>
                                      <br/>
                                      <div className='assign-input'>
                                        <div className="row " >
                                            <div className='col-10 '>
                                              <input 
                                              type="password"  
                                              className="passwordInputField "
                                              placeholder="Password must be a minimum length of 8 characters and contain uppercase and lowercase letters, a number and a symbol"
                                              id="password"
                                              name="password"
                                              minLength="8"
                                              required
                                              onChange={e => setPassword(e.target.value)}
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
                                      <br/>
                                      <div className='assign-input'>
                                        <div className="row" >
                                          <div className='col-10'>
                                            <input 
                                            type="password"  
                                            className="passwordInputField"
                                            placeholder="Password must be a minimum length of 8 characters"
                                            id="confirmPassword"
                                            name="password"
                                            minLength="8"
                                            required
                                            onChange={e => setConfirmPassword(e.target.value)}
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
                                      {/* {sentOTP?<>
                                        <label className="label">Enter OTP</label>
                                        <br/>
                                        <input type="text"
                                        className="assign-input " 
                                        placeholder="Enter OTP sent via sms"
                                        id="lname"
                                        name="username"
                                        required
                                        onChange={(e)=> setOTP(e.target.value)}
                                        />
                                      </>
                                      :<></>} */}
                                      {passwordError?<div className='required justify-content-start'>Password and Confirm Password do not match</div>:""}
                                      <div className="form-check" style={{marginTop:"42px"}}>
                                      <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                      <span className='term-condition'>I want to receive exclusive offers and promotions from Alladin.pk.</span>
                                      </div>
                                      <br/>
                                      {/* {!sentOTP?
                                      <button className="signup-btn" onClick={()=>submitOTP(phoneNumber)}>Send OTP</button>
                                      :
                                      verfiyOTPToggle?
                                      <button type='submit' onClick={handleSubmit} className="signup-btn">Signup</button>
                                      :
                                      <button className="signup-btn" onClick={()=>verifyOTP({phoneNumber,oTP})}>Verify OTP</button>
                                    } */}
                                      {/* <div align="center" style={{width:"300px"}} >
                                        <button onClick={handleSubmit} type='submit' className="signup-btn">Signup</button>
                                      </div> */}
                                  </div>
                          </div>
                          <div className='row bgColor' style={{height:"fit-content",marginTop:"-40px", paddingBottom:"15px"}}>
                                    <div className='col-lg-6 col-md-6 col-sm-12 mt-3'>
                                        <span className='d-flex justify-content-start'>Already member?&nbsp; 
                                          <NavLink to="/login">
                                            <button className="already-user-btn">Login here</button>
                                          </NavLink>
                                        </span>
                                    </div>
                                    <div className='col-lg-6 col-md-6 col-sm-12 mt-3'>
                                      <div align="center" style={{width:"300px"}} >
                                        <button onClick={handleSubmit} type='button' className="signup-btn">Signup</button>
                                      </div>
                                    </div>
                          </div>
                          </div>
                        </form>
                      </div>
                  </div>
                  <div className='col-lg-2 col-md-1 col-sm-1'></div>
                  </div>
                  }
                </div>
                
                {/* } */}
            </div>
          </div>
        {/* </form> */}
      <br></br><br></br><br></br>
    </div>
  );
};

export default Registration;
