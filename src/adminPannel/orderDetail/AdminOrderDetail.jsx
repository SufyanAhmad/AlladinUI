import "./module.scss"
import Form from 'react-bootstrap/Form'
import {useParams } from "react-router-dom";
import {publicRequest} from "../../requestMethod"
import { useState,useEffect } from 'react';
import moment from 'moment';
import swal from 'sweetalert';
import { FaMarker } from "react-icons/fa";
import { FetchUrl } from "../../requestMethod";
export const AdminOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState([]);
  const [notes, setNotes] = useState([]);
  const [orderDetail, setOrderDetails] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [status, setStatus] = useState('');
  const [text, setText] = useState('');
  const [noteTypeId, setNoteTypeId] = useState(1);
   const [reload, setReload]= useState(notes)
   const [statusErrorMessage, setStatusErrorMessage]= useState(false)
   const [editValue, setEditValue]= useState(false)
   const [updatedNote, setUpdatedNote]= useState('')
   const [editNoteKey, setEditNoteKey]= useState()

  useEffect(()=>{
    const getOrderDetail = async ()=>{
          const res = await publicRequest.get(`Order/get-order-detail/${id}`,{
            headers:{
              Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
            }
          });
          setOrderDetails(res.data.data.orderDetails)
    }
    getOrderDetail()
  },[reload])
  useEffect(()=>{
    const getOrder = async ()=>{
          const res = await publicRequest.get(`Order/get-order-detail/${id}`,{
            headers:{
              Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
            }
          });
          setOrder(res.data.data)
    }
    getOrder()
  },[reload])
  useEffect(()=>{
    const getNotes = async ()=>{
          const res = await publicRequest.get(`Order/get-notes/${id}`,{
            headers:{
              Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
            }
          });
          setNotes(res.data.data)
          setText("")
    }
    getNotes()
  },[reload])
  useEffect(()=>{
    
    const getorderStatus = async ()=>{
          const res = await publicRequest.get("Home/get-order-statuses",{
            headers:{
              Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
            }
          });
          (res.data.data).splice(5,1)
          setOrderStatus(res.data.data)
    }
    getorderStatus()
  },[])
  function handleSubmit (){
    if(status){
   let item={id,status}
          fetch(FetchUrl + `Order/update-order-status/${id}/${status}`,{
            method: 'PUT',
            headers:{
              'Accept': 'application/json',
              'Content-Type':'application/json',
              Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
            },
            body:JSON.stringify(item)
            }).then((resp)=>{
              resp.json().then((result)=>{
                if(result.status === "Success"){
                  swal("Success", result.message, "success", {
                    buttons: false,
                    timer: 2000,
                  })
                  
                  .then((value) => {
                    setReload(order)
                  });
                 } else {
                  swal("Failed", result.message, "error");
                }
               })
             });
            setStatusErrorMessage(false);
          }else{
            setStatusErrorMessage(true);
          }
    }
  async function AddNotes(credentials) {
      return  fetch(FetchUrl + `Order/add-note/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
        },
        body: JSON.stringify(credentials)
      }).then(data => data.json())
    }
    const SubmitNotes = async e => {
      e.preventDefault();
        if(text){
        const response = await AddNotes({
          text,
          noteTypeId,
        });
        if (response.status === "Success") {
          swal("Success", response.message, "success", {
            buttons: false,
            timer: 2000,
          })
          .then((value) => {
            setReload(notes)
          });
        } else {
          swal("Failed", response.message, "error");
        }
      }
    }
    const DeleteNote = (noteId) =>{
    fetch(FetchUrl+`Order/delete-note/${noteId}`, {
      method: "DELETE",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
      },
      body:JSON.stringify(noteId)
    }).then((resp)=>{
      resp.json().then((result)=>{
        setReload(notes)
      })
    })
  }
  const clickEdit = (data) =>{
      setEditValue(!data.editValue)
      setEditNoteKey(data.key)
  }
  const updateNoteValue = (data) =>{
    let noteId = data.noteId;
    let noteTypeId = data.noteTypeId;
    let text = updatedNote;
    
    let item = {
      text,
      noteTypeId
    }
             fetch(FetchUrl + `Order/update-note/${noteId}`,{
               method: 'PUT',
               headers:{
                 'Accept': 'application/json',
                 'Content-Type':'application/json',
                 Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
               },
               body:JSON.stringify(item)
              }).then((resp)=>{
              resp.json().then((result)=>{
                  
                   if(result.status === "Success"){
                     swal("Success", result.message, "success", {
                       buttons: false,
                       timer: 2000,
                     })
                     .then((value) => {
                      setEditValue(false)
                      setReload(notes) 
                      setEditNoteKey('')
                     });
                    } else {
                     swal("Failed", result.message, "error");
                     setEditNoteKey('')
                     setEditValue(false)
                   }
                  })
                });
  }
  return (
    <div className="Section">
        <div className='p-4'>
          <div className='dashboard'>Edit Order</div>
          <br></br>
          <div className="row">
              <div className="col-lg-9 col-md-9 col-sm-12">
                 <div className="edit-order-box p-3">
                     <div className="edit-order-detail ">Order Details</div>  
                     <div className="row mt-4">
                         <div className="col-lg-4 col-md-4 col-sm-12">
                             <div className="general">General</div>
                             <div className="create-date mt-2">Date created:</div>
                             <div className="d-flex justify-content-start mt-2">
                                 <button className="btn-date">{moment(order.createAt).format("YYYY-MM-DD")}</button>
                                 <button className="btn-date">{moment(order.createAt).format("hh")}</button>
                                 <button className="btn-date">{moment(order.createAt).format("mm")}</button>
                             </div>
                             <div className="create-date mt-2">Status:</div>
                              {order.orderStatusType === "Canceled"?<> 
                                {order.orderStatusMappingViewModels.filter((filterData) => (filterData.orderStatus === "Canceled")).length !== 0?<>
                                {order.orderStatusMappingViewModels.filter((filterData) => (filterData.orderStatus === "Canceled")).map((statusMessage,index,{length}) => {return <>
                                  {index===length-1?<>
                                  {statusMessage.orderStatus === "Canceled"?
                                    <td className="tableItem">{ statusMessage.createByRole === "Customer"? "Canceled by Customer" : statusMessage.createByRole === "Admin"?  "Canceled by System" : "Canceled by Customer" }</td>
                                    :
                                    <td className="tableItem">Canceled by Customer</td>}
                                    </>:""}
                                  </>
                                })}
                                </>
                                :<td className="tableItem">Canceled by Customer</td>}
                                </>
                                :<td className="tableItem">{order.orderStatusType}</td>}
                             
                        </div>
                         <div className="col-lg-4 col-md-4 col-sm-12">
                           <div className="general">Phone No:</div>
                           <div className="create-phnone-no mt-2">{order.phoneNo}</div>
                           <br />
                           <div className="general">Customer Name:</div>
                           <div className="create-phnone-no mt-2">{order.customerName}</div>
                         </div>
                         <div className="col-lg-4 col-md-4 col-sm-12">
                            <div className="general">Shipping</div>
                            <div className="create-phnone-no mt-2">Address: {order.address}</div>
                            <div className="create-phnone-no mt-1">City: {order.city}</div>
                          </div>
                     </div>
                </div>
                <br></br><br></br>
                <div className="edit-order-box p-3">
                   <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-12">
                        <span className="item">Item</span>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12">
                          <div className="d-flex justify-content-around">
                            <span className="item">Cost</span>
                            <span className="item">Qty</span>
                            <span className="item">Total</span>
                          </div>
                      </div>
                    </div>
                    <hr/>
                  {orderDetail.map((order,key)=>(
                    <div className="row mb-4" key={key}>
                      <div className="col-lg-6 col-md-6 col-sm-12" >
                          <div className="row">
                            {order.productMediaViewModels.length !== 0?<>
                              {order.productMediaViewModels.map((media,key)=>(
                                <div className="col-3" key={key}>
                                    <img src={media.imgUrl} className="order-img" />
                                </div>
                                  ))
                              }
                              </>
                            :
                              <div className="col-3" key={key}>
                                  <img src="./assets/Auth/default-img.png" className="order-img" />
                              </div>
                            }
                             <div className="col-9">
                                 <div className="order-img-desc">{order.productName}</div>
                             </div>
                          </div>
                      </div>
                     <div className="col-lg-6 col-md-6 col-sm-12">
                      {order.discountPrice === 0 ?
                        <>
                          <div className="d-flex justify-content-around mt-4">
                                <span className="item">{ (order.totalPrice-order.shippingCharge)/order.quantity}</span>
                                <span className="item">{order.quantity}</span>
                                <span ><p style={{float:"right"}} className="item">{Math.trunc(parseFloat(order.totalPrice - order.shippingCharge))}</p></span>
                            </div>
                            <br/>
                            <div style={{float:"right"}} className="item-suntotal">
                              <span style={{marginRight:"20px"}}>Shipping Charges:</span><span style={{marginRight:"60px"}}>{order.shippingCharge}</span> 
                            </div>
                            <br />
                            <div style={{float:"right"}} className="item-suntotal">
                                <span style={{marginRight:"20px"}}>Discount:</span><span style={{marginRight:"60px"}}>0</span> 
                            </div>
                          </>:
                          <>
                          <div className="d-flex justify-content-around mt-4">
                            <span className="item">{Math.trunc(parseFloat((order.totalPrice-order.shippingCharge)/order.quantity))}</span>
                            <span className="item">{order.quantity}</span>
                            <span className="item">{Math.trunc(parseFloat((order.totalPrice-order.shippingCharge)))}</span>
                          </div>
                          <br />
                          <div style={{float:"right"}} className="item-suntotal">
                            <span style={{marginRight:"20px"}}>Shipping Charges:</span><span style={{marginRight:"60px"}}>{order.shippingCharge}</span> 
                        </div>
                        <br />
                        <div style={{float:"right"}} className="item-suntotal">
                            <span style={{marginRight:"20px"}}>Discount:</span><span style={{marginRight:"60px"}}>{Math.trunc(order.totalPrice - Math.trunc(order.discountPrice))}</span> 
                        </div>
                        </>
                        }  
                     </div>
                    </div>
                   ))
                    }
                    <hr style={{border: "1px solid #C4C4C4"}}/>
                    <div style={{float:"right"}}>
                       <span className="item-suntotal" style={{marginRight:"70px"}}>Items Subtotal:	</span>
                       <span className="item-suntotal" style={{marginRight:"30px"}}>{Math.trunc(parseFloat(order.subTotal))}</span>
                    </div>
                    <br></br><br></br>
                    <div style={{float:"right"}}>
                       <span className="item-suntotal" style={{marginRight:"70px"}}>Order Total:	</span>
                       <span className="item-suntotal" style={{marginRight:"30px"}}>{Math.trunc(parseFloat(order.orderTotal))}	</span>
                    </div>
                    <br></br><br></br>
                    {/* <button className="refund-btn">Refund</button> */}
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-12">
                 <div className="edit-order-box">
                   <div className="pt-2 pl-2">
                       <span className="order-action">Order Actions</span>
                       {statusErrorMessage?<><br /><span style={{color:"red"}}>Error: Please select status before update</span></> :""}
                    </div>
                      <hr style={{border: "1px solid #C4C4C4"}}/>
                      <div className="d-flex justify-content-around">
                              <Form.Select aria-label="Default select example"
                               onChange={(e)=>setStatus(e.target.value)}
                              >
                              <option>{order.orderStatusType}</option>
                              {orderStatus.map((status,key)=>(
                                    <option key={key} value={status.orderStatusId} id={status.orderStatusId}>{status.type}</option>
                              ))}
                            </Form.Select>
                      </div>
                      <hr style={{border: "1px solid #C4C4C4"}}/>
                      <button className="refund-btn" style={{float:"right", marginRight:"10px",backgroundColor:"blue",color:"white"}} onClick={handleSubmit}>Update</button>
                      <br></br> <br></br>
                  </div>
                  <br></br>
                  <div className="edit-order-box">
                    <div className="pt-2 pl-2">
                       <span className="order-action">Order Actions</span> 
                    </div>
                      <hr style={{border: "1px solid #C4C4C4"}}/>
                      {notes.map((note,key)=>(
                      <div className="p-2" key={key}>
                        {(editValue === true && editNoteKey === key) ?
                          <div className="d-flex justify-content-between comment-text ">
                            <textarea onChange={(e) => setUpdatedNote(e.target.value)} defaultValue={note.text} style={{width:"80%"}}></textarea>
                          <button onClick={() => updateNoteValue(note)} style={{backgroundColor:"blue",color:"white",borderStyle:"none",width:"20%"}}>Edit</button>
                         </div>
                          :
                          <div className="comment-text p-2">
                            {note.text}<FaMarker onClick={() =>clickEdit({editValue,key})} style={{float:"right",color:"blue"}}/>
                          </div>
                           
                          }
                          <span className="comment-datetime">{moment(note.createAt).format('MMMM Do YYYY, h:mm:ss a')}, by Alladin </span>
                          <button className="dlt-notes c-pointer" onClick={()=>DeleteNote(note.noteId)}>Delete Note</button>
                      </div>
                      ))}
                      <hr style={{border: "1px solid #C4C4C4"}}/>
                      <div className="p-2">
                          <span className="add-notes">Add Note</span>
                          <textarea className="add-msg" rows="3"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            required
                            id="mainInput"
                            ></textarea>
                          <div className="d-flex justify-content-between">
                              <Form.Select aria-label="Default select example"
                                onChange={(e)=>setNoteTypeId(e.target.value)}
                                >
                                <option defaultValue value="1">Private Note</option>
                                <option value="2">Public Note</option>
                              </Form.Select>&nbsp;&nbsp;
                              <button style={{width:"55px", textAlign:"center",backgroundColor:"blue",color:"white"}} className="add-btn-comment" onClick={SubmitNotes}>Add</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>
    </div>
  )
}
