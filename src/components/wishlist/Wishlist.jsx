import './wishlist.scss';
import '../../App.css';
import { publicRequest } from '../../requestMethod';
import React, { useState, useEffect } from 'react';
import TopProduct from '../topProduct/TopProduct';
import { FetchUrl } from '../../requestMethod';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { useDispatch } from 'react-redux';
import { cartQuantityRefresh } from '../../redux/action/index';
import parse from 'html-react-parser';

const Wishlist = ({ appRefresher, setAppRefresher }) => {
  const [wishLists, setWishList] = useState([]);
  const [reload, setReload] = useState([wishLists]);
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(true);
  let history = useHistory();
  useEffect(() => {
    const getOrder = async () => {
      try {
        const res = await publicRequest.get('WishList/get-user-WishList-products', {
          headers: {
            Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
          },
        });
        setWishList(res.data.data);
      } catch {}
    };
    getOrder();
  }, [reload]);
  const RemoveToWishList = (data) => {
    const productId = data.productId;
    {
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
          if (result.status === 401) {
            history.push('/login');
          }
          if (result.status === 'Success') {
            swal('Success', result.message, 'success', {
              buttons: false,
              timer: 2000,
            }).then((value) => {
              setReload(wishLists);
            });
          } else {
            swal('Failed', result.message, 'error');
          }
        });
      });
    }
  };
  const AddToCart = (data) => {
    const productId = data.productId;
    fetch(FetchUrl + `Home/get-Product-quantity/${productId}`, {
      method: 'GET',
      headers: {
        Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
      },
      body: JSON.stringify(),
    }).then((resp) => {
      resp.json().then((result) => {
        if (result.status === 'Success') {
          fetch(FetchUrl + `Cart/add-to-cart/${productId}`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
            },
            body: JSON.stringify(productId),
          }).then((resp) => {
            resp.json().then((result) => {
              if (result.status === 401) {
                history.push('/login');
              }
              if (result.status === 'Success') {
                swal('Success', result.message, 'success', {
                  buttons: false,
                  timer: 2000,
                }).then((value) => {
                  setReload(wishLists);
                  setRefresh(!refresh);
                  dispatch(cartQuantityRefresh(refresh));
                  setAppRefresher(!appRefresher);
                });
              } else {
                swal('Failed', result.message, 'error');
              }
            });
          });
        } else {
          swal('Failed', result.message, 'error');
        }
      });
    });
  };
  const RemoveFromCart = (data) => {
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
          if (result.status === 401) {
            history.push('/login');
          }
          if (result.status === 'Success') {
            swal('Success', result.message, 'success', {
              buttons: false,
              timer: 2000,
            }).then((value) => {
              setReload(wishLists);
              setRefresh(!refresh);
              dispatch(cartQuantityRefresh(refresh));
              setAppRefresher(!appRefresher);
            });
          } else {
            swal('Failed', result.message, 'error');
          }
        });
      });
    }
  };
  return (
    <div className="background">
      <div className="container">
        <div className="fadeInDown">
          <br></br>
          <div className="row">
            <div className="d-flex justify-content-center mb-4">
              <span className="create-account">Wishlist</span>
            </div>
            <div className="col-lg-2 col-md-1 col-sm-1"></div>
            <div className="col-lg-8 col-md-11 col-sm-11 display-cell">
              <div className="row">
                {wishLists.map((wishList) => (
                  <div className="col-lg-6 col-md-6 col-sm-12 mt-4" key={wishList.productId}>
                    <div className="wishlist-card">
                      <div className="row">
                        <div className="col-6">
                          <div className="p-3">{wishList.image === null ? <img className="product-wish" src="./assets/Auth/Default-img.png" /> : <img className="product-wish" src={wishList.image} />}</div>
                        </div>
                        <div className="col-6">
                          <div className="mx-auto mt-3">
                            <div className="wish-product-name">
                              <span className="text-line">{wishList.productName}</span>
                            </div>
                          </div>
                          <div className="mx-auto mt-3">
                            <div className="wish-product-name">Price</div>
                            <div className="d-flex justify-content-between">
                              {wishList.discountPrice === 0 ? (
                                <div className="wish-price ">RS: {wishList.price} </div>
                              ) : (
                                <>
                                  <div className="wish-price ">RS: {wishList.discountPrice} </div>
                                  <div className="wish-product-price price wish-product-desc mt-2" style={{ marginRight: '10px' }}>
                                    <s> RS: {wishList.price}</s>
                                  </div>
                                </>
                              )}
                            </div>
                            {wishList.discountPrice === 0 ? <div className="wish-product-price"></div> : <div className="wish-product-price">RS:{wishList.price - wishList.discountPrice} off</div>}
                          </div>
                          <div className="mx-auto mt-3">
                            <div className="wish-product-name">
                              <span className="text-line">Detail</span>
                            </div>
                            <div className="wish-product-desc mt-1 text-line-wish c-pointer text-line" title={wishList.highLight}>
                              {parse(`${wishList.highLight}`)}
                            </div>
                          </div>
                          <div className=" mt-4 d-flex justify-content-between mb-4">
                            <button className="wish-product-rating" style={{ marginLeft: '10px', textAlign: 'center', width: '30px' }}>
                              {wishList.productRatting} <i className="fa fa-star" aria-hidden="true" style={{ marginLeft: '5px' }}></i>
                            </button>

                            {wishList.isInCart ? (
                              <span className="fa fa-shopping-cart bgBlue c-pointer" title="Remove from Cart" style={{ fontSize: '25px' }} onClick={() => RemoveFromCart(wishList)}></span>
                            ) : (
                              <span className="fa fa-shopping-cart c-pointer" title="Add to Cart" style={{ fontSize: '25px' }} onClick={() => AddToCart(wishList)}></span>
                            )}
                            <span className="fa fa-heart bgBlue mr-2 c-pointer" style={{ fontSize: '25px', marginRight: '6px' }} title="Remove from Wishlist" onClick={() => RemoveToWishList(wishList)}></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-2 col-md-1 col-sm-1"></div>
          </div>
          <br></br>
          <br></br>
          <TopProduct />
          <br></br>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
