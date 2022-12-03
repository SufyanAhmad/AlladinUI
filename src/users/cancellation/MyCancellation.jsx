import React, { Fragment, useEffect, useState } from "react";
import UsersSidebar from "../usersSidebar/UsersSidebar";
import "./myCancellation.scss";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import moment from "moment";
import { publicRequest } from "../../requestMethod";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
export default function MyCancellation() {
  const { id } = useParams();
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerOrdersError, setCustomerOrdersError] = useState("");
  const [sidebartoggle, setSidebartoggle] = useState('');

  useEffect(() => {
    setLoading(true);
    const getorders = async () => {
      try {
        const res = await publicRequest.get(`Order/get-Customer-orders/${id}`, {
          headers: {
            Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
          },
        });
        if(res.ok === false)
        {
          throw Error("Unable to get Customer Details")
        }
        setOrder(res.data.data)
        setLoading(false);
        setCustomerOrdersError("")
      } catch(err){ setCustomerOrdersError(err.message) }
    }
    getorders()
  }, [])

  const Loading = () => {
    return (
      <>
        <div className="col-md-6" style={{ lineHeight: 2 }}>
          <Skeleton height={300} />
        </div>
        <div className="col-md-6" style={{lineHeight:2}}>
          <Skeleton height={300} />
        </div>
      </>
    );
  };
  const _myCancleOrder = () => {
    return (
        <div className="row myCancellationContent">
          {/* <div className="row"> */}
            <div style={{zIndex:"3"}} className={`${sidebartoggle?"col-2":""} profileflexes`}>
              <UsersSidebar sidebartoggle={sidebartoggle}  setSidebartoggle={setSidebartoggle}/>
            </div>
            <div className={`${sidebartoggle?"col-10":"col-12"} profileflexes`}>
              <div className="manageAccount">
                <p className="accountHeading">
                  <b>Manage My Account</b>
                  {customerOrdersError && <p className="errorMessage">*{customerOrdersError}</p>}
                </p>
                <div className="ordersBody">
                  <span><b>My canceled order </b></span>
                  <div className="tableBoxMyReturn">
                  <table className="tableContent">
                    <tbody>
                      <tr className="tableRow">
                        <th className="IDcolumn tableItem">Order#</th>
                        <th className="DateColumn tableItem">Placed On</th>
                        <th className="statusColumn tableItem">Status</th>
                        <th className="ImageColumn tableItem">Items</th>
                        <th className="ImageColumn tableItem">Company</th>
                        <th className="priceColumn tableItem">Total</th>
                        <th className="manageColumn tableItem">Manage Order</th>
                      </tr>
                      {order.length === 0 ?
                        <tr>
                          <td colSpan="6">
                          <br></br>
                          <h4 className="cancel-order">
                            You have no cancelled order yet!
                          </h4>
                          </td>
                        </tr>
                        :
                        <>
                        {order.map((data) => (
                          <tr className="tableRow" key={data.orderId}>
                            {data.status === true ?
                              <>
                                <td className="tableItem">{data.orderNumberWithDate}</td>
                                <td className="tableItem">{moment(data.createAt).format("DD/MM/YYYY")}</td>
                                {data.orderStatusType === "Canceled"?<> 
                                {data.orderStatusMappingViewModels.filter((filterData) => (filterData.orderStatus === "Canceled")).length !== 0?<>
                                {data.orderStatusMappingViewModels.filter((filterData) => (filterData.orderStatus === "Canceled")).map((statusMessage,index,{length}) => {return <Fragment key={index}>
                                  {index===length-1?<>
                                  {statusMessage.orderStatus === "Canceled"?
                                    <td className="tableItem">{ statusMessage.createByRole === "Customer"? "Canceled by Customer" : statusMessage.createByRole === "Admin"?  "Canceled by System" : "Canceled by Customer" }</td>
                                    :
                                    <td className="tableItem">Canceled by Customer</td>}
                                    </>:""}
                                  </Fragment>
                                })}
                                </>
                                :<td className="tableItem">Canceled by Customer</td>}
                                </>
                                :<td className="tableItem">{data.orderStatusType}</td>}
                                <td className="tableItem">{data.phoneNo}</td>
                              </>
                              :
                              <>
                                <td className="tableItem">{data.orderNumberWithDate}</td>
                                <td className="tableItem"> {moment(data.createAt).format("DD/MM/YYYY")}</td>
                                {data.orderStatusType === "Canceled"?<> 
                                {data.orderStatusMappingViewModels.filter((filterData) => (filterData.orderStatus === "Canceled")).length !== 0?<>
                                {data.orderStatusMappingViewModels.filter((filterData) => (filterData.orderStatus === "Canceled")).map((statusMessage,index,{length}) => {return <Fragment key={index}>
                                  {index===length-1?<>
                                  {statusMessage.orderStatus === "Canceled"?
                                    <td className="tableItem">{ statusMessage.createByRole === "Customer"? "Canceled by Customer" : statusMessage.createByRole === "Admin"?  "Canceled by System" : "Canceled by Customer" }</td>
                                    :
                                    <td className="tableItem">Canceled by Customer</td>}
                                    </>:""}
                                  </Fragment>
                                })}
                                </>
                                :<td className="tableItem">Canceled by Customer</td>}
                                </>
                                :<td className="tableItem">{data.orderStatusType}</td>}
                                {data.orderDetails.length !== 0?<>
                                {data.orderDetails.slice(0, 1).map((orderData) => (
                                  <td key={orderData}>
                                    {orderData.productMediaViewModels.length !== 0?<>
                                      {orderData.productMediaViewModels.slice(0, 1).map((image,i) => (
                                              <img key={i} width="75px" height="75px" src={image.imgUrl}/>
                                      ))}
                                    </>
                                    :
                                      <img width="75px" height="75px" src="./assets/Auth/default-img.png"/>
                                    }
                                  </td>
                                ))}
                                </>
                                : 
                                  <td>
                                    <img width="75px" height="75px" src="./assets/Auth/default-img.png"/>
                                  </td> 
                                }
                                {data.shipmentCompany === null?
                                <td className="tableItem">Not Shipped</td>
                                :
                                <td className="tableItem">{data.shipmentCompany}</td>
                                }
                                <td className="tableItem">Rs.{Math.trunc(parseFloat(data.orderTotal))}</td>
                                <td className=" tableItem">
                                    <NavLink to={`/users/manage-orders/${data.orderId}`}>
                                      <button className="manageOrderButtonMyOrder">Manage</button>
                                    </NavLink>
                                </td>
                              </>
                            }
                          </tr>
                        ))}
                        </>
                        }
                    </tbody>
                  </table>
                </div>
                </div>
              </div>
            </div>
          {/* </div> */}
        </div>
       
    
    );
  }
  return (
    <div>
      <div className="">
        <div className="row">
          {loading ? <Loading /> : <_myCancleOrder />}
        </div>
      </div>
      {/* <br></br> <br></br> */}
    </div>
  );
}
