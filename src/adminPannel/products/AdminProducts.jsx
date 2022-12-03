import React, { useState, useEffect, useRef } from 'react';
import './adminmodule.scss';
import styled from 'styled-components';
import TablePaginationUnstyled from '@mui/base/TablePaginationUnstyled';
import 'react-responsive-modal/styles.css';
import { publicRequest } from '../../requestMethod';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import { Modal } from 'react-responsive-modal';
import axios from 'axios';
import { FetchUrl } from '../../requestMethod';
import { FaTrash } from 'react-icons/fa';
import swal from 'sweetalert';
import JoditEditor from 'jodit-react';
import { Fragment } from 'react';
const Section = styled.section`
  margin-left: 18vw;
  height: 100vh;
  background-color: #fafafa;
`;
const Root = styled('div')`
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  td,
  th {
    border: 1px solid #ddd;
    text-align: left;
    padding: 8px;
  }

  th {
    background-color: #ddd;
  }
`;

const CustomTablePagination = styled(TablePaginationUnstyled)`
  & .MuiTablePaginationUnstyled-toolbar {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }

  & .MuiTablePaginationUnstyled-selectLabel {
    margin: 0;
  }

  & .MuiTablePaginationUnstyled-displayedRows {
    margin: 0;

    @media (min-width: 768px) {
      margin-left: auto;
    }
  }

  & .MuiTablePaginationUnstyled-spacer {
    display: none;
  }

  & .MuiTablePaginationUnstyled-actions {
    display: flex;
    gap: 0.25rem;
  }
`;
const Popup = (props) => {
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.handleClose}>
          x
        </span>
        {props.content}
      </div>
    </div>
  );
};
const AdminProducts = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [orders, setOrders] = useState([]);
  const [online, setOnline] = useState([]);
  const [outOfStock, setOutOfStock] = useState([]);
  const [inactive, setInactive] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('ASC');
  const [open, setOpen] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [ImgArrangementNo, setImgArrangementNo] = useState();

  const onOpenModal = () => {
    setOpen(true);
    setHashTag([]);
  };
  const onCloseModal = () => {
    setFillFields(false);
    setOpen(false);
    setHashTag([]);
  };
  const [openEdit, setEditOpen] = useState(false);
  const onOpenEditModal = () => {
    setEditOpen(true);
    setHashTag([]);
  };
  const onCloseEditModal = () => {
    setEditOpen(false);
    setFillFields(false);
    setOldCatID(null);
    setOldMainCatID(null);
    setOldSubCatID(null);
    setEditCat(null);
    setEditMainCat(null);
    setEditSubCat(null);
    setHashTag([]);
  };
  const [openAddImageModel, setAddImageModel] = useState(false);
  const onOpenAddImageModel = () => setAddImageModel(true);
  const onCloseAddImageModel = () => {setAddImageModel(false); setImgArrangementNo()};
  const [openEditImageModel, setEditImageModel] = useState(false);
  const onOpenEditImageModel = () => setEditImageModel(true);
  const onCloseEditImageModel = () => {setEditImageModel(false); setImgArrangementNo()};
  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategory] = useState([]);
  const [subCategories, setSubCategory] = useState([]);
  const [brands, setBrands] = useState([]);
  const [warrantes, setquantity] = useState([]);
  const [highLight, setHighLight] = useState('');
  const [productName, setProductName] = useState('');
  const [editMainCat, setEditMainCat] = useState(null);
  const [editCat, setEditCat] = useState(null);
  const [editSubCat, setEditSubCat] = useState(null);
  const [oldMainCatID, setOldMainCatID] = useState('');
  const [oldCatID, setOldCatID] = useState('');
  const [oldSubCatID, setOldSubCatID] = useState('');
  const [description, setDescription] = useState('');
  const [_brandId, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountStartVar, setDiscountStartVar] = useState(null);
  const [discountEndVar, setDiscountEndVar] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [_warrantyId, setWarranty] = useState('');
  const [vedioUrl, setVedioUrl] = useState(null);
  const [shippingStatuses, setShippingStatus] = useState(true);
  const [isPapulars, setIsPapular] = useState();
  const [hashTag, setHashTag] = useState([]);
  const [weight, setWeight] = useState('');
  const [hight, setHight] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [freeShippingLabels, setFreeShippingLabel] = useState();
  const [manualShippingCharges, setManualShippingCharges] = useState(null);
  const [Images, setSelectedFiles] = useState([]);
  const [DescriptionImages, setSelectedFilesDesc] = useState([]);
  const [SubCategory, setSubcategory] = useState(null);
  const [_categoryId, setCategoryId] = useState(null);
  const [_productId, setProductId] = useState('');
  const [productDescImages, setProductDescImages] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [formFile, setSelectedImage] = useState(null);
  const [formFileDesc, setSelectedImageDesc] = useState(null);
  const [fillFields, setFillFields] = useState(false);
  const [arrangementNo, setArrangementNo] = useState(0);
  const [reload, setReload] = useState([mainCategories, online, outOfStock, productDescImages, productImages]);
  const [_reload, _setReload] = useState([mainCategories, online, outOfStock]);
  const [hashTagValue, sethashTagValue] = useState('');
  const sorting = (col) => {
    if (sort === 'ASC') {
      const sorted = [...orders].sort((a, b) => (a[col].toString().toLowerCase() > b[col].toString().toLowerCase() ? 1 : -1));
      setOrders(sorted);
      setSort('DSC');
    }
    if (sort === 'DSC') {
      const sorted = [...orders].sort((a, b) => (a[col].toString().toLowerCase() < b[col].toString().toLowerCase() ? 1 : -1));
      setOrders(sorted);
      setSort('ASC');
    }
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    const getOrders = async () => {
      setSpinner(true)
      try {
        const res = await publicRequest.get('Home/get-all-products', {
          headers: {
            Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
          },
        });
        setOrders(res.data.data);
        setSpinner(false)
      } catch {}
    };
    getOrders();
  }, [reload]);
  useEffect(() => {
    const getOutOfStock = async () => {
      setSpinner(true)
      try {
        const res = await publicRequest.get('Home/get-out-of-stock-products', {
          headers: {
            Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
          },
        });
        setOutOfStock(res.data.data);
        setSpinner(false)
      } catch {}
    };
    getOutOfStock();
  }, [reload]);
  useEffect(() => {
    const getInactive = async () => {
      setSpinner(true)
      try {
        const res = await publicRequest.get('Home/get-deactive-products', {
          headers: {
            Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
          },
        });
        setInactive(res.data.data);
        setSpinner(false)
      } catch {}
    };
    getInactive();
  }, [reload]);
  useEffect(() => {
    const getOnline = async () => {
      setSpinner(true)
      try {
        const res = await publicRequest.get('Home/get-active-products', {
          headers: {
            Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
          },
        });
        setOnline(res.data.data);
        setSpinner(false)
      } catch {}
    };
    getOnline();
  }, [reload]);
  const onFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('Images', formFile);
    formData.append('ArrangementNo', ImgArrangementNo);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: 'bearer ' + localStorage.getItem('token'),
      },
    };
    const url = FetchUrl + `DashBoard/add-image/${_productId}`;
    axios
      .post(url, formData, config)
      .then((response) => {
        setReload(mainCategories, online, outOfStock);
        setSelectedImage(null);
        setSelectedImageDesc(null);
        setAddImageModel(false);
        setEditImageModel(false);
        setImgArrangementNo()
      })
      .catch((err) => {});
  };
  const onDescriptionImageFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('Images', formFileDesc);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: 'bearer ' + localStorage.getItem('token'),
      },
    };
    const url = FetchUrl + `DashBoard/add-Product-decription-image/${_productId}`;
    axios
      .post(url, formData, config)
      .then((response) => {
        setReload();
        setSelectedImage(null);
        setEditImageModel(false);
        setAddImageModel(false);
        setSelectedImageDesc(null);
      })
      .catch((err) => {});
  };
  const selectProducts = (id) => {
    let pId = id.productId;
    const getProductDetail = async () => {
      const res = await publicRequest.get(`/Home/get-product/${pId}`);
      setProductDescImages(res.data.data.descriptionMedias);
      setProductImages(res.data.data.productMedias);
      setProductId(pId);
    };
    getProductDetail();
  };
  function selectProduct(product) {
    setProductId(product.productId);
    setHighLight(product.highLight);
    setProductName(product.productName);
    setDescription(product.description);
    setPrice(product.price);
    setOldMainCatID(product.mainCategoryId);
    setOldCatID(product.categoryId);
    setOldSubCatID(product.subCategoryId);
    // setDiscount(product.discountPrice);
    setDiscount(product.discountPrice);
    setDiscountStartVar(product.discountStart);
    setDiscountEndVar(product.discountEnd);
    setQuantity(product.quantity);
    setVedioUrl(product.vedioUrl);
    setShippingStatus(product.shippingStatus);
    setIsPapular(product.isPapular);
    if (product.hashTag !== null) {
      setHashTag(product.hashTag.split(',').filter(Boolean));
    }
    setFreeShippingLabel(product.freeShippingLabel);
    setManualShippingCharges(product.manualShippingCharges);
    setWeight(product.weight);
    setHight(product.hight);
    setWidth(product.width);
    setLength(product.length);
    setBrand(product.brandId);
    setWarranty(product.warrantyId);
  }
  const SubmitProduct = async (e) => {
    setSpinner(true)
    if ((productName && highLight && description && hight && width && length && SubCategory) && (_categoryId && weight && price && _brandId && _warrantyId && typeof freeShippingLabels === 'boolean' && typeof shippingStatuses === 'boolean' && typeof isPapulars === 'boolean')) {
      var freeShippingLabel = freeShippingLabels;
      var shippingStatus = true;
      var isPapular = isPapulars;
      var brandId = parseFloat(_brandId);
      var warrantyId = parseFloat(_warrantyId);
      var subCategoryId = SubCategory;
      var categoryId = _categoryId;
      var discountPrice = discount;
      e.preventDefault();
      var discountStart = discountStartVar === '' ? null : discountStartVar;
      var discountEnd = discountEndVar === '' ? null : discountEndVar;
      const response = await AddPrduct({
        highLight,
        productName,
        description,
        brandId,
        price,
        discountPrice,
        discountStart,
        discountEnd,
        quantity,
        warrantyId,
        vedioUrl,
        shippingStatus,
        isPapular,
        hashTag,
        weight,
        hight,
        length,
        width,
        subCategoryId,
        categoryId,
        freeShippingLabel,
        manualShippingCharges,
        arrangementNo,
      });
      setHashTag([]);
    } else {
      setFillFields(true);
    }
  };
  async function AddPrduct(credentials) {
    return fetch(FetchUrl + 'DashBoard/add-Product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
      },
      body: JSON.stringify(credentials),
    }).then((resp) => {
      resp.json().then((result) => {
        if (result.status === 'Success') {
          // swal('Success', result.message, 'success', {
          //   buttons: false,
          //   timer: 2000,
          // }).then((value) => {
            setSpinner(false);
            setOpen(false);
            setReload(online, subCategories);
            setFillFields(false);
          // });
        } else {
          setSpinner(false)
          swal('Failed', result.message, 'error');
        }
      });
    });
  }
  const SubmitImage = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('DescriptionImages', DescriptionImages);
    formData.append('Images', [Images]);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
      },
    };
    const url = FetchUrl + `DashBoard/Update-Product/${_productId}`;
    axios
      .put(url, formData, config)
      .then((response) => {
        setSelectedFiles([]);
        setSelectedFilesDesc([]);
        setEditOpen(false);
        setOldCatID(null);
        setOldMainCatID(null);
        setOldSubCatID(null);
        setEditCat(null);
        setEditMainCat(null);
        setEditSubCat(null);
        alert('Product Update successfull !!');
      })
      .catch((err) => {});
  };
  async function EditPrduct(credentials) {
    return fetch(FetchUrl + `DashBoard/Update-Product/${_productId}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
      },
      body: JSON.stringify(credentials),
    }).then((resp) => {
      resp.json().then((result) => {
        if (result.status === 'Success') {
          // swal('Success', result.message, 'success', {
          //   buttons: false,
          //   timer: 2000,
          // }).then((value) => {
            setSpinner(false)
            setEditOpen(false);
            setReload(online);
            setOldCatID(null);
            setOldMainCatID(null);
            setOldSubCatID(null);
            setEditCat(null);
            setEditMainCat(null);
            setEditSubCat(null);
          // });
        } else {
          setSpinner(false)
          swal('Failed', result.message, 'error');
        }
      });
    });
  }
  const SubmitEditProduct = async (e) => {
    setSpinner(true)
    var discountStart = discountStartVar === '' || price === discount ? null : discountStartVar;
    var discountEnd = discountEndVar === '' || price === discount ? null : discountEndVar;
    var freeShippingLabel = freeShippingLabels;
    var shippingStatus = true;
    var isPapular = isPapulars;
    var mainCategoryId = editMainCat === null ? oldMainCatID : editMainCat;
    var categoryId = editCat === null ? (editCat === undefined ? null : oldCatID) : editCat;
    var subCategoryId = editSubCat === null ? (editSubCat === undefined ? null : oldSubCatID) : editSubCat;

    var brandId = parseFloat(_brandId);
    var warrantyId = parseFloat(_warrantyId);
    var discountPrice = discount;
    e.preventDefault();
    if (productName && highLight && description && hight && width && length && weight && price && _brandId && _warrantyId && typeof freeShippingLabels === 'boolean' && typeof isPapulars === 'boolean') {
      const response = await EditPrduct({
        highLight,
        productName,
        description,
        brandId,
        price,
        discountPrice,
        discountStart,
        discountEnd,
        subCategoryId,
        mainCategoryId,
        categoryId,
        quantity,
        warrantyId,
        vedioUrl,
        shippingStatus,
        isPapular,
        hashTag,
        weight,
        hight,
        length,
        width,
        freeShippingLabel,
        manualShippingCharges,
        arrangementNo,
      });
      setHashTag([]);
      setEditMainCat(null);
      setEditCat(null);
      setEditSubCat(null);
      setOldMainCatID(null);
      setOldCatID(null);
      setOldSubCatID(null);
    } else {
      setFillFields(true);
    }
  };
  const GetCategory = (mainCategoryId) => {
    setOldMainCatID(mainCategoryId);
    fetch(FetchUrl + `Home/get-Categories/${mainCategoryId}`).then((result) => {
      result.json().then((resp) => {
        setCategory(resp.data);
      });
    });
  };
  const GetSubCategory = (categoryId) => {
    setCategoryId(categoryId);
    setOldCatID(categoryId);
    fetch(FetchUrl + `Home/get-SubCategories/${categoryId}`).then((result) => {
      result.json().then((resp) => {
        setSubCategory(resp.data);
      });
    });
  };
  useEffect(() => {
    const getMainCategories = async () => {
      try {
        const res = await publicRequest.get('Home/get-mainCategories');
        setMainCategories(res.data.data);
      } catch {}
    };
    getMainCategories();
  }, [reload]);
  useEffect(() => {
    if (oldMainCatID) {
      const getMainCategory = async () => {
        try {
          const res = await publicRequest.get(`Home/get-mainCategory/${oldMainCatID}`);
          GetCategory(res.data.data.mainCategoryId);
        } catch {}
      };
      getMainCategory();
    }
  }, [reload, oldMainCatID]);
  useEffect(() => {
    if (oldCatID) {
      const getCategory = async () => {
        try {
          const res = await publicRequest.get(`Home/get-category/${oldCatID}`);
          GetCategory(res.data.data.mainCategoryId);
          GetSubCategory(oldCatID);
          setOldMainCatID(res.data.data.mainCategoryId);
        } catch {}
      };
      getCategory();
    }
  }, [reload, oldCatID]);
  useEffect(() => {
    if (oldSubCatID) {
      const getSubCat = async () => {
        try {
          const res = await publicRequest.get(`Home/get-subCategory/${oldSubCatID}`);
          GetSubCategory(res.data.data.categoryId);
        } catch {}
      };
      getSubCat();
    }
  }, [reload, oldSubCatID]);
  useEffect(() => {
    const getbrands = async () => {
      try {
        const res = await publicRequest.get('Home/get-brands');
        setBrands(res.data.data);
      } catch {}
    };
    getbrands();
  }, []);
  useEffect(() => {
    const getquantity = async () => {
      try {
        const res = await publicRequest.get('Home/get-Warranties');
        setquantity(res.data.data);
      } catch {}
    };
    getquantity();
  }, []);
  //update Status Active and inactive
  const updateStatusActiveCategory = (data) => {
    const ProductId = data.productId;
    {
      fetch(FetchUrl + `DashBoard/update-product-active-status/${ProductId}`, {
        method: 'put',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(ProductId),
      }).then((resp) => {
        resp.json().then((result) => {
          if (result.status === 'Success') {
            swal('Success', result.message, 'success', {
              buttons: false,
              timer: 2000,
            }).then((value) => {
              setReload(online);
            });
          } else {
            swal('Failed', result.message, 'error');
          }
        });
      });
    }
  };
  //delete product image
  const DeleteImage = (mediaId) => {
    fetch(FetchUrl + `DashBoard/delete-media/${mediaId}`, {
      method: 'Delete',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
      },
      body: JSON.stringify(mediaId),
    }).then((resp) => {
      resp
        .json()
        .then((result) => {
          setSelectedImage(null);
          setSelectedImageDesc(null);
          setAddImageModel(false);
          setEditImageModel(false);
          setReload();
        })
        .catch((err) => {
          alert('Iamge is not deleted !!');
        });
    });
  };
  const renderPhotos = (sourceImage) => {
    return sourceImage.map((photo, index) => {
      return <img className="product-previow-img" src={photo} alt="" key={index} />;
    });
  };
  const renderPhotosDesc = (source) => {
    return source.map((photoDesc, i) => {
      return <img className="product-previow-img" src={photoDesc} alt="" key={i} />;
    });
  };
  const onFocusDesc = () => {
    if (description == '') {
      document.getElementById('keyPress').value += '• ';
    }
  };
  const keyupDesc = (event) => {
    var keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode == '13') {
      document.getElementById('keyPress').value += '• ';
    }
    var txtval = document.getElementById('keyPress').value;
    if (txtval.substr(txtval.length - 1) == '\n') {
      document.getElementById('keyPress').value = txtval.substring(0, txtval.length - 1);
    }
  };
  const onFocusHigh = () => {
    if (highLight == '') {
      document.getElementById('keyPressHigh').value += '• ';
    }
  };
  const keyupHigh = (event) => {
    var keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode == '13') {
      document.getElementById('keyPressHigh').value += '• ';
    }
    var txtval = document.getElementById('keyPressHigh').value;
    if (txtval.substr(txtval.length - 1) == '\n') {
      document.getElementById('keyPressHigh').value = txtval.substring(0, txtval.length - 1);
    }
  };
  const handleTagKeyDown = (e) => {
    if (e.key !== ',') return;
    const value = e.target.value;
    if (!value.trim()) return;
    setHashTag([...hashTag, value]);
  };
  const removeTag = (index) => {
    setHashTag(hashTag.filter((el, i) => i !== index));
  };
  const hashtagValueChange = (e) => {
    if (e.target.value.endsWith(',')) {
      sethashTagValue('');
    } else {
      sethashTagValue(e.target.value);
    }
  };
  return (
    <div className="Section">
      <div className="p-4">
        <div className="dashboard"> Products management </div>
        <button type="button" className="mt-5 add-product-btn" onClick={onOpenModal}>
          Add new Products
        </button>
        <div className="row padding">
          <div className="col-lg-8 col-md-12 col-sm-12 mt-5">
            <div className="d-flex justify-content-between">
              <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button className="nav-link " id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                    All
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link active" id="pills-online-tab" data-bs-toggle="pill" data-bs-target="#pills-online" type="button" role="tab" aria-controls="pills-online" aria-selected="false">
                    Online({spinner?
                            <i className="fa fa-spinner ml-4 fa-spin"></i>
                            : online.length})
                    
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">
                    Out of stock({spinner?
                            <i className="fa fa-spinner ml-4 fa-spin"></i>
                            : outOfStock.length})
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="pills-inactive-tab" data-bs-toggle="pill" data-bs-target="#pills-inactive" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">
                    Inactive({spinner?
                            <i className="fa fa-spinner ml-4 fa-spin"></i>
                            : inactive.length})
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="p-3 bgColor">
          <div className="d-flex justify-content-between ">
            <span className="category-list">Products</span>
            <input
              type="text"
              className="product-search"
              placeholder="Search product by product name ..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
          <br></br>
          <div className="tab-content" id="pills-tabContent">
            <div className="tab-pane fade " id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
              <Root sx={{ minWidth: '900px', width: 500 }}>
                <table aria-label="custom pagination table mt-2" style={{ minWidth: '900px', overFlow: 'scroll' }}>
                  <thead>
                    <tr>
                      <th>Images</th>
                      <th>Name</th>
                      <th onClick={() => sorting('orderNo')} style={{ cursor: 'pointer' }}>
                        Brand
                      </th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Created</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0 && searchTerm === ''? 
                      orders.slice(page * rowsPerPage, 
                      page * rowsPerPage + rowsPerPage) : orders)
                      .filter((val) => {
                        if (searchTerm === '') {
                          return val;
                        } else if (val.productName.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())) {
                          return val;
                        }
                      })
                      .map((row, i) => (
                        <tr key={i}>
                          <td style={{ width: 160, borderRight: 'none' }} align="right">
                            {row.productMedias.length !== 0 ? (
                              <>
                                {row.productMedias.slice(0, 1).map((image, i) => (
                                  <img key={i} src={image.imgUrl} style={{ width: '60px', height: '50px' }} />
                                ))}
                              </>
                            ) : (
                              <img src="./assets/Auth/default-img.png" style={{ width: '60px', height: '50px' }} />
                            )}
                          </td>
                          <td className="order-td" align="right">
                            {row.productName}
                          </td>
                          <td className="order-td c-pointer" align="right">
                            {row.brandName}
                          </td>
                          <td className="order-td" align="right">
                            {row.discountPrice !== 0 ? <span>{row.discountPrice}</span> : <span>{row.price}</span>}
                          </td>
                          <td className="order-td" align="right">
                            Instock ({row.quantity})
                          </td>
                          <td className="order-td" align="right">
                            {moment(row.createAt).format('YYYY-MM-DD HH:mm:ss')}
                            <br />
                            Updated:
                            <br />
                            {moment(row.updateAt).format('YYYY-MM-DD HH:mm:ss')}
                          </td>
                          <td className="order-td1" align="right">
                            {row.isActive === true ? <span>Active</span> : <span>Inactive</span>}
                          </td>
                        </tr>
                      ))}

                    {emptyRows > 0 && (
                      <tr style={{ height: 41 * emptyRows }}>
                        <td colSpan={6} />
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <CustomTablePagination
                        rowsPerPageOptions={[10, 25, { label: 'All', value: -1 }]}
                        colSpan={7}
                        count={orders.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        componentsProps={{
                          select: {
                            'aria-label': 'rows per page',
                          },
                          actions: {
                            showFirstButton: true,
                            showLastButton: true,
                          },
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </tr>
                  </tfoot>
                </table>
              </Root>
            </div>
            <div className="tab-pane fade show active" id="pills-online" role="tabpanel" aria-labelledby="pills-online-tab">
              <Root sx={{ minWidth: '900px', width: 500 }}>
                <table aria-label="custom pagination table mt-2" style={{ minWidth: '900px', overFlow: 'scroll' }}>
                  <thead>
                    <tr>
                      <th>Images</th>
                      <th>Name</th>
                      <th onClick={() => sorting('orderNo')} style={{ cursor: 'pointer' }}>
                        Brand
                      </th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0 && searchTerm === ''? 
                      online.slice(page * rowsPerPage, 
                      page * rowsPerPage + rowsPerPage) : online)
                      .filter((val) => {
                        if (searchTerm === '') {
                          return val;
                        } else if (val.productName.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())) {
                          return val;
                        }
                      })
                      .map((row, i) => (
                        <tr key={i}>
                          <td style={{ width: 160, borderRight: 'none' }} align="right">
                            {row.productMedias != 0 ? (
                              <>
                                {row.productMedias.slice(0, 1).map((image, i) => (
                                  <span key={i} onClick={() => selectProducts(row)}>
                                    <img
                                      className="c-pointer"
                                      src={image.imgUrl}
                                      style={{
                                        width: '60px',
                                        height: '50px',
                                      }}
                                      onClick={onOpenEditImageModel}
                                    />
                                  </span>
                                ))}
                              </>
                            ) : (
                              <span onClick={() => selectProducts(row)}>
                                <button className="add-img-btn" onClick={onOpenAddImageModel}>
                                  Add Image
                                </button>
                              </span>
                            )}
                          </td>
                          <td className="order-td" align="right">
                            {row.productName}
                          </td>
                          <td className="order-td c-pointer" align="right">
                            {row.brandName}
                          </td>
                          <td className="order-td" align="right">
                            {row.discountPrice !== 0 ? <span>{row.discountPrice}</span> : <span>{row.price}</span>}
                          </td>
                          <td className="order-td" align="right">
                            Instock ({row.quantity})
                          </td>
                          <td className="order-td" align="right">
                            {moment(row.createAt).format('YYYY-MM-DD HH:mm:ss')}
                            <br />
                            Updated:
                            <br />
                            {moment(row.updateAt).format('YYYY-MM-DD HH:mm:ss')}
                          </td>
                          <td className="order-td1" align="right">
                            <span onClick={() => selectProduct(row)}>
                              <span onClick={() => selectProducts(row)}>
                                <span className="c-pointer active-link" onClick={onOpenEditModal}>
                                  Edit
                                </span>
                              </span>
                            </span>
                            <br />
                            <span className="c-pointer active-link" onClick={() => updateStatusActiveCategory(row)}>
                              Inactive
                            </span>
                          </td>
                        </tr>
                      ))}
                    {emptyRows > 0 && (
                      <tr style={{ height: 41 * emptyRows }}>
                        <td colSpan={6} />
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr >
                      <CustomTablePagination
                        className = "TablePagination"
                        rowsPerPageOptions={[10, 25, { label: 'All', value: -1 }]}
                        colSpan={7}
                        count={online.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        componentsProps={{
                          select: {
                            'aria-label': 'rows per page',
                          },
                          actions: {
                            showFirstButton: true,
                            showLastButton: true,
                          },
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </tr>
                  </tfoot>
                </table>
              </Root>
            </div>
            <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
              <Root sx={{ minWidth: '900px', width: 500 }}>
                <table aria-label="custom pagination table mt-2" style={{ minWidth: '900px', overFlow: 'scroll' }}>
                  <thead>
                    <tr>
                      <th>Images</th>
                      <th>Name</th>
                      <th onClick={() => sorting('orderNo')} style={{ cursor: 'pointer' }}>
                        Brand
                      </th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0 && searchTerm === ''? 
                      outOfStock.slice(page * rowsPerPage, 
                      page * rowsPerPage + rowsPerPage) : outOfStock)
                      .filter((val) => {
                        if (searchTerm === '') {
                          return val;
                        } else if (val.productName.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())) {
                          return val;
                        }
                      })
                      .map((row, i) => (
                        <tr key={i}>
                          <td style={{ width: 160, borderRight: 'none' }} align="right">
                            {row.productMedias != 0 ? (
                              <>
                                {row.productMedias.slice(0, 1).map((image, i) => (
                                  <span key={i} onClick={() => selectProducts(row)}>
                                    <img
                                      className="c-pointer"
                                      src={image.imgUrl}
                                      style={{
                                        width: '60px',
                                        height: '50px',
                                      }}
                                      onClick={onOpenEditImageModel}
                                    />
                                  </span>
                                ))}
                              </>
                            ) : (
                              <button className="add-img-btn" onClick={onOpenAddImageModel}>
                                Add Image
                              </button>
                            )}
                          </td>
                          <td className="order-td" align="right">
                            {row.productName}
                          </td>
                          <td className="order-td c-pointer" align="right">
                            {row.brandName}
                          </td>
                          <td className="order-td" align="right">
                            {row.discountPrice !== 0 ? <span>{row.discountPrice}</span> : <span>{row.price}</span>}
                          </td>
                          <td className="order-td" align="right">
                            outOfStock ({row.quantity})
                          </td>
                          <td className="order-td" align="right">
                            {moment(row.createAt).format('YYYY-MM-DD HH:mm:ss')}
                            <br />
                            Updated:
                            <br />
                            {moment(row.updateAt).format('YYYY-MM-DD HH:mm:ss')}
                          </td>
                          <td className="order-td1" align="right">
                            <span onClick={() => selectProduct(row)}>
                              <span onClick={() => selectProducts(row)}>
                                <span className="c-pointer active-link" onClick={onOpenEditModal}>
                                  Edit
                                </span>
                              </span>
                            </span>
                            <br />
                            <span>Active</span>
                          </td>
                        </tr>
                      ))}

                    {emptyRows > 0 && (
                      <tr style={{ height: 41 * emptyRows }}>
                        <td colSpan={6} />
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <CustomTablePagination
                        rowsPerPageOptions={[10, 25, { label: 'All', value: -1 }]}
                        colSpan={7}
                        count={outOfStock.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        componentsProps={{
                          select: {
                            'aria-label': 'rows per page',
                          },
                          actions: {
                            showFirstButton: true,
                            showLastButton: true,
                          },
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </tr>
                  </tfoot>
                </table>
              </Root>
            </div>
            <div className="tab-pane fade" id="pills-inactive" role="tabpanel" aria-labelledby="pills-inactive-tab">
              <Root sx={{ minWidth: '900px', width: 500 }}>
                <table aria-label="custom pagination table mt-2" style={{ minWidth: '900px', overFlow: 'scroll' }}>
                  <thead>
                    <tr>
                      <th>Images</th>
                      <th>Name</th>
                      <th onClick={() => sorting('orderNo')} style={{ cursor: 'pointer' }}>
                        Brand
                      </th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0 && searchTerm === ''? 
                      inactive.slice(page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage) : inactive)
                      .filter((val) => {
                        if (searchTerm === '') {
                          return val;
                        } else if (val.productName.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())) {
                          return val;
                        }
                      })
                      .map((row, i) => (
                        <tr key={i}>
                          <td style={{ width: 160, borderRight: 'none' }} align="right">
                            {row.productMedias.length !== 0 ? (
                              <>
                                {row.productMedias.slice(0, 1).map((image, i) => (
                                  <img key={i} src={image.imgUrl} style={{ width: '60px', height: '50px' }} />
                                ))}
                              </>
                            ) : (
                              <img src="./assets/Auth/default-img.png" style={{ width: '60px', height: '50px' }} />
                            )}
                          </td>
                          <td className="order-td" align="right">
                            {row.productName}
                          </td>
                          <td className="order-td c-pointer" align="right">
                            {row.brandName}
                          </td>
                          <td className="order-td" align="right">
                            {row.discountPrice !== 0 ? <span>{row.discountPrice}</span> : <span>{row.price}</span>}
                          </td>
                          <td className="order-td" align="right">
                            inactive ({row.quantity})
                          </td>
                          <td className="order-td" align="right">
                            {moment(row.createAt).format('YYYY-MM-DD HH:mm:ss')}
                            <br />
                            Updated:
                            <br />
                            {moment(row.updateAt).format('YYYY-MM-DD HH:mm:ss')}
                          </td>
                          <td className="order-td1" align="right">
                            <span className="c-pointer active-link" onClick={() => updateStatusActiveCategory(row)}>
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}

                    {emptyRows > 0 && (
                      <tr style={{ height: 41 * emptyRows }}>
                        <td colSpan={6} />
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <CustomTablePagination
                        rowsPerPageOptions={[10, 25, { label: 'All', value: -1 }]}
                        colSpan={7}
                        count={inactive.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        componentsProps={{
                          select: {
                            'aria-label': 'rows per page',
                          },
                          actions: {
                            showFirstButton: true,
                            showLastButton: true,
                          },
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </tr>
                  </tfoot>
                </table>
              </Root>
            </div>
          </div>
        </div>
      </div>
      {/* Add Product popup */}
      <div id="model-popup">
        <Modal open={open} onClose={onCloseModal} center>
          <br></br>
          <div className="d-flex justify-content-center">
            <span className="Product-popup">Add Product</span>
          </div>
          <br></br>
          {fillFields ? (
            <div className="required justify-content-center">
              {' '}
              <p>*Please fill all the marked fields.</p>
            </div>
          ) : (
            ''
          )}
          <form>
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <label className="product-label">
                  Products Name<span className="required">*</span>
                </label>
                <br />
                <input type="text" id="username" name="username" className="product-input" placeholder="Please enter your products Name here" required onChange={(e) => setProductName(e.target.value)} />
                <div className="row">
                  <div className="col-lg-4 col-md-6-col-sm-12">
                    <label className="product-label mt-3">MainCategory</label>
                    <Form.Select defaultValue={'Select'} aria-label="Default select example" onChange={(e) => GetCategory(e.target.value)} required>
                      <option value="Select" disabled hidden>
                        Select
                      </option>
                      {mainCategories.map((mainCategory, i) => (
                        <option key={i} value={mainCategory.mainCategoryId} id={mainCategory.mainCategoryId}>
                          {mainCategory.name}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className="col-lg-4 col-md-6-col-sm-12">
                    <label className="product-label mt-3">
                      Category<span className="required">*</span>
                    </label>
                    <Form.Select defaultValue={'Select'} aria-label="Default select example" onChange={(e) => GetSubCategory(e.target.value)} required>
                      <option value="Select" disabled hidden>
                        Select
                      </option>
                      {categories.map((Category, i) => (
                        <option key={i} value={Category.categoryId} id={Category.categoryId}>
                          {Category.name}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className="col-lg-4 col-md-6-col-sm-12">
                    <label className="product-label mt-3">
                      SubCategory
                    </label>
                    <Form.Select defaultValue={'Select'} aria-label="Default select example" required onChange={(e) => setSubcategory(e.target.value)}>
                      <option value="Select" disabled hidden>
                        Select
                      </option>
                      {subCategories.map((subCategory, i) => (
                        <option key={i} value={subCategory.subCategoryId} id={subCategory.subCategoryId}>
                          {subCategory.name}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </div>
                <label className="product-label mt-3">
                  Highlight<span className="required">*</span>
                </label>
                <br />
                {/* <textarea type="text" id="keyPressHigh" name="username" className="product-textarea" placeholder="Please enter highlight here" rows="4" required onFocus={(e) => onFocusHigh(e)} onKeyUp={(e) => keyupHigh(e)} onChange={(e) => setHighLight(e.target.value)} /> */}
                <JoditEditor value={`${highLight}`} id="keyPressHigh" name="username" className="product-textarea" rows="4" required onFocus={(e) => onFocusHigh(e)} onKeyUp={(e) => keyupHigh(e)} onChange={(e) => setHighLight(e)} />
                <label className="product-label">
                  Description<span className="required">*</span>
                </label>
                <br></br>
                {/* <textarea type="text" id="keyPress" name="username" rows="4" className="product-textarea" placeholder="Please enter product description" required onFocus={(e) => onFocusDesc(e)} onKeyUp={(e) => keyupDesc(e)} onChange={(e) => setDescription(e.target.value)} /> */}
                <JoditEditor value={`${description}`} type="text" id="keyPress" name="username" rows="4" className="product-textarea" placeholder="Please enter product description" required onFocus={(e) => onFocusDesc(e)} onKeyUp={(e) => keyupDesc(e)} onChange={(e) => setDescription(e)} />
                <div className="row">
                  <label className="product-label">Package Dimensions (cm)</label>
                  <div className="col">
                    <label className="product-label">
                      Height<span className="required">*</span>
                    </label>
                    <input type="number" id="username" name="username" className="product-input" min="0" onChange={(e) => setHight(e.target.value)} required />
                  </div>
                  <div className="col">
                    <label className="product-label">
                      Width<span className="required">*</span>
                    </label>
                    <input type="number" id="username" name="username" className="product-input" min="0" onChange={(e) => setWidth(e.target.value)} required />
                  </div>
                  <div className="col">
                    <label className="product-label">
                      Lenght<span className="required">*</span>
                    </label>
                    <input type="number" id="username" name="username" className="product-input" min="0" onChange={(e) => setLength(e.target.value)} required />
                  </div>
                </div>
                <label className="product-label">
                  Package Weight (kg)<span className="required">*</span>
                </label>
                <br />
                <input type="number" id="username" name="username" className="product-input" min="0" placeholder="Please enter package weight here" required onChange={(e) => setWeight(e.target.value)} />
                <label className="product-label">Discount Start Date</label>
                <br />
                <input type="datetime-local" id="username" name="username" className="product-input" placeholder="Please enter package weight here" onChange={(e) => setDiscountStartVar(e.target.value)} />
                <label className="product-label">Discount End Date</label>
                <br />
                <input type="datetime-local" id="username" name="username" className="product-input" placeholder="Please enter package weight here" onChange={(e) => setDiscountEndVar(e.target.value)} />
                <label className="product-label mt-3">Tags</label>
                <br />
                <div className="product-textarea">
                  {hashTag.map((tag, index) => (
                    <div className="tagItem" key={index}>
                      <span className="tagText">{tag}</span>
                      <span onClick={() => removeTag(index)} className="close">
                        &times;
                      </span>
                    </div>
                  ))}
                  <input type="text" id="username" name="username" value={hashTagValue} className="tags-input" style={{ borderStyle: 'none' }} placeholder="Please enter tags here" onKeyDown={handleTagKeyDown} onChange={(e) => hashtagValueChange(e)} />
                </div>
                <br></br>
                <br></br>
                <br></br>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <label className="product-label">
                  Price<span className="required">*</span>
                </label>
                <br />
                <input type="number" id="username" name="username" className="product-input" placeholder="Please enter price here" min="0" required onChange={(e) => setPrice(e.target.value)} />
                <label className="product-label mt-2">Discounted Price </label>
                <br />
                <input type="number" id="username" name="username" className="product-input" placeholder="Please enter discount here" min="0" max={price} onChange={(e) => setDiscount(e.target.value)} />
                <label className="product-label mt-2">
                  Brand<span className="required">*</span>
                </label>
                <br />
                <Form.Select defaultValue={'Select'} aria-label="Default select example" required onChange={(e) => setBrand(e.target.value)}>
                  <option value="Select" disabled hidden>
                    Select
                  </option>
                  {brands.map((brand, i) => (
                    <option key={i} value={brand.brandId} id={brand.brandId}>
                      {brand.brandName}
                    </option>
                  ))}
                </Form.Select>
                <label className="product-label mt-2">
                  Warranty<span className="required">*</span>
                </label>
                <br />
                <Form.Select defaultValue={'Select'} aria-label="Default select example" required onChange={(e) => setWarranty(e.target.value)}>
                  <option value="Select" disabled hidden>
                    Select
                  </option>
                  {warrantes.map((warrante, i) => (
                    <option key={i} value={warrante.warrantyId} id={warrante.warrantyId}>
                      {warrante.warrantyType}
                    </option>
                  ))}
                </Form.Select>
                <label className="product-label mt-2">Stock</label>
                <br />
                <input type="number" id="username" name="username" className="product-input" placeholder="Please enter stock here" min="0" onChange={(e) => setQuantity(e.target.value)} />
                <label className="product-label mt-2">Video Url</label>
                <br />
                <input type="text" id="username" name="username" className="product-input" placeholder="Please enter video url here" onChange={(e) => setVedioUrl(e.target.value)} />
                <label className="product-label mt-2">Manual Shipping Charges</label>
                <br />
                <input type="number" id="username" name="username" className="product-input" placeholder="Please enter manual shipping charges here" min="0" onChange={(e) => setManualShippingCharges(e.target.value)} />
                <label className="product-label mt-4">
                  Free Shipping label<span className="required">*</span>
                </label>
                <br />
                <div>
                  <input required type="radio" onClick={() => setFreeShippingLabel(true)} value="True" name="Shipping" /> Yes&nbsp; &nbsp;
                  <input required type="radio" onClick={() => setFreeShippingLabel(false)} value="False" name="Shipping" /> No
                </div>
                <label className="product-label mt-4">
                  Is Papular<span className="required">*</span>
                </label>
                <br />
                <div>
                  <input required type="radio" onClick={() => setIsPapular(true)} value="True" name="Papular" /> Yes &nbsp; &nbsp;
                  <input required type="radio" onClick={() => setIsPapular(false)} value="False" name="Papular" /> No
                </div>
                <div className="d-flex justify-content-between" style={{ float: 'right' }}>
                  <button type="submit" className="save-prodcut-btn mr-2" onClick={SubmitProduct}>
                    Save Product
                    {spinner?
                    <i className="fa fa-spinner ml-4 fa-spin"></i>
                    :""}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Modal>
      </div>
      {/* Edit Product popup */}
      <div id="model-popup">
        <Modal open={openEdit} onClose={onCloseEditModal} center>
          <br></br>
          <div className="d-flex justify-content-center">
            <span className="Product-popup">Edit Product</span>
          </div>
          <br></br>
          <form>
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                {fillFields ? (
                  <div className="required justify-content-center">
                    {' '}
                    <p>*Please fill all the marked fields.</p>
                  </div>
                ) : (
                  ''
                )}
                <label className="product-label">
                  Products Name<span className="required">*</span>
                </label>
                <br />
                <input type="text" id="username" name="username" className="product-input" placeholder="Please enter your products Name here" required value={productName} onChange={(e) => setProductName(e.target.value)} />
                <div className="row">
                  <div className="col-lg-4 col-md-6-col-sm-12">
                    <label className="product-label mt-3">MainCategory</label>
                    <Form.Select
                      // defaultValue={mainCatName}
                      aria-label="Default select example"
                      onChange={(e) => {
                        GetCategory(e.target.value);
                        setEditMainCat(e.target.value);
                        setEditSubCat(undefined);
                        setEditCat(undefined);
                      }}
                      required
                    >
                      <option value="Select" selected={editMainCat === (null || undefined)} disabled hidden>
                        Select
                      </option>
                      {mainCategories.map((mainCategory, i) => (
                        <option key={i} value={mainCategory.mainCategoryId} id={mainCategory.mainCategoryId} selected={editMainCat === null && mainCategory.mainCategoryId === oldMainCatID}>
                          {mainCategory.name}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className="col-lg-4 col-md-6-col-sm-12">
                    <label className="product-label mt-3">
                      Category<span className="required">*</span>
                    </label>
                    <Form.Select
                      // defaultValue={catName}
                      aria-label="Default select example"
                      onChange={(e) => {
                        GetSubCategory(e.target.value);
                        setEditSubCat(undefined);
                        setEditCat(e.target.value);
                      }}
                      required
                    >
                      <option value="Select" selected={editCat === (null || undefined)} disabled hidden>
                        Select
                      </option>
                      {categories.map((Category, i) => (
                        <option key={i} value={Category.categoryId} id={Category.categoryId} selected={editCat === null && Category.categoryId === oldCatID}>
                          {Category.name}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className="col-lg-4 col-md-6-col-sm-12">
                    <label className="product-label mt-3">
                      SubCategory
                    </label>
                    <Form.Select
                      // defaultValue={subCatName}
                      aria-label="Default select example"
                      onChange={(e) => {
                        setEditSubCat(e.target.value);
                      }}
                      required
                    >
                      <option value="Select" selected={editSubCat === (null || undefined)} disabled hidden>
                        Select
                      </option>
                      {subCategories.map((subCategory, i) => (
                        <option key={i} value={subCategory.subCategoryId} id={subCategory.subCategoryId} selected={editSubCat === null && subCategory.subCategoryId === oldSubCatID}>
                          {subCategory.name}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </div>
                <label className="product-label mt-3">
                  Highlight<span className="required">*</span>
                </label>
                <br />
                {/* <textarea type="text" id="keyPressHigh" name="username" className="product-textarea" placeholder="Please enter your highlight here" rows="4" required value={highLight} onFocus={(e) => onFocusHigh(e)} onKeyUp={(e) => keyupHigh(e)} onChange={(e) => setHighLight(e.target.value)} /> */}
                <JoditEditor id="keyPressHigh" name="username" className="product-textarea" placeholder="Please enter your highlight here" rows="4" value={`${highLight}`} required onFocus={(e) => onFocusHigh(e)} onKeyUp={(e) => keyupHigh(e)} onBlur={(e) => setHighLight(e) } />
                <label className="product-label">
                  Description<span className="required">*</span>
                </label>
                <br></br>
                {/* <textarea type="text" id="keyPress" name="username" rows="4" className="product-textarea" placeholder="Please enter your package weight here" required value={description} onFocus={(e) => onFocusDesc(e)} onKeyUp={(e) => keyupDesc(e)} onChange={(e) => setDescription(e.target.value)} /> */}
                <JoditEditor value={`${description}`} id="keyPress" name="username" rows="4" className="product-textarea" placeholder="Please enter your package weight here" required onFocus={(e) => onFocusDesc(e)} onKeyUp={(e) => keyupDesc(e)} onChange={(e) => setDescription(e)} />
                <div className="img p-3">
                  <div className="result">
                    {renderPhotosDesc(DescriptionImages)}
                    {productDescImages.map((image, i) => (
                      <img
                        key={i}
                        className="result"
                        style={{
                          marginRight: '10px',
                          height: '100px',
                          width: '100px',
                        }}
                        src={image.imgUrl}
                      />
                    ))}
                  </div>
                </div>
                <div className="row">
                  <label className="product-label">Package Dimensions (cm)</label>
                  <div className="col">
                    <label className="product-label">
                      Height<span className="required">*</span>
                    </label>
                    <input type="number" id="username" name="username" className="product-input" min="0" value={hight} onChange={(e) => setHight(e.target.value)} required />
                  </div>
                  <div className="col">
                    <label className="product-label">
                      Width<span className="required">*</span>
                    </label>
                    <input type="number" id="username" name="username" className="product-input" min="0" value={width} onChange={(e) => setWidth(e.target.value)} required />
                  </div>
                  <div className="col">
                    <label className="product-label">
                      Lenght<span className="required">*</span>
                    </label>
                    <input type="number" id="username" name="username" className="product-input" min="0" value={length} onChange={(e) => setLength(e.target.value)} required />
                  </div>
                </div>
                <label className="product-label">
                  Package Weight (kg)<span className="required">*</span>
                </label>
                <br />
                <input type="number" id="username" name="username" className="product-input" placeholder="Please enter your package weight here" min="0" required value={weight} onChange={(e) => setWeight(e.target.value)} />
                <label className="product-label">Discount Start Date</label>
                <br />
                <input type="datetime-local" id="username" name="username" className="product-input" placeholder="Please enter your package weight here" value={discountStartVar} onChange={(e) => setDiscountStartVar(e.target.value)} />
                <label className="product-label">Discount End Date</label>
                <br />
                <input type="datetime-local" id="username" name="username" className="product-input" placeholder="Please enter your package weight here" value={discountEndVar} onChange={(e) => setDiscountEndVar(e.target.value)} />
                <label className="product-label mt-3">Tags</label>
                <br />
                <div className="product-textarea">
                  {hashTag.map((tag, index) => (
                    <div className="tagItem" key={index}>
                      <span className="tagText">{tag}</span>
                      <span onClick={() => removeTag(index)} className="close">
                        &times;
                      </span>
                    </div>
                  ))}
                  <input type="text" id="username" name="username" value={hashTagValue} className="tags-input" style={{ borderStyle: 'none' }} placeholder="Please enter tags here" onKeyDown={handleTagKeyDown} onChange={(e) => hashtagValueChange(e)} />
                </div>
                <br></br>
                <br></br>
                <br></br>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <label className="product-label">Products Image</label>
                <div>
                  <div className="result">
                    {renderPhotos(Images)}
                    {productImages.map((image, i) => (
                      <div key={i} className="slide-img">
                        <img
                          className="result image-slider"
                          style={{
                            marginRight: '20px',
                            height: '100px',
                            width: '100px',
                          }}
                          src={image.imgUrl}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <label className="product-label mt-2">
                  Price<span className="required">*</span>
                </label>
                <br />
                <input type="number" id="username" name="username" className="product-input" placeholder="Please enter your price here" min="0" required value={price} onChange={(e) => setPrice(e.target.value)} />
                <label className="product-label mt-2">Discounted Price</label>
                <br />
                <input type="number" id="username" name="username" className="product-input" placeholder="Please enter your discount here" required max={price} min="0" value={Math.trunc(parseFloat(discount))} onChange={(e) => setDiscount(e.target.value)} />
                <label className="product-label mt-2">
                  Brand<span className="required">*</span>
                </label>
                <br />

                <Form.Select defaultValue={_brandId} aria-label="Default select example" onChange={(e) => setBrand(e.target.value)}>
                  {brands.map((brand, i) => (
                    <Fragment key={i}>
                      <option defaultValue={_brandId} disabled hidden>
                        {_brandId === brand.brandId ? brand.brandName : 'Select'}
                      </option>
                      <option key={i} value={brand.brandId} id={brand.brandId}>
                        {brand.brandName}
                      </option>
                    </Fragment>
                  ))}
                </Form.Select>
                <label className="product-label mt-2">
                  Warranty<span className="required">*</span>
                </label>
                <br />
                <Form.Select defaultValue={_warrantyId} aria-label="Default select example" onChange={(e) => setWarranty(e.target.value)}>
                  {warrantes.map((warrante, i) => (
                    <Fragment key={i}>
                      <option defaultValue={_warrantyId} disabled hidden>
                        {_warrantyId === warrante.warrantyId ? warrante.warrantyType : 'Select'}
                      </option>
                      <option key={i} value={warrante.warrantyId} id={warrante.warrantyId}>
                        {warrante.warrantyType}
                      </option>
                    </Fragment>
                  ))}
                </Form.Select>
                <label className="product-label mt-2">Stock</label>
                <br />
                <input type="number" id="username" name="username" className="product-input" placeholder="Please enter your stock here" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                <label className="product-label mt-2">Video Url</label>
                <br />
                <input type="text" id="username" name="username" className="product-input" placeholder="Please enter your video url here" value={vedioUrl} onChange={(e) => setVedioUrl(e.target.value)} />
                <label className="product-label mt-2">Manual Shipping Charges</label>
                <br />
                <input type="number" id="username" name="username" className="product-input" placeholder="Please enter your manual shipping charges here" min="0" value={manualShippingCharges} onChange={(e) => setManualShippingCharges(e.target.value)} />
                <label className="product-label mt-4">
                  Free Shipping label<span className="required">*</span>
                </label>
                <br />
                <div>
                  {freeShippingLabels ? (
                    <>
                      <input required type="radio" defaultChecked value="true" name="Shipping" /> Yes &nbsp; &nbsp;
                      <input required type="radio" onClick={() => setFreeShippingLabel(false)} value="False" name="Shipping" /> No
                    </>
                  ) : (
                    <>
                      <input required type="radio" onClick={() => setFreeShippingLabel(true)} value="true" name="Shipping" /> Yes &nbsp; &nbsp;
                      <input required type="radio" defaultChecked value="False" name="Shipping" /> No
                    </>
                  )}
                </div>
                <label className="product-label mt-4">
                  Is Papular<span className="required">*</span>
                </label>
                <br />
                <div>
                  {isPapulars ? (
                    <>
                      <input required type="radio" defaultChecked value="true" name="Papular" /> Yes &nbsp; &nbsp;
                      <input required type="radio" onClick={() => setIsPapular(false)} value="False" name="Papular" /> No
                    </>
                  ) : (
                    <>
                      <input required type="radio" onClick={() => setIsPapular(true)} value="true" name="Papular" /> Yes &nbsp; &nbsp;
                      <input required type="radio" defaultChecked value="False" name="Papular" /> No
                    </>
                  )}
                </div>
                <div className="d-flex justify-content-between" style={{ float: 'right' }}>
                  <button type="submit" className="save-prodcut-btn mr-2" onClick={SubmitEditProduct}>
                    Save Product
                    {spinner?
                    <i className="fa fa-spinner ml-4 fa-spin"></i>
                    :""}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Modal>
      </div>
      {/* Add Product popup Images */}
      <div>
        <Modal open={openAddImageModel} onClose={onCloseAddImageModel} center>
          <br></br>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h4>Product Image</h4>
              <span style={{ color: 'green' }}>*Image dimension must be of 600x600</span>
              <form className="add-img-popup" noValidate onSubmit={onFormSubmit}>
                <div>
                <div className="row mt-4">
                    <div className="mb-2 col-lg-12 col-md-12 col-sm-12">
                      <div style={{ width:"210px",display:"inline" }} >
                        <label className="product-label mt-2">Arrangement No : &nbsp;</label>
                        <br />
                        <input placeholder={`${ImgArrangementNo?"":"Required"}`}  type="number" style={{paddingLeft:"5px", width:"170px",height:"34px"}} className="product-input" min="0" onChange={(e) => setImgArrangementNo(e.target.value)} />
                      </div>
                      <input
                        multiple
                        type="file"
                        name="myImage"
                        style={{ float: 'right', width:"100px", display:"inline" }}
                        onChange={(event) => {
                          setSelectedImage(event.target.files[0]);
                        }}
                      />
                    </div>
                  </div>
                  {/* <input style={{width:"25px",height:"25px"}} type="number" onChange={e=> setImgArrangementNo(e.target.value)}/> */}
                  {formFile && (
                    <div>
                      <img alt="not fount" width={'100px'} src={URL.createObjectURL(formFile)} />
                      <br />
                      <button style={{width:"100px",marginTop:"10px"}} className='add-product-btn' onClick={() => setSelectedImage(null)}>Remove</button>
                    </div>
                  )}
                </div>
                <br></br>
                <br></br>
                
                <button disabled={formFile?ImgArrangementNo?false:true:false} type="submit" style={{width:"100px",marginTop:"10px",float:"right"}} className='add-product-btn'>
                  Save
                </button>
              </form>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h4>Description Image</h4>
              <form className="add-img-popup" noValidate onSubmit={onDescriptionImageFormSubmit}>
                <div className='mt-4'>
                  <input
                    multiple
                    type="file"
                    name="myImage"
                    style={{ width:"310px" }}
                    onChange={(event) => {
                      setSelectedImageDesc(event.target.files[0]);
                    }}
                  />
                  <br />
                  <br />
                  {formFileDesc && (
                    <div>
                      <img alt="not fount" width={'100px'} src={URL.createObjectURL(formFileDesc)} />
                      <br />
                      <button style={{width:"100px",marginTop:"10px"}} className='add-product-btn' onClick={() => setSelectedImageDesc(null)}>Remove</button>
                    </div>
                  )}
                </div>
                <br></br>
                <br></br>
                <button type="submit" style={{width:"100px",marginTop:"10px",float:"right"}} className='add-product-btn'>
                  Save
                </button>
              </form>
            </div>
          </div>
        </Modal>
      </div>
      {/* Edit Product popup Images */}
      <div>
        <Modal open={openEditImageModel} onClose={onCloseEditImageModel} center>
          <br></br>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h4>Product Image</h4>
              <span style={{ color: 'green' }}>*Image dimension must be of 600x600</span>
              <form className="add-img-popup" noValidate onSubmit={onFormSubmit}>
                {productImages.map((image, i) => (
                  <div key={i} className="slide-img">
                    <div className='mt-4'>
                      <span>Arrangement No: {image.arrangementNo}</span>
                    </div>
                    <img
                      className="result image-slider"
                      style={{
                        marginTop:"0",
                        marginRight: '20px',
                        height: '100px',
                        width: '100px',
                      }}
                      src={image.imgUrl}
                    />

                    <div className="middle d-flex justify-content-center">
                      <FaTrash className="deleteIcon" onClick={() => DeleteImage(image.mediaId)} />
                    </div>
                  </div>
                ))}
                <div>
                  {/* <br />
                    <label style={{ float: 'right' }} htmlFor="ImgArrangementNo">Arrangement No</label>
                    <input name='ImgArrangementNo' style={{float: 'right' , width:"50px",height:"25px"}} type="number" onChange={e=> setImgArrangementNo(e.target.value)}/>
                  <br />  */}
                  <div className="row mt-4">
                    <div className="mb-2 col-lg-12 col-md-12 col-sm-12">
                      <div style={{ width:"210px",display:"inline" }} >
                        <label className="product-label mt-2">Arrangement No : &nbsp;</label>
                        <br />
                        <input placeholder={`${ImgArrangementNo?"":"Required"}`}  type="number" style={{paddingLeft:"5px", width:"170px",height:"34px"}} className="product-input" min="0" onChange={(e) => setImgArrangementNo(e.target.value)} />
                      </div>
                      <input
                        multiple
                        type="file"
                        name="myImage"
                        style={{ float: 'right', width:"100px", display:"inline" }}
                        onChange={(event) => {
                          setSelectedImage(event.target.files[0]);
                        }}
                      />
                    </div>
                  </div>
                  {formFile && (
                    <div>
                      <img alt="not fount" width={'100px'} src={URL.createObjectURL(formFile)} />
                      <br />
                      <button style={{width:"100px",marginTop:"10px"}} className='add-product-btn' onClick={() => setSelectedImage(null)}>Remove</button>
                    </div>
                  )}
                </div>
                <br></br>
                <br></br>
                <button disabled={formFile?ImgArrangementNo?false:true:false} type="submit" style={{width:"100px",marginTop:"10px",float:"right"}} className='add-product-btn'>
                  Save
                </button>
              </form>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h4>Description Image</h4>
              <form className="add-img-popup" noValidate onSubmit={onDescriptionImageFormSubmit}>
                {productDescImages.map((image, i) => (
                  <div key={i} className="slide-img">
                    <img
                      className="result image-slider"
                      style={{
                        marginRight: '20px',
                        height: '100px',
                        width: '100px',
                      }}
                      src={image.imgUrl}
                    />

                    <div className="middle d-flex justify-content-center">
                      <FaTrash className="deleteIcon" onClick={() => DeleteImage(image.mediaId)} />
                    </div>
                  </div>
                ))}
                <div className='mt-4'>
                  <input
                    multiple
                    type="file"
                    name="myImage"
                    style={{ width:"310px" }}
                    onChange={(event) => {
                      setSelectedImageDesc(event.target.files[0]);
                    }}
                  />
                  <br /><br />
                  {formFileDesc && (
                    <div>
                      <img alt="not fount" width={'100px'} src={URL.createObjectURL(formFileDesc)} />
                      <br />
                      <button style={{width:"100px",marginTop:"10px"}} className='add-product-btn' onClick={() => setSelectedImageDesc(null)}>Remove</button>
                    </div>
                  )}
                </div>
                <br></br>
                <br></br>
                <button type="submit" style={{width:"100px",marginTop:"10px",float:"right"}} className='add-product-btn'>
                  Save
                </button>
              </form>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminProducts;
