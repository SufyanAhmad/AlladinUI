import React, {useState} from 'react';
import UsersSidebar from '../usersSidebar/UsersSidebar';
import './writeReview.scss';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

export default function WriteReview() {
  const [sidebartoggle, setSidebartoggle] = useState('');
  return (
    <div>
      <>
        <div className="row writeReviewContent">
          {/* <div className="row"> */}
            <div style={{ zIndex: '3' }} className="col-2 writeReviewflexes">
              <UsersSidebar  setSidebartoggle={setSidebartoggle}/>
            </div>
            <div className="col-10 writeReviewflexes">
              <div className="manageAccount">
                <p className="accountHeading">
                  <b>Manage My Account</b>
                </p>
                <div className="writeReviewBody">
                  <span>Write Review </span>
                  <div className="writeReviewSection">
                    <span>Rate and Purchased Product:</span>
                    <div className="detailsProduct">
                      <div>
                        <img className="writeReviewImage" src="./assets/Auth/checkout.png" />
                      </div>
                      <div className="textDetail">
                        <span>Dingling Shaving Machine</span>
                        <Stack className="writeReviewRating" spacing={1}>
                          <Rating name="full-rating" defaultValue={3} precision={0.5} size="large" />
                        </Stack>
                        <span>Please share your product experience: Was the product as described? What’s is the quality like? What do you like or dislike about the product?</span>
                        <div>
                          <textarea className="textArea" cols={70} rows={5}></textarea>
                        </div>
                        <div className="uploadWriteReviewImg">
                          <div className="preview-upload-image-section">
                            <img className="preview-upload-image" src="./assets/Vector.png" alt="" />
                          </div>
                          <input type="file" id="fileChange" multiple />
                          <div className="image-label-holder">
                            <label htmlFor="fileChange" className="review-label-upload-image">
                              <div className="review-image-text">Upload image</div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <button className="write-review-submit-button">Submit</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/* </div> */}
        </div>
      </>
    </div>
  );
}
