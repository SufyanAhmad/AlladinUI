import React, { useState, useEffect } from "react";
import "./module.scss";
import { Modal } from "react-responsive-modal";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FetchUrl } from "../../requestMethod";
const AdminSlider = () => {
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [formFile, setSelectedImage] = useState(null);
  const [slider, setSlider] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState([slider]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("formFile", formFile);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: "bearer " + localStorage.getItem("token"),
      },
    };
    const url = FetchUrl + "DashBoard/add-New-Slider";
    axios
      .post(url, formData, config)
      .then((response) => {
        setReload(slider);
        setSelectedImage(null);
        setOpen(false);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    setLoading(true);
    fetch(FetchUrl + "Home/get-slider-images").then((result) => {
      result.json().then((resp) => {
        setSlider(resp.data);
        setLoading(false);
      });
    });
  }, [reload]);
  const DeleteImage = (mediaId) => {
    fetch(FetchUrl + `DashBoard/delete-media/${mediaId}`, {
      method: "Delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "bearer " +
          JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user)
            .currentUser.token,
      },
      body: JSON.stringify(mediaId),
    }).then((resp) => {
      resp
        .json()
        .then((result) => {
          setReload(slider);
        })
        .catch((err) => {
          alert("Iamge is not deleted !!");
        });
    });
  };
  const Slider = () => {
    return (
      <div className="Section">
        <div className="p-5">
          <div className="d-flex justify-content-between">
            <div className="dashboard">Sliders</div>
            <button className="add-category-btn" onClick={onOpenModal}>
              Add Slider
            </button>
          </div>
          <br></br>
          <div className="row">
            {slider.map((image) => (
              <div
                className="col-lg-4 col-md-6 col-sm-12 mt-3 slide-img"
                key={image.mediaId}
              >
                <img className="image-slider" src={image.imageUrl} />
                <div className="middle d-flex justify-content-center">
                  <div
                    className="text"
                    onClick={() => DeleteImage(image.mediaId)}
                  >
                    Delete
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Modal open={open} onClose={onCloseModal} center>
            <br></br>
            <form className="add-cate-popup" noValidate onSubmit={onFormSubmit}>
              <div>
                <input
                  multiple
                  type="file"
                  name="myImage"
                  style={{ float: "right" }}
                  onChange={(event) => {
                    setSelectedImage(event.target.files[0]);
                  }}
                />
                {formFile && (
                  <div>
                    <img
                      alt="not fount"
                      width={"250px"}
                      src={URL.createObjectURL(formFile)}
                    />
                    <br />
                    <button onClick={() => setSelectedImage(null)}>
                      Remove
                    </button>
                  </div>
                )}
              </div>
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
  return <div>{<Slider />}</div>;
};

export default AdminSlider;
