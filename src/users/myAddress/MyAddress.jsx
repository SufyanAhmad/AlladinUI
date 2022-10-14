import React, { useState, useEffect } from "react";
import UsersSidebar from "../usersSidebar/UsersSidebar";
import { publicRequest } from "../../requestMethod"
import "./myAddress.scss";
import { Modal } from "react-responsive-modal";
import { FetchUrl } from "../../requestMethod";
import swal from 'sweetalert';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function MyAddress() {
  const [Editopen, setEditOpen] = useState(false);
  const EditCloseModal = () => setEditOpen(false);
  const [sidebartoggle, setSidebartoggle] = useState(false);
  const [open, setOpen] = useState(false);
  const OpenModal = () => setOpen(true);
  const [ShippingAddress, setShippingAddress] = useState([]);
  const [reload, setReload] = useState([ShippingAddress]);
  const [city, setcity] = useState(null);
  const [firstName, setfirstName] = useState(null);
  const [address, setaddress] = useState(null);
  const [phoneNo, setphoneNo] = useState(null);
  const [email, setemail] = useState(null);
  const [status, setstatus] = useState('false');
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState("");
  const [getAddressError, setGetAddressError] = useState(null);
  const [addAddressError, setAddAddressError] = useState(null);
  const [fillFields, setFillFields] = useState(false);
  const CloseModal = () =>{ setOpen(false);
    setFillFields(false);
  }

  useEffect(() => {
    setLoading(true);
    const getaddress = async () => {
      const res = await publicRequest.get("ShippingAddress/get-Shipping-address", {
        headers: {
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
        },
      });
      setShippingAddress(res.data.data)
      setLoading(false);
    }
    getaddress()
  }, [reload])

  async function ShipAddress(credentials) {
    if(city && address && phoneNo && firstName && email){
    return fetch(FetchUrl + 'ShippingAddress/add-new-shipping-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
      },
      body: JSON.stringify(credentials)
    }).then((resp) => { 
      
      if(resp.ok === false)
      {
        throw Error("Unable to add new Shipping Address")
      }
      resp.json().then((result) => {
        if(result.status === "Success"){
          setOpen(false)
          setReload(ShippingAddress)
          setAddAddressError("")
        }
      })
      }).catch((err) => {
        setAddAddressError(err.message)
      })
    }
    else
    {
      setFillFields(true);
    }
  }
  const handleSubmit = async e => {
    e.preventDefault();
    const response = await ShipAddress({
      city,
      address,
      phoneNo,
      firstName,
      email,
      status
    });
    if ('status' in response) {
      swal("Success", response.message, "success", {
        buttons: false,
        timer: 2000,
      })
        .then(data => data.json())
    }
  
  }
  const DeleteShippingAddress = (data) => {
    const shippingAddressId = data.shippingAddressId
    {
      fetch(FetchUrl + `ShippingAddress/update-shipping-Address-status/${shippingAddressId}`, {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
        },
        body: JSON.stringify(shippingAddressId)
      }).then((resp) => {
        if(resp.ok === false)
        {
          throw Error("ShippingAddress is not update !!")
        }
        resp.json()
          .then((result) => {
            if(result.status === "Success"){
              setReload(ShippingAddress)
              setNetworkError("")
            }
          })
      }).catch((err) => {
        setNetworkError(err.message)
      });
    }
  };
  const Loadings = () => {
    return (
      <>
       <div className="col-md-6" style={{lineHeight:2}}>
              <Skeleton height={300}/>
            </div>
            <div className="col-md-6" style={{lineHeight:2}}>
              <Skeleton height={300}/>
       </div>
      </>
    );
  };
  const _MyAddress = () => {
    return (
      <>
        <div className=" addressContent">
          <div className="row">
            <div style={{zIndex:"3"}} className={`${sidebartoggle?"col-2":""} profileflexes`}>
              <UsersSidebar sidebartoggle={sidebartoggle} setSidebartoggle={setSidebartoggle}/>
            </div>
            <div className={`${sidebartoggle?"col-10":"col-12"} profileflexes`}>
              <div className="manage-myAddress">
                <p className="accountHeading">
                  <b>Manage My Account</b>
                  {networkError &&  <p className="networkError">*{networkError}</p>}
                  {getAddressError &&  <p className="networkError">*{getAddressError}</p>}
                  {addAddressError &&  <p className="networkError">*{addAddressError}</p>}
                </p>
                <div className="addressBody">
                  <div className="row d-flex">
                    <span> <p className="addressManagement">Address Management</p>
                      <button className="addressbtn pull-right" onClick={OpenModal}>Add Address</button></span>
                  </div>
                  <div className="tableBox">
                    <table className="tableContent">
                      <tbody>
                        <tr className="tableRow">
                          <th className="fullNameColumn tableItem">Full Name</th>
                          <th className="addressColumn tableItem">Address</th>
                          <th className="regionColumn tableItem">Region</th>
                          <th className="phoneNumberColumn tableItem">Phone Number</th>
                          <th className="phoneNumberColumn tableItem">Make default </th>
                        </tr>
                          {ShippingAddress.map((row) => (

                            <tr className="tableRow" key={row.shippingAddressId}>
                              {row.status === true ?
                                <>
                                  <td className="tableItem">{row.firstName}</td>
                                  <td className="tableItem">{row.address}</td>
                                  <td className="tableItem">{row.city}</td>
                                  <td className="tableItem">{row.phoneNo}
                                   
                                  </td>
                                  <td className="tableItem">  
                                  <button className="c-pointer default"
                                    onClick={() => DeleteShippingAddress(row)}>Default</button></td>
                                </>

                                :
                                <>

                                  <td className="tableItem">{row.firstName}</td>
                                  <td className="tableItem">{row.address}</td>
                                  <td className="tableItem">{row.city}</td>
                                  <td className="tableItem">{row.phoneNo}
                                   
                                  </td>
                                  <td className="tableItem">
                                    <button className="c-pointer addressdefault"
                                      onClick={() => DeleteShippingAddress(row)}>
                                      <span className="default-text" >Make Default</span>
                                    </button>
                                  </td>
                                </>
                              }
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <div>
      <div className="">
        <div className="row">
          {loading ? <Loadings /> : <_MyAddress />}
        </div>
      </div>
      {open?
      <div className="popup-model">
        <Modal
          open={open}
          onClose={CloseModal}
          center
        >
          <form onSubmit={handleSubmit}>
            <div className="popup-content">
              <div className="popup-part col-lg-6 col-md-6 col-sm-12">
              {fillFields?<p style={{color:"red"}}>*Please fill all the fields</p>:""}
                <span className="popup-Labels">Full Name</span>
                <div>
                  <input
                    className="popup-input-fields popup-Fname-input"
                    type="text"
                    placeholder="Enter Full Name"
                    onChange={e => setfirstName(e.target.value)}
                  />
                </div>
                <div className="popup-Labels ">
                  <span>Phone Number</span>
                </div>
                <div>
                  <input
                    className="popup-input-fields"
                    type="text"
                    placeholder="Enter Phone Number"
                    onChange={e => setphoneNo(e.target.value)}
                  />
                </div>
                <div className="popup-Labels ">
                  <span>Email</span>
                </div>
                <div>
                  <input
                    className="popup-input-fields"
                    type="text"
                    placeholder="Enter Email"
                    onChange={e => setemail(e.target.value)}
                  />
                </div>
                <div className="popup-Labels ">
                  <span>Make default</span>
                </div>
                <div>
                  <div onChange={e => setstatus(e.target.value)}>
                    <input type="radio" value="true" name="Papular" /> Yes &nbsp; &nbsp;
                    <input type="radio" value="false" name="Papular" /> No
                  </div>
                </div>
              </div>
              <div className="popup-part col-lg-6 col-md-6 col-sm-12">
                <div className="popup-Labels ">
                  <span>City</span>
                </div>
                <div>
                  <input
                    className="popup-input-fields"
                    type="text"
                    placeholder="Enter your City"
                    onChange={e => setcity(e.target.value)} />
                </div>
                <div className="popup-Labels ">
                  <span>Address</span>
                </div>
                <div>
                  <input
                    className="popup-input-fields"
                    type="text"
                    placeholder="Enter your Address"
                    onChange={e => setaddress(e.target.value)} />
                </div>
                <div>
                  <button className="popupSaveChanges">Save Changes</button>
                </div>
              </div>
            </div>
          </form>
        </Modal>
      </div>
      :""}
      {Editopen?<>
      <div className="popup-model">
        <Modal
          open={Editopen}
          onClose={EditCloseModal}
          center
        >
          <div className="popup-content">
            <div className="popup-part col-lg-6 col-md-6 col-sm-12">
              <span className="popup-Labels">Full Name</span>
              <div>
                <input
                  className="popup-input-fields popup-Fname-input"
                  type="text"
                  placeholder="Enter Full Name"
                />
              </div>
              <div className="popup-Labels ">
                <span>Phone Number</span>
              </div>
              <div>
                <input
                  className="popup-input-fields"
                  type="text"
                  placeholder="Enter Phone Number"
                />
              </div>
              <div className="popup-Labels ">
                <span>Make default</span>
              </div>
              <div>
                <input type="radio" name="make-default" />
              </div>
            </div>
            <div className="popup-part col-lg-6 col-md-6 col-sm-12">
              <div className="popup-Labels">
                <span>Province</span>
              </div>
              <div>
                <input className="popup-input-fields" type="text" placeholder="Enter your Province" />
              </div>
              <div className="popup-Labels ">
                <span>City</span>
              </div>
              <div>
                <input className="popup-input-fields" type="text" placeholder="Enter your City" />
              </div>
              <div className="popup-Labels ">
                <span>Area</span>
              </div>
              <div>
                <input className="popup-input-fields" type="text" placeholder="Enter your Area" />
              </div>
              <div className="popup-Labels ">
                <span>Address</span>
              </div>
              <div>
                <input className="popup-input-fields" type="text" placeholder="Enter your Address" />
              </div>
              <div>
                <button className="popupSaveChanges">Save Changes</button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
      {/* <br></br> <br></br> */}
      </>
      :""}
    </div>
  );
};

