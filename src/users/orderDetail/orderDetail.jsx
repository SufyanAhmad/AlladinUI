import React, { useEffect, useState } from 'react';
import UsersSidebar from '../usersSidebar/UsersSidebar';
import './orderdetail.scss';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { publicRequest } from '../../requestMethod';
export default function MyOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState([]);
  const [orderDetail, setOrderDetails] = useState([]);
  const [sidebartoggle, setSidebartoggle] = useState('');

  useEffect(() => {
    const getOrderDetail = async () => {
      const res = await publicRequest.get(`Order/get-order-detail/${id}`, {
        headers: {
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
      });
      setOrderDetails(res.data.data.orderDetails);
    };
    getOrderDetail();
  }, []);
  useEffect(() => {
    const getOrder = async () => {
      const res = await publicRequest.get(`Order/get-order-detail/${id}`, {
        headers: {
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
      });
      setOrder(res.data.data);
    };
    getOrder();
  }, []);
  return (
    <>
      <div className=" ordersContent">
        <div className="row">
          <div style={{ zIndex: '3' }} className={`${sidebartoggle?"col-2":""} profileflexes`}>
            <UsersSidebar sidebartoggle={sidebartoggle} setSidebartoggle={setSidebartoggle}/>
          </div>
          <div className={`${sidebartoggle?"col-10":"col-12"} profileflexes`}>
            <div className="manageAccount">
              <p className="accountHeading">
                <b>Manage My Account</b>{' '}
              </p>
              <div className="ordersBody">
                <span>Recent Order</span>
                <div className="order">
                  <span className="orderID">Order# {order.orderNumberWithDate}</span>

                  {orderDetail.map((orderData, i) => (
                    <div key={i} className="row d-flex border">
                      {order.orderStatusId !== 7 ? (
                        ''
                      ) : (
                        <div className=" row d-flex   mt-4 pull-right">
                          <NavLink to={`/users/addreview/${orderData.productId}`}>
                            <button className="manageOrderButton pull-right">Add Review</button>
                          </NavLink>
                        </div>
                      )}
                      {orderData.productMediaViewModels[0] === null ? (
                        <>
                          <hr />
                          <div className="col-md-2 mb-2" style={{ width: '100px' }}>
                            <img className="orderImage" src="./assets/Auth/Default-img.png" />
                          </div>
                          <div className="col-md-2 mt-4" style={{ width: '200px' }}>
                            <p className="orderDetail">{orderData.productName}</p>
                          </div>
                          <div className=" col-md-2 mt-4" style={{ width: '150px' }}>
                            <span className=" orderDetail">Qty: {orderData.quantity} </span>
                          </div>
                          <div className="col-md-2 mt-4" style={{ width: '100px' }}>
                            <p className="orderDetail deliveryDate"> {order.orderStatusType}</p>
                          </div>
                          {orderData.discountPrice === 0 ? (
                            <div className="col-md-2 mt-4" style={{ width: '150px' }}>
                              <p className="orderDetail deliveryDate">Rs. {orderData.totalPrice}</p>
                            </div>
                          ) : (
                            <div className="col-md-2 mt-4" style={{ width: '150px' }}>
                              <p className="orderDetail deliveryDate">Rs. {Math.trunc(orderData.discountPrice)}</p>
                            </div>
                          )}
                          <div className="col-md-2 mt-2" style={{ width: '250px' }}>
                            <p className="orderDetail deliveryDate">Delivered on </p>
                            <br />
                            <span> {moment(order.deliveryDatetime).format('DD/MM/YYYY')}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <hr />
                          {orderData.productMediaViewModels.length !== 0?<>
                            {orderData.productMediaViewModels.slice(0, 1).map((image, index) => (
                              <div key={index} className="col-md-2 mb-2" style={{ width: '100px' }}>
                                <img className="orderImage" src={image.imgUrl} />
                              </div>
                            ))}
                          </>
                          :
                          <div className="col-md-2 mb-2" style={{ width: '100px' }}>
                            <img className="orderImage" src="./assets/Auth/default-img.png" />
                          </div>
                          }
                          <div className="col-md-2 mt-4" style={{ width: '200px' }}>
                            <p className="orderDetail">{orderData.productName}</p>
                          </div>
                          <div className=" col-md-2 mt-4" style={{ width: '150px' }}>
                            <span className=" orderDetail">Qty: {orderData.quantity} </span>
                          </div>
                          <div className="col-md-2 mt-4" style={{ width: '100px' }}>
                            <p className="orderDetail deliveryDate"> {order.orderStatusType}</p>
                          </div>

                          {orderData.discountPrice !== 0 ? (
                            <div className="col-md-2 mt-4" style={{ width: '150px' }}>
                              <p className="orderDetail deliveryDate">Rs. {Math.trunc(orderData.discountPrice)}</p>
                            </div>
                          ) : (
                            <div className="col-md-2 mt-4" style={{ width: '150px' }}>
                              <p className="orderDetail deliveryDate">Rs. {orderData.totalPrice}</p>
                            </div>
                          )}
                          <div className="col-md-2 mt-2" style={{ width: '250px' }}>
                            <p className="orderDetail deliveryDate">Delivered on </p>
                            <br />
                            <span> {moment(order.deliveryDatetime).format('DD/MM/YYYY')}</span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
