import React, { useState, useEffect } from 'react';
import { publicRequest } from '../../requestMethod';
import axios from 'axios';
import { FetchUrl } from '../../requestMethod';
import UsersSidebar from '../usersSidebar/UsersSidebar';
import './reviews.scss';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { Modal } from 'react-responsive-modal';
import Skeleton from 'react-loading-skeleton';
import swal from 'sweetalert';

export default function Reviews() {
  const [Review, setReview] = useState([]);
  const [ReviewDetail, setReviewDetail] = useState([]);
  const [_ProductId, setProductId] = useState('');
  const [Editopen, setEditOpen] = useState(false);
  const EditOpenModal = () => setEditOpen(true);
  const [Images, setSelectedImage] = useState(null);
  const [Text, setText] = useState('');
  const [productId, setproductId] = useState('');
  const [Ratting, setRatting] = useState(5);
  const [reload, setReload] = useState([Review]);
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState('');
  const [sidebartoggle, setSidebartoggle] = useState('');
  const EditCloseModal = () => {
    setEditOpen(false);
    setNetworkError('');
  };
  useEffect(() => {
    setLoading(true);
    const getreview = async () => {
      try {
        const res = await publicRequest.get('Review/get-customer-reviews', {
          headers: {
            Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
          },
        });
        setReview(res.data.data);
        setLoading(false);
      } catch {}
    };
    getreview();
  }, [reload]);

  const selectReview = (reviewId) => {
    const getReviewDetail = async () => {
      try {
        const res = await publicRequest.get(`Review/get-review/${reviewId}`);
        setReviewDetail(res.data.data.reviewMedias);
        setProductId(reviewId);
      } catch {}
    };
    getReviewDetail();
  };
  function SelectReviews(Id, index) {
    setText(Review[index].text);
    setRatting(Review[index].ratting);
    setproductId(Id);
  }
  const onFormSubmit = (e) => {
    debugger;
    e.preventDefault();
    {
      const formData = new FormData();
      formData.append('Images', Images);
      formData.append('Text', Text);
      formData.append('Ratting', Ratting);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
      };
      const url = FetchUrl + `Review/add-review/${productId}`;
      axios
        .post(url, formData, config)
        .then((response) => {
          if (response.data.status === 'Success') {
            swal('Success', response.data.message, 'success', {
              buttons: false,
              timer: 2000,
            }).then((value) => {
              setSelectedImage(null);
              setEditOpen(false);
              setReload(Review);
              setNetworkError('');
            });
          } else {
            swal('Failed', response.data.message, 'error');
          }
        })
        .catch((err) => {
          setNetworkError(err.message);
        });
    }
  };
  const Loading = () => {
    return (
      <>
        <div className="col-md-6" style={{ lineHeight: 2 }}>
          <Skeleton height={300} />
        </div>
        <div className="col-md-6" style={{ lineHeight: 2 }}>
          <Skeleton height={300} />
        </div>
      </>
    );
  };
  const _myreview = () => {
    return (
      <>
        <div className="row reviewContent">
          {/* <div className="row"> */}
            <div style={{ zIndex: '3' }} className={`${sidebartoggle?"col-2":""} writeReviewflexes`}>
              <UsersSidebar  sidebartoggle={sidebartoggle} setSidebartoggle={setSidebartoggle}/>
            </div>
            <div className={`${sidebartoggle?"col-10":"col-12"} writeReviewflexes`}>
              <div className="manage-review">
                <p className="accountHeading">
                  <b>Manage My Account</b>
                </p>
                <br />
                {Review.length === 0?
                <p className="noReview">No Review added yet</p>
                :<></>}
                <div className="reviewBody">
                  <span>Reviews</span>
                  {Review.map((review, index) => (
                    <div key={index} className="productBox">
                      <div className="purchasedDate">
                        <p>
                          Purchased on {moment(review.oderCreateAt).format(' DD MMM, YYYY')}
                          <span onClick={() => selectReview(review.reviewId)}>
                            <span onClick={() => SelectReviews(review.productId, index)}>
                              <button className="pull-right Buttons" onClick={() => EditOpenModal(review.productId)}>
                                Edit
                              </button>
                            </span>
                          </span>
                        </p>
                      </div>

                      <div className="flexDisplay">
                        <div>
                          <div className="ratingGrouup">
                            <span>Your product rating & review:</span>
                            <Stack className="ratingStar" spacing={1}>
                              <Rating name="full-rating" defaultValue={review.ratting} precision={0.5} size="large" readOnly />
                            </Stack>
                          </div>
                          {review.productMedias[0] === null ? (
                            <>
                              <div className="flexDisplay">
                                <span>
                                  <img className="reviewProductImage" src="./assets/Auth/Default-img.png" />
                                </span>

                                <div className="inline nameAndColor">
                                  <p className="reviewProductName">
                                    <strong>{review.productName}</strong>
                                  </p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flexDisplay">
                                {review.productMedias.length !== 0?<>
                                  {review.productMedias.slice(0, 1).map((image, i) => (
                                    <span key={i}>
                                      <img className="reviewProductImage" src={image.imgUrl} />
                                    </span>                                                 
                                  ))}
                                </>
                                :
                                  <span>
                                    <img className="reviewProductImage" src="./assets/Auth/default-img.png" />
                                  </span>
                                }
                                <div className="inline nameAndColor">
                                  <p className="reviewProductName">
                                    <strong>{review.productName}</strong>
                                  </p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="commentSection">
                          <p>{review.text}</p>
                          {review.reviewMedias.map((image, i) => (
                            <img
                              key={i}
                              style={{
                                width: '50px',
                                height: '50px',
                                marginLeft: '5px',
                              }}
                              className="reviewProductImage"
                              src={image.imgUrl}
                            />
                          ))}

                          <div className="thumbSection">
                            <button className="thumbButton">
                              <i style={{ fontSize: '24px', marginTop: '5px' }} className="fa ">
                                &#xf087;
                              </i>
                            </button>
                            <span className="likeCount">{review.reviewLikes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          {/* </div> */}
        </div>
      </>
    );
  };
  return (
    <div>
      <div className="">
        <div className="row">{loading ? <Loading /> : <_myreview />}</div>
      </div>
      <div>
        <Modal className='reviewEditModel' open={Editopen} onClose={EditCloseModal} center>
          <br></br>
          <div className="d-flex justify-content-center">
            <span className="updateProfile-popup">
              Update Review
              {networkError && <p className="errorMessage">*{networkError}</p>}
            </span>
          </div>
          <form className='reviewEditModel' noValidate onSubmit={onFormSubmit}>
            <div>
              <Stack className="ratingStar" spacing={1}>
                <Rating name="full-rating" defaultValue={Ratting} precision={0.5} size="large" onChange={(e) => setRatting(e.target.value)} />
              </Stack>
              <p className="card-text">Please share your product experience: Was the product as described? What’s is the quality like? What do you like or dislike about the product?</p>
              <textarea type="text" id="username" name="username" className="product-textarea" placeholder="Please enter your tags here" rows="4" defaultValue={Text} onChange={(e) => setText(e.target.value)} />
              <label className="product-label mt-3">Image</label>
              {Images === null ? (
                <>
                  {ReviewDetail.map((img, i) => (
                    <img
                      key={i}
                      style={{
                        width: '50px',
                        height: '50px',
                        marginLeft: '5px',
                      }}
                      className="reviewProductImage"
                      src={img.imgUrl}
                    />
                  ))}
                </>
              ) : (
                ''
              )}
              <div>
                <input type="file" name="myImage" style={{ float: 'left' }} onChange={(event) => setSelectedImage(event.target.files[0])} />
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
        </Modal>
      </div>
      {/* <br></br> <br></br> */}
    </div>
  );
}
