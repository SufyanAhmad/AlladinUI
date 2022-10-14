
import React from 'react'
import styled from "styled-components";
import "./module.scss"


const Section = styled.section`
margin-left:18vw;
height:100vh;
background-color:#FAFAFA;
`
const Dashboard = () => {
  return (
    <div className="Section">
      <div className='p-5' >
        <div className='dashboard'> Dashboard </div>
        <div className='row'>
            <div className='col-lg-3 col-md-6 col-sm-12 mt-4'>
              <div className='dashboard-card'>
                <div className='revinew-section'>
                   <div className='ravinew p-2'>All-time Revenue</div>
                </div>
                <div className='t-revinew p-4'>RS. 0,000</div>
              </div>
            </div>
            <div className='col-lg-3 col-md-6 col-sm-12 mt-4'>
              <div className='dashboard-card'>
                <div className='revinew-section'>
                   <div className='ravinew p-2'>All-time Profit</div>
                </div>
                <div className='t-revinew p-4'>RS. 0,000</div>
              </div>
            </div>
            <div className='col-lg-3 col-md-6 col-sm-12 mt-4'>
              <div className='dashboard-card'>
                <div className='revinew-section'>
                   <div className='ravinew p-2'>All-time Orders</div>
                </div>
                <div className='t-revinew p-4'>0,000</div>
              </div>
            </div>
            <div className='col-lg-3 col-md-6 col-sm-12 mt-4'>
              <div className='dashboard-card'>
                <div className='revinew-section'>
                   <div className='ravinew p-2'>All-time Visits</div>
                </div>
                <div className='t-revinew p-4'>0,000</div>
              </div>
            </div>
        </div>
        <div className='row'>
          <div className='col-lg-3 col-md-6-col-sm-12 mt-4'>
            <div className='d-flex justify-content-between'>
              <span className='revenue'>Revenue</span>
              <span className='revenue'>Orders</span>
              <span className='revenue'>Visits</span>
            </div>
          </div>
          <div className='col-lg-9 col-md-6 col-sm-12 mt-4'>
            <div className='revenue-date'>
              <div className='date p-1'>12/4/2022</div>
            </div>
          </div>
        </div>
        <hr/>
      </div>
    </div>
  )
}

export default Dashboard