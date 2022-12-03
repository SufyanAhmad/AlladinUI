import '../../App.css';
import TopProduct from '../topProduct/TopProduct';
import React, { useState, useEffect } from 'react';
import './module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { addCart, delCart } from '../../redux/action';
import { publicRequest } from '../../requestMethod';
import { FetchUrl } from '../../requestMethod';
import swal from 'sweetalert';
import { cartQuantityRefresh } from '../../redux/action/index';

const Carts = ({ appRefresher, setAppRefresher }) => {
  // const state = useSelector((state) => state.handleCart);
  // const quantity = useSelector(state=>state.cart.quantity)
  const dispatch = useDispatch();
  const [orders, setOrder] = useState([]);
  const [getCartProducts, setGetCartProducts] = useState();
  const [cartSummary, setCartSummary] = useState('');
  const [quantities, setQuantity] = useState();
  const [reload, setReload] = useState([orders]);
  const [refresh, setRefresh] = useState(true);
  const [spinner, setSpinner] = useState(false)
  let refreshCart = useSelector((state) => state.refresh);
  let history = useHistory();
  const handleAdd = (item) => {
    dispatch(addCart(item));
  };
  const handleDel = (item) => {
    dispatch(delCart(item));
  };
  const handleQuantity = (type) => {
    if (type === 'dec') {
      quantities > 1 && setQuantity(quantities - 1);
    } else {
      setQuantity(quantities + 1);
    }
  };
  const length = orders.length;
  useEffect(() => {
    const getCartSummary = async () => {
      try {
        const res = await publicRequest.get('Cart/get-user-Cart-products', {
          headers: {
            Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
          },
        });
        setCartSummary(res.data.data);
        setOrder(res.data.data.cartProduct);
      } catch {}
    };
    getCartSummary();
  }, [refresh, appRefresher, getCartProducts, reload, refreshCart]);
  // let checkProduct = orders.filter((item) => item.status === true);
  let cartProduct = orders.length;
  const AddToCart = (data) => {
    setSpinner(true)
    const productId = data.productId;
    {
      fetch(FetchUrl + `Cart/add-to-cart/${productId}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(data),
      }).then((resp) => {
        resp.json().then((result) => {
          setSpinner(false)
          if (result.status === 'Success') {
            setRefresh(!refresh);
            dispatch(cartQuantityRefresh(refresh));
            // setGetCartProducts(getCartProducts+1)
            setAppRefresher(!appRefresher);
          }
        });
      });
    }
  };

  const RemoveToCart = (data) => {
    setSpinner(true)
    const productId = data.productId;
    {
      fetch(FetchUrl + `Cart/remove-from-cart/${productId}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(productId),
      }).then((resp) => {
        resp.json().then((result) => {
          setSpinner(false)
          if (result.status === 'Success') {
            setRefresh(!refresh);
            dispatch(cartQuantityRefresh(refresh));
            // setGetCartProducts(getCartProducts+1)
            setAppRefresher(!appRefresher);
          }
        });
      });
    }
  };
  const DeleteProductIntoCart = (data) => {
    const cartID = data.cartId;
    fetch(FetchUrl + `Cart/delete-product-from-cart/${cartID}`, {
      method: 'Delete',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
      },
      body: JSON.stringify(cartID),
    }).then((resp) => {
      resp.json().then((result) => {
        if (result.status === 'Success') {
          swal('Success', result.message, 'success', {
            buttons: false,
            timer: 2000,
          }).then((value) => {
            setRefresh(!refresh);
            dispatch(cartQuantityRefresh(refresh));
            // setGetCartProducts(getCartProducts+1)
            setAppRefresher(!appRefresher);
          });
        } else {
          swal('Failed', result.message, 'error');
        }
      });
    });
  };
  const AddAndRemoveCart = (data) => {
    const productId = data.productId;
    {
      fetch(FetchUrl + `Cart/update-cart-product-status/${productId}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(productId),
      }).then((resp) => {
        resp.json().then((result) => {
          if (result.status === 'Success') {
            setRefresh(!refresh);
            dispatch(cartQuantityRefresh(refresh));
            // setGetCartProducts(getCartProducts+1)
            setAppRefresher(!appRefresher);
          }
        });
      });
    }
  };
  const AddToWishList = (data) => {
    const productId = data.productId;
    {
      fetch(FetchUrl + `WishList/add-to-WishList/${productId}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(productId),
      }).then((resp) => {
        resp.json().then((result) => {
          if (result.status === 'Success') {
            swal('Success', result.message, 'success', {
              buttons: false,
              timer: 2000,
            }).then((value) => {
              setReload(orders);
            });
          } else {
            swal('Failed', result.message, 'error');
          }
        });
      });
    }
  };
  const RemoveToWishList = (data) => {
    const productId = data.productId;
    fetch(FetchUrl + `WishList/remove-from-WishList/${productId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
      },
      body: JSON.stringify(productId),
    }).then((resp) => {
      resp.json().then((result) => {
        if (result.status === 'Success') {
          swal('Success', result.message, 'success', {
            buttons: false,
            timer: 2000,
          }).then((value) => {
            setReload(orders);
          });
        } else {
          swal('Failed', result.message, 'error');
        }
      });
    });
  };
  const emptyCart = () => {
    return (
      <>
        <div className="card-background" style={{ height: '100vh' }}>
          <div className="container">
            <div className="d-flex justify-content-center">
              <h1 className="mt-5">Your cart is empty</h1>
            </div>
            <br></br>
            <br></br>
            <div className="d-flex justify-content-center">
              <NavLink to="/">
                <button className="mt-5 conti-shop-btn">Continue shopping</button>
              </NavLink>
            </div>
          </div>
        </div>
      </>
    );
  };
  const cartItems = () => {
    return (
      <div className="backgrounds">
        <div className="container">
          <div className="row">
            <div className="d-flex justify-content-center cart-name">
              <span className="mt-4">Cart</span>
            </div>
            <div className="col-lg-8 col-md-8 col-sm-12">
              <div className="cart-card p-4 mt-4">
                <div className="cart-title">Shopping Cart ({cartProduct})</div>
                <hr />
                {orders.map((order) => (
                  <div className="row mt-4" key={order.cartId}>
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="d-flex justify-content-start">
                        {order.image === null ? <img className="product-img" src="./assets/Auth/Default-img.png" /> : <img className="cart-product-img mt-3" src={order.image} />}
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="d-flex justify-content-start mt-3">
                        <div className="cart-product-name text-line">{order.productName}</div>
                      </div>
                      <div className="cart-product-detail mt-3">Price</div>
                      {order.discount === 0?
                      <div className="cart-product-price mt-1">{Math.trunc(parseFloat(order.totalPrice / order.quantity))}</div>
                      :
                      <div className="cart-product-price mt-1">{Math.trunc(parseFloat(order.discount / order.quantity))}</div>}
                      <div className="cart-product-detail mt-3">Detail</div>
                      <div className="cart-product-desc mt-1 text-line" title={order.highLight}>
                        {order.highLight}
                      </div>
                      <div className="d-flex justify-content-center cart-product-qty mt-2">Quantity</div>
                      <div className="d-flex justify-content-center mt-3">
                        {order.isInWishList === true ? (
                          <span className="fa fa-heart bgBlue cartdelete ml-3 c-pointer" style={{ marginLeft: '15px', fontSize: '25px' }} title="Remove from Wishlist" onClick={() => RemoveToWishList(order)}></span>
                        ) : (
                          <span className="fa fa-heart cartdelete ml-3 c-pointer" style={{ marginLeft: '15px', fontSize: '25px' }} title="Add to WishList" onClick={() => AddToWishList(order)}></span>
                        )}
                        <button className="btn btn-outline-dark me-1 d-inline quantiy-decrease" onClick={() => RemoveToCart(order)}>
                          {spinner?
                            <i style={{color:"#23334C"}} className="fa fa-spinner ml-4 fa-spin"></i>
                            :
                            <i className="fa fa-minus"></i>
                          }
                        </button>
                        <button className="qty-count">{order.quantity}</button>
                        {order.quantity !== order.availableStock && order.quantity < order.availableStock ? (
                          <button className="btn btn-outline-dark d-inline quantiy-increase" onClick={() => AddToCart(order)}>
                            {spinner?
                              <i style={{color:"#23334C"}} className="fa fa-spinner ml-4 fa-spin"></i>
                              :
                              <i className="fa fa-plus"></i>
                            }
                          </button>
                        ) : (
                          <button className="btn btn-outline-dark d-inline quantiy-increase" disabled>
                            <i className="fa fa-plus"></i>
                          </button>
                        )}

                        <div className="fa fa-trash bgBlue cartdelete ml-3 c-pointer" style={{ height: '23px', marginLeft: '15px', fontSize: '25px' }} title="Delete from cart" onClick={() => DeleteProductIntoCart(order)}></div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12 col-sm-12">
                      <div className="d-flex justify-content-center total-price">Total Price</div>
                      {order.discount === 0?
                        <div className="d-flex justify-content-center price-count mt-1">{Math.trunc(order.totalPrice)}</div>
                      :
                        <div className="d-flex justify-content-center price-count mt-1">{Math.trunc(order.discount)}</div>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
              <div className="cart-card p-4 mt-4">
                <div className="d-flex justify-content-center cart-summary">Cart summary</div>
                <div className="d-flex justify-content-between cart-subtotal mt-4">
                  <div className="Subtotal">Subtotal</div>
                  {cartSummary.discountPrice === 0?
                    <div className="Subtotal">{Math.trunc(parseFloat(cartSummary.subtotal))}</div>
                  :
                    <div className="Subtotal">{Math.trunc(parseFloat(cartSummary.discountPrice))}</div>}
                </div>
                <div className="d-flex justify-content-between cart-subtotal mt-4">
                  <div className="Subtotal">Shipping</div>
                  <div className="Subtotal">{cartSummary.shipping}</div>
                </div>
                <hr className="mt-4" />
                <div className="d-flex justify-content-between cart-total mt-4">
                  <div className="Total">Total</div>
                  <div className="Total">{Math.trunc(parseFloat(cartSummary.total))}</div>
                </div>
                <div className="d-flex justify-content-center  mt-5">
                  {cartSummary.total===0?
                  <button disabled className="disabled-btn">Proceed to checkout</button>
                  :
                  <NavLink to="/checkout">
                    <button className="button-cart-checkout">Proceed to checkout</button>
                  </NavLink>
                  }
                 
                </div>
              </div>
            </div>
          </div>
          <br></br>
          <br></br>
          <TopProduct appRefresher={appRefresher} setAppRefresher={setAppRefresher} />
          <br></br>
          <br></br>
        </div>
      </div>
    );
  };
  return (
    <div>
      {length.length === 0 && emptyCart()}
      {length.length !== 0 && cartItems()}
    </div>
  );
};

export default Carts;
