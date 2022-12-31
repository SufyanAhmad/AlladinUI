// import Footer from '../Footer/Footer';
import './productView.scss';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { ProgressBar } from 'react-bootstrap';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, { useState, useEffect } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { NavLink, useParams, useHistory } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { FetchUrl } from '../../requestMethod';
import { FaThumbsUp } from 'react-icons/fa';
import { Modal } from 'react-responsive-modal';
import { publicRequest } from '../../requestMethod';
import Form from 'react-bootstrap/Form';
import { Fragment } from 'react';
import ReactPlayer from 'react-player/youtube';
import swal from 'sweetalert';
import { useSelector, useDispatch } from 'react-redux';
import { cartQuantityRefresh } from '../../redux/action/index';
import { Helmet } from "react-helmet";
import ReactImageMagnify from 'react-image-magnify';
import parse from 'html-react-parser';


function ProductView({ appRefresher, setAppRefresher }) {
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const [openAddress, setOpenAddress] = useState(false);
  const onOpenAddressModal = () => setOpenAddress(true);
  const [openImage, setOpenImagePopup] = useState(false);
  const onOpenImageModal = () => setOpenImagePopup(true);
  const { id } = useParams();
  const [productView, setProductView] = useState('');
  const [productStarRating, setproductStarRating] = useState('');
  const [media, setMedia] = useState([]);
  const [descMedia, setDescMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [Address, setAddress] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState('');
  const [city, setcity] = useState(null);
  const [firstName, setfirstName] = useState(null);
  const [address, setaddress] = useState(null);
  const [phoneNo, setphoneNo] = useState(null);
  const [email, setemail] = useState(null);
  const [status, setstatus] = useState('false');
  const [fillFields, setFillFields] = useState(false);
  let history = useHistory();
  const [reload, setReload] = useState(productView, defaultAddress, Address);
  const [shippingAddressId, setShippingAddressId] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  let IsCurrentUser = JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser;
  const role = useSelector((state) => state.user.currentUser && state.user.currentUser.role);
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(true);
  const [spinner, setSpinner] = useState(false)
  // const { parse } = require('html-react-parser');
  const onCloseModal = () => {
    setOpen(false);
    setOpenImagePopup(false);
    setOpenAddress(false);
  };
  const onCloseAddressModel = () => {
    setOpenAddress(false);
    setFillFields(false);
  };
  useEffect(() => {
    if (IsCurrentUser == null) {
      setLoading(true);
      fetch(FetchUrl + `Home/get-product/${id}`).then((result) => {
        result.json().then((resp) => {
          setProductView(resp.data);
          setMedia(resp.data.productMedias);
          setDescMedia(resp.data.descriptionMedias);
          setproductStarRating(resp.data.productRating);
          setLoading(false);
          // document.getElementById("descriptionTag").setAttribute("content", `✓Low Prices ✓Fast Delivery across Pakistan `);
          // document.getElementById("imgLink").setAttribute("href", `${resp.data.productMedias.slice(0,1).map(img => {return img.imgUrl})}`);
          // document.getElementById("imgLink").setAttribute("content", `${resp.data.productMedias.slice(0,1).map(img => {return img.imgUrl})}`);
          // document.getElementById("productTitle").setAttribute("content", `${resp.data.productName}`);
          // document.title = resp.data.productName
        });
      });
    } else {
      setLoading(true);
      fetch(FetchUrl + `Home/get-product/${id}`, {
        headers: {
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
      }).then((result) => {
        result.json().then((resp) => {
          setProductView(resp.data);
          setMedia(resp.data.productMedias);
          setDescMedia(resp.data.descriptionMedias);
          setproductStarRating(resp.data.productRating);
          setLoading(false);
          // if(resp.data.productMedias.length !== 0){
          //   document.getElementById("imgLink").setAttribute("href", `${resp.data.productMedias.slice(0,1).map(img => {return img.imgUrl})}`);
          //   document.getElementById("imgLink").setAttribute("content", `${resp.data.productMedias.slice(0,1).map(img => {return img.imgUrl})}`);
          // }
          // document.getElementById("descriptionTag").setAttribute("content", `✓Low Prices ✓Fast Delivery across Pakistan `);
          // document.getElementById("productTitle").setAttribute("content", `${resp.data.productName}`);
          // document.title = resp.data.productName
        });
      });
    }
  }, [reload]);
  useEffect(() => {
    if (IsCurrentUser !== null) {
      fetch(FetchUrl + `Home/get-Product-quantity/${id}`, {
        headers: {
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
      }).then((result) => {
        result.json().then((resp) => {
          setProductQuantity(resp.data);
        });
      });
    }
  }, []);
  const handleQuantity = (type) => {
    if (type === 'dec') {
      quantity > 1 && setQuantity(quantity - 1);
    } else {
      setQuantity(quantity + 1);
    }
  };
  const AddToWishList = (data) => {
    const productId = data.productId;
    if (IsCurrentUser != null) {
      setSpinner(true)
      fetch(FetchUrl + `WishList/add-to-WishList/${productId}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(productId),
      }).then((resp) => {
        setSpinner(false)
        setReload(productView);
        resp.json().then((result) => {});
      });
    } else {
      history.push('/login');
    }
  };
  const AddToCart = (data) => {
    const productId = data.productId;
    if (IsCurrentUser != null) {
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
          if (result.status === 'Success') {
            setReload(productView);
            dispatch(cartQuantityRefresh(!refresh));
            setRefresh(!refresh);
            setAppRefresher(!appRefresher);
          }
        });
      });
    } else {
      history.push('/login');
    }
  };
  const AddToCartByQuantity = (data) => {
    const productQuantity = quantity;
    const productId = data.productId;
    let Item = {
      productId,
      productQuantity,
    };
    if (IsCurrentUser != null) {
      setSpinner(true)
      fetch(FetchUrl + `Cart/add-product-to-cart/${productId}?productQuantity=` + productQuantity, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(Item),
      }).then((resp) => {
        resp.json().then((result) => {
          setSpinner(false)
          if (result.status === 'Success') {
            setReload(productView);
            dispatch(cartQuantityRefresh(!refresh));
            setRefresh(!refresh);
            setAppRefresher(!appRefresher);
          }
        });
      });
    } else {
      history.push('/login');
    }
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
        setReload(productView);
        resp.json().then((result) => {});
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
          setReload(productView);
          if (result.status === 'Success') {
            dispatch(cartQuantityRefresh(!refresh));
            setRefresh(!refresh);
            setAppRefresher(!appRefresher);
          }
        });
      });
    } else {
      history.push('/login');
    }
  };
  const AddLikes = (reviewId) => {
    if (IsCurrentUser != null) {
      fetch(FetchUrl + `Review/like-to-review/${reviewId}`, {
        method: 'POST',
        headers: {
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(reviewId),
      }).then((resp) => {
        resp.json().then((result) => {
          setReload(productView);
        });
      });
    } else {
      history.push('/login');
    }
  };
  useEffect(() => {
    setLoading(true);
    fetch(FetchUrl + `Review/get-product-reviews/${id}`).then((result) => {
      result.json().then((resp) => {
        setReviews(resp.data);
        setLoading(false);
      });
    });
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
          setAddress(res.data.data);
        } catch {}
      };
      getShippingAddress();
    }
  }, [reload]);
  useEffect(() => {
    if (IsCurrentUser != null) {
      const getDefaultAddress = async () => {
        try {
          const res = await publicRequest.get('ShippingAddress/get-user-default-Shipping-address', {
            headers: {
              Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
            },
          });
          setDefaultAddress(res.data.data);
        } catch {}
      };
      getDefaultAddress();
    }
  }, [reload]);
  const AddDefaultAddress = (e) => {
    if (IsCurrentUser != null && role != 'Admin') {
      e.preventDefault();
      fetch(FetchUrl + `ShippingAddress/update-shipping-Address-status/${shippingAddressId}`, {
        method: 'put',
        headers: {
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(shippingAddressId),
      }).then((resp) => {
        resp.json().then((result) => {
          if (result.status === 'Success') {
            setOpen(false);
            setReload(defaultAddress);
          }
        });
      });
    } else {
      history.push('/login');
    }
  };
  const BuyNowProduct = (productId) => {
    // if (IsCurrentUser != null) {
      history.push(`/buyNow/${productId}`);
    // } else {
    //   history.push('/login');
    // }
  };
  async function ShipAddress(credentials) {
    return fetch(FetchUrl + 'ShippingAddress/add-new-shipping-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
      },
      body: JSON.stringify(credentials),
    }).then((data) => data.json());
  }
  const handleSubmit = async (e) => {
    if (IsCurrentUser != null) {
      e.preventDefault();
      if (city && address && phoneNo && firstName && email) {
        const response = await ShipAddress({
          city,
          address,
          phoneNo,
          firstName,
          email,
          status,
        });
        if (response.status === 'Success') {
          swal('Success', response.message, 'success', {
            buttons: false,
            timer: 2000,
          }).then((value) => {
            setReload(Address);
            setOpenAddress(false);
          });
        } else {
          swal('Error', response.message, 'error');
        }
      } else {
        setFillFields(true);
      }
    } else {
      history.push('/login');
    }
  };
  const Loading = () => {
    return (
      <>
        <div className="col-md-6" style={{ lineHeight: 2 }}>
          <Skeleton height={400} />
        </div>
        <div className="col-md-6">
          <Skeleton height={50} width={300} />
          <Skeleton height={70} />
          <Skeleton height={25} width={150} />
          <Skeleton height={50} />
          <Skeleton height={150} />
          <Skeleton height={50} width={100} />
          <Skeleton height={50} width={100} />
        </div>
      </>
    );
  };
  const descountPrice = productView.price - productView.discountPrice;
  const perDescount = (productView.discountPrice / productView.price) * 100;
  var myNumberWithTwoDecimalPlaces = Math.trunc(parseFloat(perDescount));
  const ShowProduct = () => {
    return (
      <div className="product-view-main">
        <Helmet>
          <meta name="description" content="✓Low Prices ✓Fast Delivery across Pakistan" />
          <meta name="kewords" content={`${productView.productName}, online shopping, alladin`} />
          <meta property="og:title" content={productView.productName} />
          <meta property="og:description" content="OG ✓Low Prices ✓Fast Delivery across Pakistan" />
          <meta property="og:image" content={media.slice(0,1).map(img => {return img.imgUrl})} />
        </Helmet>
        <div className="container">
          <div className="row" style={{ minHeight: '100vh' }}>
            <div className="col-lg-8 col-md-12 col-sm-12">
              <div className="product-card">
                <div className="row">
                  <div style={{ textAlign: 'center' }} className="col-lg-6 col-md-12 col-sm-12" >
                  {/* {media.slice(0, 1).map((d, index) => (
                        // d-flex justify-content-center
                        <div key={index}>
                          <img src={d.imgUrl} alt="product" style={{height:"100%",width:"100%"}}/>
                          <div style={{width:"370px",height:"500px"}}>
                          <ReactImageMagnify {...{
                                smallImage: {
                                    alt: 'Wristwatch by Ted Baker London',
                                    isFluidWidth: true,
                                    src: d.imgUrl
                                },
                                largeImage: {
                                    src: d.imgUrl,
                                    width: 1200,
                                    height: 1800
                                }
                          }} />
                          </div>
                        </div>
                      ))} */}
                    <Carousel className='carosel' showThumbs={media.length === 0 ? false : true} infiniteLoop>
                    {media.map((d, index) => (
                        <div className="product-view-img" key={index}>
                          {window.innerWidth >= 768 ? 
                          <ReactImageMagnify {...{
                                smallImage: {
                                    alt: "Product Image " + d.arrangementNo,
                                    isFluidWidth: true,
                                    src: d.imgUrl
                                },
                                largeImage: {
                                    src: d.imgUrl,
                                    width: 800,
                                    height: 800
                                }
                          }} />
                          :""}
                          <img src={d.imgUrl} alt="product" style={{height:"100%",width:"100%",display:"hidden"}}/>
                        </div>
                      ))}
                      {productView.vedioUrl !== null && productView.vedioUrl !== '' ? (
                        <div>
                          {media.slice(0, 1).map((d, index) => (
                            <div key={index} className="image d-flex justify-content-center c-pointer cnt" onClick={onOpenImageModal}>
                              <img src={d.imgUrl} className="Youtube-icon-img-main" alt="product" style={{ position: 'relative', width:"max-content", height:"100%" }} />
                              <img src="./assets/AdminPannel/yt.png" className="Youtube-icon-img" alt="video" style={{ position: 'absolute' }} />
                            </div>
                          ))}
                          <img src="./assets/youtube-icon.png" alt="video" style={{ zIndex: '-2', marginTop: '15px' }} />
                        </div>
                      ) : (
                        <span></span>
                      )}
                    </Carousel>
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-12 mtp-chargers">
                    <br></br>
                    <div className="row p-1">
                      <div className="col-10">
                        <p className="product-view-name d-inline">{productView.productName}</p>
                      </div>
                      <div className="col-2">
                        {productView.isInWishList === true ? (
                          <span className="fa fa-heart bgBlue c-pointer" style={{ fontSize: '25px' }} title="Remove from Wishlist" onClick={() => RemoveToWishList(productView)}></span>
                        ) : (
                          <span className="fa fa-heart c-pointer" style={{ fontSize: '25px' }} title="Add to WishList" onClick={() => AddToWishList(productView)}></span>
                        )}
                      </div>
                    </div>
                    <button className="start-rating d-inline" style={{ marginLeft: '10px', textAlign: 'center', width: '35px' }}>
                      {productView.rating} <i className="fa fa-star" aria-hidden="true" style={{ marginLeft: '3px' }}></i>
                    </button>
                    <p className="product-rating d-inline product-detail-padding">{productView.totalRatingCount} Ratings</p>
                    <br></br>
                    <br></br>
                    <p className="product-view-deal product-detail-padding">Detail</p>
                    <p className="product-description product-detail-padding text-line-wish c-pointer next-line" title={productView.highLight}>
                      {parse(`${productView.highLight}`)}
                    </p>
                    <hr style={{ width: '90%' }} />
                    <div>
                      {productView.discountPrice === 0 ? <span className="product-view-price product-detail-padding">RS. {productView.price}</span> : <span className="product-view-price product-detail-padding">RS. {productView.discountPrice}</span>}

                      <br></br>
                      {productView.discountPrice === 0 ? <div className="price-with-discount product-detail-padding"></div> : <div className="price-with-discount product-detail-padding">RS. {productView.price}</div>}
                      {/* <span className="price-with-discount product-detail-padding">RS. {productView.price}</span> */}
                      {/* <span className="discount-per product-detail-padding">RS:{productView.price - productView.discountPrice}</span> */}
                    </div>
                    <div>
                      <p className="rem-product product-detail-padding">Remaining({productView.quantity})</p>
                    </div>
                    {productView.quantity !== 0 ? (
                      <>
                        <div className="d-inline product-detail-padding">
                          <p className="product-quantity d-inline">Quantity</p>
                          <button className="btn btn-outline-dark me-1 d-inline quantiy-decrease" onClick={() => handleQuantity('dec')}>
                            <i className="fa fa-minus"></i>
                          </button>
                          <button className="qty-count">{quantity}</button>
                          {productQuantity !== quantity ? (
                            <button className="btn btn-outline-dark d-inline quantiy-increase" onClick={() => handleQuantity('inc')}>
                              <i className="fa fa-plus"></i>
                            </button>
                          ) : (
                            <button disabled className="btn btn-outline-dark d-inline quantiy-increase">
                              <i className="fa fa-plus"></i>
                            </button>
                          )}
                        </div>
                        <br></br>
                        <br></br>
                        <button className="btn mb-2 btn-outline-dark me-1 d-inline add-cart" title="Add to cart" onClick={() => AddToCartByQuantity(productView)}>
                          Add to cart
                          {spinner?
                            <i style={{marginLeft:"3px"}} className="fa fa-spinner ml-4 fa-spin"></i>
                            :""}
                        </button>
                        {productView.shippingStatus ? (
                          <button className="btn mb-2 btn-outline-dark d-inline buy-now" onClick={() => BuyNowProduct(productView.productId)}>
                            Buy now
                          </button>
                        ) : (
                          ''
                        )}
                      </>
                    ) : (
                      <button className=" d-flex justify-content-center btn btn-outline-dark d-inline buy-now ml-5" onClick={() => AddToWishList(productView)}>
                        Add To Wishlist
                        {spinner?
                            <i style={{marginLeft:"3px"}} className="fa fa-spinner ml-4 fa-spin"></i>
                            :""}
                      </button>
                    )}
                  </div>
                </div>
                <hr />
                <div className="more-detail">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                      <span className="pro-more-deatil">Product detail:</span>
                      <br></br>
                      <span className="pro-more-desc c-pointer next-line" title={productView.description}>
                        {parse(`${productView.description}`)}
                      </span>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                      <span className="pro-more-deatil">Brand:</span>
                      <br></br>
                      <span className="pro-more-desc">{productView.brandName}</span>
                    </div>
                  </div>
                </div>
                <div className="pro-detail-desc">
                  {descMedia.map((descriptionImage, index) => (
                    <img key={index} className="pro-detail-desc-img" src={descriptionImage.imgUrl} alt="Product Image" />
                  ))}
                </div>
              </div>
              <div className="product-card" style={{ padding: '30px' }}>
                <p className="review mt-4">Ratings & Reviews</p>
                <hr />
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-sm-12">
                    <div style={{paddingLeft:"5px"}} className="rating-num">
                      {productView.rating}
                      <span className="rating-outOff">/5</span>
                    </div>
                    <Stack style={{paddingLeft:"5px"}} spacing={1}>
                      <Rating name="full-rating" readOnly defaultValue={productView.rating} precision={0.5} />
                    </Stack>
                    <p style={{paddingLeft:"5px"}} className="star-rating">{productView.totalRatingCount} rating</p>
                  </div>
                  <div className="col-lg-9 col-sm-12 col-md-9">
                    <div className="row">
                      <div className="rating-first">
                        <Stack spacing={1}>
                          <Rating name="full-rating" readOnly defaultValue={5} precision={0.5} />
                        </Stack>
                      </div>
                      <div className="rating-second">
                        <ProgressBar now={productStarRating.fiveStar} />
                      </div>
                      <div className="rating-third">
                        <div>{productStarRating.fiveStarCount}</div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="rating-first" style={{ width: '25%' }}>
                        <Stack spacing={1}>
                          <Rating name="full-rating" readOnly defaultValue={4} precision={0.5} />
                        </Stack>
                      </div>
                      <div className="rating-second" style={{ width: '60%' }}>
                        <ProgressBar now={productStarRating.fourStar} />
                      </div>
                      <div className="rating-third" style={{ width: '15%' }}>
                        <div>{productStarRating.fourStarCount}</div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="rating-first" style={{ width: '25%' }}>
                        <Stack spacing={1}>
                          <Rating name="full-rating" readOnly defaultValue={3} precision={0.5} />
                        </Stack>
                      </div>
                      <div className="rating-second" style={{ width: '60%' }}>
                        <ProgressBar now={productStarRating.thirdStar} />
                      </div>
                      <div className="rating-third" style={{ width: '15%' }}>
                        <div>{productStarRating.thirdStarCount}</div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="rating-first" style={{ width: '25%' }}>
                        <Stack spacing={1}>
                          <Rating name="full-rating" readOnly defaultValue={2} precision={0.5} />
                        </Stack>
                      </div>
                      <div className="rating-second" style={{ width: '60%' }}>
                        <ProgressBar now={productStarRating.secondStar} />
                      </div>
                      <div className="rating-third" style={{ width: '15%' }}>
                        <div>{productStarRating.secondStarCount}</div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="rating-first" style={{ width: '25%' }}>
                        <Stack spacing={1}>
                          <Rating name="full-rating" readOnly defaultValue={1} precision={0.5} />
                        </Stack>
                      </div>
                      <div className="rating-second" style={{ width: '60%' }}>
                        <ProgressBar now={productStarRating.firstStar} />
                      </div>
                      <div className="rating-third" style={{ width: '15%' }}>
                        <div>{productStarRating.firstStarCount}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                {/* product view section */}
                <p style={{paddingLeft:"5px"}} className="product-view">Product views</p>
                <hr />
                {reviews.length != [] ? (
                  <>
                    {reviews.map((review) => (
                      <div key={review} className="">
                        <Stack spacing={1}>
                          <Rating name="full-rating d-block" readOnly defaultValue={review.ratting} precision={0.5} />
                        </Stack>
                        <span className="rating-commentator d-block mt-1">by {review.customerName}</span>
                        <p className="product-comments">{review.text}</p>
                        <div>
                          {review.reviewMedias.map((reviewImage) => (
                            <Fragment key={reviewImage}>
                              <img className="review-img" src={reviewImage.imgUrl} alt="Review Image" />
                            </Fragment>
                          ))}
                        </div>
                        <div className="coment-icons">
                          {review.isReviewLike === false ? <FaThumbsUp className="like-btn-icon" onClick={() => AddLikes(review.reviewId)} /> : <FaThumbsUp className="like-review" onClick={() => AddLikes(review.reviewId)} />}
                          <span className="comment-count">{review.reviewLikes}</span>
                        </div>
                        <div className="admin-commit">
                          <div>
                            <img className="" src="./assets/product-view/admin-comment.png" alt="Review Image" />

                            <span className="admin-response">Respond from store</span>
                            <br></br>
                            <span className="admin-comment-response">{review.replyText}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="d-flex justify-content-center">
                      <img className="empty-review-img" src="./assets/AdminPannel/no-review.png" />
                      <br></br>
                    </div>
                    <div className="d-flex justify-content-center">
                      <h5 style={{paddingLeft:"5px"}} className="mt-5">Opps no review on this product</h5>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12">
              <div className="product-card">
                <div style={{ padding: '10px' }}>
                  <span className="delivery">Delivery</span>
                  <br></br>
                  <img src="./assets/product-view/location.png" />
                  {defaultAddress !== null ? (
                    <span className="address-product-view">
                      {defaultAddress.address} , {defaultAddress.city}
                    </span>
                  ) : (
                    ''
                  )}
                  <button className="address-change-btn c-pointer" onClick={onOpenModal}>
                    Change{' '}
                  </button>

                  <hr />
                  <div className="row">
                    <div className="col-1">
                      <img src="./assets/product-view/home-delivery.png" />
                    </div>
                    <div className="col-8">
                      <span className="home-delivery d-block">Home Delivery</span>
                      <span className="address-street d-block">9 - 13 day(s)</span>
                    </div>
                    <div className="col-3">
                      <span className="delivery-price">RS. {productView.manualShippingCharges}</span>
                    </div>
                  </div>
                  <br></br>
                  <img src="./assets/product-view/cash-on.png" />
                  <span className="address-product-view">Cash on Delivery Available</span>
                  <hr />
                  <span className="Serivce">Delivery</span>
                  <div className="row">
                    <div className="col-1">
                      <img src="./assets/product-view/services.png" />
                    </div>
                    <div className="col-11">
                      <span className="home-delivery d-block">7 Days Returns</span>
                      <span className="address-street d-block">Change of mind is not applicable</span>
                    </div>
                  </div>
                  <br></br>
                  <img src="./assets/product-view/warranty.png" />
                  <span className="address-product-view"> {productView.warrantyType}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        {/* <Footer /> */}
      </div>
    );
  };
  return (
    <div>
      <div className="">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div>
          <Modal open={open} onClose={onCloseModal} center>
            <form className="add-cate-popup" onSubmit={AddDefaultAddress}>
              <br></br>
              {/* <div className="d-flex justify-content-between"> */}
                <div className='row'>
                  <div className='col-7'>
                    <span className="category-popup-text">Shipping Address</span>
                  </div>
                  <div className='col-5'>
                    <button className="_add-address-btn" onClick={onOpenAddressModal}>
                      New Address
                    </button>
                  </div>
                </div>
              {/* </div> */}
              <Form.Select style={{width:"100%"}} aria-label="Default select example" onChange={(e) => setShippingAddressId(e.target.value)}>
                <option>Select</option>
                {Address.map((address, i) => (
                  <option className='addressOptions' key={i} value={address.shippingAddressId}>
                    {address.address}, {address.city}
                  </option>
                ))}
              </Form.Select>
              <br></br>
              <br></br>
              <br></br>
              <button type="submit" className="btn-save-cat">
                Save
              </button>
            </form>
          </Modal>
        </div>
        <div>
          <Modal open={openImage} onClose={onCloseModal} center>
            <div  className="reactYTPlayer">
            <ReactPlayer width='100%' height="100%" style={{ zIndex: '2'}} url={productView.vedioUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" controls allowFullScreen></ReactPlayer>
            </div>
          </Modal>
        </div>
        <div>
          <Modal open={openAddress} onClose={onCloseAddressModel} center>
            <form onSubmit={handleSubmit}>
              <div className="row popup-content">
                <div className="popup-part col-lg-12 col-md-12 col-sm-12">
                  {fillFields ? <><span style={{ color: 'red' }}>Error: Please fill all the fields</span><br /></> : ''}
                  <span className="popup-Labels">Full Name</span>
                  <div>
                    <input style={{width:"100%"}} className="popup-input-fields popup-Fname-input" type="text" placeholder="Enter Full Name" onChange={(e) => setfirstName(e.target.value)} />
                  </div>
                  <div className="popup-Labels ">
                    <span>Phone Number</span>
                  </div>
                  <div>
                    <input style={{width:"100%"}} className="popup-input-fields" type="text" placeholder="Enter Phone Number" onChange={(e) => setphoneNo(e.target.value)} />
                  </div>
                  <div className="popup-Labels ">
                    <span>Email</span>
                  </div>
                  <div>
                    <input style={{width:"100%"}} className="popup-input-fields" type="text" placeholder="Enter Email" onChange={(e) => setemail(e.target.value)} />
                  </div>
                  <div className="popup-Labels ">
                    <span>Make default</span>
                  </div>
                  <div>
                    <div style={{width:"100%"}} onChange={(e) => setstatus(e.target.value)}>
                      <input type="radio" value="true" name="Papular" /> Yes &nbsp; &nbsp;
                      <input type="radio" value="false" name="Papular" /> No
                    </div>
                  </div>
                </div>
                <div className="popup-part col-lg-12 col-md-12 col-sm-12">
                  <div style={{width:"100%"}} className="popup-Labels ">
                    <span>City</span>
                  </div>
                  <div>
                    <input style={{width:"100%"}} className="popup-input-fields" type="text" placeholder="Enter your City" onChange={(e) => setcity(e.target.value)} />
                  </div>
                  <div className="popup-Labels ">
                    <span>Address</span>
                  </div>
                  <div>
                    <input style={{width:"100%"}} className="popup-input-fields" type="text" placeholder="Enter your Address" onChange={(e) => setaddress(e.target.value)} />
                  </div>
                  <div>
                    <button style={{width:"100%"}} className="popupSaveChanges">Save Changes</button>
                  </div>
                </div>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
}
export default ProductView;
