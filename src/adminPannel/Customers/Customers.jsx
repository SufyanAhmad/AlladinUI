import "./customer.module.scss";
import React,{ useState,useEffect } from 'react';
import styled from "styled-components";
import TablePaginationUnstyled from '@mui/base/TablePaginationUnstyled';
import 'react-responsive-modal/styles.css';
import {publicRequest} from "../../requestMethod";
import { FetchUrl } from "../../requestMethod";
const Section = styled.section`
margin-left:18vw;
height:100vh;
background-color:#FAFAFA;
`
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

const Customers = () => {
  const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] =useState(5);
    const [orders, setOrders] = useState([]);
    const [searchTerm,setSearchTerm]=useState('')
    const [sort,setSort]=useState('ASC')
    
    const updateStatusApproveCustomer  = (data)=>{
      const CategoryId = data.categoryId
     {
       fetch(FetchUrl + `DashBoard/update-Category-active-status/${CategoryId}`, {
        method: 'put',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
           Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
         },
         body:JSON.stringify(CategoryId)
       }).then((resp)=>{
         resp.json()
         .then((result)=>{
          alert("Category deleted successfull !!");
         })
         .catch((err)=>{
             alert("Category is not deleted !!")
          });
       })
     }
    };

    const sorting = (col)=>{
      if(sort === "ASC"){
        const sorted = [...orders].sort((a,b)=>
          a[col].toString().toLowerCase() > b[col].toString().toLowerCase() ? 1 : -1
        );
        setOrders(sorted);
        setSort("DSC")
      }
      if(sort === "DSC"){
        const sorted = [...orders].sort((a,b)=>
          a[col].toString().toLowerCase() < b[col].toString().toLowerCase() ? 1 : -1
        );
        setOrders(sorted);
        setSort("ASC")
      }
    };
    const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
useEffect(()=>{
  const getOrders = async ()=>{
    try{
        const res = await publicRequest.get("User/get-all-customer",{
          headers:{
            Authorization : 'bearer '+ JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.token
          }
        });
        setOrders(res.data.data)
        
    }catch{}
  }
  getOrders()
},[])
  return (
    <div className="Section">
        <div className='p-4'>
          <div className='dashboard'>Customers</div>
          <br></br>
          <div className="row padding">
      </div>
          <div className="p-3 bgColor">
              <div className="d-flex justify-content-between ">
                  <input type="text" className="product-search" style={{marginLeft:"800px"}} placeholder="Search.." onChange={(e)=>{setSearchTerm(e.target.value);
                  }}
                   />
              </div>
        <br></br>
        <Root sx={{ minWidth: '900px', width: 500 }}>
            <table aria-label="custom pagination table mt-2" style={{minWidth:'900px',overFlow:"scroll"}}>
                <thead>
                <tr>
                    <th>Customer ID</th>
                    <th>Image</th>
                    <th>FName</th>
                    <th>LName</th>
                    <th>Phone No</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {(rowsPerPage > 0 && searchTerm =="" ? 
                  orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : orders
                ).filter((val)=>{
                  if(searchTerm ==""){
                    return val
                  }else if(val.orderNo.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())){
                    return val
                  }
                }).map((row) => (
                    <tr key={row.orderId}>
                    <td style={{ width: 160,borderRight:"none" }} align="right">
                        {row.id}
                    </td>
                    <td className='order-td' align="right">
                        <img src={row.profileImageUrl}style={{borderStyle:"none",width:'60px',height:"50px"}}/>
                    </td>
                    <td className='order-td c-pointer' align="right">
                    {row.firstName}
                    </td>
                    <td className='order-td' align="right">
                        {row.lastName}
                    </td>
                    <td className='order-td' align="right">
                        {row.phoneNumber}
                    </td>
                    <td className='order-td1' align="right">
                       <span className='c-pointer' onClick={()=>updateStatusApproveCustomer(row)}>Approve</span>
                        <br/>
                       <span className='c-pointer'>Reject</span> 
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
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={6}
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
        </div>
    </div>
  )
}

export default Customers