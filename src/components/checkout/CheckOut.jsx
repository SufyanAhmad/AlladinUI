import './checkout.scss';
import { publicRequest } from '../../requestMethod';
import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import { useHistory, NavLink } from 'react-router-dom';
import { FetchUrl } from '../../requestMethod';
import { useDispatch } from 'react-redux';
import { cartQuantityRefresh } from '../../redux/action/index';

async function AddOrder(credentials) {
  return fetch(FetchUrl + 'Order/add-new-order-by-cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}
const CheckOut = ({ appRefresher, setAppRefresher }) => {
  const [cartSummary, setCartSummary] = useState('');
  const [orderProduct, setorderProduct] = useState([]);
  const [city, setCity] = useState();
  const [address, setAddress] = useState();
  const [allAddress, setAllAddress] = useState([]);
  const [phoneNo, setPhoneNo] = useState();
  const [firstName, setFirstName] = useState();
  const [email, setEmail] = useState();
  const [_default, setDefault] = useState('false');
  const [defaultAddress, setDefaultAddress] = useState('');
  const [_defaultAddress, _setDefaultAddress] = useState('');
  const [getCartProducts, setGetCartProducts] = useState(0);
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(true);
  const [reload, setReload] = useState([orderProduct]);
  let history = useHistory();
  let IsCurrentUser = JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser;
  useEffect(() => {
    if (IsCurrentUser != null) {
      const getCartSummary = async () => {
        try {
          const res = await publicRequest.get('Cart/get-user-Cart-products', {
            headers: {
              Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
            },
          });
          setCartSummary(res.data.data);
          setorderProduct(res.data.data.cartProduct);
        } catch {}
      };
      getCartSummary();
    } else {
      history.push('/login');
    }
  }, [reload]);
  useEffect(() => {
    if (IsCurrentUser != null) {
      const getShippingAddress = async () => {
        try {
          const res = await publicRequest.get('ShippingAddress/get-Shipping-address', {
            headers: {
              Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
            },
          });
          setAllAddress(res.data.data);
        } catch {}
      };
      getShippingAddress();
    }
  }, [reload]);
  useEffect(() => {
    if (IsCurrentUser != null) {
      const getDefaultShippingAddress = async () => {
        try {
          const res = await publicRequest.get('ShippingAddress/get-user-default-Shipping-address', {
            headers: {
              Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
            },
          });
          _setDefaultAddress(res.data.data);
        } catch {}
      };
      getDefaultShippingAddress();
    } else {
      history.push('/login');
    }
  }, [reload]);
  const handleSubmit = async (e) => {
    if (IsCurrentUser != null) {
      e.preventDefault();
      if (_default === 'True') {
        if (defaultAddress.city && defaultAddress.address && defaultAddress.phoneNo && defaultAddress.firstName) {
          const response = await AddOrder({
            comment: '',
            city: defaultAddress.city,
            address: defaultAddress.address,
            phoneNo: defaultAddress.phoneNo,
            firstName: defaultAddress.firstName,
            email: defaultAddress.email,
            shippedOnDefaultAddress: true,
          });
          if (response.status === 'Success') {
            swal('Success', response.message, 'success', {
              buttons: false,
              timer: 2000,
            }).then((value) => {
              let id = response.data.orderId;
              setRefresh(!refresh);
              dispatch(cartQuantityRefresh(refresh));
              setAppRefresher(!appRefresher);
              setReload(orderProduct);
              history.push(`/orderdetail/${id}`);
            });
          } else {
            swal('Failed', response.message, 'error');
          }
        } else {
        }
      } else {
        if (city && address && phoneNo && firstName) {
          const response = await AddOrder({
            comment: '',
            city,
            address,
            phoneNo,
            firstName,
            email,
            shippedOnDefaultAddress: false,
          });
          if ('status' in response) {
            swal('Success', response.message, 'success', {
              buttons: false,
              timer: 2000,
            }).then((value) => {
              let id = response.data.orderId;
              setRefresh(!refresh);
              dispatch(cartQuantityRefresh(refresh));
              setAppRefresher(!appRefresher);
              setReload(orderProduct);
              history.push(`/orderdetail/${id}`);
            });
          } else {
            swal('Failed', response.message, 'error');
          }
        } else {
        }
      }
    } else {
      history.push('/login');
    }
  };
  const GetDefaultAddress = (e) => {
    if (IsCurrentUser != null) {
      e.preventDefault();
      fetch(FetchUrl + 'ShippingAddress/get-user-default-Shipping-address', {
        method: 'GET',
        headers: {
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(),
      }).then((resp) => {
        resp.json().then((result) => {
          setDefaultAddress(result.data);
        });
      });
    } else {
      history.push('/login');
    }
  };
  const setAddressByRadio = (e) => {
    setFirstName(e.firstName);
    setEmail(e.email);
    setAddress(e.address);
    setCity(e.city);
    setPhoneNo(e.phoneNo);
  };
  return (
    <div className="bgColors">
      <div className="container">
        <div className="fadeInDown">
          <br></br>
          <div className="row">
            <div className="col-lg-1 col-md-1 col-sm-1"></div>
            <div className="col-lg-10 col-md-11 col-sm-11 display-cell">
              <div className="d-flex justify-content-between">
                <span className="create-account d-inline">Checkout</span>
              </div>
              <br></br>
              {cartSummary.subtotal === 0 ? (
                <>
                  <div className="d-flex justify-content-center">
                    <img className="empty-cart-img" src="./assets/AdminPannel/empty-cart1.jpg" />
                    <br></br>
                  </div>
                  <div className="d-flex justify-content-center">
                    <h3 className="mt-5">Opps your cart is empty</h3>
                  </div>
                  <div className="d-flex justify-content-center">
                    <NavLink to="/">
                      <span className="continue-shopping-text"> Continue shopping</span>
                    </NavLink>
                  </div>
                </>
              ) : (
                <div className="bgColor" style={{ height: '100%' }}>
                  <form className="row" onSubmit={handleSubmit}>
                    <div style={{backgroundColor:"white"}} className="col-xs-12 col-sm-12 col-md-12 col-lg-6 p-1">
                      <div className="billing-detail d-flex justify-content-between">
                        <span className="billing-detail">Billing Details</span>
                        {_defaultAddress !== null ? (
                          <div onChange={(e) => setDefault(e.target.value)}>
                            {_default === 'false' ? (
                              <>
                                <input type="radio" value="True" name="selectAddress" id="selectAddress" onChange={GetDefaultAddress} /> default
                              </>
                            ) : (
                              <>
                                <input type="radio" value="True" name="selectAddress" id="selectAddress" checked /> default
                              </>
                            )}
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                      <div className="d-flex row" style={{paddingLeft:"5px"}}>
                      {allAddress.length !== 0?
                        <div className="addressesBox col-md-12 col-lg-5 col-sm-12 mb-4">
                          <span style={{ fontSize: '17px' }}>Select Address</span>
                          {allAddress.map((Address, index) => (
                            <div className="selectAddress" key={index} style={index === allAddress.length - 1 ? { borderBottom: '1px solid #d3cdcd' } : {}}>
                              <div className="row">
                                <div className='col-lg-9 col-md-11 col-sm-9'>
                                  <label htmlFor={index}>
                                    {Address.address}, {Address.city}
                                  </label>
                                </div>
                                <div className='col-lg-1 col-md-1 col-sm-1'>
                                  <input
                                    style={{ float: 'right', marginTop: '7px' }}
                                    type="radio"
                                    name="selectAddress"
                                    id={index}
                                    onClick={() => {
                                      setDefaultAddress(Address);
                                      setAddressByRadio(Address);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        :""}
                        <div className={`${allAddress.length !== 0?"col-lg-7":"col-lg-12"} col-md-12 col-sm-12`}>
                          <label className="checkout-label">Name</label>
                          <br />
                          <input type="text" className="checkout-input" placeholder="Please enter your full name" required defaultValue={defaultAddress.firstName} onChange={(e) => setFirstName(e.target.value)} />
                          <label className="checkout-label">Email Address</label>
                          <br />
                          <input type="text" className="checkout-input" placeholder="Please enter your email" required defaultValue={defaultAddress.email} onChange={(e) => setEmail(e.target.value)} />
                          <label className="checkout-label">Address</label>
                          <br />
                          <input type="text" className="checkout-input" placeholder="Please enter your address" required defaultValue={defaultAddress.address} onChange={(e) => setAddress(e.target.value)} />
                          <label className="checkout-label">Town / City</label>
                          <br />
                          <input type="text" className="checkout-input" placeholder="Please enter your town / city" required defaultValue={defaultAddress.city} onChange={(e) => setCity(e.target.value)} />
                          <label className="checkout-label">Shipping Phone No</label>
                          <br />
                          <input type="text" className="checkout-input" placeholder="In case question arise" required defaultValue={defaultAddress.phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6 p-1">
                      <div className="d-flex justify-content-center your-order mt-3">Your Order</div>
                      <br></br>
                      <div className="d-flex justify-content-start mt-2 your-order"></div>
                      {orderProduct.map((order, i) => (
                        <span key={i}>
                          {/* {order.status === true ? ( */}
                            <div className="row">
                              <div className="col-4">
                                {order.image !== null?
                                  <img className="checkout-img mt-2" src={order.image} />
                                :
                                  <img className="checkout-img mt-2" src="./assets/Auth/default-img.png" />
                                }
                              </div>
                              <div className="col-8">
                                <div className="product-checkout-name mt-4">{order.productName}</div>
                                {order.discount === 0 ? <div className="product-checkout-price mt-1">Price:{order.price}</div> : <div className="product-checkout-price mt-1">Price:{Math.trunc(parseFloat(order.discount))}</div>}
                                <div className="product-checkout-price mt-1">Quantity:{order.quantity}</div>
                              </div>
                            </div>
                          {/* ) : (
                            <div></div>
                          )} */}
                        </span>
                      ))}
                      <hr className="mt-2" style={{ width: '95%', marginLeft: '10px' }} />
                      <div className="d-flex justify-content-between padding">
                        <span className="subtotal">Subtotal</span>
                        <span className="subtotal">{Math.trunc(parseFloat(cartSummary.total - cartSummary.shipping ))}</span>
                      </div>
                      <hr className="mt-2" style={{ width: '95%', marginLeft: '10px' }} />
                      <div className="d-flex justify-content-between padding">
                        <span className="subtotal">Shipping</span>
                        <span className="subtotal">{cartSummary.shipping}</span>
                      </div>
                      <hr className="mt-2" style={{ width: '95%', marginLeft: '10px' }} />
                      <div className="d-flex justify-content-between padding">
                        <span className="subtotal">Total</span>
                        <span className="subtotal">{Math.trunc(parseFloat(cartSummary.total))}</span>
                      </div>
                      <div className="d-flex justify-content-center">
                        <button className="place-order-btn" type="submit">
                          Place your order
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
            <div className="col-lg-1 col-md-1 col-sm-1"></div>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
};

export default CheckOut;
