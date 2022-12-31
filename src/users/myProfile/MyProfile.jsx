import React, { useEffect, useState } from 'react';
import UsersSidebar from '../usersSidebar/UsersSidebar';
import './myProfile.scss';
import { useSelector } from 'react-redux';
import { Modal } from 'react-responsive-modal';
import axios from 'axios';
import swal from 'sweetalert';
import { FetchUrl } from '../../requestMethod';

function MyProfile() {
  const [userProfile, setUserProfile] = useState('');
  const [sidebartoggle, setSidebartoggle] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(false);
  const [Editopen, setEditOpen] = useState(false);
  const EditOpenModal = () => setEditOpen(true);
  const [networkError, setNetworkError] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [ProfileImage, setSelectedImage] = useState(null);
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fillFields, setFillFields] = useState(false);
  const [reload, setReload] = useState(userProfile);
  const [isPassword, setIsPassword] = useState();
  const EditCloseModal = () => {
    setEditOpen(false);
    setNetworkError('');
    setFillFields(false);
  };
  useEffect(() => {
    setLoading(true);
    fetch(FetchUrl + `User/get-user-profile`, {
      headers: {
        Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
      },
    }).then((result) => {
      result.json().then((resp) => {
        setUserProfile(resp.data);
        setIsPassword(resp.data.havePassword)
        setLoading(false);
      });
    });
  }, [reload]);
  function selectUser(userId) {
    setFirstName(userId.firstName);
    setLastName(userId.lastName);
  }
  const onEditFormSubmit = (e) => {
    e.preventDefault();
    if (FirstName && LastName) {
      const formData = new FormData();
      formData.append('FirstName', FirstName);
      formData.append('LastName', LastName);
      formData.append('ProfileImage', ProfileImage);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
      };
      const url = FetchUrl + `User/update-user-profile`;
      axios
        .put(url, formData, config)
        .then((response) => {
          if (response.ok === false) {
            setNetworkError('profie change unsuccessful');
          } else {
            setSelectedImage(null);
            setEditOpen(false);
            setReload(userProfile);
            setNetworkError('');
          }
        })
        .catch((err) => {
          setNetworkError(err.message);
        });
    } else {
      setFillFields(true);
    }
  };
  async function ChangePassword(credentials) {
    return fetch(FetchUrl + 'Authenticate/ChangePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
      },
      body: JSON.stringify(credentials),
    }).then((data) => data.json());
  }
  async function CreatePassword(credentials) {
    return fetch(FetchUrl + 'Authenticate/create-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
      },
      body: JSON.stringify(credentials),
    }).then((data) => data.json());
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError(true);
    }
    if (newPassword && newPassword === confirmPassword) {
      const response = await ((currentPassword && isPassword) ? ChangePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      })
      :
      CreatePassword({
        newPassword,
        confirmPassword,
      }));

      if (response.status === 'Success') {
        swal('Success', response.message, 'success', {
          buttons: false,
          timer: 2000,
        });
        setPasswordError(false);
        setError(false);
        setReload(userProfile);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('').then((value) => {});
      } else {
        swal('Error', response.message, 'error');
      }
    }
     else {
      setError('Please Fill all the fields');
    }
  };
  return (
    <>
      <div className=" profileContent">
        <div className="row formclass">
          <div style={{ zIndex: '3' }} className={`${sidebartoggle?"col-4":""} profileflexes`}>
            <UsersSidebar sidebartoggle={sidebartoggle} setSidebartoggle={setSidebartoggle}/>
          </div>
          <div className={`${sidebartoggle?"col-8":"col-12 marginleft"} profileflexes`}>
            <div className="manage-Account">
              <p className="accountHeading manage-pro-account p-3">
                <b>Manage My Account</b>
              </p>
              <div className="profileBody">
                <>
                  <div>{userProfile.profileImageUrl === null || userProfile.profileImageUrl === undefined ? <img className="profilePicture" src="./assets/user.png"></img> : <img className="profilePicture" src={userProfile.profileImageUrl}></img>}</div>
                  <div className="row inlineDivs">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                      <div className="labels">
                        <p className="labelInput">First Name</p>
                      </div>
                      <div className="usersInputFields">
                        <input type="text" defaultValue={userProfile.firstName} placeholder="Enter First Name" readOnly></input>
                      </div>
                      <div className="labels">
                        <p className="labelInput">Last Name</p>
                      </div>
                      <div className="usersInputFields">
                        <input type="text" defaultValue={userProfile.lastName} placeholder="Enter Last Name" readOnly></input>
                      </div>
                      <br />
                      <br />
                      <span>
                        <span onClick={() => selectUser(userProfile)}>
                          <button className="changeButton" onClick={() => EditOpenModal(userProfile.id)}>
                            Change
                          </button>
                        </span>
                      </span>
                      
                    </div>
                    <form className="col-lg-6 col-md-6 col-sm-12" onSubmit={handleSubmit}>
                      <div style={{ width: '100%' }}>
                        {isPassword?
                        <>
                          <div className="labels">
                            <p className="labelInput secondLabel">Old Password</p>
                          </div>
                          <div className="usersInputFields passwordFields">
                            <input type="password" required placeholder="Enter Old password" onChange={(e) => setCurrentPassword(e.target.value)}></input>
                          </div>
                        </>
                        :""}
                        <div className="labels">
                          <p className="labelInput secondLabel">New Password</p>
                        </div>
                        <div className="usersInputFields passwordFields">
                          <input type="password" required placeholder="Enter New password" minLength="8" onChange={(e) => setNewPassword(e.target.value)}></input>
                        </div>
                        <div className="labels">
                          <p className="labelInput secondLabel">Confirm Password</p>
                        </div>
                        <div className="usersInputFields passwordFields">
                          <input type="password" required minLength="8" placeholder="Enter Confirm password" onChange={(e) => setConfirmPassword(e.target.value)}></input>
                        </div>
                        <br />
                        {passwordError ? <p style={{ color: 'red' , fontSize:"14px", fontWeight:"500"}}>Error: New Password and Confirm Password do not match.</p> : ''}
                        <div
                          style={{
                            width: '75%',
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <button className="saveChanges" type="submit">
                            {' '}
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Modal open={Editopen} onClose={EditCloseModal} center>
            <br></br>
            <div className="d-flex justify-content-center">
              <span className="updateProfile-popup">
                Update Profile
                {networkError && <p className="errorMessage">*{networkError}</p>}
              </span>
            </div>
            {fillFields ? <p style={{ color: 'red' }}>Error: Error: Please fill all the fields</p> : ''}
            <form className="add-cate-popup" noValidate onSubmit={onEditFormSubmit}>
              <label className="product-label mt-3">First Name</label>
              <br />
              <input type="text" className="product-input" placeholder="Name" defaultValue={FirstName} required onChange={(e) => setFirstName(e.target.value)} />
              <label className="product-label mt-3">Last Name</label>
              <br />
              <input type="text" className="product-input" placeholder="Parents Category" defaultValue={LastName} required onChange={(e) => setLastName(e.target.value)} />
              <label className="product-label mt-3">Image</label>
              {ProfileImage === null ? <img style={{ height: '100px', width: '100px' }} src={userProfile.profileImageUrl} /> : ''}
              <div>
                <input
                  type="file"
                  name="myImage"
                  style={{ float: 'right' }}
                  onChange={(event) => {
                    setSelectedImage(event.target.files[0]);
                  }}
                />
                {ProfileImage && (
                  <div>
                    <img alt="not fount" width={'70px'} src={URL.createObjectURL(ProfileImage)} />
                    <br />
                    <button onClick={() => setSelectedImage(null)}>Remove</button>
                  </div>
                )}
              </div>

              <br></br>
              <br></br>
              <button type="submit" className="btn-save-cat">
                Save
              </button>
            </form>
          </Modal>
        </div>
      </div>
    </>
  );
}
export default MyProfile;
