import './App.css';
import Home from './components/Home';
import { Switch, Route, Redirect, useLocation, HashRouter } from 'react-router-dom';
import { publicRequest } from './requestMethod';
import Cart from './components/Cart';
import Login from './components/Auth/Login';
import Registration from './components/Auth/Registration';
import Footer from './components/Footer/Footer';
import Slider from './components/Slider/Slider';
import Navbar from './components/Navbar/Navbar';
import ProductView from './components/Product-view/ProductView';
import CheckOut from './components/checkout/CheckOut';
import Wishlist from './components/wishlist/Wishlist';
import OrderDetails from './components/orderDetails/OrderDetails';
import TopProduct from './components/topProduct/TopProduct';
import ProductList from './components/Product-List/ProductList';
import Carts from './components/cart/Carts';
import Sidebar from './adminPannel/sidebar/Sidebar';
import Dashboard from './adminPannel/dashboard/Dashboard';
import AdminProducts from './adminPannel/products/AdminProducts';
import MainCategory from './adminPannel/mainCategory/MainCategory';
import Orders from './adminPannel/orders/Orders';
import { AdminOrderDetail } from './adminPannel/orderDetail/AdminOrderDetail';
import Review from './adminPannel/reviews/Review';
import PageNotFound from './components/pageNotFound/PageNotFound';
import { useDispatch, useSelector } from 'react-redux';
import Category from './adminPannel/dashboard/category/Category';
import SubCategories from './adminPannel/subCategory/SubCategories';
import ProductsBySubcategory from './adminPannel/adminProduct/ProductsBySubcategory';
import ContactUs from './components/contactUs/ContactUs';
import SearchProducts from './components/SearchProducts/SearchProducts';
import AdminSlider from './adminPannel/AdminSlider/AdminSlider';
import AdminFooter from './adminPannel/FooterDetail/FooterDetail';
import Youtube from './adminPannel/Youtube/Youtube';
import Customers from './adminPannel/Customers/Customers';
import { useEffect, useState, useRef } from 'react';
import Account from './users/myAccount/Account';
import UsersSidebar from './users/usersSidebar/UsersSidebar';
import MyProfile from './users/myProfile/MyProfile';
import MyAddress from './users/myAddress/MyAddress';
import MyOrders from './users/myOrders/MyOrders';
import MyOrderDetail from './users/orderDetail/orderDetail';
import Reviews from './users/review/Reviews';
import AddReview from './users/addReview/addreview';
import MyCancellation from './users/cancellation/MyCancellation';
import MyReturns from './users/returns/MyReturns';
import WriteReview from './users/writeReview/WriteReview';
import ManageOrders from './users/manageOrders/ManageOrders';
import ProductListBysubCategoryId from './components/ProductListBysubCategoryId/ProductListBysubCategoryId';
import BrandAndWarrante from './adminPannel/BrandAndwarrante/BrandAndWarrante';
import Loading from './users/Loading/Loading';
import ProjectedRoutes from './ProjectedRoutes';
import TimeCounter from './components/TimeCounter/TimeCounter';
import ProductByCategoryId from './components/productByCategoryId/productByCategoryId';
import ProductByMainCategoryId from './components/productByMainCategory/ProductByMainCategoryId';
import BuyNow from './components/buyNow/BuyNow';
import ForgotPassword from './components/Auth/ForgotPassword';
import { HelmetProvider } from 'react-helmet-async';
import OrderConfirmation from './components/orderConfirmation/OrderConfirmation';

const App = () => {
  let refresh = useSelector((state) => state.refresh);
  let user = useSelector((state) => state.user.currentUser);
  const role = useSelector((state) => state.user.currentUser && state.user.currentUser.role);
  let [cartLength, setCartLength] = useState(0);
  const [appRefresher, setAppRefresher] = useState(true);
  const [ordersnumber, setOrdernumber] = useState([]);
  const [reviewsnumber, setReviewsnumber] = useState([]);
  const [reload, setReload] = useState([ordersnumber]);
  const sampleLocation = useLocation();
  if (sampleLocation.pathname !== '/login' && sampleLocation.pathname !== '/register') {
    localStorage.setItem('currentURL', sampleLocation.pathname);
  }
  useEffect(() => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  })
  // useEffect(()=>{
  //   document.getElementById("imgLink").setAttribute("href", `/logo192.png`);
  //   document.getElementById("imgLink").setAttribute("content", `/logo192.png`);
  //   document.getElementById("descriptionTag").setAttribute("content", `✓Low Prices ✓Fast Delivery across Pakistan `);
  //   document.getElementById("productTitle").setAttribute("content", `Alladin.pk`);
  //   document.title = "Alladin.pk"
  // })
  useEffect(() => {
    const getQuantity = async () => {
      if (user !== null) {
        const res = await publicRequest.get('Cart/get-user-products-quantity', {
          headers: {
            Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
          },
        });
        setCartLength(res.data.data);
      }
    };
    getQuantity();
  }, [appRefresher, refresh]);
  useEffect(() => {
    if (role === 'Admin') {
      const getOrdersNum = async () => {
        const res = await publicRequest.get('Order/get-all-orders', {
          headers: {
            Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
          },
        });
        setOrdernumber(res.data.data);
      };
      const getReviewsNum = async () => {
        const res = await publicRequest.get('Review/get-all-reviews', {
          headers: {
            Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
          },
        });
        setReviewsnumber(res.data.data);
      };
      getOrdersNum();
      getReviewsNum();
    }
  }, [reload]);
  const pendings = ordersnumber.filter((item) => item.orderStatusType === 'Pending');
  const reviews = reviewsnumber.filter((item) => item.replyStatus === false);
  return (
    <>
    <HelmetProvider>
      <Navbar cartLength={cartLength} orderLength={pendings.length} reviewLength={reviews.length} />
      <Switch>
        <Route exact path="/">
          <Home appRefresher={appRefresher} setAppRefresher={setAppRefresher} />
        </Route>
        <Route path="/orderdetail/:id" component={OrderDetails} />
        <Route path="/orderconfirmation" component={OrderConfirmation} />
        <Route path="/buyNow/:id" component={BuyNow} />
        <Route path="/loading" component={Loading} />
        <Route path="/topproduct">
          <TopProduct appRefresher={appRefresher} setAppRefresher={setAppRefresher} />
        </Route>
        <Route path="/products/:subCategoryId">{role === 'Admin' ? <Redirect to="/login" /> : <ProductListBysubCategoryId appRefresher={appRefresher} setAppRefresher={setAppRefresher} />}</Route>
        <Route path="/mainCategoryProducts/:mainCategoryId">{role === 'Admin' ? <Redirect to="/login" /> : <ProductByMainCategoryId appRefresher={appRefresher} setAppRefresher={setAppRefresher} />}</Route>
        <Route path="/categoryProducts/:subCategoryId">{role === 'Admin' ? <Redirect to="/login" /> : <ProductByCategoryId appRefresher={appRefresher} setAppRefresher={setAppRefresher} />}</Route>
        <Route path="/cart">
          <Cart />
        </Route>
        <Route path="/login">
          {role === 'Customer' ? (
            <Redirect to={localStorage.getItem('currentURL').split('/').find((element) => element === 'register')? '/' : localStorage.getItem('currentURL')} />
          ) : role === 'Admin' ? (
            <Redirect to={ localStorage.getItem('currentURL').split('/').find((element) => element === 'admin')? localStorage.getItem('currentURL'): '/admin/products'}/>
          ) : (
            <Login />
          )}
        </Route>
        <Route path="/register" component={Registration} />
        <Route path="/forgotPassword" component={ForgotPassword} />
        <Route path="/footer" component={Footer} />
        <Route path="/slider">
          <Slider appRefresher={appRefresher} setAppRefresher={setAppRefresher} />
        </Route>
        <Route path="/searchProduct/:searchKey">{role === 'Admin' ? <Redirect to="/login" /> : <SearchProducts appRefresher={appRefresher} setAppRefresher={setAppRefresher} />}</Route>
        <Route path="/product/view/:id">{role === 'Admin' ? <Redirect to="/login" /> : <ProductView appRefresher={appRefresher} setAppRefresher={setAppRefresher} />}</Route>
        <Route path="/checkout">{!user || role === 'Admin' ? <Redirect to="/login" /> : <CheckOut appRefresher={appRefresher} setAppRefresher={setAppRefresher} />}</Route>
        <Route path="/wishlist">{!user || role === 'Admin' ? <Redirect to="/login" /> : <Wishlist appRefresher={appRefresher} setAppRefresher={setAppRefresher} />}</Route>
        <Route path="/productList/:id">{role === 'Admin' ? <Redirect to="/login" /> : <ProductList appRefresher={appRefresher} setAppRefresher={setAppRefresher} />}</Route>
        <Route path="/productLists">{role === 'Admin' ? <Redirect to="/login" /> : <ProductList appRefresher={appRefresher} setAppRefresher={setAppRefresher} />}</Route>
        <Route path="/contact" component={ContactUs} />
        <Route path="/timeCounter" component={TimeCounter} />
        <Route path="/carts">{!user || role === 'Admin' ? <Redirect to="/login" /> : <Carts appRefresher={appRefresher} setAppRefresher={setAppRefresher} />}</Route>
        <Route path="/admin/dashboard" component={Dashboard} />
        <ProjectedRoutes path="/admin/products" component={AdminProducts} auth={role === 'Admin'} />
        <ProjectedRoutes path="/admin/mainCategory" component={MainCategory} auth={role === 'Admin'} />
        <ProjectedRoutes path="/admin/orders" component={Orders} auth={role === 'Admin'} />
        <ProjectedRoutes path="/admin/orderdetail/:id" component={AdminOrderDetail} auth={role === 'Admin'} />
        <ProjectedRoutes path="/admin/sidebar" component={Sidebar} auth={role === 'Admin'} />
        <ProjectedRoutes path="/admin/review" component={Review} auth={role === 'Admin'} />
        <ProjectedRoutes path="/admin/category/:id" component={Category} auth={role === 'Admin'} />
        <ProjectedRoutes path="/admin/subCategory/:id" component={SubCategories} auth={role === 'Admin'} />
        <ProjectedRoutes path="/admin/ProductsBySubcategory/:id" component={ProductsBySubcategory} auth={role === 'Admin'} />
        <ProjectedRoutes path="/admin/slider" component={AdminSlider} auth={role === 'Admin'} />
        <ProjectedRoutes path="/admin/FooterDetail" component={AdminFooter} auth={role === 'Admin'} />
        <ProjectedRoutes path="/admin/Youtube" component={Youtube} auth={role === 'Admin'} />
        <ProjectedRoutes path="/admin/customer" component={Customers} auth={role === 'Admin'} />
        <Route path="/users/myAccount" component={Account} />
        <Route path="/users/myProfile" component={MyProfile} />
        <ProjectedRoutes path="/admin/brandsAndWarrantes" component={BrandAndWarrante} auth={role === 'Admin'} />

        <Route path="/users/myAddress" component={MyAddress} />
        <Route path="/users/myOrders" component={MyOrders} />
        <Route path="/users/orderdetail/:id" component={MyOrderDetail} />
        <Route path="/users/reviews" component={Reviews} />
        <Route path="/users/addreview/:id" component={AddReview} />
        <Route path="/users/cancellations/:id" component={MyCancellation} />
        <Route path="/users/return/:id" component={MyReturns} />
        <Route path="/users/writeReview/:id" component={WriteReview} />
        <Route path="/users/manage-orders/:id" component={ManageOrders} />

        <Route path="/*" component={PageNotFound} />
      </Switch>
      <Footer />
      </HelmetProvider>
    </>
  );
};
export default App;
