import './topProduct.scss';
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import { publicRequest } from '../../requestMethod';
import { FetchUrl } from '../../requestMethod';
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert';
import { cartQuantityRefresh } from '../../redux/action/index';
import parse from 'html-react-parser';

const TopProduct = ({ appRefresher, setAppRefresher }) => {
  const [data, setData] = useState([]);
  const [topProduct, setTopProduct] = useState(data);
  const [papularProduct, setPapularProduct] = useState(data);
  const [loading, setLoading] = useState(false);
  const [Editopen, setEditOpen] = useState(false);
  const EditOpenModal = () => setEditOpen(true);
  const EditCloseModal = () => setEditOpen(false);
  const [productDetail, setProductDetail] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [reload, setReload] = useState([topProduct, papularProduct]);
  let history = useHistory();
  let user = useSelector((state) => state.user.currentUser);
  let refresher = useSelector((state) => state.refresh);
  const componentMounted = useRef(true);
  const arrivalProductMounted = useRef(true);
  const popularProductMounted = useRef(true);
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(true);
  useEffect(() => {
    if (user == null) {
      setLoading(true);
      fetch(FetchUrl + 'Home/get-new-arrival-products?getTopProducts=' + true).then((result) => {
        if (componentMounted.current) {
          result.json().then((resp) => {
            setTopProduct(resp.data);
            setLoading(false);
          });
        }
      });
      return () => {
        componentMounted.current = false;
      };
    } else {
      setLoading(true);
      fetch(FetchUrl + 'Home/get-new-arrival-products?getTopProducts=' + true, {
        headers: {
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
      }).then((result) => {
        if (arrivalProductMounted.current) {
          result.json().then((resp) => {
            setTopProduct(resp.data);
            setLoading(false);
          });
        }
      });
      return () => {
        arrivalProductMounted.current = false;
      };
    }
  }, [refresher, reload]);
  useEffect(() => {
    if (user == null) {
      setLoading(true);
      fetch(FetchUrl + 'Home/get-papular-products?getTopProducts=' + true).then((result) => {
        if (popularProductMounted.current) {
          result.json().then((resp) => {
            setPapularProduct(resp.data);
            setLoading(false);
          });
        }
      });
      return () => {
        popularProductMounted.current = false;
      };
    } else {
      setLoading(true);
      fetch(FetchUrl + 'Home/get-papular-products?getTopProducts=' + true, {
        headers: {
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
      }).then((result) => {
        if (popularProductMounted.current) {
          result.json().then((resp) => {
            setPapularProduct(resp.data);
            setLoading(false);
          });
        }
      });
      return () => {
        popularProductMounted.current = false;
      };
    }
  }, [refresher, reload]);
  const AddToWishList = (data) => {
    const productId = data.productId;
    if (user !== null) {
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
          if (result.status == 401) {
            history.push('/login');
          }
          if (result.status === 'Success') {
            swal('Success', result.message, 'success', {
              buttons: false,
              timer: 2000,
            }).then((value) => {
              setReload(topProduct, papularProduct);
            });
          } else {
            swal('Failed', result.message, 'error');
          }
        });
      });
    } else {
      history.push('/login');
    }
  };
  const RemoveToWishList = (data) => {
    const productId = data.productId;
    if (user !== null) {
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
          if (result.status == 401) {
            history.push('/login');
          }
          if (result.status === 'Success') {
            swal('Success', result.message, 'success', {
              buttons: false,
              timer: 2000,
            }).then((value) => {
              setReload(topProduct, papularProduct);
            });
          } else {
            swal('Failed', result.message, 'error');
          }
        });
      });
    } else {
      history.push('/login');
    }
  };
  const AddToCart = (data) => {
    const productId = data.productId;
    if (user !== null) {
      fetch(FetchUrl + `Home/get-Product-quantity/${productId}`, {
        method: 'GET',
        headers: {
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(),
      }).then((resp) => {
        resp.json().then((result) => {
          if (result.status == 'Success') {
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
                setAppRefresher(!appRefresher);
                if (result.status == 401) {
                  history.push('/login');
                }
                if (result.status === 'Success') {
                  swal('Success', result.message, 'success', {
                    buttons: false,
                    timer: 2000,
                  }).then((value) => {
                    setReload(topProduct, papularProduct);
                    setRefresh(!refresh);
                    dispatch(cartQuantityRefresh(refresh));
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
    } else {
      history.push('/login');
    }
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
          if (result.status == 401) {
            history.push('/login');
          }
          if (result.status === 'Success') {
            swal('Success', result.message, 'success', {
              buttons: false,
              timer: 2000,
            }).then((value) => {
              setReload(topProduct, papularProduct);
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
  const getProductDetail = (data) => {
    const getProductDetail = async () => {
      try {
        const res = await publicRequest.get(`/Home/get-product/${data}`);
        setProductDetail(res.data.data.productMedias);
        setProductDetails(res.data.data);
      } catch {}
    };
    getProductDetail();
  };
  return (
    <div>
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className="super-deals">
            <div className="row">
              <div className="deal-content">
                <p className="d-inline deal-text">New arrivals </p>
                <button className="d-inline view-more">
                  <NavLink to={`/productList/${2}`}>View more </NavLink>
                </button>
              </div>
              <div className={`topProduct-content ${window.innerWidth >= 768 ?"row":""}`}>
              {topProduct.map((product) => (
                <div className="col-lg-4 col-md-6 col-sm-4 " key={product.productId}>
                  <div className="topProduct-card">
                    {product.productMedias[0] == null ? (
                      <span style={{ diplay: 'block', width: '100%' }}>
                        <NavLink style={{ width: '100%' }} to={`/product/view/${product.productId}`}>
                          <img className="top-product-img" src="./assets/Auth/Default-img.png" alt="Image" />
                        </NavLink>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                          <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                            <li className="top-icon" onClick={() => getProductDetail(product.productId)}>
                              <span className="fa fa-eye" onClick={() => EditOpenModal(product.productId)}></span>
                            </li>
                            <li className="top-icon mid-icon">
                              {product.isInWishList ? <span className="fa fa-heart bgBlue" title="Remove from Wishlist" onClick={() => RemoveToWishList(product)}></span> : <span className="fa fa-heart" title="Add to WishList" onClick={() => AddToWishList(product)}></span>}
                            </li>
                            <li className="top-icon">{product.isInCart ? <span className="fa fa-shopping-cart bgBlue" title="Remove from Cart" onClick={() => RemoveFromCart(product)}></span> : <span className="fa fa-shopping-cart" title="Add to Cart" onClick={() => AddToCart(product)}></span>}</li>
                          </ul>
                        </div>
                      </span>
                    ) : (
                      <>
                        <span style={{ diplay: 'block', width: '100%' }}>
                          {product.productMedias.length !== 0 ? (
                            <>
                              {product.productMedias.slice(0, 1).map((img) => (
                                  <NavLink style={{ width: '100%' }} key={img} to={`/product/view/${product.productId}`}>
                                    <img className="top-product-img" src={img.imgUrl} alt="Image" />
                                  </NavLink>
                              ))}
                            </>
                          ) : (
                            <NavLink style={{ width: '100%' }} to={`/product/view/${product.productId}`}>
                              <img className="top-product-img" src="./assets/Auth/default-img.png" alt="Image" />
                            </NavLink>
                          )}
                          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                              <li className="top-icon" onClick={() => getProductDetail(product.productId)}>
                                <span className="fa fa-eye" onClick={() => EditOpenModal(product.productId)}></span>
                              </li>
                              <li className="top-icon mid-icon">
                                {product.isInWishList ? <span className="fa fa-heart bgBlue" title="Remove from Wishlist" onClick={() => RemoveToWishList(product)}></span> : <span className="fa fa-heart" title="Add to WishList" onClick={() => AddToWishList(product)}></span>}
                              </li>
                              <li className="top-icon">
                                {product.isInCart ? <span className="fa fa-shopping-cart bgBlue" title="Remove from Cart" onClick={() => RemoveFromCart(product)}></span> : <span className="fa fa-shopping-cart" title="Add to Cart" onClick={() => AddToCart(product)}></span>}
                              </li>
                            </ul>
                          </div>
                        </span>
                      </>
                    )}
                    <div className="d-inline">
                      <p className="arrival-product-name d-inline">
                        <span className="text-line ml-2">{product.productName}</span>
                      </p>

                      {product.discountPrice === 0 ? (
                        <div className="d-inline">
                          <p className="product-price d-inline">RS: {product.price}</p>
                        </div>
                      ) : (
                        <div className="d-inline">
                          <p className="product-price d-inline">RS:{product.discountPrice}</p>
                          {/* <p className="product-price-org d-inline">PKR: {product.price}</p> */}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className="super-deals">
            <div className="row">
              <div className="deal-content">
                <p className="d-inline deal-text">Top Selection</p>
                <button className="d-inline view-more ">
                  <NavLink to={`/productList/${3}`}>View more </NavLink>
                </button>
              </div>
              <div className={`topProduct-content ${window.innerWidth >= 768 ?"row":""}`}>
              {papularProduct.map((pProduct) => (
                <div className="col-lg-4 col-md-6 col-sm-4" key={pProduct.productId}>
                  <div className="topProduct-card">
                    {pProduct.productMedias[0] == null ? (
                      <span style={{ diplay: 'block', width: '100%' }}>
                        <NavLink style={{ width: '100%' }} to={`/product/view/${pProduct.productId}`}>
                          <img className="top-product-img" src="./assets/Auth/Default-img.png" alt="Image" />
                        </NavLink>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                          <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                            <li className="top-icon" onClick={() => getProductDetail(pProduct.productId)}>
                              <span className="fa fa-eye" onClick={() => EditOpenModal(pProduct.productId)}></span>
                            </li>
                            <li className="top-icon mid-icon">
                              {pProduct.isInWishList ? <span className="fa fa-heart bgBlue" title="Remove from Wishlist" onClick={() => RemoveToWishList(pProduct)}></span> : <span className="fa fa-heart" title="Add to WishList" onClick={() => AddToWishList(pProduct)}></span>}
                            </li>
                            <li className="top-icon">
                              {pProduct.isInCart ? <span className="fa fa-shopping-cart bgBlue" title="Remove from Cart" onClick={() => RemoveFromCart(pProduct)}></span> : <span className="fa fa-shopping-cart" title="Add to Cart" onClick={() => AddToCart(pProduct)}></span>}
                            </li>
                          </ul>
                        </div>
                      </span>
                    ) : (
                      <>
                        <span style={{ diplay: 'block', width: '100%' }}>
                          {pProduct.productMedias.length !== 0 ? (
                            <>
                              {pProduct.productMedias.slice(0, 1).map((img) => (
                                <NavLink style={{ width: '100%' }} key={img} to={`/product/view/${pProduct.productId}`}>
                                  <img className="top-product-img" src={img.imgUrl} alt="Image" />
                                </NavLink>
                              ))}
                            </>
                          ) : (
                            <NavLink style={{ width: '100%' }} to={`/product/view/${pProduct.productId}`}>
                              <img className="top-product-img" src="./assets/Auth/default-img.png" alt="Image" />
                            </NavLink>
                          )}
                        </span>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                          <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                            <li className="top-icon" onClick={() => getProductDetail(pProduct.productId)}>
                              <span className="fa fa-eye" onClick={() => EditOpenModal(pProduct.productId)}></span>
                            </li>
                            <li className="top-icon mid-icon">
                              {pProduct.isInWishList ? <span className="fa fa-heart bgBlue" title="Remove from Wishlist" onClick={() => RemoveToWishList(pProduct)}></span> : <span className="fa fa-heart" title="Add to WishList" onClick={() => AddToWishList(pProduct)}></span>}
                            </li>
                            <li className="top-icon">
                              {pProduct.isInCart ? <span className="fa fa-shopping-cart bgBlue" title="Remove from Cart" onClick={() => RemoveFromCart(pProduct)}></span> : <span className="fa fa-shopping-cart" title="Add to Cart" onClick={() => AddToCart(pProduct)}></span>}
                            </li>
                          </ul>
                        </div>
                      </>
                    )}

                    <div className="d-inline ">
                      <p className="arrival-product-name d-inline">
                        <span className="text-line ml-2">{pProduct.productName}</span>
                      </p>
                      {pProduct.discountPrice === 0 ? (
                        <div className="d-inline">
                          <p className="product-price d-inline">RS: {pProduct.price}</p>
                        </div>
                      ) : (
                        <div className="d-inline">
                          <p className="product-price d-inline">RS: {pProduct.discountPrice}</p>
                          {/* <p className="product-price-org d-inline">PKR: {pProduct.price}</p> */}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="model">
        <Modal open={Editopen} onClose={EditCloseModal} center>
          <br></br>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              {productDetail[0] == null ? (
                <img className="product-img" src="./assets/Auth/Default-img.png" />
              ) : (
                <>
                  {productDetail.slice(0, 1).map((image) => (
                    <img key={image} className="popup-product-img" src={image.imgUrl} />
                  ))}
                </>
              )}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="d-flex justify-content-start">
                <h3>{productDetails.productName}</h3>
              </div>
              <div>
                <h5>Price</h5>
                {productDetails.discountPrice === 0 ? (
                  <>
                    <span className="price">RS: {productDetails.price}</span>
                  </>
                ) : (
                  <>
                    <span className="price_line">
                      <p className="price">RS: {productDetails.price}</p>
                    </span>
                    <span className="price">RS: {Math.trunc(productDetails.discountPrice)}</span>
                  </>
                )}
              </div>
              <div className="mt-2">
                <h5>HighLight</h5>
                <span>{parse(`${productDetails.highLight}`)}</span>
              </div>
              <div className="mt-2">
                <h5>Description</h5>
                <span>{parse(`${productDetails.description}`)}</span>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TopProduct;
