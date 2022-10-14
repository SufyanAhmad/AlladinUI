import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { VscChromeClose } from 'react-icons/vsc';
import { useSelector } from 'react-redux';
import './usersSidebar.scss';
import { useRef } from 'react';
import { publicRequest } from '../../requestMethod';
import { useParams } from 'react-router-dom';
import { FetchUrl } from '../../requestMethod';

function UsersSidebar(prop) {
  const role = useSelector((state) => state.user.currentUser && state.user.currentUser.role);
  const [userProfile, setUserProfile] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [showSubHeading, setShowSubHeading] = useState(false);
  const [cancelLength, setCancelLength] = useState([]);
  const [returnLength, setReturnLength] = useState([]);
  const { id } = useParams();
  const componentMounted = useRef(true);

  useEffect(() => {
    fetch(FetchUrl + `User/get-user-profile`, {
      headers: {
        Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
      },
    }).then((result) => {
      result.json().then((resp) => {
        if (componentMounted.current) {
          setUserProfile(resp.data);
        }
      });
    });
    return () => {
      componentMounted.current = false;
    };
  }, []);
  useEffect(() => {
    const getorders = async () => {
      try {
        const res = await publicRequest.get(`Order/get-Customer-orders/3`, {
          headers: {
            Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
          },
        });
        setCancelLength(res.data.data);
      } catch {}
    };
    getorders();
  }, []);
  useEffect(() => {
    const getorders = async () => {
      try {
        const res = await publicRequest.get(`Order/get-Customer-orders/8`, {
          headers: {
            Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
          },
        });
        setReturnLength(res.data.data);
      } catch {}
    };
    getorders();
  }, []);
  if (window.location.pathname === '/users/myOrders' || window.location.pathname === '/users/return/8' || window.location.pathname === '/users/cancellations/3') {
    if (!showSubHeading) {
      setShowSubHeading(true);
    }
  }
  return (
    <div
      style={{
        backgroundColor: `${prop.sidebartoggle ? '#23334c' : 'transparent'}`,
        width: `${prop.sidebartoggle ?"242px":"10px"}`,
        // width: '242px',
        height: '100%',
        position: 'fixed',
      }}
    >
      <div className="userSidebar-toggle">
        {prop.sidebartoggle  ? (
          <div className="userSidebar-toggle userSidebar-toggleClose">
            <VscChromeClose className="usersSidebar-toggleIcon" onClick={() => { setToggle(false); prop.setSidebartoggle(false);}} />
          </div>
        ) : (
          <GiHamburgerMenu className="userSidebar-toggle usersSidebar-toggleIcon" onClick={() => {setToggle(true); prop.setSidebartoggle(true);}} />
        )}
      </div>
      {prop.sidebartoggle ? (
        <div className="sidebarContent">
          <div className="pictureName">
            <NavLink to="/users/myProfile">{userProfile.profileImageUrl === null || userProfile.profileImageUrl === undefined ? <img className="profilePicture mr-2" src="./assets/user.png"></img> : <img className="profilePicture mr-2" src={userProfile.profileImageUrl}></img>}</NavLink>
            <NavLink to="/users/myProfile">
              <span className="ml-5 name text-line">
                {' '}
                {userProfile.firstName} {userProfile.lastName}
              </span>
            </NavLink>
          </div>
          {role === 'Customer' ? (
            <>
              <div className="sidebarList">
                <NavLink onClick={()=>setToggle(false)} to="/users/myProfile">
                  <p className={`listItem ${window.location.pathname === '/users/myProfile' ? 'active-user-screen' : ''}`}>My Profile</p>
                </NavLink>
                <hr />
                <NavLink onClick={()=>setToggle(false)} to="/users/myAddress">
                  <p className={`listItem ${window.location.pathname === '/users/myAddress' ? 'active-user-screen' : ''}`}>My Address</p>
                </NavLink>

                <hr />
                <div className={`listItem ${window.location.pathname === '/users/myOrders' ? 'active-user-screen' : ''}`} style={{ display: 'flex' }}>
                  <NavLink onClick={()=>setToggle(false)} to="/users/myOrders">
                    <span className="myOrdertext">My Orders</span>
                  </NavLink>
                  <button
                    onClick={() => setShowSubHeading(!showSubHeading)}
                    style={{
                      color: '#FFFFFF',
                      height: '10px',
                      width: '10px',
                      marginLeft: '50px',
                      display: 'inline',
                      fontSize: '24px',
                      background: 'transparent',
                      borderStyle: 'none',
                    }}
                    className="fa fa-chevron-circle-down"
                  ></button>
                </div>
                <hr />
                {showSubHeading ? (
                  <>
                    <NavLink onClick={()=>setToggle(false)} to={`/users/return/${'8'}`}>
                      <p className={`${window.location.pathname === '/users/return/8' ? 'active-user-screen' : ''} listSubItem `}>
                        My Returns
                        <span style={{ marginRight: '10px', float: 'right' }}>{returnLength.length}</span>
                      </p>
                    </NavLink>
                    <hr />
                    <NavLink onClick={()=>setToggle(false)} to={`/users/cancellations/${'3'}`}>
                      <p className={`${window.location.pathname === '/users/cancellations/3' ? 'active-user-screen' : ''} listSubItem `}>
                        My Cancellations
                        <span style={{ marginRight: '10px', float: 'right' }}>{cancelLength.length}</span>
                      </p>
                    </NavLink>
                    <hr />
                  </>
                ) : (
                  ''
                )}
                <NavLink onClick={()=>setToggle(false)} to="/users/reviews">
                  <p style={{ marginBottom: '0px' }} className={`listItem ${window.location.pathname === '/users/reviews' ? 'active-user-screen' : ''}`}>
                    My Reviews
                  </p>
                </NavLink>
              </div>
            </>
          ) : (
            <>
              <div className="sidebarList">
                <NavLink onClick={()=>setToggle(false)} to="/users/myProfile">
                  <p className={`listItem ${window.location.pathname === '/users/myProfile' ? 'active-user-screen' : ''}`}>My Profile</p>
                </NavLink>
                <hr />
              </div>
            </>
          )}
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default UsersSidebar;
