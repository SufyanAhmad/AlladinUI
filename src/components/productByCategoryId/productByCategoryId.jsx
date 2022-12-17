import '../../App.css';
import React, { useState, useEffect, useRef } from 'react';
import { publicRequest } from '../../requestMethod';
import { NavLink, useParams, useHistory } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import { FetchUrl } from '../../requestMethod';
import swal from 'sweetalert';
import { useSelector, useDispatch } from 'react-redux';
import { cartQuantityRefresh } from '../../redux/action/index';
import parse from 'html-react-parser';

function ProductByCategoryId({ appRefresher, setAppRefresher }) {
  const { subCategoryId } = useParams();
  let [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [productDetail, setProductDetail] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [Editopen, setEditOpen] = useState(false);
  const EditOpenModal = () => setEditOpen(true);
  const EditCloseModal = () => setEditOpen(false);
  const [brands, setBrands] = useState([]);
  const [warranty, setWarranty] = useState([]);
  let [minPrice, setMinPrice] = useState('');
  let [maxPrice, setMaxPrice] = useState('');
  let [brandId, setBrandId] = useState([]);
  let [warrantyId, setWarrantyId] = useState([]);
  const dispatch = useDispatch();
  let refresher = useSelector((state) => state.refresh);
  const [refresh, setRefresh] = useState(refresher);
  const [reload, setReload] = useState([products]);
  let history = useHistory();
  let IsCurrentUser = JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser;

  useEffect(() => {
    if (IsCurrentUser != null) {
      const getProductsbyKey = async () => {
        try {
          const res = await publicRequest.get(`Home/get-category-products/${subCategoryId}`, {
            headers: {
              Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
            },
          });
          setProducts(res.data.data);
          setAllProducts(res.data.data);
        } catch {}
      };
      getProductsbyKey();
    } else {
      const getProductsbyKey = async () => {
        try {
          const res = await publicRequest.get(`Home/get-category-products/${subCategoryId}`);
          setProducts(res.data.data);
          setAllProducts(res.data.data);
        } catch {}
      };
      getProductsbyKey();
    }
  }, [reload, refresh]);
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
    const getwarranty = async () => {
      try {
        const res = await publicRequest.get('Home/get-Warranties');
        setWarranty(res.data.data);
      } catch {}
    };
    getwarranty();
  }, []);
  const AddToCart = (data) => {
    const productId = data.productId;
    if (IsCurrentUser != null) {
      fetch(FetchUrl + `Home/get-Product-quantity/${productId}`, {
        method: 'GET',
        headers: {
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(),
      }).then((resp) => {
        resp.json().then((result) => {
          if (result.status == 'Success') {
            fetch(FetchUrl + `Cart/add-to-cart/${productId}`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
              },
              body: JSON.stringify(productId),
            }).then((resp) => {
              resp.json().then((result) => {
                if (result.status == 401) {
                  history.push('/login');
                }
                if (result.status === 'Success') {
                  swal('Success', result.message, 'success', {
                    buttons: false,
                    timer: 2000,
                  }).then((value) => {
                    setRefresh(!refresh);
                    dispatch(cartQuantityRefresh(refresh));
                    setAppRefresher(!appRefresher);
                    setReload(products);
                  });
                } else {
                  swal('Failed', result.message, 'error');
                }
              });
            });
          } else {
            swal('Failed', result.message, 'error');
          }
        });
      });
    } else {
      history.push('/login');
    }
  };
  const AddToWishList = (data) => {
    const productId = data.productId;
    if (IsCurrentUser != null) {
      fetch(FetchUrl + `WishList/add-to-WishList/${productId}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(productId),
      }).then((resp) => {
        resp.json().then((result) => {
          if (result.status === 'Success') {
            swal('Success', result.message, 'success', {
              buttons: false,
              timer: 2000,
            }).then((value) => {});
          } else {
            swal('Failed', result.message, 'error');
          }
        });
      });
    } else {
      history.push('/login');
    }
  };
  const RemoveToWishList = (data) => {
    const productId = data.productId;
    if (IsCurrentUser != null) {
      fetch(FetchUrl + `WishList/remove-from-WishList/${productId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(productId),
      }).then((resp) => {
        resp.json().then((result) => {
          if (result.status === 'Success') {
            swal('Success', result.message, 'success', {
              buttons: false,
              timer: 2000,
            }).then((value) => {});
          } else {
            swal('Failed', result.message, 'error');
          }
        });
      });
    } else {
      history.push('/login');
    }
  };
  const RemoveFromCart = (data) => {
    const productId = data.productId;
    if (IsCurrentUser != null) {
      fetch(FetchUrl + `Cart/remove-from-cart/${productId}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(productId),
      }).then((resp) => {
        resp.json().then((result) => {
          if (result.status === 'Success') {
            swal('Success', result.message, 'success', {
              buttons: false,
              timer: 2000,
            }).then((value) => {
              setRefresh(!refresh);
              dispatch(cartQuantityRefresh(refresh));
              setAppRefresher(!appRefresher);
              setReload(products);
            });
          } else {
            swal('Failed', result.message, 'error');
          }
        });
      });
    } else {
      history.push('/login');
    }
  };
  const getProductDetail = (data) => {
    const getProductDetail = async () => {
      try {
        const res = await publicRequest.get(`/Home/get-product/${data}`);
        setProductDetail(res.data.data.productMedias);
        setProductDetails(res.data.data);
      } catch {}
    };
    getProductDetail();
  };
  const _setminPrice = function (value) {
    minPrice = value;
    setMinPrice(value);
    searchResult();
  };
  const _setmaxPrice = function (value) {
    maxPrice = value;
    setMaxPrice(value);
    searchResult();
  };
  const _setBrandId = function (event) {
    var updatedList = [...brandId];
    if (event.target.checked) {
      updatedList = [...brandId, event.target.value];
    } else {
      updatedList.splice(brandId.indexOf(event.target.value), 1);
    }
    brandId = updatedList;
    setBrandId(updatedList);
    searchResult();
  };
  const _setWarrantyId = function (event) {
    var updatedList = [...warrantyId];
    if (event.target.checked) {
      updatedList = [...warrantyId, event.target.value];
    } else {
      updatedList.splice(warrantyId.indexOf(event.target.value), 1);
    }
    warrantyId = updatedList;
    setWarrantyId(updatedList);
    searchResult();
  };
  const searchResult = () => {
    products = allProducts;
    let items = {
      minPrice,
      maxPrice,
      brandId,
      warrantyId,
    };
    let _minPrice = parseFloat(items.minPrice);
    let _maxPrice = parseFloat(items.maxPrice);
    if (minPrice === '' && maxPrice === '') {
      setProducts(products);
    } else if (minPrice !== '' && maxPrice === '') {
      const result = products.filter((curData) => {
        if(curData.discountPrice === 0)
        {
          return curData.price >= _minPrice;
        }
        else {
          return curData.discountPrice >= _minPrice;
        }
      });
      setProducts(result);
    } else if (minPrice !== '' && maxPrice !== '') {
      const result = products.filter((curData) => {
        if(curData.discountPrice === 0){
          return curData.price >= _minPrice && curData.price <= _maxPrice;
        }
        else {
          return curData.discountPrice >= _minPrice && curData.discountPrice <= _maxPrice;
        }
      });
      setProducts(result);
    } else if (minPrice === '' && maxPrice !== '') {
      const result = products.filter((curData) => {
        if(curData.discountPrice === 0){
          return curData.price <= _maxPrice;
        }
        else {
          return curData.discountPrice <= _maxPrice;
        }
      });
      setProducts(result);
    }

    if (brandId.length > 0) {
      let _productsbrand = [];
      for (let b of brandId) {
        const result = products.filter((curData) => {
          return curData.brandId === parseFloat(b);
        });

        for (let r of result) {
          _productsbrand.push(r);
        }
      }
      setProducts(_productsbrand);
    }
    if (warrantyId.length > 0) {
      let _productsWarranty = [];
      for (let w of warrantyId) {
        const result = products.filter((curData) => {
          return curData.warrantyId === parseFloat(w);
        });

        for (let r of result) {
          _productsWarranty.push(r);
        }
      }
      setProducts(_productsWarranty);
    }
  };
  return (
    <div className="background">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12" style={{ float: 'right' }}>
            <div className="dropdown ProductListSort mt-3">
              <input
                type="text"
                className="product-search"
                placeholder="Search Product ..."
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-3 col-md-3 col-sm-12 bgColor form-row" style={{ height: '100%' }}>
            <div className="ml-2 my-3">
              <div className="related-Categories">
                <h3 style={{ fontWeight: '500', fontSize: '20px' }}>Related Categories</h3>
              </div>
              <div className="price">
                <h1 className="d-inline" style={{ fontWeight: '500', fontSize: '16px' }}>
                  Price
                </h1>
                <input
                  className="d-inline priceValue mr-2 ml-3"
                  itemType="number"
                  placeholder="Min"
                  onChange={(e) => {
                    _setminPrice(e.target.value);
                  }}
                ></input>
                <img src="./assets/Line.png"></img>
                <input
                  className="d-inline priceValue ml-2 "
                  itemType="number"
                  placeholder="Max"
                  onChange={(e) => {
                    _setmaxPrice(e.target.value);
                  }}
                ></input>
              </div>
              <hr style={{ width: '100%' }}></hr>
              <div>
                <h1 style={{ fontWeight: '500', fontSize: '16px' }}>Brand</h1>
                {brands.map((brand, key) => (
                  <div className="form-check" key={key}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="Anex"
                      value={brand.brandId}
                      id={brand.brandId}
                      checked={brand.isChecked}
                      onChange={(e) => {
                        _setBrandId(e, brand);
                      }}
                    ></input>
                    <label className="form-check-label">{brand.brandName}</label>
                    <br></br>
                  </div>
                ))}
              </div>
              <hr style={{ width: '100%' }}></hr>
              <div>
                <h1 style={{ fontWeight: '500', fontSize: '16px' }}>Warenty</h1>
                {warranty.map((warranty) => (
                  <div className="form-check" key={warranty.warrantyId}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="1 Year"
                      value={warranty.warrantyId}
                      id={warranty.warrantyId}
                      checked={warranty.isChecked}
                      onChange={(e) => {
                        _setWarrantyId(e, warranty);
                      }}
                    ></input>
                    <label className="form-check-label">{warranty.warrantyType}</label>
                    <br></br>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-9 col-md-9 col-sm-12 mb-5">
            <div className="container">
              <div className="row">
                {products
                  .filter((val) => {
                    if (searchTerm === '') {
                      return val;
                    } else if (val.productName.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())) {
                      return val;
                    }
                  })
                  .map((product) => (
                    <div className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-item mt-2" key={product.productId}>
                      <div className="product">
                        <span style={{ diplay: 'block', width: '100%' }}>
                          {product.productMedias[0] == null ? (
                            <NavLink style={{ width: '100%' }} to={`/product/view/${product.productId}`}>
                              <img className="product-img" src="./assets/Auth/Default-img.png" alt="Product-Img" style={{ width: '100%', height: '223px' }} />
                            </NavLink>
                          ) : (
                            <span style={{ diplay: 'block', width: '100%' }}>
                              <NavLink style={{ width: '100%' }} to={`/product/view/${product.productId}`}>
                                {product.productMedias.slice(0, 1).map((image) => (
                                  <img key={image.mediaId} className="product-img" src={image.imgUrl} alt="Product-Img" style={{ width: '100%', height: '223px' }} />
                                ))}
                              </NavLink>
                            </span>
                          )}
                        </span>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                          <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                            <li className="icon" onClick={() => getProductDetail(product.productId)}>
                              <span className="fa fa-eye" title="View Details" onClick={() => EditOpenModal(product.productId)}></span>
                            </li>
                            <li className="icon mid-icon">
                              {product.isInWishList ? <span className="fa fa-heart bgBlue" title="Remove from Wishlist" onClick={() => RemoveToWishList(product)}></span> : <span className="fa fa-heart" title="Add to WishList" onClick={() => AddToWishList(product)}></span>}
                            </li>
                            <li className="icon">{product.isInCart ? <span className="fa fa-shopping-cart bgBlue" title="Remove from Cart" onClick={() => RemoveFromCart(product)}></span> : <span className="fa fa-shopping-cart" title="Add to Cart" onClick={() => AddToCart(product)}></span>}</li>
                          </ul>
                        </div>
                      </div>
                      <div className="title pt-4 pb-2 text-line" title={product.productName}>
                        {product.productName}
                      </div>
                      <div className="d-flex align-content-center justify-content-center">
                        <button className="flip-card-rating d-inline" style={{ marginLeft: '10px', textAlign: 'center', width: '30px' }}>
                          {product.rating} <i className="fa fa-star" aria-hidden="true" style={{ marginLeft: '5px' }}></i>
                        </button>
                        <p className="d-inline fc-charges-sold ml-2">{product.productSold} sold</p>
                      </div>
                      {product.discountPrice === 0 ? (
                        <p className="product-Cate-price ">RS: {product.price}</p>
                      ) : (
                        <div className="justify-content-center">
                          <span className="product-Cate-price ">RS: {product.discountPrice}</span>
                          <span className="product-price-org">PKR: {product.price}</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
      <div className="model">
        <Modal open={Editopen} onClose={EditCloseModal} center>
          <br></br>
          <div className="product-detail-popup">Product Detail</div>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              {productDetail[0] === null ? (
                <img className="product-img" src="./assets/Auth/Default-img.png" />
              ) : (
                <>
                  {productDetail.slice(0, 1).map((image) => (
                    <img key={image} className="popup-product-img" src={image.imgUrl} />
                  ))}
                </>
              )}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="d-flex pb-2 justify-content-start">
                <h3>{productDetails.productName}</h3>
              </div>
              <div>
                <h5>Price</h5>
                {productDetails.discountPrice === 0 ? (
                  <span>RS: {productDetails.price}</span>
                ) : (
                  <>
                    <span className="p-price">RS: {productDetails.price}</span>
                    <br></br>
                    <span>RS:{Math.trunc(productDetails.discountPrice)}</span>
                  </>
                )}
              </div>
              <div className="mt-2">
                <h5>HighLight</h5>
                <span>{parse(`${productDetails.highLight}`)}</span>
              </div>
              <div className="mt-2">
                <h5>Description</h5>
                <span>{parse(`${productDetails.description}`)}</span>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default ProductByCategoryId;
