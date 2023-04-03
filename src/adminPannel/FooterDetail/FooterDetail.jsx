import React, { useState, useEffect, useRef } from 'react';
import './FooterDetail.scss';
import { Modal } from 'react-responsive-modal';
import axios from 'axios';
import 'react-responsive-modal/styles.css';
import '../../App.css';
import { FetchUrl } from '../../requestMethod';
const AdminFooter = () => {
  const [page, setPage] = React.useState(0);
  const [open, setOpen] = useState(false);
  const [Open, setopen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const OpenModal = () => setopen(true);
  const CloseModal = () => setopen(false);
  const [Editopen, setEditOpen] = useState(false);
  const EditOpenModal = () => setEditOpen(true);
  const EditCloseModal = () => setEditOpen(false);
  const [Address1, setAddress1] = useState('');
  const [Address2, setAddress2] = useState('');
  const [Map1, setMap1] = useState('');
  const [Map2, setMap2] = useState('');
  const [PhoneNo1, setPhoneNo1] = useState('');
  const [PhoneNo2, setPhoneNo2] = useState('');
  const [WhatsappNo1, setWhatsappNo1] = useState('');
  const [WhatsappNo2, setWhatsappNo2] = useState('');
  const [FaceBookLink, setFaceBookLink] = useState('');
  const [LinkedInLink, setLinkedInLink] = useState('');
  const [YoutubeLink, setYoutubeLink] = useState('');
  const [InstagramLink, setTwitterLink] = useState('');
  const [Email, setEmail] = useState('');
  const [footer, setFooter] = useState('');
  const [Services, setServices] = useState([]);
  const [IconImage, setSelectedImage] = useState(null);
  const [Heading, setHeading] = useState([]);
  const [Description, setDiscr] = useState([]);
  const [serviceId, setServiceId] = useState('');
  const [reload, setReload] = useState([Services]);
  const componentMounted = useRef(true);

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
  });
  function select(Id) {
    setAddress1(footer.address1);
    setAddress2(footer.address2);
    setPhoneNo1(footer.phoneNo1);
    setPhoneNo2(footer.phoneNo2);
    setWhatsappNo1(footer.whatsappNo1);
    setWhatsappNo2(footer.whatsappNo2);
    setFaceBookLink(footer.faceBookLink);
    setLinkedInLink(footer.linkedInLink);
    setYoutubeLink(footer.youtubeLink);
    setTwitterLink(footer.instagramLink);
    setEmail(footer.email);
  }
  const Submit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('Address1', Address1);
    formData.append('Address2', Address2);
    formData.append('Map1', Map1);
    formData.append('Map2', Map2);
    formData.append('PhoneNo1', PhoneNo1);
    formData.append('PhoneNo2', PhoneNo2);
    formData.append('WhatsappNo1', WhatsappNo1);
    formData.append('WhatsappNo2', WhatsappNo2);
    formData.append('FaceBookLink', FaceBookLink);
    formData.append('LinkedInLink', LinkedInLink);
    formData.append('YoutubeLink', YoutubeLink);
    formData.append('InstagramLink', InstagramLink);
    formData.append('Email', Email);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: 'bearer ' + localStorage.getItem('token'),
      },
    };
    const url = FetchUrl + `DashBoard/Update-ShopDetail`;
    axios
      .put(url, formData, config)
      .then((response) => {
        setReload();
        setOpen(false);
        alert('Footer Detail upload successfull !!');
      })
      .catch((err) => {});
  };
  useEffect(() => {
    fetch(FetchUrl + 'Home/get-services').then((result) => {
      result.json().then((resp) => {
        setServices(resp.data);
      });
    });
  }, [reload]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('IconImage', IconImage);
    formData.append('Description', Description);
    formData.append('Heading', Heading);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: 'bearer ' + localStorage.getItem('token'),
      },
    };
    const url = FetchUrl + 'DashBoard/add-new-service';
    axios
      .post(url, formData, config)
      .then((response) => {
        setReload();
        setSelectedImage(null);
        setopen(false);
      })
      .catch((err) => {});
  };
  function selectUser(id, index) {
    setSelectedImage(Services[index].iconImage);
    setHeading(Services[index].heading);
    setDiscr(Services[index].description);
    setServiceId(id);
  }
  const onEditFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('IconImage', IconImage);
    formData.append('Heading', Heading);
    formData.append('Description', Description);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
      },
    };

    const url = FetchUrl + `DashBoard/update-service/${serviceId}`;
    axios
      .put(url, formData, config)
      .then((response) => {
        setReload();
        setSelectedImage(null);
        setEditOpen(false);
        alert('Services update successfull !!');
      })
      .catch((err) => {});
  };
  const DeleteServices = (id) => {
    fetch(FetchUrl + `DashBoard/delete-service/${id}`, {
      method: 'Delete',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
      }
    }).then((resp) => {
      resp
        .json()
        .then((result) => {
          setReload();
        })
        .catch((err) => {
          alert('Services is not deleted !!');
        });
    });
  };
  return (
    <div className="Section">
      <div className="p-5">
        <div className="dashboard">Footer Detail</div>
        <div className="card-1">
          <div className="row d-flex g-2">
            <div className="d-flex" onClick={() => select(footer.shopDetailId)}>
              <button className="btnup" onClick={() => onOpenModal(footer.shopDetailId)}>
                Update
              </button>
            </div>
            <div className="col-md-6">
              <div className="card-2">
                <h3 className="m-4 headings">
                  <img src="./assets/footer/atom_icon.png" style={{ height: 25, width: 25 }} alt="location" /> Linked Accounts:
                </h3>
                <div className="m-4">
                  <p className="txt d-pointer">
                    <i className="fa fa-brands fa-twitter me-3"></i> Twitter:
                  </p>
                  <div className="detail-txt">
                    <span className=" d-pointer">{footer.instagramLink} </span>
                  </div>
                  <p className="txt d-pointer">
                    <i className="fa fa-facebook-f me-3"></i> Facebook:
                  </p>
                  <div className="detail-txt">
                    <span className=" d-pointer">{footer.faceBookLink}</span>
                  </div>
                  <p className="txt d-pointer">
                    {' '}
                    <i className="fa fa-linkedin me-3"></i> LinkdIn:
                  </p>
                  <div className="detail-txt">
                    <span className=" d-pointer">{footer.linkedInLink}</span>
                  </div>
                  <p className="txt d-pointer">
                    {' '}
                    <i className="fa fa-brands fa-youtube me-3"></i> YouTube:
                  </p>
                  <div className="detail-txt">
                    <span className=" d-pointer">{footer.youtubeLink}</span>
                  </div>
                </div>
                <h3 className="m-4 headings">
                  <img src="./assets/footer/location_on_icon.png" style={{ height: 25, width: 25 }} alt="location" />
                  Address/Location:
                </h3>
                <div className="m-4">
                  <p>
                    <span className="txt d-pointer">No 1</span>
                  </p>
                  <div className="detail-txts">
                    <span className=" d-pointer"> {footer.address1}</span>
                  </div>
                </div>
                <div className="m-4">
                  <p>
                    <span className="txt d-pointer">No 2</span>
                  </p>
                  <div className="detail-txts">
                    <span className=" d-pointer">{footer.address2}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card-2 p-4">
                <h3 className="m-2 headings">
                  <img src="./assets/footer/phone_icon-black.png" style={{ height: 25, width: 25 }} alt="location" /> Contact Us:
                </h3>
                <div className="m-4">
                  <p>
                    <span className="txt d-pointer"> No 1</span>
                  </p>
                  <div className="detail-txts">
                    <span className=" c-pointer">{footer.phoneNo1}</span>
                  </div>
                  <p>
                    <span className="txt d-pointer"> No 2</span>
                  </p>
                  <div className="detail-txts">
                    <span className=" c-pointer">{footer.phoneNo2}</span>
                  </div>
                </div>

                <h3 className="m-2 headings">
                  <img src="./assets/footer/Whatsapp_icon-black.png" style={{ height: 25, width: 25 }} alt="location" /> Whatsapp No.
                </h3>
                <div className="m-4">
                  <p>
                    <span className="txt d-pointer"> No 1</span>
                  </p>
                  <div className="detail-txts">
                    <span className=" c-pointer">{footer.whatsappNo1}</span>
                  </div>
                  <p>
                    <span className="txt d-pointer"> No 2</span>
                  </p>
                  <div className="detail-txts">
                    <span className=" d-pointer">{footer.whatsappNo2}</span>
                  </div>
                </div>
                <h3 className="m-2 headings">
                  <img src="./assets/footer/email_icon.png" style={{ height: 25, width: 25 }} alt="location" /> E-mail Address:
                </h3>
                <div className="m-4">
                  <p>
                    <span className="txt d-pointer"> No 1</span>
                  </p>
                  <div className="detail-txts">
                    <span className=" d-pointer">{footer.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Services Section */}
          <div className="row  g-4 text-align">
            <div className="dashboard">Services Detail</div>
            <div>
              <button className=" btnup pull-right" onClick={OpenModal}>
                Add Service
              </button>
            </div>
            <br />
            <br />
            {Services.map((Service, index) => (
              <div key={index} className="footer col-md-3 mb-md-0 mb-3">
                <div className="mb-2">
                  <div className="back">
                    <img className="footerimg" style={{ width: '60px', height: '50px' }} src={Service.iconImageUrl} />
                  </div>
                  <ul className="list-unstyled text-Footer">
                    <li>
                      <a className="greate">{Service.heading}</a>
                    </li>
                    <li>
                      <div>
                        <a className="text-Footer">{Service.description}</a>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="mb-2">
                  <span>
                    <button className="btn-dlt" onClick={() => DeleteServices(Service.serviceId)}>
                      Delete
                    </button>
                    <span onClick={() => selectUser(Service.serviceId, index)}>
                      <button className="btn-edit" onClick={() => EditOpenModal(Service.serviceId)}>
                        Edit
                      </button>
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Modal open={Open} onClose={CloseModal} center>
          <br></br>
          <form className="add-cate-popup" noValidate onSubmit={onFormSubmit}>
            <div>
              <input
                multiple
                type="file"
                className='choose-file'
                name="myImage"
                style={{ float: 'right' }}
                onChange={(event) => {
                  setSelectedImage(event.target.files[0]);
                }}
              />
              {IconImage && (
                <div>
                  <img alt="not fount" width={'250px'} src={URL.createObjectURL(IconImage)} />
                  <br />
                  <button className='remove-button' onClick={() => setSelectedImage(null)}>Remove</button>
                </div>
              )}
            </div>
            <label className="product-label mt-3">Heading</label>
            <input type="text" id="link" name="Line" className="product-input" onChange={(e) => setHeading(e.target.value)} />
            <label className="product-label mt-3">Description</label>
            <input type="text" id="link" name="Line" className="product-input" onChange={(e) => setDiscr(e.target.value)} />
            <br></br>
            <br></br>
            <button type="submit" className="btn-save-cat">
              Save
            </button>
          </form>
        </Modal>
      </div>
      <div id="model-popup">
        <Modal open={open} onClose={onCloseModal} center>
          <br></br>
          <div className="d-flex justify-content-center">
            <span className="Product-popup">Add Footer Detail</span>
          </div>
          <br></br>
          <form className="add-cate-popup" noValidate onSubmit={Submit}>
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <label className="product-label">Twitter </label>
                <br />
                <input type="text" defaultValue={InstagramLink} className="product-input" placeholder="twitter link" onChange={(e) => setTwitterLink(e.target.value)} />
                <br />
                <label className="product-label mt-3">Facebook</label>
                <br />
                <input type="text" className="product-input" placeholder="facebook link" defaultValue={FaceBookLink} onChange={(e) => setFaceBookLink(e.target.value)} />
                <br />
                <label className="product-label mt-3">LinkdIn</label>
                <br />
                <input type="text" defaultValue={LinkedInLink} className="product-input" placeholder="LinkdIn link" onChange={(e) => setLinkedInLink(e.target.value)} />
                <br />
                <label className="product-label mt-3">Youtube</label>
                <br />
                <input type="text" defaultValue={YoutubeLink} className="product-input" placeholder=" Youtube link" onChange={(e) => setYoutubeLink(e.target.value)} />
                <br />
                <label className="product-label mt-3">Address</label>
                <br />
                <input type="text" defaultValue={Address1} className="product-input" placeholder="Address no.1" onChange={(e) => setAddress1(e.target.value)} />
                <br />
                <br />
                <input type="text" defaultValue={Address2} className="product-input" placeholder="Address no.2 " onChange={(e) => setAddress2(e.target.value)} />

                <br />
                <br />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <label className="product-label">Phone No.</label>
                <br />
                <input type="text" defaultValue={PhoneNo1} className="product-input" placeholder="Phone no.1" onChange={(e) => setPhoneNo1(e.target.value)} />
                <br />
                <br />
                <input type="text" defaultValue={PhoneNo2} className="product-input" placeholder="Phone no.2" onChange={(e) => setPhoneNo2(e.target.value)} />
                <br />
                <label className="product-label mt-3">Whatsapp No.</label>
                <br />
                <input type="text" defaultValue={WhatsappNo1} className="product-input" placeholder="Whatsapp no.1" onChange={(e) => setWhatsappNo1(e.target.value)} />
                <br />
                <br />
                <input type="text" defaultValue={WhatsappNo2} className="product-input" placeholder="Whatsapp no.2" rows="2" onChange={(e) => setWhatsappNo2(e.target.value)} />
                <br />
                <label className="product-label mt-2">E-mail</label>
                <br />
                <input type="text" defaultValue={Email} className="product-input" placeholder="***@gmail.com" onChange={(e) => setEmail(e.target.value)} />
                <br />
                <br />
                <div className="d-flex justify-content-between" style={{ float: 'right' }}>
                  <button type="submit" className="save-footer-btn mr-3" onClick={Submit}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Modal>
      </div>
      <div>
        <Modal open={Editopen} onClose={EditCloseModal} center>
          <br></br>
          <div className="d-flex justify-content-center">
            <span className="category-popup">Services</span>
          </div>
          <br />
          <form className="add-cate-popup" noValidate onSubmit={onEditFormSubmit}>
            <div>
              <input
                multiple
                type="file"
                name="myImage"
                className='choose-file'
                style={{ float: 'right' }}
                onChange={(event) => {
                  setSelectedImage(event.target.files[0]);
                }}
              />
              {IconImage && (
                <div>
                  <img alt="not fount" width={'250px'} src={URL.createObjectURL(IconImage)} />
                  <br />
                  <button className='remove-button' onClick={() => setSelectedImage(null)}>Remove</button>
                </div>
              )}
            </div>
            <label className="product-label mt-3">Heading</label>
            <input type="text" id="link" name="Line" className="product-input" defaultValue={Heading} onChange={(e) => setHeading(e.target.value)} />
            <label className="product-label mt-3">Description</label>
            <input type="text" id="link" name="Line" className="product-input" defaultValue={Description} onChange={(e) => setDiscr(e.target.value)} />
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

export default AdminFooter;
