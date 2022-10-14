import React,{useState,useEffect} from 'react'
import { Modal } from 'react-responsive-modal';
import "./brandAndWarranty.scss"
import {publicRequest} from "../../requestMethod"
import {FetchUrl} from "../../requestMethod";
import { FaTrash} from "react-icons/fa";
import swal from 'sweetalert';
const BrandAndWarrante = () => {
    const [openBrand, setOpenBrand] = useState(false);
    const onOpenModalBrand = () => setOpenBrand(true);
    const onCloseModalBrand = () => setOpenBrand(false);
    const [openWarranty, setOpenWarranty] = useState(false);
    const onOpenModalWarranty = () => setOpenWarranty(true);
    const onCloseModalWarranty = () => setOpenWarranty(false);

    const [brands, setBrands] = useState([]);
    const [warrantes, setquantity] = useState([]);
    const [brandName ,setBrandName]= useState('');
    const [warranty,setWarranty]= useState('');
    const [reload, setReload] = useState([brands,warrantes]);
    useEffect(()=>{
        const getbrands = async ()=>{
          try{
              const res = await publicRequest.get("Home/get-brands");
              setBrands(res.data.data)
          }catch{}
        }
        getbrands()
      },[reload])
      useEffect(()=>{
        const getquantity = async ()=>{
          try{
              const res = await publicRequest.get("Home/get-Warranties");
              setquantity(res.data.data)
          }catch{}
        }
        getquantity()
      },[reload])
    const onSubmitBrands = async e => {
      e.preventDefault();
      const response = await AddBrand({
        brandName,
      });
    }
    async function AddBrand({brandName}) {
    return fetch(FetchUrl+`DashBoard/add-brand/${brandName}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
        },
        body: JSON.stringify({brandName})
    })
        .then(()=>{
        setReload(brands)
        setOpenBrand(false)
        })
    }
    const onSubmitWarranty = async e => {
    e.preventDefault();
    const response = await AddWarranty({
        warranty,
    });
    }
    async function AddWarranty({warranty}) {
        return fetch(FetchUrl+`DashBoard/add-warranty/${warranty}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
        },
        body: JSON.stringify({warranty})
        })
        .then(()=>{
            setReload(warrantes)
            setOpenWarranty(false)
        })
    }
    const DeleteBrand  = (brandId)=>{
      fetch(FetchUrl+`DashBoard/delete-brand/${brandId}`, {
       method: 'Delete',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
        },
        body:JSON.stringify(brandId)
      }).then((resp)=>{
        resp.json().then((result)=>{
        if(result.status === "Success"){
          swal("Success", result.message, "success", {
            buttons: false,
            timer: 2000,
          })
          .then((value) => {
            setReload(brands)
          });
          } else {
          swal("Failed", result.message, "error");
        }
        })
      })
    };
    const DeleteWarranty  = (warrantyId)=>{
      fetch(FetchUrl+`DashBoard/delete-warranty/${warrantyId}`, {
       method: 'Delete',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
        },
        body:JSON.stringify(warrantyId)
        }).then((resp)=>{
          resp.json().then((result)=>{
          if(result.status === "Success"){
            swal("Success", result.message, "success", {
              buttons: false,
              timer: 2000,
            })
            .then((value) => {
              setReload(warrantes)
            });
            } else {
            swal("Failed", result.message, "error");
          }
          })
        })
    };
  return (
    <div className='Section'>
        <div className='p-5'>
            <div className='row'>
                <div className='col-lg-6 col-md-6 col-sm-12'>
                    <div className='d-flex justify-content-between'>
                      <div className='dashboard'>Brands</div>
                      <button className="add-category-btn" onClick={onOpenModalBrand}>Add Brands</button>
                    </div>
                    <br></br>
                    <img className='brand-img' src="./assets/AdminPannel/brands.jpeg" />
                    {brands.map((brand,i)=>(
                         <div key={i} className='brand-container d-flex justify-content-between'>
                           <p className='brand-name'>{brand.brandName}</p>
                           <FaTrash className='delete-Icon c-pointer' onClick={()=>DeleteBrand(brand.brandId)} />
                         </div>
                         
                        ))
                    }
                </div>
                <div className='col-lg-6 col-md-6 col-sm-12'>
                    <div className='d-flex justify-content-between'>
                      <div className='dashboard'>Warranties</div>
                      <button className="add-category-btn" onClick={onOpenModalWarranty}>Warranties</button>
                    </div>
                    <br></br>
                    <img className='brand-img' src="./assets/AdminPannel/warranty.jpg" />
                    {warrantes.map((warranty,i)=>(
                         <div key={i} className='brand-container d-flex justify-content-between'>
                           <p className='brand-name'>{warranty.warrantyType}</p>
                           <FaTrash className='delete-Icon c-pointer' onClick={()=>DeleteWarranty(warranty.warrantyId)}/>
                         </div>
                        ))
                    }
                </div>
            </div>
        </div>
        <Modal open={openBrand} onClose={onCloseModalBrand} center>
            <br></br>
                <form className="add-cate-popup" noValidate onSubmit={onSubmitBrands}>
                <label className="product-label mt-3">Brand</label>
                    <br/>
                    <input 
                    type="text" 
                    className="brand-edit-input" 
                    placeholder="Name"
                    required
                    onChange={(e)=>setBrandName(e.target.value)}
                    />
                    <br></br><br></br>
                    <button type="submit" className="btn-save-cat">Save</button>
                </form>
        </Modal>
        <Modal open={openWarranty} onClose={onCloseModalWarranty} center>
            <br></br>
                <form className="add-cate-popup" noValidate onSubmit={onSubmitWarranty}>
                <label className="product-label mt-3">Warranty</label>
                    <br/>
                    <input 
                    type="text" 
                    className="brand-edit-input" 
                    placeholder="Name"
                    required
                    onChange={(e)=>setWarranty(e.target.value)}
                    />
                    <br></br><br></br>
                    <button type="submit" className="btn-save-cat">Save</button>
                </form>
        </Modal>
    </div>
  )
}

export default BrandAndWarrante