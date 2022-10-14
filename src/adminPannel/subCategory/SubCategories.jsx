import styled from "styled-components";
import * as React from 'react';
import { useState,useEffect } from 'react';
import TablePaginationUnstyled from '@mui/base/TablePaginationUnstyled';
import "./module.scss";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import axios from "axios";
import {publicRequest} from "../../requestMethod"
import {Link,useParams } from "react-router-dom";
import {FetchUrl} from "../../requestMethod";

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

export default function Category() {
  const { id } = useParams();
  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const [imgUrl, setSelectedImage] = useState(null);
  const [Editopen, setEditOpen] = useState(false);
  const EditOpenModal = () => setEditOpen(true);
  const [_subCategoryId, setSubCategoryId] = useState(null);
  const [IsShowOnHome, setIsShowOnHome] = useState(false);
  const [IsShowOnSlider, setIsShowOnSlider] = useState(false);
  const [name, setProductName] = useState('');
  const [hashTag, setProductHashtag] = useState('');
  const [ArrangementNo, setArrangementNo] = useState(1);
  const [subCategories, setSubCategories] = useState([]);
  const [subCategoryDetail , setSubCategoryDetail] = useState('')
  const [reload, setReload] = useState([subCategories]);
  const [errorMessage, setErrorMessage] = useState(false);
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - subCategories.length) : 0;

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
    setEditOpen(false);
  }
 const onFormSubmit =(e)=>{
   e.preventDefault();
   if(name && hashTag && ArrangementNo){
   const formData = new FormData();
   formData.append('ImgUrl',imgUrl);
   formData.append('IsShowOnSlider',IsShowOnSlider);
   formData.append('IsShowOnHome',IsShowOnHome);
   formData.append('Name',name);
   formData.append('HashTag',hashTag)
   formData.append('ArrangementNo',ArrangementNo)
   const config = {
     headers:{
       'content-type':'multipart/form-data',
       Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
     },
   };
   const url = FetchUrl+`DashBoard/add-subCategory/${id}`;
   axios.post(url,formData,config)
   .then((response)=>{
    if(response.data.status === "Success"){
      setReload(subCategories)
      setOpen(false);
      setSelectedImage(null)
    }
   })
   .catch((err)=>{
   });
  }else{
    setErrorMessage(true)
  }
 }
 //get categories
useEffect(() => {
    fetch(FetchUrl+`Home/get-SubCategories/${id}`,{
      headers: {
        Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
      },
    }).then((result)=>{
      result.json().then((resp)=>{
        setSubCategories(resp.data)
      })
    })
  }, [reload]);
  const StatusUpdateSubCategory  = (data)=>{
    const SubCategoryId = data.subCategoryId
   {
     fetch(FetchUrl+`DashBoard/update-subCategory-active-status/${SubCategoryId}`, {
      method: 'put',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
       },
       body:JSON.stringify(SubCategoryId)
     }).then((resp)=>{
       resp.json()
       .then((result)=>{
        setReload(subCategories)
       })
       .catch((err)=>{
           alert("Category is not Status Update !!")
        });
     })
   }
  };
  const selectSubCategory = (id) => {
    const getProductDetail = async () => {
      try {
        const res = await publicRequest.get(`/Home/get-category/${id}`);
        setSubCategoryDetail(res.data.data)
      } catch { }
    }
    getProductDetail()
  }
   function selectSubCategories(id,index){
    setProductName(index.name)
    setProductHashtag(index.hashTag)
    setArrangementNo(index.arrangementNo)
    setSubCategoryId(index.subCategoryId)
  }
  const onEditFormSubmit =(e)=>{
    e.preventDefault();
    if(name && hashTag && ArrangementNo){
    const formData = new FormData();
    formData.append('ImgUrl',imgUrl);
    formData.append('Name',name);
    formData.append('IsShowOnSlider',IsShowOnSlider);
    formData.append('IsShowOnHome',IsShowOnHome);
    formData.append('HashTag',hashTag);
    formData.append('ArrangementNo',ArrangementNo)
    const config = {
      headers:{
        'content-type':'multipart/form-data',
        Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
      },
    };
    const url = FetchUrl+`DashBoard/update-subCategory/${_subCategoryId}`;
    axios.put(url,formData,config)
    .then((response)=>{
      if(response.data.status === "Success"){
        setReload(subCategories)
        setSelectedImage(null);
        setEditOpen(false);
      }
    })
    .catch((err)=>{
    });
  }else{
    setErrorMessage(true)
    }
  }
  return (
      <div className="Section">
        <div className='p-4'>
          <div className='dashboard'>SubCategory</div>

          <div className="row padding">
          <div className="col-lg-12 col-md-12 col-sm-12 mt-5">
          <div className="d-flex justify-content-between">
            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <button className="nav-link active" id="pills-Active-tab" data-bs-toggle="pill" data-bs-target="#pills-Active" type="button" role="tab" aria-controls="pills-Active" aria-selected="true">Activate</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link" id="pills-deActive-tab" data-bs-toggle="pill" data-bs-target="#pills-deActive" type="button" role="tab" aria-controls="pills-deActive" aria-selected="false">Deactivate</button>
              </li>
            </ul>
          </div>
        </div>
          </div>
          <br></br>
          <div className="p-3 bgColor">
              <div className="d-flex justify-content-between ">
                  <span className="category-list">SubCategory List</span>
                  <button className="add-category-btn" onClick={onOpenModal}>Add SubCategory</button>
              </div>
        <br></br>
        <div className="tab-content" id="pills-tabContent">
          <div className="tab-pane fade show active" id="pills-Active" role="tabpanel" aria-labelledby="pills-Active-tab">
          <Root sx={{ minWidth: '800px', width: 320,overFlowX:'scroll' }}>
            <table aria-label="custom pagination table mt-2">
                <thead>
                <tr>
                    <th>Images</th>
                    <th>Name</th>
                    <th>HashTag</th>
                    <th>Show ON Home</th>
                    <th>Slider</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                  {(rowsPerPage > 0
                      ? subCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : subCategories
                  ).map((row,index) => (
                  <React.Fragment key={index}>
                  { row.isActive === true ?
                    <tr key={row.categoryId}>
                      <td style={{ width: 160,borderRight:"none" }} align="right">
                          <img src={row.image}style={{width:'60px',height:"50px"}}/>
                      </td>
                      <td className="tb-dt-name" style={{ width: 160,borderLeft:"none",borderRight:"none"}} align="right">
                          <Link to={`/admin/ProductsBySubcategory/${row.subCategoryId}`}>{row.name}</Link>
                      </td>
                      <td style={{ width: 160,borderLeft:"none",borderRight:"none" }} align="right">
                          {row.hashTag}
                      </td>
                      <td  style={{ width: 100,borderLeft:"none" }} className='order-td' align="right">
                      <span style={{border:'1px solid #23334C',borderRadius:"5px"}} className="p-1">
                          {row.isShowOnHome===true?
                            <span className='c-pointer'>True</span> :
                            <span className='c-pointer'>False</span> 
                            }
                      </span> 
                      </td>
                      <td  style={{ width: 100,borderLeft:"none" }} className='order-td' align="right">
                        <span style={{border:'1px solid #23334C',borderRadius:"5px"}} className="p-1">
                        {row.isShowOnSlider===true?
                            <span className='c-pointer'>True</span> :
                            <span className='c-pointer'>False</span> 
                            }
                        </span> 
                      </td>
                      <td style={{ width: 100,borderLeft:"none" }} align="right">
                      <span onClick={() => selectSubCategories(row.subCategoryId,row)}>
                          <span onClick={() => selectSubCategory(row.subCategoryId)}>
                            <span className="c-pointer active-link" onClick={()=>EditOpenModal(row.subCategoryId)}>Edit</span>
                          </span>
                          </span>
                          <br/>
                          <span className="c-pointer active-link" onClick={()=>StatusUpdateSubCategory(row)}>Deactivate</span>
                      </td>
                    </tr>
                    : 
                  <tr></tr>
                   }
                  </React.Fragment>
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
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={6}
                    count={subCategories.length}
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
          <div className="tab-pane fade " id="pills-deActive" role="tabpanel" aria-labelledby="pills-deActive-tab">
          <Root sx={{ minWidth: '800px', width: 320,overFlowX:'scroll' }}>
            <table aria-label="custom pagination table mt-2">
                <thead>
                <tr>
                    <th>Images</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                  {(rowsPerPage > 0
                      ? subCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : subCategories
                  ).map((row,index) => (
                  <React.Fragment key={index}>
                  { row.isActive === false ?
                    <tr key={row.categoryId}>
                      <td style={{ width: 160,borderRight:"none" }} align="right">
                          <img src={row.image}style={{width:'60px',height:"50px"}}/>
                      </td>
                      <td className="tb-dt-name" style={{ width: 160,borderLeft:"none",borderRight:"none"}} align="right">
                          <Link to={`/admin/ProductsBySubcategory/${row.subCategoryId}`}>{row.name}</Link>
                      </td>
                      <td style={{ width: 160,borderLeft:"none",borderRight:"none" }} align="right">
                          {row.hashTag}
                      </td>
                      <td style={{ width: 160,borderLeft:"none" }} align="right">
                      <span className="c-pointer" onClick={()=>StatusUpdateSubCategory(row)}>Activate</span>
                      </td>
                    </tr>
                    : 
                  <tr></tr>
                   }
                   </React.Fragment>
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
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={6}
                    count={subCategories.length}
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
      {/* popup section */}
      {/* add Subcategory popup */}
        <div>
            <Modal open={open} onClose={onCloseModal} center>
                <br></br>
                    <div className="d-flex justify-content-center">
                        <span className="category-popup">SubCategory</span>
                    </div>
                    {errorMessage?<div className='required justify-content-center'> <p>*Please fill all the marked fields.</p></div>:""}
                    <form className="add-cate-popup" noValidate onSubmit={onFormSubmit}>
                    <label className="product-label mt-3">Name<span className="required">*</span></label>
                    <br/>
                    <input 
                    type="text" 
                    id="username"
                    name="username" 
                    className="product-input" 
                    placeholder="Name"
                    required
                    onChange={e => setProductName(e.target.value)}
                    />
                    <label className="product-label mt-3">HashTag<span className="required">*</span></label>
                    <br/>
                    <input 
                    type="text" 
                    id="username"
                    name="username" 
                    className="product-input" 
                    placeholder="Parents Category"
                    required
                    onChange={e => setProductHashtag(e.target.value)}
                    />
                    <label className="product-label mt-3">Arrangement No<span className="required">*</span></label>
                    <br/>
                    <input 
                    type="number" 
                    min="0"
                    id="username"
                    name="username" 
                    className="product-input" 
                    placeholder="Arrangement No"
                    required
                    onChange={e => setArrangementNo(e.target.value)}
                    />
                    <label className="product-label mt-4">Is Show On Home</label>
                    <br/>
                    <div onChange={e => setIsShowOnHome(e.target.value)}>
                    <input type="radio" value="True" name="ShowOnHome" /> Yes&nbsp; &nbsp; 
                    <input type="radio" value="False" name="ShowOnHome" /> No
                    </div>
                    <label className="product-label mt-4">Is Show On Slider</label>
                    <br/>
                    <div onChange={e => setIsShowOnSlider(e.target.value)}>
                    <input type="radio" value="True" name="ShowOnSlider"  /> Yes&nbsp; &nbsp; 
                    <input type="radio" value="False" name="ShowOnSlider" /> No
                    </div>
                     <label className="product-label mt-3">Thumbnail</label>
                     <p style={{color:"green"}}>*Image dimension must be of 600x600</p>
                     <div>
                     <input
                            type="file"
                            name="myImage" 
                            style={{float:"right"}}
                            onChange={(event) => {
                            setSelectedImage(event.target.files[0]);
                            }}
                        />
                        {imgUrl && (
                            <div>
                            <img alt="not fount" width={"250px"} src={URL.createObjectURL(imgUrl)} />
                            <br />
                            <button onClick={()=>setSelectedImage(null)}>Remove</button>
                            </div>
                        )}
                       
                      </div>
                      <br></br><br></br>
                      <button type="submit" className="btn-save-cat">Save</button>
                    </form>
            </Modal>
       </div>
       {/* Edit Subcategory popup */}
       <div>
            <Modal open={Editopen} onClose={onCloseModal} center>
                <br></br>
                    <div className="d-flex justify-content-center">
                        <span className="category-popup">SubCategory</span>
                    </div>
                    {errorMessage?<div className='required justify-content-center'> <p>*Please fill all the marked fields.</p></div>:""}
                    <form className="add-cate-popup" noValidate onSubmit={onEditFormSubmit}>
                    <label className="product-label mt-3">Name<span className="required">*</span></label>
                    <br/>
                    <input 
                    type="text" 
                    id="username"
                    name="username" 
                    className="product-input" 
                    placeholder="Name"
                    value={name}
                    required
                    onChange={e => setProductName(e.target.value)}
                    />
                    <label className="product-label mt-3">HashTag<span className="required">*</span></label>
                    <br/>
                    <input 
                    type="text" 
                    id="username"
                    name="username" 
                    className="product-input" 
                    placeholder="Parents Category"
                    value={hashTag}
                    required
                    onChange={e => setProductHashtag(e.target.value)}
                    />
                     <label className="product-label mt-3">Arrangement No<span className="required">*</span></label>
                    <br/>
                    <input 
                    type="number" 
                    min="0"
                    id="username"
                    name="username" 
                    className="product-input" 
                    placeholder="Arrangement No"
                    value={ArrangementNo}
                    required
                    onChange={e => setArrangementNo(e.target.value)}
                    />
                    <label className="product-label mt-4">Is Show On Home</label>
                    <br/>
                    <div onChange={e => setIsShowOnHome(e.target.value)}>
                    <input type="radio" value="True" name="ShowOnHome"/> Yes&nbsp; &nbsp; 
                    <input type="radio" value="False" name="ShowOnHome"/> No
                    </div>
                    <label className="product-label mt-4">Is Show On Slider</label>
                    <br/>
                    <div onChange={e => setIsShowOnSlider(e.target.value)}>
                    <input type="radio" value="True" name="ShowOnSlider" /> Yes&nbsp; &nbsp; 
                    <input type="radio" value="False" name="ShowOnSlider" /> No
                    </div>
                    <label className="product-label mt-3">Image</label>
                    <p style={{color:"green"}}>*Image dimension must be of 600x600</p>
                    {imgUrl ===null?
                     <img style={{height:"100px",width:"100px"}} src={subCategoryDetail.image}/>
                     :
                     ""}
                     <div>
                     <input
                            type="file"
                            name="myImage" 
                            style={{float:"right"}}
                            onChange={(event) => {
                            setSelectedImage(event.target.files[0]);
                            }}
                        />
                        {imgUrl && (
                            <div>
                            <img alt="not fount" width={"70px"} src={URL.createObjectURL(imgUrl)} />
                            <br />
                            <button onClick={()=>setSelectedImage(null)}>Remove</button>
                            </div>
                        )}
                       
                      </div>
                      <br></br><br></br>
                      <button type="submit" className="btn-save-cat">Save</button>
                    </form>
            </Modal>
       </div>
    </div>
  );
}
