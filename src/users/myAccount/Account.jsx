import React from "react";
import "./account.scss";
import { useState } from 'react';
import UsersSidebar from "../usersSidebar/UsersSidebar";
function Account() {
  
const [sidebartoggle, setSidebartoggle] = useState('');
  return (
    <>
      <div className=" usersContent">
        <div className="row">
          <div style={{zIndex:"3"}} className={`${sidebartoggle?"col-2":""} usersflexes`}>
            <UsersSidebar  sidebartoggle={sidebartoggle} setSidebartoggle={setSidebartoggle}/>
          </div>
          <div className={`${sidebartoggle?"col-10":"col-12"} usersflexes`} >
            <div className="manageAccount">
              <p className="accountHeading">
                <b>Manage My Account</b>
              </p>
              <div className="contentBody">
                <div className="personalProfile inline">
                  <span className="personalProfileHeading">
                    <b>Personal Profile</b>
                  </span>
                  <p className="personalProfileDetail">Anabia Aslam</p>
                  <button className="editButton ">Edit</button>
                </div>
                <div className="address">
                  <p className="addressHeading">
                    <b>Address</b>
                  </p>
                  <p className="addressDetail">
                    Default Shipping Address
                    <br />
                    Muhammad Aslam
                    <br />
                    Fixtures mobel
                    <br />
                    Punjab - Lahore - Kot Lakh Pat - Peco Road
                    <br />
                    (+92) 3340672199
                  </p>
                  <button className="editButton ">Edit</button>
                </div>
              </div>
              <div className="recentOrder">
                <p className="placeOrder">
                  <b>Recent Order</b>
                </p>
                <table className="orderTable">
                  <tr className="headingRow">
                    <td className="tableItem tableHeading">Order#</td>
                    <td className="tableItem tableHeading">Placed On</td>
                    <td className="tableItem tableHeading">Items</td>
                    <td className="tableItem tableHeading">Totals</td>
                  </tr>
                  <tr>
                    <td className="tableItem">133868580442822</td>
                    <td className="tableItem">2/16/2022</td>
                    <td className="tableItem">Items</td>
                    <td className="tableItem">
                      Rs. 6,789
                      <button className="manageButton">Manage</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="tableItem">133868580442822</td>
                    <td className="tableItem">2/16/2022</td>
                    <td className="tableItem">Items</td>
                    <td className="tableItem">
                      Rs. 6,789
                      <button className="manageButton">Manage</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="tableItem">133868580442822</td>
                    <td className="tableItem">2/16/2022</td>
                    <td className="tableItem">Items</td>
                    <td className="tableItem">
                      Rs. 6,789
                      <button className="manageButton">Manage</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="tableItem">133868580442822</td>
                    <td className="tableItem">2/16/2022</td>
                    <td className="tableItem">Items</td>
                    <td className="tableItem">
                      Rs. 6,789
                      <button className="manageButton">Manage</button>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Account;
