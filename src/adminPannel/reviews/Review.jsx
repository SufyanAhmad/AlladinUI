import React, { useState, useEffect } from 'react';
import './review.scss';
import { publicRequest } from '../../requestMethod';
import moment from 'moment';
import { FetchUrl } from '../../requestMethod';
import { Modal } from 'react-responsive-modal';
import swal from 'sweetalert';

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const [_reviewId, setReviewId] = useState('');
  const [replyText, setReviewText] = useState('');
  const [reload, setReload] = useState([reviews]);
  const [errorMessage, setErrorMessage] = useState(false);
  useEffect(() => {
    const getReviews = async () => {
      try {
        const res = await publicRequest.get('Review/get-all-reviews', {
          headers: {
            Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
          },
        });
        setReviews(res.data.data);
      } catch {}
    };
    getReviews();
  }, [reload]);
  const deleteReview = (data) => {
    const ReviewId = data.reviewId;
    {
      fetch(FetchUrl + `Review/delete-product-review/${ReviewId}`, {
        method: 'Delete',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(ReviewId),
      }).then((resp) => {
        resp
          .json()
          .then((result) => {
            setReload(reviews);
          })
          .catch((err) => {
            alert('Review Is not deleted !!');
          });
      });
    }
  };
  async function addReview(credentials) {
    return fetch(FetchUrl + `Review/add-reply-to-review/${_reviewId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
      },
      body: JSON.stringify(credentials),
    }).then((data) => data.json());
  }
  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (replyText) {
      const response = await addReview({
        replyText,
      });
      if ('status' in response) {
        swal('Success', response.message, 'success', {
          buttons: false,
          timer: 2000,
        }).then((value) => {
          setOpen(false);
          setReload(reviews);
        });
      } else {
        swal('Error', response.message, 'error');
      }
    } else {
      setErrorMessage(true);
    }
  };
  const onCloseModal = () => {
    setOpen(false);
    setErrorMessage(false);
  };
  const selectReview = (id) => {
    setReviewId(id);
  };
  return (
    <div className="Section">
      <div className="p-4">
        <div className="dashboard">Reviews</div>
        <table className="table table-borderless bg-white mt-4">
          <thead className="review-head">
            <tr>
              <th scope="col" style={{ width: '100px' }}>
                Order Id
              </th>
              <th scope="col">Content</th>
              <th scope="col">Product Name</th>
              <th scope="col">Rating</th>
              <th scope="col" style={{ width: '150px' }}>
                Status
              </th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody className="review-table">
            {reviews.map((review, i) => (
              <tr key={i}>
                <th scope="row" className="text-lines review-id" key={review.reviewId}>
                  {review.reviewId}
                </th>
                <td>
                  <span className="about-service">{review.text}</span>
                  <div className="">
                    <span className="reviewer-name">{review.customerName}</span>
                    <span className="reviewer-name" style={{ marginLeft: '15px' }}>
                      {moment(review.updateAt).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                  </div>

                  <div className="row">
                    <div className="col-12" key={review.reviewId}>
                      {review.reviewMedias.map((img, index) => (
                        <img key={index} src={img.imgUrl} className="p-1" style={{ height: '50px', width: '50px' }} />
                      ))}
                    </div>
                  </div>
                </td>
                <td>{review.productName}</td>
                <td>
                  <span className="mt-1">{review.ratting}</span> <img className="" src="./assets/AdminPannel/Star-review.png" />
                </td>
                <td>
                  <span style={{ border: '1px solid #23334C', borderRadius: '5px' }} className="p-1">
                    {review.replyStatus === true ? <span className="c-pointer"> Replied</span> : <span className="c-pointer">Not Replied</span>}
                  </span>{' '}
                </td>
                <td>
                  <span onClick={() => selectReview(review.reviewId)}>
                    <span className="c-pointer" onClick={onOpenModal}>
                      Reply
                    </span>
                  </span>
                  <br></br>
                  <span className="c-pointer" onClick={() => deleteReview(review)}>
                    Delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* add Subcategory popup */}
      <div>
        <Modal open={open} onClose={onCloseModal} center>
          <br></br>
          <div className="d-flex justify-content-center">
            <span className="category-popup-text">Reply Review</span>
          </div>
          {errorMessage ? (
            <div className="required justify-content-center">
              {' '}
              <p>*Please add review text.</p>
            </div>
          ) : (
            ''
          )}
          <form className="add-cate-popup" noValidate onSubmit={onFormSubmit}>
            <br />
            <textarea type="text" id="username" name="username" className="product-textArea" rows="4" required onChange={(e) => setReviewText(e.target.value)}></textarea>

            <br></br>
            <br></br>
            <button type="submit" className="btn-save-cat">
              Save
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Review;
