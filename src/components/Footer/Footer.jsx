import React, { useState, useEffect, useMemo, useRef } from 'react';
import './footer.css';
import { useLocation } from 'react-router-dom';
import { FetchUrl } from '../../requestMethod';
const Footer = () => {
  const pathname = window.location.pathname;
  const paths = pathname.split('/');
  const id = paths[2];
  const admin = paths[3];
  const location = useLocation();
  const showMainFooter = location.pathname === '/';
  const searchProduct = location.pathname === `/searchProduct/${id}`;
  const showsubFooter = location.pathname === '/carts';
  const showsubFooter1 = location.pathname === '/login';
  const showsubFooter2 = location.pathname === '/register';
  const ForgotPassword = location.pathname === '/forgotPassword';
  const showsubFooter3 = location.pathname === `/product/view/${admin}`;
  const showsubFooter4 = location.pathname === '/checkout';
  const showsubFooter5 = location.pathname === '/wishlist';
  const BuyNow = location.pathname === `/buyNow/${id}`;
  const ProductByMainCate = location.pathname === `/mainCategoryProducts/${id}`;
  const ProductBySubCate = location.pathname === `/categoryProducts/${id}`;
  const showsubFooter6 = location.pathname === `/orderdetail/${id}`;
  const _UserNavbars = location.pathname === `/users/orderdetail/${admin}`;
  const _UserAddReview = location.pathname === `/users/addreview/${admin}`;
  const _UserOrderReturn = location.pathname === `/users/return/${admin}`;
  const _UserwriteReview = location.pathname === `/users/writeReview/${admin}`;
  const _UserManageOrders = location.pathname === `/users/manage-orders/${admin}`;
  const _UserCancellations = location.pathname === `/users/cancellations/${admin}`;
  const _UsermyAddress = location.pathname === '/users/myAddress';
  const _UsermyOrders = location.pathname === '/users/myOrders';
  const _UsermyProfile = location.pathname === '/users/myProfile';
  const _Userreviews = location.pathname === '/users/reviews';
  const ContactUs = location.pathname === '/contact';
  const ProductList = location.pathname === `/productList/${id}`;
  const Account = location.pathname === `/users/myAccount`;
  const [footer, setFooter] = useState([]);
  const [Services, setServices] = useState([]);
  const componentMounted = useRef(true);
  const servicesMounted = useRef(true);

  useEffect(() => {
    fetch(FetchUrl + 'Home/get-ShopDetail').then((result) => {
      if (componentMounted.current) {
        result.json().then((resp) => {
          setFooter(resp.data);
        });
      }
    });
    return () => {
      componentMounted.current = false;
    };
  }, []);
  useEffect(() => {
    fetch(FetchUrl + 'Home/get-services').then((result) => {
      if (servicesMounted.current) {
        result.json().then((resp) => {
          setServices(resp.data);
        });
      }
    });
    return () => {
      servicesMounted.current = false;
    };
  }, []);
  const MainFooter = () => {
    return (
      <div className="row">
        <footer className="page-footer font-small blue pt-4 bg-footer text-white" style={{ marginTop: '-25px' }}>
          <div className="container-fluid text-center text-md-left">
            <div className="row text-align">
              <div className="row text-align">
                {Services.map((Service) => (
                  <div className="top-footer mb-md-0 mb-3">
                    <img className="footer-img" style={{ width: '50px', height: '40px' }} src={Service.iconImageUrl} />
                    <ul className="list-unstyled text-white">
                      <li>
                        <a className="greate-value">{Service.heading}</a>
                      </li>
                      <li>
                        <a className="text-white">{Service.description}</a>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
              <hr className="hr-line" />
              <div className="col-lg-3 col-md-6 col-sm-12 top-footers mb-md-0 mb-4">
                <div className="row">
                  <div className="col-lg-10 col-md-10 col-sm-12">
                    <p className="greate-value margin">Menu</p>
                    <ul className="list-unstyled text-white margin">
                      <li>
                        <a href="/" className="text-white">
                          Home
                        </a>
                      </li>
                      <li>
                        <a className="text-white">Blog</a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-lg-2 col-md-2 col-sm-12">
                    <img className="vr-line" src="./assets/wishlist/vr-line.png" />
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 top-footers mb-md-0 mb-4">
                <div className="row">
                  <div className="col-lg-10 col-md-10 col-sm-12">
                    <p className="greate-value margin">About</p>
                    <ul className="list-unstyled text-white margin">
                      <li>
                        <a className="text-white">Term of use</a>
                      </li>
                      <li>
                        <a className="text-white">Privacy Policy</a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-lg-2 col-md-2 col-sm-12">
                    <img className="vr-line" src="./assets/wishlist/vr-line.png" />
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 top-footers mb-md-0 mb-4">
                <div className="row">
                  <div className="col-lg-10 col-md-10 col-sm-12">
                    <p className="greate-value margin">Follow us</p>
                    <ul className="list-unstyled text-white margin">
                      <span className="d-inlie">
                        <li className="d-inline">
                          <a href={footer.faceBookLink} target="_blank" className="text-white d-pointer">
                            <img src="./assets/footer/facebook-icon.png" alt="facebook" /> &nbsp;Facebook
                          </a>
                        </li>
                        <li className="d-inline">
                          <a href={footer.youtubeLink} target="_blank" className="text-white socail-margin d-pointer">
                            <img src="./assets/footer/youtube-icon.png" alt="youtube" /> &nbsp;Youtube
                          </a>
                        </li>
                      </span>
                      <br></br>
                      <span className="d-inlie">
                        <li className="d-inline">
                          <a href={footer.instagramLink} target="_blank" className="text-white d-pointer">
                            <img src="./assets/footer/twitter-icon.png" alt="twitter" /> &nbsp;Twitter
                          </a>
                        </li>
                        <li className="d-inline">
                          <a href={footer.linkedInLink} target="_blank" className="text-white socail-margin-link d-pointer">
                            <img src="./assets/footer/linkdin-icon.png" alt="linkdin" /> &nbsp;Linkedin
                          </a>
                        </li>
                      </span>
                    </ul>
                  </div>
                  <div className="col-lg-2 col-md-2 col-sm-12">
                    <img className="vr-line" src="./assets/wishlist/vr-line.png" />
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 top-footers-ui mb-md-0 ">
                <div className="row">
                  <div className="col-lg-10 col-md-10 col-sm-12">
                    <p className="greate-value margin ">Contact</p>
                    <ul className="list-unstyled text-white ">
                      <li className="mt-1">
                        <img src="./assets/footer/location-icon.png" alt="location" /> &nbsp;{' '}
                        <a className="text-white">
                          {' '}
                          {footer.address1}, {footer.address2}
                        </a>
                      </li>
                      <li className="mt-1">
                        <img src="./assets/footer/phone-icon.png" alt="phone" /> &nbsp; <a className="text-white">Phone no: {footer.phoneNo1} </a>
                      </li>
                      <li className="mt-1">
                        <img src="./assets/footer/whatsapp-icon.png" alt="whatsapp" /> &nbsp; <a className="text-white">Whatsapp: {footer.whatsappNo1}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  };
  const SubFooter = () => {
    return (
      <div className="row">
        <footer className="sub-footer font-small blue pt-4 bg-footer text-white" style={{ marginTop: '-25px' }}>
          <div className="container-fluid text-center text-md-left">
            <div className="row text-align mb-5">
              <div className="col-lg-3 col-md-6 col-sm-12 top-footers mb-md-0 mb-3">
                <div className="row">
                  <div className="col-lg-10 col-md-10 col-sm-12">
                    <p className="greate-value margin">Menu</p>
                    <ul className="list-unstyled text-white margin">
                      <li>
                        <a href="/" className="text-white">
                          Home
                        </a>
                      </li>
                      <li>
                        <a className="text-white">Blog</a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-lg-2 col-md-2 col-sm-12">
                    <img className="vr-line" src="./assets/wishlist/vr-line.png" />
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 top-footers mb-md-0 mb-3">
                <div className="row">
                  <div className="col-lg-10 col-md-10 col-sm-12">
                    <p className="greate-value margin">About</p>
                    <ul className="list-unstyled text-white margin">
                      <li>
                        <a className="text-white">Term of use</a>
                      </li>
                      <li>
                        <a className="text-white">Privacy Policy</a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-lg-2 col-md-2 col-sm-12">
                    <img className="vr-line" src="./assets/wishlist/vr-line.png" />
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 top-footers mb-md-0 mb-3">
                <div className="row">
                  <div className="col-lg-10 col-md-10 col-sm-12">
                    <p className="greate-value margin">Follow us</p>
                    <ul className="list-unstyled text-white margin">
                      <span className="d-inlie">
                        <li className="d-inline">
                          <a href="{footer.faceBookLink}" target="_blank" className="text-white">
                            <img src="./assets/footer/facebook-icon.png" alt="facebook" /> &nbsp;Facebook
                          </a>
                        </li>
                        <li className="d-inline">
                          <a href="{footer.youtubeLink}" target="_blank" className="text-white socail-margin">
                            <img src="./assets/footer/youtube-icon.png" alt="youtube" /> &nbsp;Youtube
                          </a>
                        </li>
                      </span>
                      <br></br>
                      <span className="d-inlie">
                        <li className="d-inline">
                          <a href="{footer.instagramLink}" target="_blank" className="text-white">
                            <img src="./assets/footer/twitter-icon.png" alt="twitter" /> &nbsp;Twitter
                          </a>
                        </li>
                        <li className="d-inline">
                          <a href="{footer.linkedInLink}" target="_blank" className="text-white socail-margin-link">
                            <img src="./assets/footer/linkdin-icon.png" alt="linkdin" /> &nbsp;Linkedin
                          </a>
                        </li>
                      </span>
                    </ul>
                  </div>
                  <div className="col-lg-2 col-md-2 col-sm-12">
                    <img className="vr-line" src="./assets/wishlist/vr-line.png" />
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 top-footers-ui mb-md-0 mb-3">
                <div className="row">
                  <div className="col-lg-10 col-md-10 col-sm-12">
                    <p className="greate-value margin ">Contact</p>
                    <ul className="list-unstyled text-white ">
                      <li className="mt-1">
                        <img src="./assets/footer/location-icon.png" alt="location" /> &nbsp;{' '}
                        <a className="text-white">
                          {footer.address1}, {footer.address2}
                        </a>
                      </li>
                      <li className="mt-1">
                        <img src="./assets/footer/phone-icon.png" alt="phone" /> &nbsp; <a className="text-white">Phone no: {footer.phoneNo1}</a>
                      </li>
                      <li className="mt-1">
                        <img src="./assets/footer/whatsapp-icon.png" alt="whatsapp" /> &nbsp; <a className="text-white">Whatsapp: {footer.whatsappNo1}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <br></br>
            <br></br>
          </div>
        </footer>
      </div>
    );
  };

  return (
    <>
      <div className="background">
        {showMainFooter && <MainFooter />}
        {ProductByMainCate && <SubFooter />}
        {ProductBySubCate && <SubFooter />}
        {/* {showsubFooter3 && <SubFooter />} */}
        {ForgotPassword && <SubFooter />}
        {showsubFooter && <SubFooter />}
        {showsubFooter1 && <SubFooter />}
        {showsubFooter2 && <SubFooter />}
        {showsubFooter4 && <SubFooter />}
        {showsubFooter5 && <SubFooter />}
        {showsubFooter6 && <SubFooter />}
        {_UsermyAddress && <SubFooter />}
        {_UsermyOrders && <SubFooter />}
        {_Userreviews && <SubFooter />}
        {_UsermyProfile && <SubFooter />}
        {ProductList && <SubFooter />}
        {ContactUs && <SubFooter />}
        {_UserNavbars && <SubFooter />}
        {_UserAddReview && <SubFooter />}
        {_UserOrderReturn && <SubFooter />}
        {_UserwriteReview && <SubFooter />}
        {_UserManageOrders && <SubFooter />}
        {_UserCancellations && <SubFooter />}
        {searchProduct && <SubFooter />}
        {BuyNow && <SubFooter />}
      </div>
    </>
  );
};
export default Footer;
