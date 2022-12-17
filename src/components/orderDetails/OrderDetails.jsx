import { NavLink } from 'react-router-dom';
import './orderdetails.scss';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { publicRequest } from '../../requestMethod';
const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState('');
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await publicRequest.get(`Order/get-order-detail/${id}`, {
          headers: {
            Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
          },
        });
        setOrder(res.data.data);
      } catch {}
    };
    getProducts();
  }, []);
  return (
    <div className="background">
      <div className="row">
        <div className='col-lg-3 col-md-3'></div>
        <div className='col-lg-6 col-md-6 col-sm-12'>
          <div  className="allahdainLogo">
            <div className="d-flex justify-content-center">
              <img className="" src="./assets/allahdain.png" />
            </div>
          </div>
          <div className=' orderRecievedHeading justify-content-center'>Order Recieved</div>
          <div className='thankYouText'><i style={{marginRight:"10px",fontSize:"16px"}} className='fa fa-check-circle'></i>Thank you. Your order has been recieved.</div>
          <div className="mt-4 orderDetailsdata row">
            <div className="col-lg-3 col-md-12  col-sm-12 mb-2">
              <span>ORDER NUMBER:</span>
              <br />
              <span><b>{order.orderNumberWithDate}</b></span>
            </div>
            <div className="col-lg-3 col-md-12 col-sm-12 mb-2 borderLeft">
              <span>DATE:</span>
              <br />
              <span><b>{moment(order.createAt).format("YYYY-MM-DD")}</b></span>
            </div>
            <div className="col-lg-3 col-md-12 col-sm-12 mb-2 borderLeft">
              <span>TOTAL:</span>
              <br />
              <span><b>{Math.trunc(parseFloat(order.orderTotal))}</b></span>
            </div>
            <div className="col-lg-3 col-md-12 col-sm-12 mb-2 borderLeft">
              <span>PAYMENT METHOD:</span>
              <br />
              <span><b>Cash On Delivery</b></span>
            </div>
          </div>
          <div className='bottomText1'>
            <p>YOUR ORDER WILL BE DELIVERED IN 3-7 DAYS, YOU WILL GET A CONFIRMATION CALL SHORTLY.<br/>YOU CAN TRACK YOUR ORDER BY LOGGING INTO YOUR ACCOUNT USING YOUR MOBILE NO..</p>
          </div>
          <div className='bottomText2'>
            <p>FOR MORE DETAILS CALL 0492722500  OR  WHATSAPP 03316801200</p>
          </div>
        </div>
        <div className='col-lg-3 col-md-3'></div>
      </div>
    </div>
  );
};

export default OrderDetails;
