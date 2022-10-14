import React, { useEffect, useState } from "react";
import UsersSidebar from "../usersSidebar/UsersSidebar";
import "./myOrders.scss";
import moment from "moment";
import { NavLink } from "react-router-dom";
import { publicRequest } from "../../requestMethod";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import {FetchUrl} from "../../requestMethod";
import swal from 'sweetalert';

 function MyOrders() {
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(userOrders);
  const [sidebartoggle, setSidebartoggle] = useState('');
  useEffect(() => {
    setLoading(true);
    const getorders = async () => {
      try {
        const res = await publicRequest.get("Order/get-customer-orders", {
          headers: {
            Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
          },
        });
        setUserOrders(res.data.data)
        setLoading(false);
      } catch { }
    }
    getorders()
  }, [reload])
  
  const CancelOrderStatus  = (orderId)=>{
      fetch(FetchUrl+`Order/update-order-status-to-cancel/${orderId}`, {
        method: "put",
        headers: {
         'Content-Type': 'application/json',
          Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
        },
        body:JSON.stringify(orderId)
      }).then((resp)=>{
        resp.json().then((result)=>{
          if (result.status === "Success") {
            swal("Success", result.message, "success", {
              buttons: false,
              timer: 2000,
            })
            .then((value) => {
              setReload(userOrders)
            });
          }else{
            swal("Failed", result.message, "error");
          }
        })
      })
   }
  const Loading = () => {
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
  const _myOrder = () => {
  return (
    <>
      <div className="row myOrdersContent">
          <div style={{zIndex:"3"}} className={`${sidebartoggle?"col-2":""} profileflexes`}>
            <UsersSidebar sidebartoggle={sidebartoggle} setSidebartoggle={setSidebartoggle}/>
          </div>
          <div className={`${sidebartoggle?"col-10":"col-12"} profileflexes`}>
            <div className="manageAccount">
              <p className="accountHeading">
                <b>Manage My Account</b>
              </p>
              <div className="ordersBody">
                <span><b>Recent Order</b></span>
                <div className="tableBoxBoddy">
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
                        <th className="cancelOrderColumn tableItem">Cancel Order</th>
                      </tr>
                        {userOrders.map((data) => (
                          <tr className="tableRow" key={data.orderId}>
                            {data.status === true ?
                              <>
                                <td className="tableItem">{data.orderNo}</td>
                                <td className="tableItem">{moment(data.createAt).format("DD/MM/YYYY")}</td>
                                {data.orderStatusType === "Canceled"?<> 
                                {data.orderStatusMappingViewModels.filter((filterData) => (filterData.orderStatus === "Canceled")).length !== 0?<>
                                {data.orderStatusMappingViewModels.filter((filterData) => (filterData.orderStatus === "Canceled")).map((statusMessage,index,{length}) => {return <>
                                  {index===length-1?<>
                                  {statusMessage.orderStatus === "Canceled"?
                                    <td className="tableItem">{ statusMessage.createByRole === "Customer"? "Canceled by Customer" : statusMessage.createByRole === "Admin"?  "Canceled by System" : "Canceled by Customer" }</td>
                                    :
                                    <td className="tableItem">Canceled by Customer</td>}
                                    </>:""}
                                  </>
                                })}
                                </>
                                :<td className="tableItem">Canceled by Customer</td>}
                                </>
                                :<td className="tableItem">{data.orderStatusType}</td>}
                                <td className="tableItem">{data.phoneNo}</td>
                                <td className="cancelOrderColumn tableItem">cancel</td>
                              </>
                              :
                              <>
                                <td className="tableItem">{data.orderNo}</td>
                                <td className="tableItem"> {moment(data.createAt).format("DD/MM/YYYY")}</td>
                                {data.orderStatusType === "Canceled"?<> 
                                {data.orderStatusMappingViewModels.filter((filterData) => (filterData.orderStatus === "Canceled")).length !== 0?<>
                                {data.orderStatusMappingViewModels.filter((filterData) => (filterData.orderStatus === "Canceled")).map((statusMessage,index,{length}) => {return <>
                                  {index===length-1?<>
                                  {statusMessage.orderStatus === "Canceled"?
                                    <td className="tableItem">{ statusMessage.createByRole === "Customer"? "Canceled by Customer" : statusMessage.createByRole === "Admin"?  "Canceled by System" : "Canceled by Customer" }</td>
                                    :
                                    <td className="tableItem">Canceled by Customer</td>}
                                    </>:""}
                                  </>
                                })}
                                </>
                                :<td className="tableItem">Canceled by Customer</td>}
                                </>
                                :<td className="tableItem">{data.orderStatusType}</td>}
                                {data.orderDetails.length !== 0?<>
                                  {data.orderDetails.slice(0, 1).map((orderData,i) => (
                                    <td  key={i}>
                                      <span className="col-md-4 ">
                                        {orderData.productMediaViewModels.length !== 0?<>
                                        {orderData.productMediaViewModels.slice(0, 1).map((image,j) => (
                                                  <img key={j} width="75px" height="75px" src={image.imgUrl}/>
                                              ))}
                                              </>
                                              :
                                              <img width="75px" height="75px" src="./assets/Auth/default-img.png"/>
                                              }
                                      </span>
                                    </td>
                                  ))}
                                </>
                                :
                                  <td>
                                    <span className="col-md-4 ">
                                                <img width="75px" height="75px" src="./assets/Auth/default-img.png"/>
                                    </span>
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
                                {data.orderStatusType === "Pending" ?
                                 <td className="tableItem c-pointer" onClick={() => CancelOrderStatus(data.orderId)}>Cancel</td>
                                 :
                                 data.orderStatusType === "Delivered" ?
                                 <td className="tableItem">
                                  {data.orderDetails.slice(0, 1).map((orderData,i) => (
                                    <>
                                    {orderData.isCustomerGiveReview === true?
                                    <span>Completed</span>
                                    :
                                  <NavLink to={`/users/addreview/${orderData.productId}`}>
                                    <button className="manageOrderButtonMyOrder">Review</button>
                                  </NavLink>
                                  }
                                  </>
                                 ))}
                                 </td>
                                 :
                                 <></>
                                }
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
    </>
  );
}
return (
  <div>
    <div>
      <div className="row">
        {loading ? <Loading /> : <_myOrder />}
      </div>
    </div>
    {/* <br></br> <br></br> */}
  </div>
   );
}
export default MyOrders;