import { NavLink } from "react-router-dom";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { publicRequest } from "../../requestMethod"
import UsersSidebar from "../usersSidebar/UsersSidebar";
import "./myReturns.scss";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
export default function MyReturns() {

  const { id } = useParams();
  const [order, setOrder] = useState([]);
  const [orderDetail, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(false);
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

        setOrder(res.data.data)
        setLoading(false);
      } catch { }
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
  const _myReturnOrder = () => {
    return (
      <>
        <div className="row ordersContent">
          {/* <div className="row"> */}
            <div style={{zIndex:"3"}} className={`${sidebartoggle?"col-2":""} profileflexes`}>
              <UsersSidebar sidebartoggle={sidebartoggle} setSidebartoggle={setSidebartoggle}/>
            </div>
            <div className={`${sidebartoggle?"col-10":"12"} profileflexes`}>
              <div className="manageAccount">
                <p className="accountHeading">
                  <b>Manage My Account</b>
                </p>
                <div className="ordersBody">
                  <span><b>My returnd order </b></span>
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
                            <h4 className="cancel-order">You have no returned order yet!</h4>
                          </td>
                        </tr>:<>
                        {order.map((data) => (
                          <tr className="tableRow" key={data.orderId}>
                            {data.status === true ?
                              <>
                                <td className="tableItem">{data.orderNumberWithDate}</td>
                                <td className="tableItem">{moment(data.createAt).format("DD/MM/YYYY")}</td>
                                <td className="tableItem">{data.orderStatusType}</td>
                                <td className="tableItem">{data.phoneNo}</td>
                              </>
                              :
                              <>
                                <td className="tableItem">{data.orderNumberWithDate}</td>
                                <td className="tableItem"> {moment(data.createAt).format("DD/MM/YYYY")}</td>
                                <td className="tableItem">{data.orderStatusType}</td>
                                {data.orderDetails.length !== 0?<>
                                {data.orderDetails.slice(0, 1).map((orderData) => (
                                  <td key={orderData}>
                                    <span  className="col-md-4 ">
                                      {orderData.productMediaViewModels.length !== 0?<>
                                        {orderData.productMediaViewModels.slice(0, 1).map((image,i) => (
                                                <img key={i} width="75px" height="75px" src={image.imgUrl}/>
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
                                    <span  className="col-md-4 ">
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
      </>
    );
  }
  return (
    <div>
      <div className="">
        <div className="row">
          {loading ? <Loading /> : <_myReturnOrder />}
        </div>
      </div>
      {/* <br></br> <br></br> */}
    </div>
  );
}
