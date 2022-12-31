import { NavLink, Link } from 'react-router-dom';
import './module.scss';
import { useLocation, useHistory } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { MdSpaceDashboard } from 'react-icons/md';
import { FaAddressCard } from 'react-icons/fa';
import { FaUserAlt } from 'react-icons/fa';
import { FaRegCaretSquareRight } from 'react-icons/fa';
import { FaHandPointDown } from 'react-icons/fa';
import { FaSlack } from 'react-icons/fa';
import { GiTwirlCenter } from 'react-icons/gi';
import { BsFillChatTextFill } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import { FiMove } from 'react-icons/fi';
import { GiHamburgerMenu } from 'react-icons/gi';
import { VscChromeClose } from 'react-icons/vsc';
import scrollreveal from 'scrollreveal';
import { publicRequest } from '../../requestMethod';
import { logout } from '../../redux/userRedux';
import { useDispatch, useSelector } from 'react-redux';
import localStorage from 'redux-persist/es/storage';
import { FaBeer } from 'react-icons/fa';
import { Fragment } from 'react';

function Navbar({ cartLength, orderLength, reviewLength }) {
  const pathname = window.location.pathname;
  const paths = pathname.split('/');
  const id = paths[2];
  const admin = paths[3];
  const location = useLocation();
  const UserNavbars = location.pathname === '/';
  const Orderdetail = location.pathname === `/orderdetail/${id}`;
  const Topproduct = location.pathname === '/topproduct';
  const Products = location.pathname === '/products';
  const Product = location.pathname === `/products/${id}`;
  const ProductByMainCate = location.pathname === `/mainCategoryProducts/${id}`;
  const ProductBySubCate = location.pathname === `/categoryProducts/${id}`;
  const Cart = location.pathname === '/carts';
  const Login = location.pathname === '/login';
  const Register = location.pathname === '/register';
  const ForgotPassword = location.pathname === '/forgotPassword';
  const Productview = location.pathname === `/product/view/${admin}`;
  const searchProduct = location.pathname === `/searchProduct/${id}`;
  const BuyNow = location.pathname === `/buyNow/${id}`;
  const Checkout = location.pathname === '/checkout';
  const Wishlist = location.pathname === '/wishlist';
  const ContactUs = location.pathname === '/contact';
  const productLists = location.pathname === '/productLists';
  const ProductList = location.pathname === `/productList/${id}`;
  const _UserNavbars = location.pathname === `/users/orderdetail/${admin}`;
  const _UserAddReview = location.pathname === `/users/addreview/${admin}`;
  const _UserOrderReturn = location.pathname === `/users/return/${admin}`;
  const _UserwriteReview = location.pathname === `/users/writeReview/${admin}`;
  const _UserManageOrders = location.pathname === `/users/manage-orders/${admin}`;
  const _UserCancellations = location.pathname === `/users/cancellations/${admin}`;

  const AdminNavbars = location.pathname === '/admin/sidebar';
  const AdminDashboard = location.pathname === '/admin/dashboard';
  const AdminProducts = location.pathname === '/admin/products';
  const AdminMianCategory = location.pathname === '/admin/mainCategory';
  const AdminOrders = location.pathname === '/admin/orders';
  const AdminOrderDetail = location.pathname === `/admin/orderdetail/${admin}`;
  const AdminSlider = location.pathname === '/admin/slider';
  const AdminFooter = location.pathname === '/admin/FooterDetail';
  const AdminYoutube = location.pathname === '/admin/Youtube';
  const AdminCustomer = location.pathname === '/admin/customer';
  const AdminReviews = location.pathname === '/admin/review';
  const AdminBrands = location.pathname === '/admin/brandsAndWarrantes';
  const AdminCategory = location.pathname === `/admin/category/${admin}`;
  const AdminSubCategory = location.pathname === `/admin/subCategory/${admin}`;
  const ProductBySubcate = location.pathname === `/admin/ProductsBySubcategory/${admin}`;
  const Account = location.pathname === '/users/myAccount';
  const MyProfile = location.pathname === '/users/myProfile';
  const MyAddress = location.pathname === '/users/myAddress';
  const MyOrders = location.pathname === '/users/myOrders';
  const Reviews = location.pathname === '/users/reviews';
  const MyCancellation = location.pathname === `/users/cancellations`;
  const MyReturn = location.pathname === `/users/return`;
  const WriteReview = location.pathname === `/users/writeReview`;
  const ManageOrders = location.pathname === `/users/manage-orders`;


  const [scrollNav, setScrollNav] = useState(false);
  const [showRespSearch, setShowRespSearch] = useState(true);
  const role = useSelector((state) => state.user.currentUser && state.user.currentUser.role);
  const [prevLocation,setPrevLocation] = useState();
  useEffect(()=>{
    setPrevLocation(window.location.pathname);
  },[!(window.location.pathname)])
  useEffect(()=>{
    prevLocation === window.location.pathname ? setPrevLocation(window.location.pathname) : setShowRespSearch(true); setPrevLocation(window.location.pathname);
  },[window.location.pathname])
  const UserNavbar = () => {
    const dispatch = useDispatch();
    const [orders, setOrder] = useState([]);
    const [mainCategories, setMainCategories] = useState([]);
    const [subCatShow, setSubCatShow] = useState();
    const [catShow, setCatShow] = useState();
    const [filterProduct, setFilterProduct] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState(null);
    const componentMounted = useRef(true);
    const [spinner, setSpinner] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(null);
    const [scrollDirection, setScrollDirection] = useState(true);
    const history = useHistory();
    const scrolly = useRef(0);
    useEffect(() => {
      if(filterProduct != "")
      {
        setSpinner(true)
        const getProductsbyKey = async () => {
          try {
            const res = await publicRequest.get(`Home/get-products-by-search/${filterProduct}`);
            setSearchSuggestions(res.data.data);
            setSpinner(false)
          } catch {}
        };
        getProductsbyKey();
      }
        
    }, [filterProduct]);
    useEffect(() => {
      const getOrder = async () => {
        try {
          const res = await publicRequest.get('Cart/get-user-Cart-products', {
            headers: {
              Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
            },
          });
          setOrder(res.data.data);
        } catch {}
      };
      getOrder();
    }, []);
    const handleChange = (value) => {
      setFilterProduct(value);
    };
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
    const ProductLenght = orders.length;
    const user = useSelector((state) => state.user.currentUser);
    const changeNavbar = () => {
      if (window.scrollY >= 1) 
      {
        setScrollNav(true);
        if(scrollPosition > window.scrollY)
        {setScrollDirection(false);}
        else if(scrollPosition < window.scrollY){
          setScrollDirection(true);
        }
        setScrollPosition(window.scrollY);
      
      }
      else 
        setScrollNav(false);
    };
    window.addEventListener('scroll', changeNavbar);
    const handleClick = () => {
      window.location.assign(`/searchProduct/${filterProduct}`)
    } 
    return (
      <div className="row">
        <nav className={` navbar-expand-lg navbar-light py-1 shadow-sm ${scrollNav ? 'navbar scrolled fixed-top' : 'navbar'} `}>
          <div className={`${scrollNav && (scrollDirection)?"mt-2":""} container`}>
            <NavLink onClick={() => setShowRespSearch(true)} className={scrollNav?"":"navbar-brand"} to="/">
              <div className="fadeIn first">
                <img src="./assets/alladainlogo.png" alt="User Icon" className='logo' />
              </div>
            </NavLink>
            {showRespSearch ? (<>
              <div className=" resp-search">
                <div className="Container-navbar">
                  <div className="Form-group ">
                    <input
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && filterProduct != '') {
                          setSpinner(true)
                          handleClick();
                        }
                      }}
                      type="text" className="search-bar d-inline " placeholder="Search products..." onChange={e=>handleChange(e.target.value)} 
                    />
                    {filterProduct != '' ? (
                      <NavLink onClick={()=> setSpinner(true)} to={`/searchProduct/${filterProduct}`}>
                        {spinner?
                          <i style={{color:"black"}} className="fa fa-spinner ml-4 fa-spin"></i>
                          :
                          <i className="fa fa-search d-inline cursor-pointer" aria-hidden="true">
                            {' '}
                          </i>
                        }
                      </NavLink>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                {searchSuggestions!= null && filterProduct!=""?
                        <div className='search-suggestion-group'>
                         {searchSuggestions.slice(0,3).map((product,i)=> (
                          <NavLink key={i} to={`/product/view/${product.productId}`}>
                          <div style={{height:"100px"}} className='d-flex'>
                            <div>
                              {product.productMedias.slice(0, 1).map((image,i)=> (
                                <img key={i} width="100px" height="100%" src={image.imgUrl} />
                              ))}
                              </div>
                              <div className='searh-suggestion-textField' style={{color:"black",marginLeft:"20px",textAlign:"left"}}>
                                <span className="text-line searh-suggestion-productName">{product.productName}</span>
                                {product.discountPrice === 0 ? (
                                  <span>RS: {product.price}</span>
                                ) : (
                                  <>
                                    <span className="p-price">RS: {product.price}</span>
                                    {window.innerWidth <= 1100?
                                    <br/>:""}
                                    <span style={{marginLeft:"10px"}}>RS: {Math.trunc(product.discountPrice)}</span>
                                  </>
                                )}
                              </div>
                              <br />
                              <hr />
                          </div>
                          </NavLink>
                         ))}
                         {/* <NavLink to={`/searchProduct/${filterProduct}`}> */}
                         <button onClick={()=> window.location.assign(`/searchProduct/${filterProduct}`)} className='searh-suggestion-button'>View All {searchSuggestions.length} Items</button>
                         {/* </NavLink> */}
                        </div>
                        :""
                        }
              </div>
              {/* {scrollNav?
                <button className="navbar-toggler show" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={() => setShowRespSearch(!showRespSearch)}>
                  <span className="navbar-toggler-icon"></span>
                </button>
                :<></>} */}
                </>
            ) : (
              ''
            )}
            
            {(showRespSearch && window.innerWidth<=990)?
            <div style={{display:"flex",justifyContent:"center"}}>
                <NavLink onClick={() => setShowRespSearch(true)} to="/carts" className={`nav-item responsive-btn`}>
                  <div className={` content-center navbar-text  d-inline  ${window.location.pathname === '/carts' ? 'opened' : 'none'}`}>
                    <div style={{ width:"50px", textAlign:"center"}}>
                      {user ?
                        <div className=" cart-lenght">({cartLength})</div>
                      :""}
                      <div align="center">
                        <img style={user ? {}:{marginTop:"-5px",marginRight:"-9px"}} src={window.location.pathname === '/carts' ? './assets/red-cart.png' : './assets/shopping.png'} className={'fa-user-circle-o d-block navbar-text cart'} />
                      </div>
                    </div>
                  </div>
                </NavLink>
                <NavLink  to="/login" className={`nav-item responsive-btn ${window.location.pathname === '/login' ? 'opened' : 'none'}`}>
                  {user ? (
                    <div className="content-center navbar-text d-inline ">
                      {/* {!scrollNav ? (
                        <> */}
                        <div style={{ width:"50px", textAlign:"center"}}>
                          <div align="center">
                            <img src="./assets/account.png" className="fa-user-circle-o d-block" />
                          </div>
                          <div>
                            <div align="center">
                              <button
                                type="button"
                                className="btn dropDownButton dropdown-toggle dropdown-toggle-split"
                                style={{
                                  height: '0px',
                                  marginTop: '-25px',
                                  boxShadow: 'none',
                                  color: 'white',
                                }}
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              ></button>
                              <ul style={{zIndex:"4"}} className="navbar-dropdown dropdown-menu">
                                <button
                                  className="btn accountItems px-0"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    history.push('/users/myProfile');
                                    setShowRespSearch(true);
                                  }}
                                >
                                  <li className="accountItemsText">&nbsp;&nbsp;Profile</li>
                                </button>
                                {role !== 'Admin' ? (
                                  <>
                                    <br />
                                    <button
                                      className="btn accountItems px-0"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        history.push('/users/myAddress');
                                        setShowRespSearch(true);
                                      }}
                                    >
                                      <li className="accountItemsText">&nbsp;&nbsp;My Address</li>
                                    </button>
                                    <button
                                      className="btn accountItems px-0"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        history.push('/users/myOrders');
                                        setShowRespSearch(true);
                                      }}
                                    >
                                      <li className="accountItemsText">&nbsp;&nbsp;My Orders</li>
                                    </button>
                                    <button
                                      style={{ textDecoration: 'none' }}
                                      className="btn accountItems px-0"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        history.push('/users/cancellations/3');
                                        setShowRespSearch(true);
                                      }}
                                    >
                                      <li className="accountItemsText">&nbsp;&nbsp;My Cancelation</li>
                                    </button>
                                    <button
                                      style={{ textDecoration: 'none' }}
                                      className="btn accountItems px-0"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        history.push('/users/return/8');
                                        setShowRespSearch(true);
                                      }}
                                    >
                                      <li className="accountItemsText">&nbsp;&nbsp;My Returns</li>
                                    </button>
                                    <button
                                      style={{ textDecoration: 'none' }}
                                      className="btn accountItems px-0"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        history.push('/users/reviews');
                                        setShowRespSearch(true);
                                      }}
                                    >
                                      <li className="accountItemsText">&nbsp;&nbsp;My Reviews</li>
                                    </button>
                                  </>
                                ) : (
                                  ''
                                )}
                                <li className="accountItemsLogout" onClick={() => {setShowRespSearch(true); dispatch(logout())}}>
                                  &nbsp;&nbsp;Log Out
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                    </div>
                  ) : (
                    <div className="content-center navbar-text d-inline ">
                      <div style={{ width:"50px", textAlign:"center"}}>
                        <div align="center">
                          <img src={window.location.pathname === '/login' ? './assets/red-user.png' : './assets/account.png'} className={'fa-user-circle-o d-block'} />
                        </div>
                      </div>
                    </div>
                  )}
                </NavLink>
            </div>
            :""}
            <button style={{height:"fit-content",marginTop:"10px"}} className="navbar-toggler show" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={() => setShowRespSearch(!showRespSearch)}>
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse ${showRespSearch ? '' : 'show'}`} id="navbarSupportedContent">
              <div align="center">
                <ul className="navbar-nav mb-2 mb-lg-0">
                  {!scrollNav ? (
                    <>
                      <NavLink onClick={() => setShowRespSearch(true)} className={`nav-link ${window.location.pathname === '/' ? 'opened' : ''}`} aria-current="page" to="/">
                        <li className={`nav-item navbar-text ${window.location.pathname === '/' ? 'opened' : ''}`}>Home</li>
                      </NavLink>
                      <NavLink onClick={() => setShowRespSearch(true)} className={`nav-link ${window.location.pathname === '/checkout' ? 'opened' : 'none'}`} to="/checkout">
                        <li className={`nav-item navbar-text ${window.location.pathname === '/checkout' ? 'opened' : ''}`}>Checkout</li>
                      </NavLink>{' '}
                    </>
                  ) : (
                    <>

                      <div
                        style={{
                          background: 'none',
                          marginTop: '20px',
                          width: '200px',
                          height: '60px',
                          textAlign: 'center',
                          zIndex:"4"
                        }}
                      >
                        <button className="category-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCategories" aria-controls="navbarCategories" aria-expanded="false" aria-label="Toggle navigation">
                          <i
                            style={{
                              width: '35px',
                              fontSize: '32px',
                              marginTop: '1px',
                              size: '52px',
                            }}
                            className="fa fa-bars fa-large "
                          ></i>
                        </button>
                        <div
                          className="collapse category-items"
                          id="navbarCategories"
                          style={{
                            marginTop: '13px',
                            padding: '10px',
                            zIndex: '2',
                            marginTop: '21px',
                            height: '60vh',
                            width: '285px',
                            // overflow: 'scroll',
                            borderRadius: '6px',
                          }}
                          onMouseLeave={() => {
                            setSubCatShow(null);
                            setCatShow(null);
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex' }}>
                              <div style={{ minWidth: '10px', padding: '18px' }} className="Togglesidebar nav-dropdown textColor">
                                <div className="categories">
                                  <i style={{ fontSize: '17px' }} className="fa fa-bars fa-large mt-2"></i>
                                  <a className="text-decoration-none" style={{ color: 'inherit' }}>
                                    <span className="cate-type toggleItems">Categories</span>
                                  </a>
                                </div>
                                <div className="sidebar-content">
                                  {mainCategories.map((miancategory,i) => (
                                    <div key={i} style={{ display: 'flex' }}>
                                      <div key={miancategory.mainCategoryId}>
                                        <div className="sidebar-item" key={miancategory.mainCategoryId}>
                                          <div style={{ width: 'fit-content' }} onMouseOver={() => setCatShow(miancategory.mainCategoryId)}>
                                            <span>
                                              <img
                                                src={miancategory.image}
                                                style={{
                                                  width: '30px',
                                                  height: '30px',
                                                }}
                                              />
                                            </span>
                                            <span style={{ marginLeft: '10px' }}>
                                              <NavLink onClick={() => setShowRespSearch(true)} style={{ fontSize: '14px' }} className="maincategory-name-box" to={`/mainCategoryProducts/${miancategory.mainCategoryId}`}>
                                                {miancategory.name}
                                              </NavLink>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        {catShow === miancategory.mainCategoryId ? (
                                          <div>
                                            {mainCategories.map((mainCat,i) => (
                                              <Fragment key={i}>
                                                {mainCat.mainCategoryId === catShow && mainCat.categories.length != [] ? (
                                                  <div key={miancategory.mainCategoryId} style={{ overflow: 'visible' }}>
                                                    <ul className="sub-cate subcategoryList" key={mainCat.mainCategoryId}>
                                                      {mainCat.categories.map((category) => (
                                                        <Fragment key={category.categoryId}>
                                                          <div style={{ marginLeft: '-55px', display: 'flex', flexStartDirection: 'row' }} key={category.categoryId}>
                                                            <div className="subCategoryBox">
                                                              <li key={category.categoryId} onMouseOver={() => setSubCatShow(category.categoryId)}>
                                                                <NavLink onClick={() => setShowRespSearch(true)} style={{ fontSize: '18px', backgroundColor: '#f8f5f5;' }} className="category-name-box" to={`/categoryProducts/${category.categoryId}`}>
                                                                  {category.name}
                                                                </NavLink>
                                                              </li>
                                                            </div>
                                                            {subCatShow === category.categoryId ? (
                                                              <>
                                                                {/* <div className='subcategoryItems'> */}
                                                                <ul style={{ listStyleType: 'none', marginLeft: '267px', position:"absolute"  }}>
                                                                  {category.subCategories.map((subcategory,i ) => (
                                                                    <Fragment key={i}>
                                                                      <li key={subcategory.subCategoryId}>
                                                                        <NavLink onClick={() => setShowRespSearch(true)} className="subcategory-name-box" to={`/products/${subcategory.subCategoryId}`}>
                                                                          {subcategory.name}
                                                                        </NavLink>
                                                                      </li>
                                                                    </Fragment>
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
                                              </Fragment>
                                            ))}
                                          </div>
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {/* <div style={{ overflow: 'scroll' }}>
                                {mainCategories.map((miancategory) => (
                                  <Fragment key={miancategory.mainCategoryId}>
                                    {miancategory.mainCategoryId === subCatShow && miancategory.categories.length != [] ? (
                                      <div
                                        style={{
                                          fontSize: '14px',
                                          overflow: 'visible',
                                        }}
                                        key={miancategory.mainCategoryId}
                                      >
                                        <ul className="sub-cate subcategoryList">
                                          {miancategory.categories.map((data) => (
                                            <div className="subCategoryBox" key={data.categoryId}>
                                              <li className="category-name-box" key={data.categoryId}>
                                                <NavLink style={{ fontSize: '14px' }} className="category-name-box" to={`/categoryProducts/${data.categoryId}`}>
                                                  {data.name}
                                                </NavLink>
                                              </li>
                                              {data.subCategories.map((subcategory) => (
                                                <li className="subcategory-name-box" key={subcategory.subCategoryId}>
                                                  <NavLink style={{ fontSize: '14px' }} to={`/ProductByCategoryId/${subcategory.subCategoryId}`}>
                                                    {subcategory.name}
                                                  </NavLink>
                                                  <hr></hr>
                                                </li>
                                              ))}
                                            </div>
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
                        </div>
                      </div>
                    </>
                  )}
                  <div align="center" className="d-inline">
                    <div className="Container-navbar">
                      <div style={scrollNav?{marginTop : "20px"} : {}} className="Form-group">
                        <input 
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && filterProduct != '') {
                              setSpinner(true);
                              handleClick();
                            }
                          }} 
                          type="text" className="search-bar d-inline " placeholder="Search products..." onChange={e=>handleChange(e.target.value)} 
                        />
                        {filterProduct != '' ? (
                          <NavLink onClick={()=>setSpinner(true)} style={{zIndex:"5"}} to={`/searchProduct/${filterProduct}`}>
                            {spinner?
                              <i style={{color:"black"}} className="fa fa-spinner fa-spin"></i>
                              :
                              <i className="fa fa-search d-inline cursor-pointer" aria-hidden="true">
                                {' '}
                              </i>
                            }
                          </NavLink>
                        ) : (
                          ''
                        )}
                      </div>
                      {searchSuggestions!= null && filterProduct!=""?
                        <div className='search-suggestion-group'>
                         {searchSuggestions.slice(0,3).map((product, i)=> (
                          <NavLink key={i} to={`/product/view/${product.productId}`}>
                          <div style={{height:"100px"}} className='d-flex'>
                            <div>
                              {product.productMedias.slice(0, 1).map((image,i)=> (
                                <img key={i} width="100px" height="100%" src={image.imgUrl} />
                              ))}
                              </div>
                              <div className='searh-suggestion-textField' style={{color:"black",marginLeft:"20px",textAlign:"left"}}>
                                <span className="text-line searh-suggestion-productName">{product.productName}</span>
                                {product.discountPrice === 0 ? (
                                  <span>RS: {product.price}</span>
                                ) : (
                                  <>
                                    <span className="p-price">RS: {product.price}</span>
                                    {window.innerWidth <= 1100?
                                    <br/>:""}
                                    <span style={{marginLeft:"10px"}}>RS: {Math.trunc(product.discountPrice)}</span>
                                  </>
                                )}
                              </div>
                              <br />
                              <hr />
                          </div>
                          </NavLink>
                         ))}
                         {/* <NavLink to={`/searchProduct/${filterProduct}`}> */}
                         <button onClick={()=> window.location.assign(`/searchProduct/${filterProduct}`)} className='searh-suggestion-button'>View All {searchSuggestions.length} Items</button>
                         {/* </NavLink> */}
                        </div>
                        :""
                        }
                    </div>
                  </div>
                </ul>
              </div>
              <div align="center">
                <div className="buttons">
                <NavLink onClick={() => setShowRespSearch(true)} to="/carts" className={`nav-item  ms-4 responsive-btn`}>
                  <div className={` content-center navbar-text  d-inline  ${window.location.pathname === '/carts' ? 'opened' : 'none'}`}>
                    <div style={{ width:"50px", textAlign:"center"}}>
                      <div className=" cart-lenght">({cartLength})</div>
                      <div align="center">
                        <img src={window.location.pathname === '/carts' ? './assets/red-cart.png' : './assets/shopping.png'} className={'fa-user-circle-o d-block navbar-text cart'} />
                      </div>
                      <div>
                        <span className={`account ${window.location.pathname === '/carts' ? 'opened' : 'none'}`}>Cart</span>
                      </div>
                    </div>
                  </div>
                </NavLink>
                <NavLink onClick={() => setShowRespSearch(true)} to="/wishlist" className={`nav-item ms-4 responsive-btn ${window.location.pathname === '/wishlist' ? 'opened' : 'none'}`}>
                  <div className="content-center navbar-text d-inline ">
                    <div style={{ width:"50px", textAlign:"center"}}>
                      <div align="center">
                        <img src={window.location.pathname === '/wishlist' ? './assets/heart-suit.png' : './assets/heart.png'} className={'fa-user-circle-o d-block'} />
                      </div>
                      <div>
                        <span className={`account ${window.location.pathname === '/wishlist' ? 'opened' : 'none'}`}>Wishlist</span>
                      </div>
                    </div>
                  </div>
                </NavLink>
                <NavLink  to="/login" className={`nav-item  ms-4 responsive-btn ${window.location.pathname === '/login' ? 'opened' : 'none'}`}>
                  {user ? (
                    <div className="content-center navbar-text d-inline ">
                      {/* {!scrollNav ? (
                        <> */}
                        <div style={{ width:"50px", textAlign:"center"}}>
                          <div align="center">
                            <img src="./assets/account.png" className="fa-user-circle-o d-block" />
                          </div>
                          <div>
                            <div align="center">
                              <button
                                type="button"
                                className="btn dropDownButton dropdown-toggle dropdown-toggle-split"
                                style={{
                                  height: '0px',
                                  marginTop: '-25px',
                                  boxShadow: 'none',
                                  color: 'white',
                                }}
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              ></button>
                              <ul className="navbar-dropdown dropdown-menu">
                                <button
                                  className="btn accountItems px-0"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    history.push('/users/myProfile');
                                    setShowRespSearch(true);
                                  }}
                                >
                                  <li className="accountItemsText">&nbsp;&nbsp;Profile</li>
                                </button>
                                {role !== 'Admin' ? (
                                  <>
                                    <br />
                                    <button
                                      className="btn accountItems px-0"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        history.push('/users/myAddress');
                                        setShowRespSearch(true);
                                      }}
                                    >
                                      <li className="accountItemsText">&nbsp;&nbsp;My Address</li>
                                    </button>
                                    <button
                                      className="btn accountItems px-0"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        history.push('/users/myOrders');
                                        setShowRespSearch(true);
                                      }}
                                    >
                                      <li className="accountItemsText">&nbsp;&nbsp;My Orders</li>
                                    </button>
                                    <button
                                      style={{ textDecoration: 'none' }}
                                      className="btn accountItems px-0"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        history.push('/users/cancellations/3');
                                        setShowRespSearch(true);
                                      }}
                                    >
                                      <li className="accountItemsText">&nbsp;&nbsp;My Cancelation</li>
                                    </button>
                                    <button
                                      style={{ textDecoration: 'none' }}
                                      className="btn accountItems px-0"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        history.push('/users/return/8');
                                        setShowRespSearch(true);
                                      }}
                                    >
                                      <li className="accountItemsText">&nbsp;&nbsp;My Returns</li>
                                    </button>
                                    <button
                                      style={{ textDecoration: 'none' }}
                                      className="btn accountItems px-0"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        history.push('/users/reviews');
                                        setShowRespSearch(true);
                                      }}
                                    >
                                      <li className="accountItemsText">&nbsp;&nbsp;My Reviews</li>
                                    </button>
                                  </>
                                ) : (
                                  ''
                                )}
                                <li className="accountItemsLogout" onClick={() => {setShowRespSearch(true); dispatch(logout())}}>
                                  &nbsp;&nbsp;Log Out
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        {/* </> */}
                      {/* ) : (
                        <>
                          <img src="./assets/account.png" className="fa-user-circle-o d-block" style={{ marginBottom: '-13px' }} />
                          <button
                            type="button"
                            className="btn dropdown-toggle dropdown-toggle-split"
                            style={{
                              marginLeft: '8px',
                              height: '0px',
                              marginBottom: '3px',
                              boxShadow: 'none',
                              color: 'white',
                            }}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          ></button>
                          <ul className="dropdown-menu navbar-dropdown">
                            <button
                              className="btn accountItems px-0"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                history.push('/users/myProfile');
                              }}
                            >
                              <li className="accountItemsText">&nbsp;&nbsp;Profile</li>
                            </button>
                            {role !== 'Admin' ? (
                              <>
                                <br />
                                <button
                                  className="btn accountItems px-0"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    history.push('/users/myAddress');
                                  }}
                                >
                                  <li className="accountItemsText">&nbsp;&nbsp;My Address</li>
                                </button>
                                <button
                                  className="btn accountItems px-0"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    history.push('/users/myOrders');
                                  }}
                                >
                                  <li className="accountItemsText">&nbsp;&nbsp;My Orders</li>
                                </button>
                                <button
                                  className="btn accountItems px-0"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    history.push('/users/cancellations/3');
                                  }}
                                >
                                  <li className="accountItemsText">&nbsp;&nbsp;My Cancelation</li>
                                </button>
                                <button
                                  className="btn accountItems px-0"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    history.push('/users/return/8');
                                  }}
                                >
                                  <li className="accountItemsText">&nbsp;&nbsp;My Returns</li>
                                </button>
                                <button
                                  className="btn accountItems px-0"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    history.push('/users/reviews');
                                  }}
                                >
                                  <li className="accountItemsText">&nbsp;&nbsp;My Reviews</li>
                                </button>
                              </>
                            ) : (
                              ''
                            )}
                            <li className="accountItemsLogout" onClick={() => dispatch(logout())}>
                              &nbsp;&nbsp;Log Out
                            </li>
                          </ul>
                        </>
                      )} */}
                    </div>
                  ) : (
                    <div className="content-center navbar-text d-inline ">
                      <div style={{ width:"50px", textAlign:"center"}}>
                        <div align="center">
                          <img src={window.location.pathname === '/login' ? './assets/red-user.png' : './assets/account.png'} className={'fa-user-circle-o d-block'} />
                        </div>
                        <div>
                        <span className={`account ${window.location.pathname === '/login' ? 'opened' : 'none'}`}>Account</span>
                        </div>
                      </div>
                    </div>
                  )}
                </NavLink>
                <NavLink onClick={() => setShowRespSearch(true)} className="navContact nav-item  ms-4 responsive-btn" to="">
                  {/* {!scrollNav ? ( */}
                    <div className=" content-center navbar-text d-inline  ">
                      <div style={{ width:"50px", textAlign:"center"}}>
                        <div align="center">
                        <i className="phoneIcon fa fa-phone"></i>
                        </div>
                        <p style={{ fontWeight: ' 400', fontSize: '14px' }}>0492722500</p>
                      </div>
                    </div>
                  {/* ) : (
                    <div className="phoneIconDiv scrolledNav content-center ">
                      <i className="phoneIcon fa fa-phone"></i>
                      <p style={{ fontWeight: ' 400', fontSize: '14px' }}>0492722500</p>
                    </div>
                  )} */}
                </NavLink>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  };
  const AminNavbar = () => {
    const dispatch = useDispatch();
    const [currentLink, setCurrentLink] = useState(0);
    const [navbarState, setNavbarState] = useState(false);

    const html = document.querySelector('html');
    const role = useSelector((state) => state.user.currentUser && state.user.currentUser.role);
    // html.addEventListener("click", () => setNavbarState(false));

    useEffect(() => {
      const sr = scrollreveal({
        origin: 'left',
        distance: '80px',
        duration: 1000,
        reset: false,
      });

      sr.reveal(
        `.brand,
       .links>ul>li:nth-of-type(1),
      .links>ul>li:nth-of-type(2),
      .links>ul>li:nth-of-type(3),
      .links>ul>li:nth-of-type(4),
      .links>ul>li:nth-of-type(5),
      .links>ul>li:nth-of-type(6),
      .links>ul>li:nth-of-type(7),
      .links>ul>li:nth-of-type(8),
      .logout
      `,
        {
          opacity: 0,
          interval: 300,
        }
      );
    }, []);

    return (
      <>
        <Section>
          <div className="top">
            <div className="brand">
              <Link to="/">
                <img className="logo-img" src="./assets/AdminPannel/logo.png" />
              </Link>
            </div>
            <div className="toggle">
              {navbarState ? (
                <VscChromeClose onClick={() => setNavbarState(false)} />
              ) : (
                <GiHamburgerMenu
                  onClick={(e) => {
                    e.stopPropagation();
                    setNavbarState(true);
                  }}
                />
              )}
            </div>
            <div className="links">
              <ul>
                <NavLink to="/admin/products">
                  <li className={currentLink === 1 ? 'active' : 'none'} onClick={() => setCurrentLink(1)}>
                    <FaSlack />
                    <span> Products</span>
                  </li>
                </NavLink>
                <NavLink to="/admin/mainCategory">
                  <li className={currentLink === 2 ? 'active' : 'none'} onClick={() => setCurrentLink(2)}>
                    <MdSpaceDashboard />
                    <span> Category</span>
                  </li>
                </NavLink>
                <NavLink to="/admin/orders">
                  <li className={currentLink === 3 ? 'active' : 'none'} onClick={() => setCurrentLink(3)}>
                    <FaAddressCard />
                    <span>
                      {' '}
                      Orders <span style={{ float: 'right' }}>{orderLength}</span>
                    </span>
                  </li>
                </NavLink>
                <NavLink to="/admin/review">
                  <li className={currentLink === 5 ? 'active' : 'none'} onClick={() => setCurrentLink(5)}>
                    <BsFillChatTextFill />
                    <span>
                      {' '}
                      Review <span style={{ float: 'right' }}>{reviewLength}</span>
                    </span>
                  </li>
                </NavLink>
                <NavLink to="/admin/slider">
                  <li className={currentLink === 6 ? 'active' : 'none'} onClick={() => setCurrentLink(6)}>
                    <FiMove />
                    <span> Slider</span>
                  </li>
                </NavLink>
                <NavLink to="/admin/Youtube">
                  <li className={currentLink === 7 ? 'active' : 'none'} onClick={() => setCurrentLink(7)}>
                    <FaRegCaretSquareRight />
                    <span> Youtube</span>
                  </li>
                </NavLink>
                <NavLink to="/admin/FooterDetail">
                  <li className={currentLink === 8 ? 'active' : 'none'} onClick={() => setCurrentLink(8)}>
                    <FaHandPointDown />
                    <span> Footer</span>
                  </li>
                </NavLink>
                <NavLink to="/admin/brandsAndWarrantes">
                  <li className={currentLink === 9 ? 'active' : 'none'} onClick={() => setCurrentLink(8)}>
                    <FaBeer />
                    <span> Brands</span>
                  </li>
                </NavLink>
              </ul>
            </div>
          </div>
          <NavLink to="/login">
            <div className="logout">
              <FiLogOut />
              <span className="logout" onClick={() => dispatch(logout())}>
                Logout
              </span>
            </div>
          </NavLink>
        </Section>
        <ResponsiveNav id="ResponsiveNav" state={navbarState} className={navbarState ? 'show' : ''}>
          <div className="responsive__links">
            <ul>
              <NavLink to="/admin/products">
                <li className={currentLink === 1 ? 'active' : 'none'} onClick={() => setCurrentLink(1)}>
                  <MdSpaceDashboard />
                  <span> Products</span>
                </li>
              </NavLink>

              <NavLink to="/admin/mainCategory">
                <li className={currentLink === 2 ? 'active' : 'none'} onClick={() => setCurrentLink(2)}>
                  <span> Category</span>
                </li>
              </NavLink>

              <NavLink to="/admin/orders">
                <li className={currentLink === 3 ? 'active' : 'none'} onClick={() => setCurrentLink(3)}>
                  <FaAddressCard />
                  <span> Orders</span>
                </li>
              </NavLink>
              <li className={currentLink === 4 ? 'active' : 'none'} onClick={() => setCurrentLink(4)}>
                <GiTwirlCenter />
                <span> Users</span>
              </li>
              <NavLink to="/admin/review">
                <li className={currentLink === 5 ? 'active' : 'none'} onClick={() => setCurrentLink(5)}>
                  <BsFillChatTextFill />
                  <span> Review</span>
                </li>
              </NavLink>
            </ul>
          </div>
        </ResponsiveNav>
      </>
    );
  };
  return (
    <div className="background">
      {UserNavbars && <UserNavbar />}
      {ProductByMainCate && <UserNavbar />}
      {ProductBySubCate && <UserNavbar />}
      {Orderdetail && <UserNavbar />}
      {Topproduct && <UserNavbar />}
      {Products && <UserNavbar />}
      {Product && <UserNavbar />}
      {Cart && <UserNavbar />}
      {Login && <UserNavbar />}
      {Register && <UserNavbar />}
      {ForgotPassword && <UserNavbar />}
      {Checkout && <UserNavbar />}
      {Wishlist && <UserNavbar />}
      {Productview && <UserNavbar />}
      {ContactUs && <UserNavbar />}
      {ProductList && <UserNavbar />}
      {Account && <UserNavbar />}
      {MyProfile && <UserNavbar />}
      {MyAddress && <UserNavbar />}
      {MyOrders && <UserNavbar />}
      {Reviews && <UserNavbar />}
      {MyCancellation && <UserNavbar />}
      {MyReturn && <UserNavbar />}
      {WriteReview && <UserNavbar />}
      {ManageOrders && <UserNavbar />}
      {_UserNavbars && <UserNavbar />}
      {productLists && <UserNavbar />}
      {_UserAddReview && <UserNavbar />}
      {_UserOrderReturn && <UserNavbar />}
      {_UserwriteReview && <UserNavbar />}
      {_UserManageOrders && <UserNavbar />}
      {_UserCancellations && <UserNavbar />}
      {searchProduct && <UserNavbar />}
      {BuyNow && <UserNavbar />}
      {AdminNavbars && <AminNavbar />}
      {AdminFooter && <AminNavbar />}
      {AdminYoutube && <AminNavbar />}
      {AdminSlider && <AminNavbar />}
      {AdminCustomer && <AminNavbar />}
      {AdminDashboard && <AminNavbar />}
      {AdminProducts && <AminNavbar />}
      {AdminCategory && <AminNavbar />}
      {AdminOrders && <AminNavbar />}
      {AdminOrderDetail && <AminNavbar />}
      {AdminReviews && <AminNavbar />}
      {AdminMianCategory && <AminNavbar />}
      {AdminSubCategory && <AminNavbar />}
      {AdminBrands && <AminNavbar />}
      {ProductBySubcate && <AminNavbar />}
    </div>
  );
}

const Section = styled.section`
  position: fixed;
  left: 0;
  background-color: #23334c;
  height: 100vh;
  width: 18vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 0;
  gap: 2rem;

  .top {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    overflow: scroll;
    .toggle {
      display: none;
    }
    .brand {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      svg {
        color: #ffc107;
        font-size: 2rem;
      }
      span {
        font-size: 2rem;
        color: #ffc107;
        font-family: 'Permanent Marker', cursive;
      }
    }
    .links {
      display: flex;
      justify-content: center;
      ul {
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 219px;
        li {
          padding: 0.6rem 1rem;
          border-radius: 0.6rem;
          &:hover {
            background-color: #ffc107;
            a {
              color: black;
            }
          }
          a {
            text-decoration: none;
            display: flex;
            gap: 1rem;
            color: white;
          }
        }
        .active {
          background-color: #ffc107;
          border-radius: 0.6rem;
          a {
            color: black;
          }
        }
      }
    }
  }
  .logout {
    padding: 0.3rem 1rem;
    border-radius: 0.6rem;
    &:hover {
      background-color: #da0037;
    }
    a {
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: white;
    }
  }
  @media screen and (min-width: 280px) and (max-width: 1080px) {
    position: initial;
    width: 100%;
    min-width: 1055px;

    height: max-content;
    padding: 1rem;
    .top {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      height: max-content;

      .toggle {
        display: block;
        color: white;
        z-index: 99;
        svg {
          font-size: 1.4rem;
        }
      }
      .brand {
        gap: 1rem;
        justify-content: flex-start;
      }
    }
    .top > .links,
    .logout {
      display: none;
    }
  }
`;
const ResponsiveNav = styled.div`
  position: fixed;
  right: -10vw;
  top: 0;
  z-index: 10;
  background-color: black;
  height: 100vh;
  width: ${({ state }) => (state ? '60%' : '0%')};
  transition: 0.4s ease-in-out;
  display: flex;
  opacity: 0;
  visibility: hidden;
  padding: 1rem;
  .responsive__links {
    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 3rem;
      li {
        padding: 0.6rem 1rem;
        border-radius: 0.6rem;
        &:hover {
          background-color: #ffc107;

          a {
            color: black;
          }
        }
        a {
          text-decoration: none;
          display: flex;
          gap: 1rem;
          color: white;
        }
      }
      .active {
        background-color: #ffc107;
        border-radius: 0.6rem;
        a {
          color: black;
        }
      }
    }
  }
`;

export default Navbar;
