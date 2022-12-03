import '../../App.css';
import './productList.scss';
import React, { useState, useEffect } from 'react';
import { publicRequest } from '../../requestMethod';
import { NavLink, useParams, useHistory } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import { FetchUrl } from '../../requestMethod';
import swal from 'sweetalert';
import { useSelector, useDispatch } from 'react-redux';
import { cartQuantityRefresh } from '../../redux/action/index';

function SearchProducts({ appRefresher, setAppRefresher }) {
  const { searchKey } = useParams();
  const [products, setProducts] = useState([]);
  const [productDetail, setProductDetail] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [Editopen, setEditOpen] = useState(false);
  const EditOpenModal = () => setEditOpen(true);
  const EditCloseModal = () => setEditOpen(false);
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(true);
  const [reload, setReload] = useState([products]);
  let history = useHistory();
  let IsCurrentUser = JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser;

  useEffect(() => {
    if (IsCurrentUser != null) {
      const getProductsbyKey = async () => {
        try {
          const res = await publicRequest.get(`Home/get-products-by-search/${searchKey}`, {
            headers: {
              Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
            },
          });
          setProducts(res.data.data);
        } catch {}
      };
      getProductsbyKey();
    } else {
      const getProductsbyKey = async () => {
        try {
          const res = await publicRequest.get(`Home/get-products-by-search/${searchKey}`);
          setProducts(res.data.data);
        } catch {}
      };
      getProductsbyKey();
    }
  }, [reload]);
  const AddToCart = (data) => {
    const productId = data.productId;
    if (IsCurrentUser != null) {
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
                if (result.status == 401) {
                  history.push('/login');
                }
                if (result.status === 'Success') {
                  swal('Success', result.message, 'success', {
                    buttons: false,
                    timer: 2000,
                  }).then((value) => {
                    dispatch(cartQuantityRefresh(!refresh));
                    setRefresh(!refresh);
                    setAppRefresher(!appRefresher);
                    setReload(products);
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
  const AddToWishList = (data) => {
    const productId = data.productId;
    if (IsCurrentUser != null) 
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
          if (result.status === 401) {
            history.push('/login');
          }
          alert('Product Add to wishlist successfully');
        });
      });
  } else {
    history.push('/login');
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
  const RemoveToWishList = (data) => {
    const productId = data.productId;
    if (IsCurrentUser != null) {
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
              dispatch(cartQuantityRefresh(!refresh));
              setRefresh(!refresh);
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
    if (IsCurrentUser != null) {
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
          if (result.status === 'Success') {
            swal('Success', result.message, 'success', {
              buttons: false,
              timer: 2000,
            }).then((value) => {
              dispatch(cartQuantityRefresh(!refresh));
              setRefresh(!refresh);
              setAppRefresher(!appRefresher);
              setReload(products);
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
  const handleClick = (product) => {
    window.location.assign(`/product/view/${product.productId}`)
   
  }
  return (
    <div className="background">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-4 col-sm-12">
            <div className="dropdown ProductListSort mt-3">
              <input
                type="text"
                className="product-search"
                placeholder="Search Product ..."
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-12 col-md-12 col-sm-12 mb-5">
            <div>
              {products.length != [] ? (
                <div className="row">
                  {products
                    .filter((val) => {
                      if (searchTerm === '') {
                        return val;
                      } else if (val.productName.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())) {
                        return val;
                      }
                    })
                    .map((product) => (
                      <div className="col-lg-2 col-md-3 col-sm-12 col-xs-12 d-flex flex-column align-items-center justify-content-center product-item mt-2" key={product.productId}>
                        <div className="product">
                          <span onClick={()=>handleClick(product)} style={{ diplay: 'block', width: '100%' }}>
                            {product.productMedias[0] == null ? (
                              // <NavLink style={{ width: '100%' }} to={`/product/view/${product.productId}`}>
                                <img style={{ width: '100%' }} className="product-img" src="./assets/Auth/Default-img.png" alt="Product-Img" />
                              // </NavLink>
                              ) : (
                              <span style={{ diplay: 'block', width: '100%' }}>
                                {product.productMedias.slice(0, 1).map((image,i) => (
                                // <NavLink key={i} to={`/product/view/${product.productId}`}>
                                  <img style={{ width: '100%' }} key={image.mediaId} className="product-img" src={image.imgUrl} alt="Product-Img" />
                                  // </NavLink>
                                ))}
                              </span>
                            )}
                          </span>
                          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                              <li className="icon" onClick={() => getProductDetail(product.productId)}>
                                <span className="fa fa-eye" onClick={() => EditOpenModal(product.productId)}></span>
                              </li>
                              <li className="icon mid-icon">
                                {product.isInWishList ? <span className="fa fa-heart bgBlue" title="Remove from Wishlist" onClick={() => RemoveToWishList(product)}></span> : <span className="fa fa-heart" title="Add to WishList" onClick={() => AddToWishList(product)}></span>}
                              </li>
                              <li className="icon">{product.isInCart ? <span className="fa fa-shopping-cart bgBlue" title="Remove from Cart" onClick={() => RemoveFromCart(product)}></span> : <span className="fa fa-shopping-cart" title="Add to Cart" onClick={() => AddToCart(product)}></span>}</li>
                            </ul>
                          </div>
                        </div>
                        <div className="title pt-4 pb-2 text-line" title={product.productName}>
                          {product.productName}
                        </div>
                        <div className="d-flex align-content-center justify-content-center">
                          <button className="flip-card-rating d-inline" style={{ marginLeft: '10px', textAlign:"center",width:"30px" }}>
                            {product.rating} <i class="fa fa-star" aria-hidden="true" style={{marginLeft:"5px"}}></i>
                          </button>
                          <p className="d-inline fc-charges-sold ml-2">{product.productSold} sold</p>
                        </div>
                        {product.discountPrice === 0 ? (
                          <div className="price">RS: {product.price}</div>
                        ) : (
                          <><div style={{marginBottom:"-5px"}}>
                            <span className=" p-price">RS: {product.price}</span>
                            </div>
                            <div>
                            <span className="price">RS: {Math.trunc(product.discountPrice)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="d-flex justify-content-center">
                  <div className="col-lg-4 col-md-4 col-sm-12">
                    <img className="no-data-img" src="./assets/AdminPannel/data-not-found.png" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
      <div className="model">
        <Modal open={Editopen} onClose={EditCloseModal} center>
          <br></br>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="product-detail-popup" style={{ width: '300px' }}>
                Product Detail
              </div>
              {productDetail.length !== 0?
                <>
                  {productDetail.slice(0, 1).map((image, i) => (
                    <img key={i} className="popup-img-product" style={{ maxWidth: '200px' }} src={image.imgUrl} />
                  ))}
                </>
              :
                <img className="popup-img-product" style={{ maxWidth: '200px' }} src="./assets/Auth/default-img.png" />
              }
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="d-flex pb-2 justify-content-start">
                <h3>{productDetails.productName}</h3>
              </div>
              <div>
                <h5>Price</h5>
                <span className="p-price">RS: {productDetails.price}</span>
                <br></br>
                <span>RS: {Math.trunc(productDetails.discountPrice)}</span>
              </div>
              <div className="mt-2">
                <h5>HighLight</h5>
                <span>{productDetails.highLight}</span>
              </div>
              <div className="mt-2">
                <h5>Description</h5>
                <span>{productDetails.description}</span>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default SearchProducts;
