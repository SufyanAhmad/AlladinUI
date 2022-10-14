
import {publicRequest} from "../../requestMethod"
import React, { useState, useEffect } from "react";
import swal from 'sweetalert';
import { useHistory,useParams} from "react-router-dom";
import {FetchUrl} from "../../requestMethod";

const BuyNow = ({reloadPage,setReloadPage}) => {
    const { id } = useParams();
    const [city, setCity] = useState();
    const [address, setAddress] = useState();
    const [phoneNo, setPhoneNo] = useState();
    const [firstName, setFirstName] = useState();
    const [email, setEmail] = useState();
    const [_default, setDefault] = useState("false");
    const [defaultAddress, setDefaultAddress] = useState('');
    const [_defaultAddress, _setDefaultAddress] = useState('');
    const [productView, setProductView] = useState('');
    const [media, setMedia] = useState([]);
    const [productQuantity, setQuantity] = useState(1);
    const [allAddress, setAllAddress] = useState([]);
    const [price, setPrice] = useState([]);
    const [subtotal, setSubtotal] = useState([]);
    const [shippingCharges, setShippingCharges] = useState([]);
    const [total, setTotal] = useState([]);


    let history = useHistory();
    let IsCurrentUser=JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser
    useEffect(() => {
          fetch(FetchUrl+`Home/get-product/${id}`,{
            headers:{
              Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
            }
          }).then((result)=>{
            result.json().then((resp)=>{
              setProductView(resp.data)
              setMedia(resp.data.productMedias)
            })
          })
      }, []);
      const handleQuantity = (type) => {
    var loginForm = document.querySelector('form');
    loginForm.addEventListener('submit', (e)=>{e.preventDefault();}); 
        if (type === "dec") {
          productQuantity > 1 && setQuantity(productQuantity - 1);
        } else {
          setQuantity(productQuantity + 1);
        }
      };
    useEffect(()=>{
      if(IsCurrentUser !=null){
        const getDefaultShippingAddress = async ()=>{
          try{
              const res = await publicRequest.get("ShippingAddress/get-user-default-Shipping-address",{
                headers:{
                  Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
                }
              });
              _setDefaultAddress(res.data.data)
          }catch{}
        }
        getDefaultShippingAddress()
      }else{
        history.push("/login")
      }
    },[])
    const handleSubmit = async e => {
      var loginForm = document.querySelector('form');
      loginForm.addEventListener('submit', (e)=>{e.preventDefault();}); 
      e.preventDefault();
      if(IsCurrentUser !=null){
        if(_default === "True"){
        if(defaultAddress.city && defaultAddress.address && defaultAddress.phoneNo && defaultAddress.firstName){
          let quantity = productQuantity;
        const response = await AddOrder({
            quantity,
            comment:"",
            city:defaultAddress.city,
            address:defaultAddress.address,
            phoneNo:defaultAddress.phoneNo,
            firstName:defaultAddress.firstName,
            email:defaultAddress.email,
            shippedOnDefaultAddress:true
        });
        if (response.status ==="Success") {
          swal("Success", response.message, "success", {
            buttons: false,
            timer: 2000,
          })
          .then((value) => {
            let id = response.data.orderId
            history.push(`/orderdetail/${id}`);
           
          });
          setReloadPage(reloadPage + 1)
        } else {
          swal("Failed", response.message, "error");
        }
      }else{
        alert("Please Fill all the fields")
      }
    }else{
      if(city && address && phoneNo && firstName){
        let quantity = productQuantity;
        const response = await AddOrder({
            quantity,
            comment:"",
            city,
            address,
            phoneNo,
            firstName,
            email,
            shippedOnDefaultAddress:false
        });
        if ('status' in response) {
          swal("Success", response.message, "success", {
            buttons: false,
            timer: 2000,
          })
          .then((value) => {
            let id = response.data.orderId
            history.push(`/orderdetail/${id}`);
          });
          setReloadPage(reloadPage + 1)
        } else {
          swal("Failed", response.message, "error");
        }
      }else{
        alert("Please Fill all the fields")
      }
    }
  }else{
    history.push("/login")
  }
  }
  async function AddOrder(credentials) {
    return fetch(FetchUrl+`Order/add-new-order/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }
    const GetDefaultAddress = e => {
      if(IsCurrentUser !=null){
      e.preventDefault();
      fetch(FetchUrl+"ShippingAddress/get-user-default-Shipping-address", {
      method: "GET",
      headers: {
        Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
      },
      body:JSON.stringify()
    }).then((resp)=>{
      resp.json().then((result)=>{
        setDefaultAddress(result.data)
      })
    })
  }else{
    history.push("/login")
  }
  };
  useEffect(()=>{
    let quantity = productQuantity
    let productId = id;
      let Item = {
        productId,
        quantity,
      };
      if (IsCurrentUser != null) {
        fetch(FetchUrl + `Order/get-product-order-summary/${id}?quantity=` + quantity, {
          method: 'GET',
          headers: {
            Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
          },
          body: JSON.stringify(),
        }).then((resp) => {
          resp.json().then((result) => {
            if (result.status === 'Success') {
              setShippingCharges(result.data.shipping);
              setPrice(result.data.productPrice);
              setSubtotal(result.data.subtotal);
              setTotal(result.data.total)
            }
          });
        });
      } else {
        history.push('/login');
      }
  },[productQuantity])
  
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
  },[]);
  const setAddressByRadio = (e) => {
    setFirstName(e.firstName);
    setEmail(e.email);
    setAddress(e.address);
    setCity(e.city);
    setPhoneNo(e.phoneNo);
  };
  return (
    <div className='bgColors'>
      <div className='container'>
        <div className="fadeInDown">
            <br></br>
            <div className='row'>
                <div className='col-xs-1 col-lg-2 col-md-1 col-sm-1'></div>
                <div className='col-xs-10 col-lg-8 col-md-10 col-sm-10 display-cell'>
                    <div className='d-flex justify-content-between'>
                    <span className='create-account d-inline'>Buy Now</span>
                    </div>
                    <br></br>
                      <form onSubmit={handleSubmit}>
                    <div className='row bgColor' style={{height:"100%"}}>
                        <div style={{backgroundColor:"white"}} className='col-xs-12 col-sm-12 col-md-12 col-lg-6 p-1'>
                            <div className='billing-detail d-flex justify-content-between'>
                              <span className='billing-detail'>Billing Details</span>
                             {
                              _defaultAddress !==null ?
                              <div onChange={e => setDefault(e.target.value)}>
                                {_default ==="false"?
                                  <>
                                  <input type="radio" value="True" name="selectAddress" id="selectAddress" onChange={GetDefaultAddress} /> default
                                  </>
                                  :
                                  <>
                                    <input type="radio" value="True" name="selectAddress" id="selectAddress" checked/> default
                                  </>
                                }
                              </div>
                              :
                              ""
                              }
                            </div>
                            <div className="row">
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
                              </div>:""}
                              <div className={`${allAddress.length !== 0?"col-lg-7":"col-lg-12"} col-md-12 col-sm-12`}>
                                <label className="checkout-label">Name</label>
                                <br/>
                                <input type="text"  className="checkout-input" 
                                placeholder="Plase enter your full name"
                                required
                                defaultValue={defaultAddress.firstName}
                                onChange={e => setFirstName(e.target.value)}
                                />
                                <label className="checkout-label">Email Address</label>
                                <br/>
                                <input type="text"  className="checkout-input"
                                placeholder="Please enter your email"
                                required
                                defaultValue={defaultAddress.email}
                                onChange={e => setEmail(e.target.value)}
                                />
                                <label className="checkout-label">Address</label>
                                <br/>
                                <input type="text"  className="checkout-input" 
                                placeholder="Please enter your address"
                                required
                                defaultValue={defaultAddress.address}
                                onChange={e => setAddress(e.target.value)}
                                />
                                <label className="checkout-label">Town / City</label>
                                <br/>
                                <input type="text"  className="checkout-input" 
                                placeholder="Please enter your town / city"
                                required
                                defaultValue={defaultAddress.city}
                                onChange={e => setCity(e.target.value)}
                                />
                                <label className="checkout-label">Shipping Phone No</label>
                                <br/>
                                <input type="text"  className="checkout-input" 
                                placeholder="In case question arise"
                                required
                                defaultValue={defaultAddress.phoneNo}
                                onChange={e => setPhoneNo(e.target.value)}
                                />
                              </div>
                            </div>
                        </div>
                        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-6 p-1'>
                          <div className="d-flex justify-content-center your-order mt-3">
                               Your Order
                            </div>
                            <br></br>
                            <div className="d-flex justify-content-start mt-2 your-order">
                            </div>
                                <div className="row">
                                {media.slice(0,1).map((d,index) => (
                                <div className="col-4" key={index}>
                                    <img className="checkout-img mt-2" src={d.imgUrl}/>
                                </div>
                                ))}
                                <div className="col-8">
                                    <div className="product-checkout-name mt-4">{productView.productName}</div>
                                    {/* {productView.discountPrice ===0? */}
                                    <div className="product-checkout-price mt-1">Price:{price}</div>
                                    {/* :
                                    <div className="product-checkout-price mt-1">Price:{Math.trunc(parseFloat(Math.trunc(productView.discountPrice)))}</div>
                                    } */}
                                    <div className="d-inline product-detail-padding">
                                        <p className="product-quantity d-inline">Quantity</p>
                                        <button type="button" className="btn btn-outline-dark me-1 d-inline quantiy-decrease"  onClick={() => handleQuantity("dec")}>
                                            <i className="fa fa-minus"></i>
                                        </button>
                                        <button className="qty-count">{productQuantity}</button>
                                        {
                                        productView.quantity !==productQuantity?
                                        <button type="button"  className="btn btn-outline-dark d-inline quantiy-increase" onClick={() => handleQuantity("inc")}>
                                            <i className="fa fa-plus"></i>
                                        </button>
                                        :
                                        <button disabled className="btn btn-outline-dark d-inline quantiy-increase">
                                            <i className="fa fa-plus"></i>
                                        </button>
                                        }
                                    </div>
                                </div>
                                </div>
                                {/* {productView.discountPrice ===0?
                                <> */}
                                <hr className="mt-2" style={{width:"95%",marginLeft:"10px"}}/>
                                <div className="d-flex justify-content-between padding">
                                    <span className="subtotal">Subtotal</span>
                                    <span className="subtotal">{subtotal}</span>
                                </div>
                                <hr className="mt-2" style={{width:"95%",marginLeft:"10px"}}/>
                                <div className="d-flex justify-content-between padding">
                                    <span className="subtotal">Shipping</span>
                                    <span className="subtotal">{shippingCharges}</span>
                                </div>
                                <hr className="mt-2" style={{width:"95%",marginLeft:"10px"}}/>
                                <div className="d-flex justify-content-between padding">
                                    <span className="subtotal">Total</span>
                                    <span className="subtotal">{total}</span>
                                </div>
                                {/* </>
                                :
                                <>
                                <hr className="mt-2" style={{width:"95%",marginLeft:"10px"}}/>
                                <div className="d-flex justify-content-between padding">
                                    <span className="subtotal">Subtotal</span>
                                    <span className="subtotal">{Math.trunc(parseFloat(Math.trunc(productView.discountPrice)))*quantity}</span>
                                </div>
                                <hr className="mt-2" style={{width:"95%",marginLeft:"10px"}}/>
                                <div className="d-flex justify-content-between padding">
                                    <span className="subtotal">Shipping</span>
                                    <span className="subtotal">{productView.manualShippingCharges}</span>
                                </div>
                                <hr className="mt-2" style={{width:"95%",marginLeft:"10px"}}/>
                                <div className="d-flex justify-content-between padding">
                                    <span className="subtotal">Total</span>
                                    <span className="subtotal">{(Math.trunc(parseFloat(Math.trunc(productView.discountPrice)))*quantity)+(productView.manualShippingCharges)}</span>
                                </div>
                                </>
                                 } */}
                                <div className="d-flex justify-content-center">
                                  <button className="place-order-btn" type="submit">
                                    Place your order
                                  </button>
                                </div>
                        </div>
                   </div>
                      </form>
                  </div>
                <div className='col-xs-1 col-lg-2 col-md-1 col-sm-1'></div>
            </div>
        </div>
      </div>
      <br></br>
      <br></br>
      <br></br><br></br>
   </div>
  )
}

export default BuyNow