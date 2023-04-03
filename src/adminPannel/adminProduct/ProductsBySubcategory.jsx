import styled from "styled-components";
import * as React from 'react';
import { useState,useEffect } from 'react';
import TablePaginationUnstyled from '@mui/base/TablePaginationUnstyled';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import axios from "axios";
import {Link,useParams } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import "./module.scss";
import {publicRequest} from "../../requestMethod"
import "../../App.css"
import moment from 'moment';
import {FetchUrl} from "../../requestMethod";
import { FaTrash} from "react-icons/fa";
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

export default function ProductsBySubcategory() {
  const { id } = useParams();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const [products, setProduct] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [warrantes, setquantity] = useState([]);
  const [highLight, setHighLight] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [brandId, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountStart, setDiscountStart] = useState(null);
  const [discountEnd, setDiscountEnd] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [warrantyId, setWarranty] = useState('');
  const [vedioUrl, setVedioUrl] = useState(null);
  const [shippingStatuses, setShippingStatus] = useState(false);
  const [isPapulars, setIsPapular] = useState(false);
  const [hashTag, setHashTag] = useState('');
  const [weight, setWeight] = useState('');
  const [hight, setHight] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [freeShippingLabels, setFreeShippingLabel] = useState(false);
  const [manualShippingCharges, setManualShippingCharges] = useState(0);
  const [openAddImageModel, setAddImageModel] = useState(false);
  const onOpenAddImageModel = () => setAddImageModel(true);
  const onCloseAddImageModel = () => setAddImageModel(false);
  const [_productId, setProductId] = useState('')
  const [productDescImages , setProductDescImages] = useState([])
  const [productImages , setProductImages] = useState([])
  const [formFile , setSelectedImage] = useState(null);
  const [formFileDesc , setSelectedImageDesc] = useState(null);
  const [openEditImageModel, setEditImageModel] = useState(false);
  const onOpenEditImageModel = () => setEditImageModel(true);
  const onCloseEditImageModel = () => setEditImageModel(false);
  const [reload, setReload] = useState([products]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [arrangementNo, setArrangementNo] = useState(0);
  const [tags, setTags] = useState([]);
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const onCloseModal = ()=>{
    setOpen(false);
    setErrorMessage(false);
  }

 const SubmitProduct = async e => {
    
    e.preventDefault();
    if(productName && highLight && description && hight && width && length && weight && price && brandId && warrantyId && freeShippingLabels && shippingStatuses && isPapulars){
    var freeShippingLabel = (freeShippingLabels === "True");
    var shippingStatus = (shippingStatuses === "True");
    var isPapular = (isPapulars === "True");
    var subCategoryId = id;
    var categoryId = null
    const response = await AddPrduct({
    highLight,
    productName,
    description,
    brandId,
    price,
    discount,
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
    freeShippingLabel,
    manualShippingCharges,
    arrangementNo,
    subCategoryId,
    categoryId
    });
    }else{
     setErrorMessage(true)
    }
  }
async function AddPrduct(credentials) {
  
  return fetch(FetchUrl+"DashBoard/add-Product", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
    },
    body: JSON.stringify(credentials)
  })
    .then((resp)=>{
       resp.json().then((result)=>{
        
        if(result.status === "Success"){
          
            setReload()
            setOpen(false)
            setErrorMessage(false)
          }
       })
     })
 }
 const onFormSubmit =(e)=>{
  e.preventDefault();
  const formData = new FormData();
  formData.append('Images',formFile );
  const config = {
    headers:{
      'content-type':'multipart/form-data',
      Authorization : 'bearer '+ localStorage.getItem("token")
    },
  };
  
  const url = FetchUrl+`DashBoard/add-image/${_productId}`;
  axios.post(url,formData,config)
  .then((response)=>{
     setReload()
     setSelectedImage(null)
     setEditImageModel(false)
     setAddImageModel(false)
     setSelectedImageDesc(null)
     this.formData = new FormData();
  })
  .catch((err)=>{
    console.log(err);
  });
 }
 const onDescriptionImageFormSubmit =(e)=>{
  e.preventDefault();
  const formData = new FormData();
  formData.append('Images',formFileDesc );
  const config = {
    headers:{
      'content-type':'multipart/form-data',
      Authorization : 'bearer '+ localStorage.getItem("token")
    },
  };
  const url = FetchUrl+`DashBoard/add-Product-decription-image/${_productId}`;
  axios.post(url,formData,config)
  .then((response)=>{
     setReload()
     setSelectedImage(null)
     setEditImageModel(false)
     setAddImageModel(false)
     setSelectedImageDesc(null)
     this.formData = new FormData();
  })
  .catch((err)=>{
    console.log(err);
  });
 }
 
 const selectProducts = (id) => {
  let pId = id.productId
 const getProductDetail = async () => {
     const res = await publicRequest.get(`/Home/get-product/${pId}`);
     setProductDescImages(res.data.data.descriptionMedias)
     setProductImages(res.data.data.productMedias)
     setProductId(pId)
 }
 getProductDetail()
}
const DeleteImage  = (mediaId)=>{
  fetch(FetchUrl+`DashBoard/delete-media/${mediaId}`, {
   method: 'Delete',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
    },
    body:JSON.stringify(mediaId )
  }).then((resp)=>{
    resp.json()
    .then((result)=>{
      setSelectedImage(null)
       setSelectedImageDesc(null)
       setAddImageModel(false)
       setEditImageModel(false)
      setReload()
    })
    .catch((err)=>{
        alert("Iamge is not deleted !!")
     });
  })
};
 useEffect(()=>{
  const getMainCategories = async ()=>{
    try{
        const res = await publicRequest.get("Home/get-mainCategories");
        setMainCategories(res.data.data)
    }catch{}
  }
  getMainCategories()
},[])
useEffect(()=>{
  const getbrands = async ()=>{
    try{
        const res = await publicRequest.get("Home/get-brands");
        setBrands(res.data.data)
    }catch{}
  }
  getbrands()
},[])
useEffect(()=>{
  const getquantity = async ()=>{
    try{
        const res = await publicRequest.get("Home/get-Warranties");
        setquantity(res.data.data)
    }catch{}
  }
  getquantity()
},[])
 //get categories
useEffect(() => {
    fetch(FetchUrl+`Home/get-products/${id}`).then((result)=>{
      result.json().then((resp)=>{
        setProduct(resp.data)
      })
    })
  }, [reload]);
  const DeleteProduct  = (data)=>{
    const productId = data.productId
   {
     fetch(FetchUrl+`DashBoard/delete-product/${productId}`, {
       method: "Delete",
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
       },
       body:JSON.stringify(productId)
     }).then((resp)=>{
       resp.json()
       .then((result)=>{
        alert("Delete product successfull !!");
       })
       .catch((err)=>{
         alert("Product is not deleted !!")
      });
     })
   }
  };
  const handleTagKeyDown = (e) => {
    if(e.key !== 'Enter') return
    const value = e.target.value
    if(!value.trim()) return
    setTags([...tags,value])
    e.target.value = ''
  }
  const removeTag = (index) => {
    setTags(tags.filter((el,i) => i !== index))
  }

  return (
    <div className="Section">
        <div className='p-4'>
          <div className='dashboard'>Products</div>
          <br></br>
          <div className="p-3 bgColor">
              <div className="d-flex justify-content-between ">
                  <span className="category-list">Product List</span>
                  <button className="add-category-btn" onClick={onOpenModal}>Add Product</button>
              </div>
        <br></br>
        <Root sx={{ minWidth: '800px', width: 320,overFlowX:'scroll' }}>
            <table aria-label="custom pagination table mt-2">
                <thead>
                <tr>
                    <th>Images</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Created</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {(rowsPerPage > 0
                    ? products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : products
                ).map((row) => (
                    <tr key={row.productId}>
                      <td style={{ width: 160,borderRight:"none" }} align="right">
                      { row.productMedias.length !== 0 ?
                          <>
                            {row.productMedias.slice(0,1).map((image,i) => (
                              <span key={i} onClick={() => selectProducts(row)}>
                                  <img className='c-pointer' src={image.imgUrl} style={{width:'60px',height:"50px"}} onClick={onOpenEditImageModel} />
                              </span>
                              ))}
                          </>
                              :
                              <span onClick={() => selectProducts(row)}>
                                <button className='add-img-btn' onClick={onOpenAddImageModel}>Add Image</button>
                              </span>
                            }
                      </td>
                      <td className="tb-dt-name" style={{ width: 160,borderLeft:"none",borderRight:"none"}} align="right">
                        {row.productName}
                      </td>
                      <td style={{ width: 160,borderLeft:"none",borderRight:"none" }} align="right">
                          {row.brand}
                      </td>
                      <td style={{ width: 160,borderLeft:"none",borderRight:"none" }} align="right">
                      {Math.trunc(row.discountPrice)}
                      </td>
                      <td style={{ width: 160,borderLeft:"none",borderRight:"none" }} align="right">
                        Instock ({row.quantity})
                      </td>
                      <td style={{ width: 160,borderLeft:"none",borderRight:"none" }} align="right">
                          {moment(row.createAt).format("YYYY-MM-DD")}<br/>Updated:<br/>
                          {moment(row.updateAt).format("YYYY-MM-DD")}
                      </td>
                      <td style={{ width: 160,borderLeft:"none" }} align="right">
                      </td>
                    </tr>
                ))}

                {emptyRows > 0 && (
                    <tr style={{ height: 41 * emptyRows }}>
                    <td colSpan={7} />
                    </tr>
                )}
                </tbody>
                <tfoot>
                <tr>
                    <CustomTablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={7}
                    count={products.length}
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
      {/* popup section */}
      {/* add category popup */}
        <div id="model-popup">
            <Modal open={open} onClose={onCloseModal} center>
                <br></br>
                    <div className="d-flex justify-content-center">
                        <span className="Product-popup">Add Product</span>
                    </div>
                    {errorMessage?<div className='required justify-content-center'> <p>*Please fill all the marked fields.</p></div>:""}
                    <br></br>
                    <form>
                      <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                        <label className="product-label">Products Name<span className="required">*</span></label>
                          <br/>
                          <input 
                          type="text" 
                          id="username"
                          name="username" 
                          className="product-input" 
                          placeholder="Please enter your products Name here"
                          required
                          onChange={e => setProductName(e.target.value)}
                          />
                         
                            <label className="product-label mt-3">Highlight<span className="required">*</span></label>
                              <br/>
                              <textarea 
                              type="text" 
                              id="username"
                              name="username" 
                              className="product-textarea" 
                              placeholder="Please enter your highlight here"
                              rows="4"
                              required
                              onChange={e => setHighLight(e.target.value)}
                              />
                              <label className="product-label">Description<span className="required">*</span></label>
                              <br></br>
                              <input 
                                type="text" 
                                id="username"
                                name="username" 
                                className="product-input" 
                                placeholder="Please enter your package weight here"
                                required
                                onChange={e => setDescription(e.target.value)}
                                />
                            <div className="row">
                            <label className="product-label">Package Dimensions (cm)</label>
                              <div className="col">
                              <label className="product-label">Height<span className="required">*</span></label>
                                  <input 
                                    type="number" 
                                    id="username"
                                    name="username" 
                                    className="product-input"
                                    min="0" 
                                    onChange={e => setHight(e.target.value)}
                                    required
                                />
                              </div>
                              <div className="col">
                              <label className="product-label">Width<span className="required">*</span></label>
                                  <input 
                                    type="number" 
                                    id="username"
                                    name="username" 
                                    className="product-input" 
                                    min="0"
                                    onChange={e => setWidth(e.target.value)}
                                    required
                                />
                              </div>
                              <div className="col">
                              <label className="product-label">Lenght<span className="required">*</span></label>
                                  <input 
                                    type="number" 
                                    id="username"
                                    name="username" 
                                    className="product-input" 
                                    min="0"
                                    onChange={e => setLength(e.target.value)}
                                    required
                                />
                              </div>
                            </div>
                          <label className="product-label">Package Weight (kg)<span className="required">*</span></label>
                          <br/>
                          <input 
                          type="number" 
                          id="username"
                          name="username" 
                          className="product-input" 
                          min="0"
                          placeholder="Please enter your package weight here"
                          required
                          onChange={e => setWeight(e.target.value)}
                          />
                           <label className="product-label">Discount Start Date</label>
                          <br/>
                          <input 
                          type="datetime-local" 
                          id="username"
                          name="username" 
                          className="product-input" 
                          placeholder="Please enter your package weight here"
                          
                          onChange={e => setDiscountStart(e.target.value)}
                          />
                           <label className="product-label">Discount End Date</label>
                          <br/>
                          <input 
                          type="datetime-local" 
                          id="username"
                          name="username" 
                          className="product-input" 
                          placeholder="Please enter your package weight here"
                          
                          onChange={e => setDiscountEnd(e.target.value)}
                          />
                          <label className="product-label mt-3">Tags</label>
                              <br/>
                              <div className="product-textarea">
                                {tags.map((tag,index) => (
                                     <div className='tagItem' key={index}>
                                        <span className='tagText'>{tag}</span>
                                        <span onClick={() => removeTag(index)} className='close'>&times;</span>
                                     </div>
                                ))}
                                <input 
                                type="text" 
                                id="username"
                                name="username" 
                                className='tags-input'
                                style={{borderStyle:"none"}}
                                placeholder="Please enter tags here"
                                onKeyDown={handleTagKeyDown}
                                onChange={e => setHashTag(e.target.value)}
                                />
                              </div>
                            <br></br><br></br><br></br>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12"> 
                              <label className="product-label">Price<span className="required">*</span></label>
                              <br/>
                              <input 
                                type="number" 
                                id="username"
                                name="username" 
                                className="product-input" 
                                placeholder="Please enter your price here"
                                min="0"
                                required
                                onChange={e => setPrice(e.target.value)}
                              />
                              <label className="product-label mt-2">Discount</label>
                              <br/>
                              <input 
                                type="number" 
                                id="username"
                                name="username" 
                                className="product-input" 
                                placeholder="Please enter your discount here"
                                min="0"
                                required
                                onChange={e => setDiscount(e.target.value)}
                              />
                              <label className="product-label mt-2">Brand<span className="required">*</span></label>
                              <br/>
                              <Form.Select defaultValue={'Select'} aria-label="Default select example"
                              onChange={(e)=>setBrand(e.target.value)}
                              >
                              <option value="Select" disabled hidden>Select</option>
                              {  brands.map((brand)=>(
                                    <option key={brand.brandId} value={brand.brandId} id={brand.brandId}>{brand.brandName}</option>
                              ))}
                            </Form.Select>
                              <label className="product-label mt-2">Warranty<span className="required">*</span></label>
                              <br/>
                              <Form.Select defaultValue={'Select'} aria-label="Default select example"
                               onChange={e => setWarranty(e.target.value)}
                              >
                              <option value="Select" disabled hidden>Select</option>
                              {warrantes.map((Quantity)=>(
                                    <option key={Quantity.warrantyId} value={Quantity.warrantyId} id={Quantity.warrantyId}>{Quantity.warrantyType}</option>
                              ))}
                            </Form.Select>
                              <label className="product-label mt-2">Stock</label>
                              <br/>
                              <input 
                                type="number" 
                                id="username"
                                name="username" 
                                className="product-input" 
                                placeholder="Please enter your stock here"
                                min="0"
                                required
                                onChange={e => setQuantity(e.target.value)}
                              />
                              <label className="product-label mt-2">Video Url</label>
                              <br/>
                              <input 
                                type="text" 
                                id="username"
                                name="username" 
                                className="product-input" 
                                placeholder="Please enter your video url here"
                                onChange={e => setVedioUrl(e.target.value)}
                              />
                              <label className="product-label mt-2">Manual Shipping Charges%</label>
                              <br/>
                              <input 
                                type="number" 
                                id="username"
                                name="username" 
                                className="product-input" 
                                placeholder="Please enter your manual shipping charges here"
                                min="0"
                                onChange={e => setManualShippingCharges(e.target.value)}
                              />
                            <label className="product-label mt-4">Free Shipping label<span className="required">*</span></label>
                              <br/>
                              <div onChange={e => setFreeShippingLabel(e.target.value)}>
                                <input type="radio" value="True" name="Shipping" /> Yes&nbsp; &nbsp; 
                                <input type="radio" value="False" name="Shipping"/> No
                              </div>
                              <label className="product-label mt-4">Shipping Status<span className="required">*</span></label>
                              <br/>
                              <div onChange={e => setShippingStatus(e.target.value)}>
                                <input type="radio" value="True" name="gender"  /> Yes&nbsp; &nbsp; 
                                <input type="radio" value="False" name="gender" /> No
                              </div>
                              <label className="product-label mt-4">Is Papular<span className="required">*</span></label>
                              <br/>
                              <div onChange={e => setIsPapular(e.target.value)}>
                                <input type="radio" value="True" name="Papular"  /> Yes &nbsp; &nbsp; 
                                <input type="radio" value="False" name="Papular" /> No
                              </div>
                              <div className="d-flex justify-content-between" style={{float:"right"}}>
                                  <button type="submit" className="save-prodcut-btn mr-2" onClick={SubmitProduct}>Save Product</button>
                                 </div>
                        </div>
                      </div>
                  </form>
            </Modal>
       </div>
        {/* Edit Product popup Images */}
       <div>
        <Modal open={openAddImageModel} onClose={onCloseAddImageModel} center>
            <br></br>
            <div className='row'>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <h4>Product Image</h4>
                <span style={{color:"green"}}>*Image dimension must be of 600x600</span>
                <form className="add-cate-popup" noValidate onSubmit={onFormSubmit}>
                  <div>
                  <input 
                        multiple
                        type="file"
                        name="myImage" 
                        className='choose-file'
                        style={{float:"right"}}
                        onChange={(event) => {
                        setSelectedImage(event.target.files[0]);
                        }}
                    />
                    {formFile  && (
                        <div>
                        <img alt="not fount" width={"100px"} src={URL.createObjectURL(formFile)} />
                        <br />
                        <button className='remove-button' onClick={()=>setSelectedImage(null)}>Remove</button>
                        </div>
                    )}
                    
                  </div>
                  <br></br><br></br>
                  <button type="submit" className="btn-save-cat">Save</button>
                </form>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <h4>Description Image</h4>
                <form className="add-cate-popup" noValidate onSubmit={onDescriptionImageFormSubmit}>
                  <div>
                  <input 
                        multiple
                        type="file"
                        name="myImage" 
                        className='choose-file'
                        style={{float:"right"}}
                        onChange={(event) => {
                          setSelectedImageDesc(event.target.files[0]);
                        }}
                    />
                    {formFileDesc  && (
                        <div>
                        <img alt="not fount" width={"100px"} src={URL.createObjectURL(formFileDesc)} />
                        <br />
                        <button className='remove-button' onClick={()=>setSelectedImageDesc(null)}>Remove</button>
                        </div>
                    )}
                    
                  </div>
                  <br></br><br></br>
                  <button type="submit" className="btn-save-cat">Save</button>
                </form>
              </div>
            </div>
        </Modal>
       </div>
        {/* Edit Product popup Images */}
        <div>
        <Modal open={openEditImageModel} onClose={onCloseEditImageModel} center>
            <br></br>
            <div className='row'>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <h4>Product Image</h4>
                <span style={{color:"green"}}>*Image dimension must be of 600x600</span>
                <form className="add-cate-popup" noValidate onSubmit={onFormSubmit}>
                {
                  productImages.map((image,i)=>(
                    <div key={i} className="slide-img">
                      <img className="result image-slider" style={{marginRight:"20px",height:"100px",width:"100px"}} src={image.imgUrl}/>
                      <div className="middle d-flex justify-content-center">
                            <FaTrash className='deleteIcon'  onClick={()=>DeleteImage(image.mediaId)}/>
                      </div>
                    </div>
                  ))
                }
                  <div>
                  <input 
                        multiple
                        type="file"
                        name="myImage" 
                        className='choose-file'
                        style={{float:"right"}}
                        onChange={(event) => {
                        setSelectedImage(event.target.files[0]);
                        }}
                    />
                    {formFile  && (
                        <div>
                        <img alt="not fount" width={"100px"} src={URL.createObjectURL(formFile)} />
                        <br />
                        <button className='remove-button' onClick={()=>setSelectedImage(null)}>Remove</button>
                        </div>
                    )}
                    
                  </div>
                  <br></br><br></br>
                  <button type="submit" className="btn-save-cat">Save</button>
                </form>
              </div>
              <div className='col-lg-6 col-md-6 col-sm-12'>
                <h4>Description Image</h4>
                <form className="add-cate-popup" noValidate onSubmit={onDescriptionImageFormSubmit}>
                {
                  productDescImages.map((image,i)=>(
                    <div key={i} className="slide-img">
                      <img className="result image-slider" style={{marginRight:"20px",height:"100px",width:"100px"}} src={image.imgUrl}/>
                      
                      <div className="middle d-flex justify-content-center">
                            <FaTrash className='deleteIcon'  onClick={()=>DeleteImage(image.mediaId)}/>
                      </div>
                    </div>
                  ))
                }
                  <div>
                  <input 
                        multiple
                        type="file"
                        name="myImage" 
                        className='choose-file'
                        style={{float:"right"}}
                        onChange={(event) => {
                          setSelectedImageDesc(event.target.files[0]);
                        }}
                    />
                    {formFileDesc  && (
                        <div>
                        <img alt="not fount" width={"100px"} src={URL.createObjectURL(formFileDesc)} />
                        <br />
                        <button className='remove-button' onClick={()=>setSelectedImageDesc(null)}>Remove</button>
                        </div>
                    )}
                    
                  </div>
                  <br></br><br></br>
                  <button type="submit" className="btn-save-cat">Save</button>
                </form>
              </div>
            </div>
        </Modal>
       </div>
    </div>
  );
}
