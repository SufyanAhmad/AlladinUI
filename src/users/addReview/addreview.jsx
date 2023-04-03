import React, { useState, useEffect, Fragment } from 'react';
import './addreview.scss';
import UsersSidebar from '../usersSidebar/UsersSidebar';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { FetchUrl } from '../../requestMethod';
import swal from 'sweetalert';
import { useParams, useHistory } from 'react-router-dom';

export default function AddReview() {
  const { id } = useParams();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productView, setProductView] = useState('');
  const [Images, setSelectedImage] = useState(null);
  const [Text, setText] = useState('');
  const [Ratting, setRatting] = useState(5);
  const [errorMessage, setErrorMessage] = useState('');
  const [networkError, setNetworkError] = useState('');
  const [getProductError, setGetProductError] = useState('');
  const [reload, setReload] = useState(productView);
  const [sidebartoggle, setSidebartoggle] = useState('');
  let history = useHistory();
  useEffect(() => {
    setLoading(true);
    fetch(FetchUrl + `Home/get-product/${id}`, {
      headers: {
        Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
      },
    })
      .then((result) => {
        if (result.ok === false) {
          throw Error('Unable to get product !!');
        }
        result.json().then((resp) => {
          setProductView(resp.data);
          setMedia(resp.data.productMedias);
          setGetProductError('');
          setLoading(false);
        });
      })
      .catch((err) => setGetProductError(err.message));
  }, [reload]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (Text) {
      const formData = new FormData();
      formData.append('Images', Images);
      formData.append('Text', Text);
      formData.append('Ratting', Ratting);
      setErrorMessage('');
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
      };
      const url = FetchUrl + `Review/add-review/${id}`;
      axios
        .post(url, formData, config)
        .then((response) => {
          if (response.data.status === 'Success') {
            swal('Success', response.data.message, 'success', {
              buttons: false,
              timer: 2000,
            }).then((value) => {
              setSelectedImage(null);
              setReload(productView);
              history.push('/users/reviews');
            });
          } else {
            swal('Failed', response.data.message, 'error');
          }
        })
        .catch((err) => {
          setNetworkError(err.message);
        });
    } else {
      setErrorMessage('*please fill all the fields');
    }
  };
  return (
    <div className="row ordersContent">
      {/* <div className="row"> */}
        <div style={{ zIndex: '3' }} className={`${sidebartoggle?"col-2":""} profileflexes`}>
          <UsersSidebar sidebartoggle={sidebartoggle} setSidebartoggle={setSidebartoggle}/>
        </div>
        <div className={`${sidebartoggle?"col-10":"col-12"} profileflexes`}>
          <div className="manageAccount">
            <p className="accountHeading">
              <b>Manage My Account</b>
              {getProductError && <p className="errorMessage">*{getProductError}</p>} {networkError && <p className="errorMessage">*{networkError}</p>} {errorMessage && <p className="errorMessage">{errorMessage}</p>}
            </p>
            <div className="Body">
              <div className="row">
                <div className="col-md-12">
                  <p>Write Reviews</p>
                  <hr />
                  <div>
                    <p>Rate and purchased product:</p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3 col-sm-3">
                  {media[0] === null ? (
                    <div>
                      <img style={{ width: '200px', height: '200px' }} className="orderImage" src="./assets/Auth/Default-img.png" />
                    </div>
                  ) : (
                    <div>
                      {media.slice(0, 1).map((image, i) => (
                        <Fragment key={i}>
                          <img style={{ width: '200px', height: '200px' }} className="orderImage" src={image.imgUrl} />
                        </Fragment>
                      ))}
                    </div>
                  )}
                </div>
                <div className="col-md-9 col-sm-9">
                  <h5 className="card-title">{productView.productName}</h5>
                  <form noValidate onSubmit={onFormSubmit}>
                    <div>
                      <Stack className="ratingStar" spacing={1}>
                        <Rating name="full-rating" defaultValue={5} precision={0.5} size="large" onChange={(e) => setRatting(e.target.value)} />
                      </Stack>
                      <p className="card-text">Please share your product experience: Was the product as described? What’s is the quality like? What do you like or dislike about the product?</p>
                      <textarea type="text" id="username" name="username" className="product-textarea" placeholder="Please enter your tags here" rows="4" required onChange={(e) => setText(e.target.value)} />
                      <div>
                        <input
                          type="file"
                          name="myImage"
                          className='choose-file'
                          style={{ float: 'left' }}
                          onChange={(event) => {
                            setSelectedImage(event.target.files[0]);
                          }}
                        />
                        {Images && (
                          <div>
                            <img alt="not fount" width={'70px'} src={URL.createObjectURL(Images)} />
                            <br />
                            <button className="Buttons" onClick={() => setSelectedImage(null)}>
                              Remove Image
                            </button>
                          </div>
                        )}
                      </div>
                      <br />
                      <br />
                      <div>
                        <button className="Buttons">Submit</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/* </div> */}
    </div>
  );
}
