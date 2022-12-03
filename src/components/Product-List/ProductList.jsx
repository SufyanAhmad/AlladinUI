import '../../App.css';
import './productList.scss';
import React, { useState, useEffect } from 'react';
import { publicRequest } from '../../requestMethod';
import { useParams, NavLink, useHistory } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import { FetchUrl } from '../../requestMethod';
import swal from 'sweetalert';
import { useDispatch } from 'react-redux';
import { cartQuantityRefresh } from '../../redux/action/index';

function ProductList({ appRefresher, setAppRefresher }) {
  const { id } = useParams();
  let history = useHistory();
  let [products, setProducts] = useState([]);
  const [allOnSaleProducts, setAllOnSaleProducts] = useState([]);
  const [productDetail, setProductDetail] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [Editopen, setEditOpen] = useState(false);
  const EditOpenModal = () => setEditOpen(true);
  const EditCloseModal = () => setEditOpen(false);
  const [brand, setbrand] = useState([]);
  const [Warranty, setWarranty] = useState([]);
  let [minPrice, setMinPrice] = useState('');
  let [maxPrice, setMaxPrice] = useState('');
  let [brandId, setBrandId] = useState([]);
  let [warrantyId, setWarrantyId] = useState([]);
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(true);
  const [reload, setReload] = useState([products]);
  let IsCurrentUser = JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser;
  useEffect(() => {
    fetch(FetchUrl + `Home/get-brands`).then((result) => {
      result.json().then((resp) => {
        setbrand(resp.data);
      });
    });
  }, []);
  useEffect(() => {
    fetch(FetchUrl + `Home/get-Warranties`).then((result) => {
      result.json().then((resp) => {
        setWarranty(resp.data);
      });
    });
  }, []);
  useEffect(() => {
    if (IsCurrentUser != null) {
      {
        id === '1'
          ? fetch(FetchUrl + `Home/get-onsale-products`, {
              headers: {
                Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
              },
            }).then((result) => {
              result.json().then((resp) => {
                setProducts(resp.data.products);
                setAllOnSaleProducts(resp.data.products);
              });
            })
          : id === '2'
          ? fetch(FetchUrl + 'Home/get-new-arrival-products', {
              headers: {
                Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
              },
            }).then((result) => {
              result.json().then((resp) => {
                setProducts(resp.data);
                setAllOnSaleProducts(resp.data);
              });
            })
          : fetch(FetchUrl + 'Home/get-papular-products', {
              headers: {
                Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
              },
            }).then((result) => {
              result.json().then((resp) => {
                setProducts(resp.data);
                setAllOnSaleProducts(resp.data);
              });
            });
      }
    } else {
      {
        id === '1'
          ? fetch(FetchUrl + `Home/get-onsale-products`).then((result) => {
              result.json().then((resp) => {
                setProducts(resp.data.products);
                setAllOnSaleProducts(resp.data.products);
              });
            })
          : id === '2'
          ? fetch(FetchUrl + 'Home/get-new-arrival-products').then((result) => {
              result.json().then((resp) => {
                setProducts(resp.data);
                setAllOnSaleProducts(resp.data);
              });
            })
          : fetch(FetchUrl + 'Home/get-papular-products').then((result) => {
              result.json().then((resp) => {
                setProducts(resp.data);
                setAllOnSaleProducts(resp.data);
              });
            });
      }
    }
  }, [reload]);
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
                    dispatch(cartQuantityRefresh(!refresh));
                    setRefresh(!refresh);
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
            }).then((value) => {
              dispatch(cartQuantityRefresh(!refresh));
              setRefresh(!refresh);
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
              dispatch(cartQuantityRefresh(!refresh));
              setRefresh(!refresh);
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
    products = allOnSaleProducts;
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
        if(curData.discountPrice === 0){
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
          <div className="col-lg-8 col-md-8 col-sm-12 solar-charger mt-3">
            {products.slice(0, 1).map((product) => (
              <h1 key={product} className=" ProductListHeading">
                {product.mainCategoryName}
              </h1>
            ))}
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12">
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
          <div className="col-lg-3 col-md-3 col-sm-12 bgColor">
            <div className="ml-2 my-3">
              <div className="relatedCategories">
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
                <div style={window.innerWidth <=768?{display:"flex",overflow:"scroll"}:{}}>
                  {brand.map((Brand) => (
                    <div key={Brand.brandId} className="form-check">
                      <>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={Brand.brandId}
                          id={Brand.brandId}
                          checked={Brand.isChecked}
                          onChange={(e) => {
                            _setBrandId(e, Brand);
                          }}
                          name="Anex"
                        ></input>
                        <label className="form-check-label">{Brand.brandName}</label>
                      </>
                    </div>
                  ))}
                </div>
              </div>
              <hr style={{ width: '100%' }}></hr>
              <div>
                <h1 style={{ fontWeight: '500', fontSize: '16px' }}>Warenty</h1>
                <div style={window.innerWidth <=768?{display:"flex",overflow:"scroll"}:{}}>
                {Warranty.map((warranty) => (
                  <div key={warranty.warrantyId} className="form-check">
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
                              <img className="productList-img" src="./assets/Auth/Default-img.png" alt="Product-Img" />
                            </NavLink>
                          ) : (
                            <span style={{ diplay: 'block', width: '100%' }}>
                              <NavLink style={{ width: '100%' }} to={`/product/view/${product.productId}`}>
                                {product.productMedias.slice(0, 1).map((image) => (
                                  <img key={image.mediaId} className="productList-img" src={image.imgUrl} alt="Product-Img" />
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
                            <li className="icon mx-3">
                              {product.isInWishList ? <span className="fa fa-heart bgBlue" title="Remove from Wishlist" onClick={() => RemoveToWishList(product)}></span> : <span className="fa fa-heart" title="Add to WishList" onClick={() => AddToWishList(product)}></span>}
                            </li>
                            <li className="icon">{product.isInCart ? <span className="fa fa-shopping-cart bgBlue" title="Remove from Cart" onClick={() => RemoveFromCart(product)}></span> : <span className="fa fa-shopping-cart" title="Add to Cart" onClick={() => AddToCart(product)}></span>}</li>
                          </ul>
                        </div>
                      </div>
                      <div className="title pt-4 pb-2 text-line mb-1">{product.productName}</div>
                      <div className="d-flex align-content-center justify-content-center">
                        <button className="flip-card-rating d-inline" style={{ marginLeft: '10px', textAlign:"center",width:"30px" }}>
                          {product.rating}<i class="fa fa-star" aria-hidden="true" style={{marginLeft:"5px"}}></i>
                        </button>
                        <p className="d-inline fc-charges-sold ml-2">{product.productSold} sold</p>
                      </div>
                      {product.discountPrice === 0 ? (
                        <p className="product-price d-inline">RS: {product.price}</p>
                      ) : (
                        <div className="d-inline">
                          <p className="product-price d-inline">RS: {Math.trunc(product.discountPrice)}</p>
                          <p className="product-price-org d-inline ">PKR: {product.price}</p>
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

          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="product-detail-popup">Product Detail</div>
              {productDetail[0] === null ? (
                <img className="product-img" src="./assets/Auth/Default-img.png" />
              ) : (
                <>
                  {productDetail.slice(0, 1).map((image) => (
                    <img key={image} className="popup-img-product " style={{ width: '200px', height: '250px' }} src={image.imgUrl} />
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
                    <span>RS: {Math.trunc(productDetails.discountPrice)}</span>
                  </>
                )}
              </div>
              <div className="mt-2">
                <h5>HighLight</h5>
                <span>{productDetails.highLight}</span>
              </div>
              <div className="mt-2">
                <h5>Description</h5>
                <span>{productDetails.description}</span>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
export default ProductList;
