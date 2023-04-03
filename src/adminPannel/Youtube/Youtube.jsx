import React, { useState, useEffect } from "react";
import "./youtube.scss";
import { Modal } from "react-responsive-modal";
import axios from "axios";
import "react-loading-skeleton/dist/skeleton.css";
import { FetchUrl } from "../../requestMethod";
const Youtube = () => {
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const [image, setSelectedImage] = useState(null);
  const [youtube, setyoutube] = useState([]);
  const [VedioUrl, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState([youtube]);
  const [errorMessage, setErrorMessage] = useState(false);

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (VedioUrl) {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("VedioUrl", VedioUrl);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: "bearer " + localStorage.getItem("token"),
        },
      };
      const url = FetchUrl + "DashBoard/add-youtube-data";
      axios
        .post(url, formData, config)
        .then((response) => {
          setReload();
          setSelectedImage(null);
          setOpen(false);
        })
        .catch((err) => {});
    } else {
      setErrorMessage(true);
    }
  };
  const onCloseModal = () => {
    setOpen(false);
    setErrorMessage(false);
  };
  useEffect(() => {
    setLoading(true);
    fetch(FetchUrl + "Home/get-youtube-data").then((result) => {
      result.json().then((resp) => {
        setyoutube(resp.data);
        setLoading(false);
      });
    });
  }, [reload]);
  const DeleteYoutube = (id) => {
    fetch(FetchUrl + `DashBoard/delete-youtube-data/${id}`, {
      method: "Delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "bearer " +
          JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user)
            .currentUser.token,
      },
      body: JSON.stringify(id),
    }).then((resp) => {
      resp
        .json()
        .then((result) => {
          setReload();
        })
        .catch((err) => {
          alert("Youtube is not deleted !!");
        });
    });
  };
  return (
    <div className="Section">
      <div className="p-5">
        <div className="d-flex justify-content-between">
          <div className="dashboard">Youtube Section</div>
          <button className="add-category-btn" onClick={onOpenModal}>
            Add Link
          </button>
        </div>
        <br></br>
        <div className="row">
          {youtube.map((image) => (
            <div
              className="col-lg-6 col-md-6 col-sm-12 mt-3 slide-img"
              key={image.id}
            >
              <img
                className="image-slider"
                src={image.imageUrl}
                style={{ width: 455 }}
              />
              <div className="middle d-flex justify-content-center">
                <div className="text" onClick={() => DeleteYoutube(image.id)}>
                  Delete
                </div>
              </div>
              <div className="link">
                <a href={image.vedioUrl} target="_blank">
                  {image.vedioUrl}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Modal open={open} onClose={onCloseModal} center>
          {errorMessage ? (
            <div className="required justify-content-center">
              {" "}
              <p>*Please the marked field.</p>
            </div>
          ) : (
            ""
          )}
          <br></br>
          <form className="add-cate-popup" noValidate onSubmit={onFormSubmit}>
            <div>
              <input
                multiple
                type="file"
                className='choose-file'
                name="myImage"
                style={{ float: "right" }}
                onChange={(event) => {
                  setSelectedImage(event.target.files[0]);
                }}
              />
              {image && (
                <div>
                  <img
                    alt="not fount"
                    width={"250px"}
                    src={URL.createObjectURL(image)}
                  />
                  <br />
                  <button className='remove-button' onClick={() => setSelectedImage(null)}>Remove</button>
                </div>
              )}
            </div>
            <label className="product-label mt-3">
              Youtube URL<span className="required">*</span>
            </label>
            <input
              type="text"
              id="link"
              name="Line"
              className="product-input mt-2"
              required
              onChange={(e) => setLink(e.target.value)}
            />
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
export default Youtube;
