import React, { useState, useEffect, useRef, useMemo, Fragment } from 'react';
import swal from 'sweetalert';
import './slider.scss';
import Carousel from 'react-bootstrap/Carousel';
import Skeleton from 'react-loading-skeleton';
import { NavLink, useHistory } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css';
import { publicRequest } from '../../requestMethod';
import { Modal } from 'react-responsive-modal';
import { FetchUrl } from '../../requestMethod';
import TopProduct from '../topProduct/TopProduct';
import ReactWhatsapp from 'react-whatsapp';
import TimeCounter from '../TimeCounter/TimeCounter';
import { useDispatch, useSelector } from 'react-redux';
import { cartQuantityRefresh } from '../../redux/action/index';
import zIndex from '@mui/material/styles/zIndex';

const Slider = ({ appRefresher, setAppRefresher }) => {
  const [slider, setSlider] = useState([]);
  const [saleProduct, setSaleProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const [Editopen, setEditOpen] = useState(false);
  const EditOpenModal = () => setEditOpen(true);
  const EditCloseModal = () => setEditOpen(false);
  const [productDetail, setProductDetail] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [subcategoryProduct, setSubcategoryProduct] = useState([]);
  const [categoryProduct, setCategoryProduct] = useState([]);
  const [youtube, setyoutube] = useState([]);
  const [subCatShow, setSubCatShow] = useState();
  const [showSubCat, setShowSubCat] = useState();
  const [sideBarToggle, setSideBarToggle] = useState(true);
  const scrolly = useRef(1);
  const componentMounted = useRef(true);
  let history = useHistory();
  const [sliderProduct, setSliderProduct] = useState([]);
  const [reload, setReload] = useState([saleProduct, subcategoryProduct, sliderProduct]);
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(true);

  let user = useSelector((state) => state.user.currentUser);
  useEffect(() => {
    setLoading(true);
    fetch(FetchUrl + 'Home/get-slider-subCategory-products').then((result) => {
      result.json().then((resp) => {
        setSliderProduct(resp.data);
        setLoading(false);
      });
    });
  }, [reload]);
  useEffect(() => {
    if (user === null) {
      setLoading(true);
      fetch(FetchUrl + 'Home/get-onsale-products?getTopProducts=' + true).then((result) => {
        result.json().then((resp) => {
          setSaleProduct(resp.data.products);
          setLoading(false);
        });
      });
    } else {
      setLoading(true);
      fetch(FetchUrl + 'Home/get-onsale-products?getTopProducts=' + true, {
        headers: {
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
      }).then((result) => {
        result.json().then((resp) => {
          setSaleProduct(resp.data.products);
          setLoading(false);
        });
      });
    }
  }, [reload]);
  useEffect(() => {
    if (user === null) {
      setLoading(true);
      fetch(FetchUrl + 'Home/get-subCategories-products').then((result) => {
        result.json().then((resp) => {
          setSubcategoryProduct(resp.data);
          setLoading(false);
        });
      });
    } else {
      setLoading(true);
      fetch(FetchUrl + 'Home/get-subCategories-products', {
        headers: {
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
      }).then((result) => {
        result.json().then((resp) => {
          setSubcategoryProduct(resp.data);
          setLoading(false);
        });
      });
    }
  }, []);
  useEffect(() => {
    if (user === null) {
      setLoading(true);
      fetch(FetchUrl + 'Home/get-categories-products').then((result) => {
        result.json().then((resp) => {
          setCategoryProduct(resp.data);
          setLoading(false);
        });
      });
    } else {
      setLoading(true);
      fetch(FetchUrl + 'Home/get-categories-products', {
        headers: {
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
      }).then((result) => {
        result.json().then((resp) => {
          setCategoryProduct(resp.data);
          setLoading(false);
        });
      });
    }
  }, []);
  useEffect(() => {
    setLoading(true);
    fetch(FetchUrl + 'Home/get-slider-images').then((result) => {
      result.json().then((resp) => {
        setSlider(resp.data);
        setLoading(false);
      });
    });
  }, [reload]);
  useEffect(() => {
    setLoading(true);
    fetch(FetchUrl + 'Home/get-youtube-data').then((result) => {
      result.json().then((resp) => {
        setyoutube(resp.data);
        setLoading(false);
      });
    });
  }, []);

  useEffect(() => {
    const getMainCategories = async () => {
      const res = await publicRequest.get('Home/get-mainCategories-detail');
      if (componentMounted.current) {
        setMainCategories(res.data.data);
      }
    };
    getMainCategories();
    return () => {
      componentMounted.current = false;
    };
  }, []);
  const AddToWishList = (data) => {
    if (user !== null) {
      const productId = data.productId;
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
          if (result.status === 'Success') {
            swal('Success', result.message, 'success', {
              buttons: false,
              timer: 2000,
            }).then((value) => {
              setReload([saleProduct, subcategoryProduct, sliderProduct]);
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
              setReload([saleProduct, subcategoryProduct, sliderProduct]);
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
                if (result.status == 401) {
                  history.push('/login');
                }
                if (result.status === 'Success') {
                  swal('Success', result.message, 'success', {
                    buttons: false,
                    timer: 2000,
                  }).then((value) => {
                    setRefresh(!refresh);
                    dispatch(cartQuantityRefresh(refresh));
                    setAppRefresher(!appRefresher);
                    setReload(subcategoryProduct);
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
          if (result.status === 401) {
            history.push('/login');
          }
          if (result.status === 'Success') {
            swal('Success', result.message, 'success', {
              buttons: false,
              timer: 2000,
            }).then((value) => {
              setReload([saleProduct, subcategoryProduct, sliderProduct]);
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
  useEffect(() => {
    const container = document.querySelector('.scrollPostion');
    container.scrollTop = scrolly.current;
  }, [subCatShow]);

  function scrollHandler(argument) {
    scrolly.current = argument;
  }
  const Loading = () => {
    return (
      <>
        <div className="col-md-2">
          <Skeleton height={350} />
        </div>
        <div className="col-md-2">
          <Skeleton height={350} />
        </div>
        <div className="col-md-2">
          <Skeleton height={350} />
        </div>
        <div className="col-md-2">
          <Skeleton height={350} />
        </div>
        <div className="col-md-2">
          <Skeleton height={350} />
        </div>
        <div className="col-md-2">
          <Skeleton height={350} />
          <br></br>
        </div>
      </>
    );
  };
  const ShowProducts = () => {
    return (
      <>
        <div className="bgColor">
          <br></br>
          <div className="slider-container">
            <div className="row navbar-container">
              <div className={` ${sideBarToggle ? 'col-3' : 'col-1'} sidebar-items left-sidebar`}>
                <div
                  style={{
                    display: 'flex',
                    height: '100%',
                    overflow: 'scroll',
                  }}
                  className="scrollPostion"
                  onScroll={() => {
                    const container = document.querySelector('.scrollPostion');
                    scrollHandler(container.scrollTop);
                  }}
                  onMouseLeave={() => {
                    setSubCatShow(null);
                    setShowSubCat(null);
                  }}
                >
                  <div style={{ display: 'flex', zIndex: '4' }} className=" overflow-visible">
                    <div className="sidebar nav-dropdown textColor">
                      <div className="categories">
                        <i onClick={() => setSideBarToggle(!sideBarToggle)} style={{ fontSize: '17px' }} className="fa fa-bars fa-large mt-2"></i>
                        <a className="text-decoration-none" style={{ opacity: '0.7' }}>
                          {sideBarToggle ? <span className="cate-type">Categories</span> : ''}
                        </a>
                      </div>
                      <div className="sidebar-content">
                        {mainCategories.map((miancategory) => (
                          <div style={{ display: 'flex', flexStartDirection: 'row' }} key={miancategory.mainCategoryId}>
                            <div key={miancategory.mainCategoryId} style={{ display: 'flex' }}>
                              <div style={{ display: 'flex', flex: '1' }}>
                                <div className="sidebar-item" key={miancategory.mainCategoryId}>
                                  <div
                                    style={{ width: 'fit-content' }}
                                    onMouseOver={() => {
                                      setSubCatShow(miancategory.mainCategoryId);
                                      setShowSubCat();
                                    }}
                                  >
                                    <span>
                                      <img src={miancategory.image} style={{ width: '30px', height: '30px' }} />
                                    </span>

                                    {sideBarToggle ? (
                                      <span style={{ marginLeft: '10px' }}>
                                        <NavLink className="maincategory-name-box" to={`/mainCategoryProducts/${miancategory.mainCategoryId}`}>
                                          {miancategory.name}
                                        </NavLink>
                                      </span>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {miancategory.mainCategoryId === subCatShow ? (
                              <div>
                                {mainCategories.map((mainCat) => (
                                  <>
                                    {mainCat.mainCategoryId === subCatShow && mainCat.categories.length != [] ? (
                                      <div key={miancategory.mainCategoryId} style={{ overflow: 'visible' }}>
                                        <ul className="sub-cate subcategoryList" key={mainCat.mainCategoryId}>
                                          {mainCat.categories.map((data) => (
                                            <Fragment key={data.categoryId}>
                                              <div style={{ display: 'flex', flexStartDirection: 'row' }} key={data.categoryId}>
                                                <div className="subCategoryBox">
                                                  <li onMouseOver={() => setShowSubCat(data.categoryId)} key={data.categoryId}>
                                                    <NavLink style={showSubCat === data.categoryId ? { fontWeight: '700', fontSize: '18px', backgroundColor: '#f8f5f5;' } : {}} className="category-name-box" to={`/categoryProducts/${data.categoryId}`}>
                                                      {data.name}
                                                    </NavLink>
                                                  </li>
                                                </div>
                                                {showSubCat === data.categoryId ? (
                                                  <>
                                                    {/* <div className='subcategoryItems'> */}
                                                    <ul style={{ listStyleType: 'none', marginLeft: '267px', position: 'absolute' }}>
                                                      {data.subCategories.map((subcategory) => (
                                                        <>
                                                          <li key={subcategory.subCategoryId}>
                                                            <NavLink className="subcategory-name-box" to={`/products/${subcategory.subCategoryId}`}>
                                                              {subcategory.name}
                                                            </NavLink>
                                                          </li>
                                                        </>
                                                      ))}
                                                    </ul>
                                                    {/* </div> */}
                                                  </>
                                                ) : (
                                                  <></>
                                                )}
                                              </div>
                                            </Fragment>
                                          ))}
                                        </ul>
                                      </div>
                                    ) : (
                                      <span></span>
                                    )}
                                  </>
                                ))}
                              </div>
                            ) : (
                              ''
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* <div style={{ overflow: 'scroll' }}>
                    {mainCategories.map((miancategory, i) => (
                      <Fragment key={miancategory.mainCategoryId}>
                        {miancategory.mainCategoryId === subCatShow && miancategory.categories.length != [] ? (
                          <div key={miancategory.mainCategoryId} style={{ overflow: 'visible' }}>
                            <ul className="sub-cate subcategoryList" key={miancategory.mainCategoryId}>
                              {miancategory.categories.map((data) => (
                                <Fragment key={data.categoryId}>
                                  <div key={data.categoryId} className="subCategoryBox" style={{ wordBreak: 'keep-all' }}>
                                    <li className="category-name-box" onMouseOver={()=>setShowSubCat(data.categoryId)} key={data.categoryId}>
                                      <NavLink style={showSubCat === data.categoryId ?{fontWeight:"700",fontSize:"18px"}:{}} className="category-name-box" to={`/categoryProducts/${data.categoryId}`}>
                                        {data.name}
                                      </NavLink>
                                    </li>
                                    {showSubCat === data.categoryId?<>
                                    {data.subCategories.map((subcategory) => 
                                      <li className="subcategory-name-box" key={subcategory.subCategoryId}>
                                        <NavLink to={`/ProductByCategoryId/${subcategory.subCategoryId}`}>{subcategory.name}</NavLink>
                                        <hr></hr>
                                      </li>
                                    )}
                                    </>
                                    :<></>}
                                  </div>
                                </Fragment>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <span></span>
                        )}
                      </Fragment>
                    ))}
                  </div> */}
                </div>
              </div>
              <div style={{ height: '500px', zIndex: '1' }} className={`${sideBarToggle ? 'col-lg-7' : 'col-lg-9'} col-md-12 col-sm-12 `}>
                <Carousel>
                  {slider.map((slide, i) => (
                    <Carousel.Item style={{ height: '450px' }} key={i}>
                      <img className="d-block w-100 slider-img" src={slide.imageUrl} alt="First slide" />
                      <Carousel.Caption></Carousel.Caption>
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
              <div className="col-2 sidebar-right">
                <div className="sidebar-img-right" style={{ backgroundImage: "url('./assets/sidebar2.png')", backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', allignItems: 'center' }}>
                  {/* <img src="./assets/sidebar2.png" className="sidebar-img-right" /> */}
                  <div className="sidebar-img-buttom1">
                    <Carousel className="ml-4 slids">
                      {sliderProduct.map((sld, i) => (
                        <Carousel.Item key={i} show={2}>
                          {sld.productMedias.slice(0, 1).map((image) => (
                            <img key={image} className="d-block slider-product" src={image.imgUrl} alt="First slide" />
                          ))}
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </div>
                </div>
                <br></br>
                <div className="mt-2">
                  <span className="channel-name">You</span>
                  <button className="youtube-btn">Tube</button>
                </div>
                <div>
                  <Carousel className="ml-4 slid">
                    {youtube.map((slide, i) => (
                      <Carousel.Item key={i}>
                        <img style={{ width: '100%', height: '100%' }} className="d-block slider-youtube mt-2" src={slide.imageUrl} alt="First slide" />
                        <a href={slide.vedioUrl} target="_blank">
                          <div className="middle d-flex justify-content-center">
                            <div className="text ">
                              <img src="./assets/video_icon.png" style={{ height: 40, width: 40, color: 'white', marginTop: -10 }} alt="location" />
                            </div>
                          </div>
                        </a>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </div>
                <br></br>
              </div>
            </div>
            {/* super deails */}
            <br></br>
            <ReactWhatsapp className="icon-bar" number="+923066801200" style={{ float: 'right', zIndex:"5" }}>
              <a className="whatsapp">
                <i className="fa fa-whatsapp" style={{ width: '23px' }}></i>
              </a>
            </ReactWhatsapp>
            <div className="super-deal">
              <div className="row g-4 ">
                <div className="deal-content">
                  <p className="d-inline deal-text">
                    Super <span style={{ color: 'red' }}>Deal</span>{' '}
                  </p>
                  <span className="discount Incredible_price">Top products. Incredible price.</span>
                  <TimeCounter />
                  <button className="d-inline view-more">
                    <NavLink to={`/productList/${1}`}>View more </NavLink>
                  </button>
                </div>
                {saleProduct.map((product) => (
                  <div className="col-lg-2 col-md-4 col-sm-12 ml-2" key={product.productId}>
                    <br></br>
                    <div className="card">
                      <div className="d-inline">
                        <button className="discount-btn">-{Math.trunc(((product.price-product.discountPrice)/product.price)*100)}%</button>
                      </div>
                      {product.productMedias[0] == null ? (
                        <>
                          <span style={{ diplay: 'block', width: '100%' }}>
                            <NavLink style={{ width: '100%' }} to={`/product/view/${product.productId}`}>
                              <img className="sale-product-img" src="./assets/Auth/Default-img.png" alt={product.productName} />
                            </NavLink>
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
                          </span>
                        </>
                      ) : (
                        <span style={{ diplay: 'block', width: '100%' }}>
                          {product.productMedias.length !== 0 ? (
                            <>
                              {product.productMedias.slice(0, 1).map((image, i) => (
                                <NavLink style={{ width: '100%' }} key={i} to={`/product/view/${product.productId}`}>
                                  <img className="sale-product-img" src={image.imgUrl} alt={product.productName} />
                                </NavLink>
                              ))}
                            </>
                          ) : (
                            <NavLink style={{ width: '100%' }} to={`/product/view/${product.productId}`}>
                              <img className="sale-product-img" src="./assets/Auth/default-img.png" alt={product.productName} />
                            </NavLink>
                          )}
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
                        </span>
                      )}
                      <div className=" d-flex justify-content-center home-product-name ">
                        <span className="text-line">{product.productName}</span>
                      </div>
                      <div className=" d-flex justify-content-between">
                        <p className="product-price-slider">RS: {product.discountPrice}</p>
                        <p className="product-price-slider price-with-discount">RS: {product.price}</p>
                      </div>
                      <div className="d-inline">
                        <p className="sold-out d-inline">{product.productSold} sold</p>
                        {product.freeShippingLabel ? <img className="product-price-org d-inline" src="./assets/delivery-img.png" alt="sold-out" /> : <></>}
                      </div>
                      <br></br>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* new Arival */}
            <br></br>
            <TopProduct appRefresher={appRefresher} setAppRefresher={setAppRefresher} />
            <br></br>
            {/* Subcategory Products */}
            {categoryProduct.map((product) => (
              <div key={product.categoryId} className="super-deal">
                <div className="row g-4 ">
                  <div className="deal-content">
                    <p className="d-inline deal-text">{product.name}</p>
                    <button className="d-inline view-more">
                      <NavLink to={`/categoryProducts/${product.categoryId}`}>View more </NavLink>
                    </button>
                  </div>
                  {product.products.map((data) => (
                    <div className="col-lg-2 col-md-4 col-sm-12 ml-2" key={data.productId}>
                      <div className="card">
                        {data.productMedias[0] === null ? (
                          <>
                            <span style={{ diplay: 'block', width: '100%' }}>
                              <NavLink style={{ width: '100%' }} to={`/product/view/${data.productId}`}>
                                <img className="sale-product-img" src="./assets/Auth/Default-img.png" alt={data.productName} />
                              </NavLink>
                              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                                  <li className="icon" onClick={() => getProductDetail(data.productId)}>
                                    <span className="fa fa-eye" onClick={() => EditOpenModal(data.productId)}></span>
                                  </li>
                                  <li className="icon">{data.isInWishList ? <span className="fa fa-heart bgBlue" title="Remove from Wishlist" onClick={() => RemoveToWishList(data)}></span> : <span className="fa fa-heart" title="Add to WishList" onClick={() => AddToWishList(data)}></span>}</li>
                                  <li className="icon">{data.isInCart ? <span className="fa fa-shopping-cart bgBlue" title="Remove from Cart" onClick={() => RemoveFromCart(data)}></span> : <span className="fa fa-shopping-cart" title="Add to Cart" onClick={() => AddToCart(data)}></span>}</li>
                                </ul>
                              </div>
                            </span>
                          </>
                        ) : (
                          <>
                            <span style={{ diplay: 'block', width: '100%' }}>
                              {data.productMedias.slice(0, 1).map((image) => (
                                <NavLink style={{ width: '100%' }} key={image} to={`/product/view/${data.productId}`}>
                                  <img className="product-img" style={{ width: '100%' }} src={image.imgUrl} alt={data.productName} />
                                </NavLink>
                              ))}
                              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                                  <li className="icon" onClick={() => getProductDetail(data.productId)}>
                                    <span className="fa fa-eye" onClick={() => EditOpenModal(data.productId)}></span>
                                  </li>
                                  <li className="icon mid-icon">
                                    {data.isInWishList ? <span className="fa fa-heart bgBlue" title="Remove from Wishlist" onClick={() => RemoveToWishList(data)}></span> : <span className="fa fa-heart" title="Add to WishList" onClick={() => AddToWishList(data)}></span>}
                                  </li>
                                  <li className="icon">{data.isInCart ? <span className="fa fa-shopping-cart bgBlue" title="Remove from Cart" onClick={() => RemoveFromCart(data)}></span> : <span className="fa fa-shopping-cart" title="Add to Cart" onClick={() => AddToCart(data)}></span>}</li>
                                </ul>
                              </div>
                            </span>
                          </>
                        )}
                        <div className="d-inline">
                          <p className="arrival-product-name d-inline">
                            <span className="text-line ml-2">{data.productName}</span>
                          </p>
                          <button className="rating d-inline" style={{ marginLeft: '10px', textAlign: 'center', width: '30px' }}>
                            {data.rating} <i class="fa fa-star" aria-hidden="true" style={{ marginLeft: '5px' }}></i>
                          </button>
                          <p className="d-inline charges-sold">{data.productSold} sold</p>
                          <br />
                          {data.discountPrice === 0 ? (
                            <p className="product-price d-inline">RS: {data.price}</p>
                          ) : (
                            <div className="d-inline">
                              <p className="product-price d-inline">RS: {Math.trunc(data.discountPrice)}</p>
                              <p className="product-price-org d-inline">PKR: {data.price}</p>
                            </div>
                          )}
                        </div>
                        <br></br>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {subcategoryProduct.map((product) => (
              <div key={product.subCategoryId} className="super-deal">
                <div className="row g-4 ">
                  <div className="deal-content">
                    <p className="d-inline deal-text">{product.name}</p>
                    <button className="d-inline view-more">
                      <NavLink to={`/products/${product.subCategoryId}`}>View more </NavLink>
                    </button>
                  </div>
                  {product.products.map((data) => (
                    <div className="col-lg-2 col-md-4 col-sm-12 ml-2" key={data.productId}>
                      <div className="card">
                        {data.productMedias[0] === null ? (
                          <>
                            <span style={{ diplay: 'block', width: '100%' }}>
                              <NavLink style={{ width: '100%' }} to={`/product/view/${data.productId}`}>
                                <img className="sale-product-img" src="./assets/Auth/Default-img.png" alt={data.productName} />
                              </NavLink>
                              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                                  <li className="icon" onClick={() => getProductDetail(data.productId)}>
                                    <span className="fa fa-eye" onClick={() => EditOpenModal(data.productId)}></span>
                                  </li>
                                  <li className="icon">{data.isInWishList ? <span className="fa fa-heart bgBlue" title="Remove from Wishlist" onClick={() => RemoveToWishList(data)}></span> : <span className="fa fa-heart" title="Add to WishList" onClick={() => AddToWishList(data)}></span>}</li>
                                  <li className="icon">{data.isInCart ? <span className="fa fa-shopping-cart bgBlue" title="Remove from Cart" onClick={() => RemoveFromCart(data)}></span> : <span className="fa fa-shopping-cart" title="Add to Cart" onClick={() => AddToCart(data)}></span>}</li>
                                </ul>
                              </div>
                            </span>
                          </>
                        ) : (
                          <>
                            <span style={{ diplay: 'block', width: '100%' }}>
                              {data.productMedias.length === 0 ? (
                                <img className="product-img" style={{ width: '100%' }} src="./assets/Auth/default-img.png" alt="Product Image" />
                              ) : (
                                <>
                                  {data.productMedias.slice(0, 1).map((image) => (
                                    <NavLink style={{ width: '100%' }} key={image} to={`/product/view/${data.productId}`}>
                                      <img className="product-img" style={{ width: '100%' }} src={image.imgUrl} alt={data.productName} />
                                    </NavLink>
                                  ))}
                                </>
                              )}
                              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                                  <li className="icon" onClick={() => getProductDetail(data.productId)}>
                                    <span className="fa fa-eye" onClick={() => EditOpenModal(data.productId)}></span>
                                  </li>
                                  <li className="icon mid-icon">
                                    {data.isInWishList ? <span className="fa fa-heart bgBlue" title="Remove from Wishlist" onClick={() => RemoveToWishList(data)}></span> : <span className="fa fa-heart" title="Add to WishList" onClick={() => AddToWishList(data)}></span>}
                                  </li>
                                  <li className="icon">{data.isInCart ? <span className="fa fa-shopping-cart bgBlue" title="Remove from Cart" onClick={() => RemoveFromCart(data)}></span> : <span className="fa fa-shopping-cart" title="Add to Cart" onClick={() => AddToCart(data)}></span>}</li>
                                </ul>
                              </div>
                            </span>
                          </>
                        )}
                        <div className="mt-1 d-inline">
                          <p className="arrival-product-name d-inline">
                            <span className="text-line ml-2">{data.productName}</span>
                          </p>
                          <div className='mt-1'>
                          <button className="rating d-inline" style={{ marginLeft: '10px', textAlign: 'center', width: '30px' }}>
                            {data.rating}
                            <i className="fa fa-star" aria-hidden="true" style={{ marginLeft: '5px' }}></i>
                          </button>
                          <p className="d-inline charges-sold">{data.productSold} sold</p>
                          </div>
                          <br />
                          {data.discountPrice === 0 ? (
                            <p className="product-price d-inline">RS: {data.price}</p>
                          ) : (
                            <div className="d-inline">
                              <p className="product-price d-inline">RS: {Math.trunc(data.discountPrice)}</p>
                              <p className="product-price-org d-inline">PKR: {data.price}</p>
                            </div>
                          )}
                        </div>
                        <br></br>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <br></br>
          </div>
        </div>
      </>
    );
  };
  return (
    <div>
      <div className="mb-4 pl-3 pr-3">
        <div className="row justify-content-center">{loading ? <Loading /> : <ShowProducts />}</div>
      </div>
      <div className=" model">
        <Modal open={Editopen} onClose={EditCloseModal} center>
          <br></br>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 ">
              {productDetail[0] === null ? (
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
              <div style={{width:"100%"}}>
                <h3>{productDetails.productName}</h3>
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
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Slider;
