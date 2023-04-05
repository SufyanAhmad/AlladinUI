import React, { useState, useEffect, useRef, Fragment } from 'react';
import './module.scss';
import styled from 'styled-components';
import TablePaginationUnstyled from '@mui/base/TablePaginationUnstyled';
import 'react-responsive-modal/styles.css';
import Form from 'react-bootstrap/Form';
import { NavLink } from 'react-router-dom';
import { publicRequest } from '../../requestMethod';
import moment from 'moment';
import { Modal } from 'react-responsive-modal';
import swal from 'sweetalert';
import { FetchUrl } from '../../requestMethod';
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

const Orders = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('ASC');
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [expectedDatetime, setExpectedDatetime] = useState('');
  const [shipmentCompany, setShipmentCompany] = useState('');
  const [referenceNo, setReferenceNo] = useState('');
  const [ProductId, setProductId] = useState('');
  const [reload, setReload] = useState([orders]);
  const [spinner,setSpinner] = useState(false)
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
        const res = await publicRequest.get('Order/get-all-orders', {
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
  async function shipedOrder(credentials) {
    return fetch(FetchUrl + `Order/update-order-status/${ProductId}/${6}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
      },
      body: JSON.stringify(credentials),
    }).then(() => {
      setReload(orders);
      setOpen(false);
    });
  }
  const form = useRef(null);
  const onFormSubmit = async (e) => {
    e.preventDefault();
    const response = await shipedOrder({
      expectedDatetime,
      shipmentCompany,
      referenceNo,
    });
    if (response.status === 'Success') {
      swal('Success', response.message, 'success', {
        buttons: false,
        timer: 2000,
      }).then((value) => {
        setReload(orders);
        setOpen(false);
      });
    } else {
      swal('Error', response.message, 'error');
    }
  };
  function selectUser(id) {
    setProductId(id);
  }
  const readyToShipOrder = (data) => {
    {
      let item = {
        expectedDatetime: '2022-05-14T11:32:06.915Z',
        shipmentCompany: 'alladin.pk',
        referenceNo: '123',
      };
      fetch(FetchUrl + `Order/update-order-status/${data}/${5}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(item),
      }).then((resp) => {
        setReload(orders);
        resp.json().then((result) => {
          setReload(orders);
          setOpen(false);
        });
      });
    }
  };
  const cancelOrder = (data) => {
    {
      let item = {
        expectedDatetime: '2022-05-14T11:32:06.915Z',
        shipmentCompany: 'alladin.pk',
        referenceNo: '123',
      };
      fetch(FetchUrl + `Order/update-order-status/${data}/${3}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(item),
      }).then((resp) => {
        setReload(orders);
        resp.json().then((result) => {
          setReload(orders);
        });
      });
    }
  };
  const failDeliveryOrder = (data) => {
    {
      let item = {
        expectedDatetime: '2022-05-14T11:32:06.915Z',
        shipmentCompany: 'alladin.pk',
        referenceNo: '123',
      };
      fetch(FetchUrl + `Order/update-order-status/${data}/${9}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(item),
      }).then((resp) => {
        setReload(orders);
        resp.json().then((result) => {
          setReload(orders);
        });
      });
    }
  };
  const returnedOrder = (data) => {
    {
      let item = {
        expectedDatetime: '2022-05-14T11:32:06.915Z',
        shipmentCompany: 'alladin.pk',
        referenceNo: '123',
      };
      fetch(FetchUrl + `Order/update-order-status/${data}/${8}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(item),
      }).then((resp) => {
        resp.json().then((result) => {
          setReload(orders);
        });
      });
    }
  };
  const deliveredOrder = (data) => {
    {
      let item = {
        expectedDatetime: '2022-05-14T11:32:06.915Z',
        shipmentCompany: 'alladin.pk',
        referenceNo: '123',
      };
      fetch(FetchUrl + `Order/update-order-status/${data}/${7}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'bearer ' + JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).currentUser.token,
        },
        body: JSON.stringify(item),
      }).then((resp) => {
        setReload(orders);
        resp.json().then((result) => {
          setReload(orders);
        });
      });
    }
  };
  const pendings = orders.filter((item) => item.orderStatusType === 'Pending');
  const ReadyToShip = orders.filter((item) => item.orderStatusType === 'ReadyToShip');
  const Shipped = orders.filter((item) => item.orderStatusType === 'Shipped');
  const Delivered = orders.filter((item) => item.orderStatusType === 'Delivered');
  const Canceled = orders.filter((item) => item.orderStatusType === 'Canceled');
  const FailDelivery = orders.filter((item) => item.orderStatusType === 'FailDelivery');
  const Returned = orders.filter((item) => item.orderStatusType === 'Returned');

  return (
    <div className="Section">
      <div className="p-4">
        <div className="dashboard">Order Detail</div>
        <br></br>
        <div className="row padding">
          <div className="col-lg-12 col-md-12 col-sm-12 mt-5">
            <div className="d-flex justify-content-between">
              <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button className="nav-link " id="pills-all-tab" data-bs-toggle="pill" data-bs-target="#pills-all" type="button" role="tab" aria-controls="pills-all" aria-selected="true">
                    All
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link active" id="pills-pending-tab" data-bs-toggle="pill" data-bs-target="#pills-pending" type="button" role="tab" aria-controls="pills-pending" aria-selected="false">
                    Pending
                    {spinner?
                            <i style={{marginLeft:"3px"}} className="fa fa-spinner ml-4 fa-spin"></i>
                            :""}
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="pills-readyToShip-tab" data-bs-toggle="pill" data-bs-target="#pills-readyToShip" type="button" role="tab" aria-controls="pills-readyToShip" aria-selected="false">
                    Ready To Ship
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="pills-shiped-tab" data-bs-toggle="pill" data-bs-target="#pills-shiped" type="button" role="tab" aria-controls="pills-shiped" aria-selected="false">
                    Shipped
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="pills-deliverd-tab" data-bs-toggle="pill" data-bs-target="#pills-deliverd" type="button" role="tab" aria-controls="pills-deliverd" aria-selected="false">
                    Delivered
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="pills-cancelled-tab" data-bs-toggle="pill" data-bs-target="#pills-cancelled" type="button" role="tab" aria-controls="pills-cancelled" aria-selected="false">
                    Cancelled
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="pills-returned-tab" data-bs-toggle="pill" data-bs-target="#pills-returned" type="button" role="tab" aria-controls="pills-returned" aria-selected="false">
                    Returned
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="pills-faildDelivery-tab" data-bs-toggle="pill" data-bs-target="#pills-faildDelivery" type="button" role="tab" aria-controls="pills-faildDelivery" aria-selected="false">
                    Failed Delivery
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="p-3 admin-content bgColor">
          <div className="d-flex justify-content-between ">
            <span className="category-list">Category List</span>
            <input
              type="text"
              className="product-search"
              placeholder="Search order by order number.."
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
          <br></br>
          <div className="tab-content" id="pills-tabContent">
            <div className="tab-pane fade " id="pills-all" role="tabpanel" aria-labelledby="pills-all-tab">
              <Root sx={{ minWidth: '900px', width: 500 }}>
                <table aria-label="custom pagination table mt-2" style={{ minWidth: '900px', overFlow: 'scroll' }}>
                  <thead>
                    <tr>
                      <th onClick={() => sorting('orderNo')} style={{ cursor: 'pointer' }}>Order No</th>
                      <th>Customer</th>
                      <th> Date</th>
                      <th>Order Price</th>
                      <th>Delivery Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0 && searchTerm === '' ? 
                      orders.slice(page * rowsPerPage, 
                      page * rowsPerPage + rowsPerPage) : orders)
                      .filter((val) => {
                        if (searchTerm === '') {
                          return val;
                        } else if (val.orderNo.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())) {
                          return val;
                        }
                      })
                      .map((row) => (
                        <tr key={row.orderNumberWithDate}>
                          <td style={{ width: 160, borderRight: 'none' }} align="right">
                            <NavLink to={`/admin/orderdetail/${row.orderId}`} style={{ color: 'black' }}>
                              {row.orderNumberWithDate}
                            </NavLink>
                          </td>
                          <td className="order-td" align="right">
                            {row.firstName} {row.lastName}
                          </td>
                          {row.deliveryDatetime === null ? (
                            <td className="order-td" align="right">
                              Not yet delivered
                            </td>
                          ) : (
                            <td className="order-td" align="right">
                              {moment(row.deliveryDatetime).format('YYYY-MM-DD')}
                            </td>
                          )}
                          <td className="order-td" align="right">
                            {Math.trunc(parseFloat(row.totalPrice))}
                          </td>
                          <td className="order-td" align="right">
                            {/* <span
                              style={{
                                border: "1px solid #23334C",
                                borderRadius: "5px",
                              }}
                              className="p-1"
                            >
                              {row.orderStatusType}
                            </span> */}
                            {row.orderStatusType === 'Canceled' ? (
                              <>
                                {row.orderStatusMappingViewModels.filter((filterData) => filterData.orderStatus === 'Canceled').length !== 0 ? (
                                  <>
                                    {row.orderStatusMappingViewModels
                                      .filter((filterData) => filterData.orderStatus === 'Canceled')
                                      .map((statusMessage, index,{length}) => (
                                        <Fragment key={index}>{index===length-1?<>
                                          {statusMessage.orderStatus === 'Canceled' ? (
                                            <span style={{ border: '1px solid #23334C', borderRadius: '5px' }} className="p-1">
                                              {statusMessage.createByRole === 'Admin' ? 'Canceled by System' : 'Canceled by Customer'}
                                            </span>
                                          ) : (
                                            <span style={{ border: '1px solid #23334C', borderRadius: '5px' }} className="p-1">
                                              Canceled by Customer
                                            </span>
                                          )}
                                          </>:""}
                                        </Fragment>
                                      ))}
                                  </>
                                ) : (
                                  <span style={{ border: '1px solid #23334C', borderRadius: '5px' }} className="p-1">
                                    Canceled by Customer
                                  </span>
                                )}
                              </>
                            ) : (
                              <span style={{ border: '1px solid #23334C', borderRadius: '5px' }} className="p-1">
                                {row.orderStatusType}
                              </span>
                            )}
                          </td>
                          <td className="order-td1" align="right"></td>
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
            <div className="tab-pane fade show active" id="pills-pending" role="tabpanel" aria-labelledby="pills-pending-tab">
              <Root sx={{ minWidth: '900px', width: 500 }}>
                <table aria-label="custom pagination table mt-2" style={{ minWidth: '900px', overFlow: 'scroll' }}>
                  <thead>
                    <tr>
                      <th onClick={() => sorting('orderNo')} style={{ cursor: 'pointer' }}>Order ID</th>
                      <th>Customer</th>
                      <th>Delivery Date</th>
                      <th>Order Price</th>
                      <th>Delivery Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0 && searchTerm === '' ? 
                      pendings.slice(page * rowsPerPage, 
                      page * rowsPerPage + rowsPerPage) : pendings)
                      .filter((val) => {
                        if (searchTerm === '') {
                          return val;
                        } else if (val.orderNo.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())) {
                          return val;
                        }
                      })
                      .map((row, i) => (
                        <Fragment key={i}>
                          {row.orderStatusType === 'Pending' ? (
                            <tr key={row.orderNumberWithDate}>
                              <td style={{ width: 160, borderRight: 'none' }} align="right">
                                <NavLink to={`/admin/orderdetail/${row.orderId}`} style={{ color: 'black' }}>
                                  {row.orderNumberWithDate}
                                </NavLink>
                              </td>
                              <td className="order-td" align="right">
                                {row.firstName} {row.lastName}
                              </td>
                              {row.deliveryDatetime === null ? (
                                <td className="order-td" align="right">
                                  Not yet delivered
                                </td>
                              ) : (
                                <td className="order-td" align="right">
                                  {moment(row.deliveryDatetime).format('YYYY-MM-DD')}
                                </td>
                              )}
                              <td className="order-td" align="right">
                                {Math.trunc(parseFloat(row.totalPrice))}
                              </td>
                              <td className="order-td" align="right">
                                <span
                                  style={{
                                    border: '1px solid #23334C',
                                    borderRadius: '5px',
                                  }}
                                  className="p-1"
                                >
                                  {row.orderStatusType}
                                </span>
                              </td>
                              <td className="order-td1" align="right">
                                <span className="c-pointer active-link" onClick={() => readyToShipOrder(row.orderId)}>
                                  Ready To Ship
                                </span>
                                <br />
                                <span className="c-pointer active-link" onClick={() => cancelOrder(row.orderId)}>
                                  Cancel
                                </span>
                              </td>
                            </tr>
                          ) : (
                            <span></span>
                          )}
                        </Fragment>
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
                        colSpan={7}
                        count={pendings.length}
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
            <div className="tab-pane fade" id="pills-readyToShip" role="tabpanel" aria-labelledby="pills-readyToShip-tab">
              <Root sx={{ minWidth: '900px', width: 500 }}>
                <table aria-label="custom pagination table mt-2" style={{ minWidth: '900px', overFlow: 'scroll' }}>
                  <thead>
                    <tr>
                      <th  onClick={() => sorting('orderNo')} style={{ cursor: 'pointer' }}>Order ID</th>
                      <th>Customer</th>
                      <th> Date</th>
                      <th>Order Price</th>
                      <th>Delivery Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0 && searchTerm === '' ? 
                      ReadyToShip.slice(page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage) : ReadyToShip)
                      .filter((val) => {
                        if (searchTerm === '') {
                          return val;
                        } else if (val.orderNo.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())) {
                          return val;
                        }
                      })
                      .map((row, i) => (
                        <Fragment key={i}>
                          {row.orderStatusType === 'ReadyToShip' ? (
                            <tr key={row.orderNumberWithDate}>
                              <td style={{ width: 160, borderRight: 'none' }} align="right">
                                <NavLink to={`/admin/orderdetail/${row.orderId}`} style={{ color: 'black' }}>
                                  {row.orderNumberWithDate}
                                </NavLink>
                              </td>
                              <td className="order-td" align="right">
                                {row.firstName} {row.lastName}
                              </td>
                              {row.deliveryDatetime === null ? (
                                <td className="order-td" align="right">
                                  Not yet delivered
                                </td>
                              ) : (
                                <td className="order-td" align="right">
                                  {moment(row.deliveryDatetime).format('YYYY-MM-DD')}
                                </td>
                              )}
                              <td className="order-td" align="right">
                                {Math.trunc(parseFloat(row.totalPrice))}
                              </td>
                              <td className="order-td" align="right">
                                <span
                                  style={{
                                    border: '1px solid #23334C',
                                    borderRadius: '5px',
                                  }}
                                  className="p-1"
                                >
                                  {row.orderStatusType}
                                </span>
                              </td>
                              <td className="order-td1" align="right">
                                <span onClick={() => selectUser(row.orderId)}>
                                  <span className="c-pointer active-link" onClick={onOpenModal}>
                                    Shipped
                                  </span>
                                </span>
                                <br />
                                <span className="c-pointer active-link" onClick={() => cancelOrder(row.orderId)}>
                                  Cancel
                                </span>
                              </td>
                            </tr>
                          ) : (
                            <span></span>
                          )}
                        </Fragment>
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
                        colSpan={7}
                        count={ReadyToShip.length}
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
            <div className="tab-pane fade" id="pills-shiped" role="tabpanel" aria-labelledby="pills-shiped-tab">
              <Root sx={{ minWidth: '900px', width: 500 }}>
                <table aria-label="custom pagination table mt-2" style={{ minWidth: '900px', overFlow: 'scroll' }}>
                  <thead>
                    <tr>
                      <th onClick={() => sorting('orderNo')} style={{ cursor: 'pointer' }}>Order ID</th>
                      <th>Customer</th>
                      <th> Date</th>
                      <th>Order Price</th>
                      <th>Delivery Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0 && searchTerm === '' ? 
                      Shipped.slice(page * rowsPerPage, 
                      page * rowsPerPage + rowsPerPage) : Shipped)
                      .filter((val) => {
                        if (searchTerm === '') {
                          return val;
                        } else if (val.orderNo.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())) {
                          return val;
                        }
                      })
                      .map((row, i) => (
                        <Fragment key={i}>
                          {row.orderStatusType === 'Shipped' ? (
                            <tr key={row.orderNumberWithDate}>
                              <td style={{ width: 160, borderRight: 'none' }} align="right">
                                <NavLink to={`/admin/orderdetail/${row.orderId}`} style={{ color: 'black' }}>
                                  {row.orderNumberWithDate}
                                </NavLink>
                              </td>
                              <td className="order-td" align="right">
                                {row.firstName} {row.lastName}
                              </td>
                              {row.deliveryDatetime === null ? (
                                <td className="order-td" align="right">
                                  Not yet delivered
                                </td>
                              ) : (
                                <td className="order-td" align="right">
                                  {moment(row.deliveryDatetime).format('YYYY-MM-DD')}
                                </td>
                              )}
                              <td className="order-td" align="right">
                                {Math.trunc(parseFloat(row.totalPrice))}
                              </td>
                              <td className="order-td" align="right">
                                <span
                                  style={{
                                    border: '1px solid #23334C',
                                    borderRadius: '5px',
                                  }}
                                  className="p-1"
                                >
                                  {row.orderStatusType}
                                </span>
                              </td>
                              <td className="order-td1" align="right">
                                <span className="c-pointer active-link" onClick={() => deliveredOrder(row.orderId)}>
                                  Deliverd
                                </span>

                                <br />
                                <span className="c-pointer active-link" onClick={() => failDeliveryOrder(row.orderId)}>
                                  Faild Delivery
                                </span>
                                <br />
                                {/* <span className='c-pointer'>Cancel</span>  */}
                              </td>
                            </tr>
                          ) : (
                            <span></span>
                          )}
                        </Fragment>
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
                        colSpan={7}
                        count={Shipped.length}
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
            <div className="tab-pane fade" id="pills-deliverd" role="tabpanel" aria-labelledby="pills-deliverd-tab">
              <Root sx={{ minWidth: '900px', width: 500 }}>
                <table aria-label="custom pagination table mt-2" style={{ minWidth: '900px', overFlow: 'scroll' }}>
                  <thead>
                    <tr>
                      <th onClick={() => sorting('orderNo')} style={{ cursor: 'pointer' }}>Order ID</th>
                      <th>Customer</th>
                      <th> Date</th>
                      <th>Order Price</th>
                      <th>Delivery Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0 && searchTerm === '' ? 
                      Delivered.slice(page * rowsPerPage, 
                      page * rowsPerPage + rowsPerPage) : Delivered)
                      .filter((val) => {
                        if (searchTerm === '') {
                          return val;
                        } else if (val.orderNo.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())) {
                          return val;
                        }
                      })
                      .map((row, i) => (
                        <Fragment key={i}>
                          {row.orderStatusType === 'Delivered' ? (
                            <tr key={row.orderNumberWithDate}>
                              <td style={{ width: 160, borderRight: 'none' }} align="right">
                                <NavLink to={`/admin/orderdetail/${row.orderId}`} style={{ color: 'black' }}>
                                  {row.orderNumberWithDate}
                                </NavLink>
                              </td>
                              <td className="order-td" align="right">
                                {row.firstName} {row.lastName}
                              </td>
                              <td className="order-td" align="right">
                                {moment(row.deliveryDatetime).format('YYYY-MM-DD')}
                              </td>
                              <td className="order-td" align="right">
                                {Math.trunc(parseFloat(row.totalPrice))}
                              </td>
                              <td className="order-td" align="right">
                                <span
                                  style={{
                                    border: '1px solid #23334C',
                                    borderRadius: '5px',
                                  }}
                                  className="p-1"
                                >
                                  {row.orderStatusType}
                                </span>
                              </td>
                              <td className="order-td1" align="right">
                                <span className="c-pointer active-link" onClick={() => returnedOrder(row.orderId)}>
                                  Returned
                                </span>
                                {/* <br/>
                        <span className='c-pointer'>Cancel</span>  */}
                              </td>
                            </tr>
                          ) : (
                            <span></span>
                          )}
                        </Fragment>
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
                        colSpan={7}
                        count={Delivered.length}
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
            <div className="tab-pane fade" id="pills-cancelled" role="tabpanel" aria-labelledby="pills-cancelled-tab">
              <Root sx={{ minWidth: '900px', width: 500 }}>
                <table aria-label="custom pagination table mt-2" style={{ minWidth: '900px', overFlow: 'scroll' }}>
                  <thead>
                    <tr>
                      <th onClick={() => sorting('orderNo')} style={{ cursor: 'pointer' }}>Order ID</th>
                      <th>Customer</th>
                      <th> Date</th>
                      <th>Order Price</th>
                      <th>Delivery Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0 && searchTerm === '' ? 
                      Canceled.slice(page * rowsPerPage, 
                      page * rowsPerPage + rowsPerPage) : Canceled)
                      .filter((val) => {
                        if (searchTerm === '') {
                          return val;
                        } else if (val.orderNo.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())) {
                          return val;
                        }
                      })
                      .map((row, i) => (
                        <Fragment key={i}>
                          {row.orderStatusType === 'Canceled' ? (
                            <tr key={row.orderNumberWithDate}>
                              <td style={{ width: 160, borderRight: 'none' }} align="right">
                                <NavLink to={`/admin/orderdetail/${row.orderId}`} style={{ color: 'black' }}>
                                  {row.orderNumberWithDate}
                                </NavLink>
                              </td>
                              <td className="order-td" align="right">
                                {row.firstName} {row.lastName}
                              </td>
                              {row.deliveryDatetime === null ? (
                                <td className="order-td" align="right">
                                  Not yet delivered
                                </td>
                              ) : (
                                <td className="order-td" align="right">
                                  {moment(row.deliveryDatetime).format('YYYY-MM-DD')}
                                </td>
                              )}
                              <td className="order-td" align="right">
                                {Math.trunc(parseFloat(row.totalPrice))}
                              </td>
                              <td className="order-td" align="right">
                                {row.orderStatusType === 'Canceled' ? (
                                  <>
                                    {row.orderStatusMappingViewModels.filter((filterData) => filterData.orderStatus === 'Canceled').length !== 0 ? (
                                      <>
                                        {row.orderStatusMappingViewModels
                                          .filter((filterData) => filterData.orderStatus === 'Canceled')
                                          .map((statusMessage, index, {length}) => (
                                            <Fragment key={index}>
                                            {index === length-1?<>
                                              {statusMessage.orderStatus === 'Canceled' ? (
                                                <span style={{ border: '1px solid #23334C', borderRadius: '5px' }} className="p-1">
                                                  {statusMessage.createByRole === 'Admin' ? 'Canceled by System' : 'Canceled by Customer'}
                                                </span>
                                              ) : (
                                                <span style={{ border: '1px solid #23334C', borderRadius: '5px' }} className="p-1">
                                                  Canceled by Customer
                                                </span>
                                              )}
                                              </>:""}
                                            </Fragment>
                                          ))}
                                      </>
                                    ) : (
                                      <span style={{ border: '1px solid #23334C', borderRadius: '5px' }} className="p-1">
                                        Canceled by Customer
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <span style={{ border: '1px solid #23334C', borderRadius: '5px' }} className="p-1">
                                    {row.orderStatusType}
                                  </span>
                                )}
                              </td>
                              <td className="order-td1" align="right"></td>
                            </tr>
                          ) : (
                            <span></span>
                          )}
                        </Fragment>
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
                        colSpan={7}
                        count={Canceled.length}
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
            <div className="tab-pane fade" id="pills-returned" role="tabpanel" aria-labelledby="pills-returned-tab">
              <Root sx={{ minWidth: '900px', width: 500 }}>
                <table aria-label="custom pagination table mt-2" style={{ minWidth: '900px', overFlow: 'scroll' }}>
                  <thead>
                    <tr>
                      <th onClick={() => sorting('orderNo')} style={{ cursor: 'pointer' }}>Order ID</th>
                      <th>Customer</th>
                      <th> Date</th>
                      <th>Order Price</th>
                      <th>Delivery Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0 && searchTerm === '' ? 
                      Returned.slice(page * rowsPerPage, 
                      page * rowsPerPage + rowsPerPage) : Returned)
                      .filter((val) => {
                        if (searchTerm === '') {
                          return val;
                        } else if (val.orderNo.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())) {
                          return val;
                        }
                      })
                      .map((row, i) => (
                        <Fragment key={i}>
                          {row.orderStatusType === 'Returned' ? (
                            <tr key={row.orderNumberWithDate}>
                              <td style={{ width: 160, borderRight: 'none' }} align="right">
                                <NavLink to={`/admin/orderdetail/${row.orderId}`} style={{ color: 'black' }}>
                                  {row.orderNumberWithDate}
                                </NavLink>
                              </td>
                              <td className="order-td" align="right">
                                {row.firstName} {row.lastName}
                              </td>
                              <td className="order-td" align="right">
                                {moment(row.deliveryDatetime).format('YYYY-MM-DD')}
                              </td>
                              <td className="order-td" align="right">
                                {Math.trunc(parseFloat(row.totalPrice))}
                              </td>
                              <td className="order-td" align="right">
                                <span
                                  style={{
                                    border: '1px solid #23334C',
                                    borderRadius: '5px',
                                  }}
                                  className="p-1"
                                >
                                  {row.orderStatusType}
                                </span>
                              </td>
                              <td className="order-td1" align="right"></td>
                            </tr>
                          ) : (
                            <span></span>
                          )}
                        </Fragment>
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
                        colSpan={7}
                        count={Returned.length}
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
            <div className="tab-pane fade" id="pills-faildDelivery" role="tabpanel" aria-labelledby="pills-faildDelivery-tab">
              <Root sx={{ minWidth: '900px', width: 500 }}>
                <table aria-label="custom pagination table mt-2" style={{ minWidth: '900px', overFlow: 'scroll' }}>
                  <thead>
                    <tr>
                      <th onClick={() => sorting('orderNo')} style={{ cursor: 'pointer' }}>Order ID</th>
                      <th>Customer</th>
                      <th> Date</th>
                      <th>Order Price</th>
                      <th>Delivery Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0 && searchTerm === '' ? 
                      FailDelivery.slice(page * rowsPerPage, 
                      page * rowsPerPage + rowsPerPage) : FailDelivery)
                      .filter((val) => {
                        if (searchTerm === '') {
                          return val;
                        } else if (val.orderNo.toString().toLowerCase().includes(searchTerm.toString().toLowerCase())) {
                          return val;
                        }
                      })
                      .map((row, i) => (
                        <Fragment key={i}>
                          {row.orderStatusType === 'FailDelivery' ? (
                            <tr key={row.orderNumberWithDate}>
                              <td style={{ width: 160, borderRight: 'none' }} align="right">
                                <NavLink to={`/admin/orderdetail/${row.orderId}`} style={{ color: 'black' }}>
                                  {row.orderNumberWithDate}
                                </NavLink>
                              </td>
                              <td className="order-td" align="right">
                                {row.firstName} {row.lastName}
                              </td>
                              {row.deliveryDatetime === null ? (
                                <td className="order-td" align="right">
                                  Not yet delivered
                                </td>
                              ) : (
                                <td className="order-td" align="right">
                                  {moment(row.deliveryDatetime).format('YYYY-MM-DD')}
                                </td>
                              )}
                              <td className="order-td" align="right">
                                {Math.trunc(parseFloat(row.totalPrice))}
                              </td>
                              <td className="order-td" align="right">
                                <span
                                  style={{
                                    border: '1px solid #23334C',
                                    borderRadius: '5px',
                                  }}
                                  className="p-1"
                                >
                                  {row.orderStatusType}
                                </span>
                              </td>
                              <td className="order-td1" align="right"></td>
                            </tr>
                          ) : (
                            <span></span>
                          )}
                        </Fragment>
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
                        colSpan={7}
                        count={FailDelivery.length}
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
      {/* add category popup */}
      <div>
        <Modal open={open} onClose={onCloseModal} center>
          <br></br>
          <div className="d-flex justify-content-center">
            <span className="category-popup">Shipped</span>
          </div>
          <form ref={form} className="add-cate-popup" noValidate onSubmit={onFormSubmit}>
            <label className="product-label mt-3">Date \ Time</label>
            <br />
            <input type="datetime-local" id="username" name="username" className="product-input" placeholder="Date \ Time" required onChange={(e) => setExpectedDatetime(e.target.value)} />
            <label className="product-label mt-3">Company Name</label>
            <br />
            <Form.Select onChange={(e) => setShipmentCompany(e.target.value)} defaultValue={'Select'} aria-label="Default select example">
              <option value="Select" disabled hidden>
                Select
              </option>
              <option>M&P</option>
              <option>Movex</option>
              <option>Trax</option>
              <option>Leopard</option>
              <option>TCS</option>
              <option>Pakistan Post</option>
              <option>Asia Cargo</option>
              <option>A2Z Cargo</option>
              <option>Bus Cargo</option>
              <option>Other Cargo</option>
            </Form.Select>
            <label className="product-label mt-3">Tracking No</label>
            <br />
            <input type="text" id="username" name="username" className="product-input" placeholder="Reference No" required onChange={(e) => setReferenceNo(e.target.value)} />
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

export default Orders;
