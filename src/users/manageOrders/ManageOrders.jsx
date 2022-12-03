import React, { useEffect, useState } from "react";
import "./manageOrders.scss";
import UsersSidebar from "../usersSidebar/UsersSidebar";
import { NavLink, useParams } from "react-router-dom";
import { publicRequest } from "../../requestMethod";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import moment from "moment";
export default function ManageOrders() {
  const [orderStatus, setOrderStatus] = useState("");
  const [orderDeatils, setOrderDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderDetailError, setOrderDetailError] = useState("");
  const { id } = useParams();
  const [sidebartoggle, setSidebartoggle] = useState('');

  useEffect(() => {
    setLoading(true);
    const getorders = async () => {
      try {
        const res = await publicRequest.get(`Order/get-order-detail/${id}`, {
          headers: {
            Authorization:
              "bearer " +
              JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user)
                .currentUser.token,
          },
        });
        if (res.ok === false) {
          throw Error("Unable to get Order Details");
        }
        setOrderStatus(res.data.data);
        setOrderDetail(res.data.data.orderDetails);
        setOrderDetailError("");
        setLoading(false);
      } catch (err) {
        setOrderDetailError(err.message);
      }
    };
    getorders();
  }, []);
  const Loading = () => {
    return (
      <>
        <div className="col-md-6" style={{ lineHeight: 2 }}>
          <Skeleton height={300} />
        </div>
        <div className="col-md-6" style={{ lineHeight: 2 }}>
          <Skeleton height={300} />
        </div>
      </>
    );
  };
  const _ManagemyOrder = () => {
    return (
      <div className="row manageOrdersContent">
        {/* <div className="row"> */}
          <div style={{ zIndex: "3" }} className={`${sidebartoggle?"col-2":""} profileflexes`}>
            <UsersSidebar  sidebartoggle={sidebartoggle} setSidebartoggle={setSidebartoggle}/>
          </div>
          <div className={`${sidebartoggle?"col-10":"col-12"} profileflexes`}>
            <div className="orderAccount">
              <p className="accountHeading">
                <b>
                  My order status{" "}
                  {orderDetailError && (
                    <p className="errorMessage">*{orderDetailError}</p>
                  )}
                </b>
              </p>
              <div className="manageOrdersBody">
                <div style={{ backgroundColor: "aliceblue",padding:"20px" }}>
                  <span>Order Detail</span>
                  <div className="content-box">
                    <span className="order-ID-heading">Order# </span>
                    <span>{orderStatus.orderNumberWithDate}</span>
                    {orderStatus.shipmentCompany ? (
                      <div className="companyName">
                        <span style={{ marginRight: "10px", color: "#595959" }}>
                          Company Name:
                        </span>
                        <span>{orderStatus.shipmentCompany}</span>
                      </div>
                    ) : (
                      ""
                    )}
                    {orderStatus.referenceNo ?
                    <div className="trackingID">
                      <span style={{ marginRight: "10px", color: "#595959" }}>
                        Tracking Id:
                      </span>
                      <span>{orderStatus.referenceNo}</span>
                    </div>:
                    ""}
                    <div className="totalPrice-group">
                      <span className="order-Total-heading">Total:</span>
                      <span> Rs</span>
                      <span>
                        {Math.trunc(parseFloat(orderStatus.orderTotal))}
                      </span>
                    </div>
                    {orderStatus.orderStatusType === "Canceled" ? (
                      <>
                        <br></br>
                        <h4 className="cancel-order">
                          Your order has been cancelled
                        </h4>
                      </>
                    ) : (
                      <div className="stepper-wrapper">
                        <div className="stepper-item completed">
                          <div className="step-counter"></div>
                          <div className="step-name">Processing</div>
                        </div>
                        {orderStatus.orderStatusType === "Shipped" ||
                        orderStatus.orderStatusType === "Delivered" ||
                        orderStatus.orderStatusType === "Returned" ||
                        orderStatus.orderStatusType === "FailDelivery" ? (
                          <div className="stepper-item completed">
                            <div className="step-counter"></div>
                            <div className="step-name">Shipped</div>
                          </div>
                        ) : (
                          <div className="stepper-item active">
                            <div className="step-counter"></div>
                            <div className="step-name">Shipping</div>
                          </div>
                        )}
                        {orderStatus.orderStatusType === "Delivered" ||
                        orderStatus.orderStatusType === "Returned" ||
                        orderStatus.orderStatusType === "FailDelivery" ? (
                          <div className="stepper-item completed">
                            <div className="step-counter"></div>
                            <div className="step-name">
                              {orderStatus.orderStatusType}
                            </div>
                          </div>
                        ) : (
                          <div className="stepper-item active">
                            <div className="step-counter"></div>
                            <div className="step-name">Delivered</div>
                          </div>
                        )}
                      </div>
                    )}
                    {orderDeatils.map((order) => (
                      <div className=" row manage-orders-productInfo" key={order}>
                        <div className="col-2">
                        {order.productMediaViewModels.length === 0?
                            <img
                            className="manage-orders-image"
                            src='./assets/Auth/Default-img.png'
                            />
                          :
                            <>
                              {order.productMediaViewModels
                                .slice(0, 1)
                                .map((image) => (
                                  <img
                                    key={image}
                                    className="manage-orders-image"
                                    src={image.imgUrl}
                                  />
                                ))}
                            </>
                        }
                        </div>
                        <div className=" col-5 mt-3 manage-orders-productName">
                          <span>
                            <strong>{order.productName}</strong>
                          </span>
                        </div>
                        <div className="col-1 mt-3 ">
                          <span className="order-ID-heading">Qty:</span>
                          <span>{order.quantity}</span>
                        </div>
                        {order.discountPrice === 0?
                        <div className="col-2 mt-3 productInfo-price">
                          Rs: {Math.trunc(parseFloat(order.totalPrice))}
                        </div>
                        :
                        <div className="col-2 mt-3 productInfo-price">
                          Rs: {Math.trunc(parseFloat(order.discountPrice))}
                        </div>}
                        <div className="col-2 mt-3 ">
                        {orderStatus.orderStatusType == "Delivered" ? (
                          !order.isCustomerGiveReview?
                          <button className="reviewed ">
                                Reviewed
                          </button>
                        :
                          <button className="write-review-button c-pointer">
                            <NavLink to={`/users/addreview/${order.productId}`}>
                                Write Review
                            </NavLink>
                          </button>
                        ) : (
                          ""
                        )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 trackingInfoHeading">
                  <span>Tracking Info</span>
                </div>
                {orderDeatils.map((order, index) => (
                  <div key={index} className="mt-4 tableBox">
                    <span style={{fontSize:"19px"}}><b>{order.productName}</b></span>
                    <table className="tableContent">
                      <tbody>
                        
                        <tr className="tableRow">
                          <th className="transactionTimeColumn tableItem">
                            Transaction Time
                          </th>
                          <th className="eventColumn tableItem">Event</th>
                          <th className="messageColumn tableItem">Message</th>
                        </tr>
                        {orderStatus.orderStatusMappingViewModels.map((statusMessage, index) => (
                        <tr key={index} className="tableRow">
                          {statusMessage.orderStatus === "Delivered" || "Shipped" || "ReadyToShip" || "Pending" || "Returned" || "Canceled"?<>
                          <td className="tableItem">
                            {moment(statusMessage.createAt).format(
                              "DD/MM/YYYY hh:mm:ss"
                            )}
                          </td>
                          <td className="tableItem">
                            {statusMessage.orderStatus}
                          </td>
                          {statusMessage.orderStatus === "Delivered" ? (
                            <td className="tableItem">
                              Your order has been delivered.If you need any
                              assistance please call our helpline.
                            </td>
                          ) : statusMessage.orderStatus === "Shipped" ? (
                            <td className="tableItem">
                              Your order is shipped via{" "}
                              <strong>'{orderStatus.shipmentCompany}'</strong>{" "}
                              Tracking number is{" "}
                              <strong>'{orderStatus.referenceNo}'</strong>
                            </td>
                          ) : statusMessage.orderStatus ===
                            "ReadyToShip" ? (
                            <td className="tableItem">
                              Your order is packed and ready to Ship.
                            </td>
                          ) : statusMessage.orderStatus === "Pending" ? (
                            <td className="tableItem">
                              Order is recieved, Your order number is:{" "}
                              {orderStatus.orderNumberWithDate}
                            </td>
                          ) : statusMessage.orderStatus === "Returned" ? (
                            <td className="tableItem">
                              Your order has been Returned.
                            </td>
                          ) : statusMessage.orderStatus === "Canceled" ? (
                            <td className="tableItem">
                              {statusMessage.createByRole === "Admin"?
                              "Your order has been Canceled by Admin.":statusMessage.createByRole === "Customer"? " You canceled order.":"Your Order has been Canceled."}
                            </td>
                          ) : (
                            ""
                          )}
                          </>
                          :""}
                        </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          </div>
        {/* </div> */}
      </div>
    );
  };
  return (
    <div>
      <div className="">
        <div className="row">{loading ? <Loading /> : <_ManagemyOrder />}</div>
      </div>
      {/* <br></br> <br></br> */}
    </div>
  );
}
