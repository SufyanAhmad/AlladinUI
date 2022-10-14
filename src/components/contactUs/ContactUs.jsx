import React from "react";
import "./contactUs.scss";

function ContactUs() {
  return (
    <>
      <div className="contact_title">Contact</div>
      <div className="contact_container">
        <div className="cantact_form">
          <form>
            <div className="details">
              <div className="input_box ">
                <div>
                  <label htmlFor="f_name l_name" className="labels">
                    Name
                  </label>
                </div>
                <input className="name_field" placeholder="First" style={{width:"45%"}} type="text" id="f_name" />
                
                <input className="name_field" placeholder="Last" style={{width:"45%",marginLeft:"10%"}} type="text" id="l_name" />
                
              </div>

              <div className="input_box">
                <div>
                  <label className="labels" htmlFor="email">
                    E-mail
                  </label>
                </div>
                <input className="input_field" placeholder="Please enter your e-mail" type="email" id="email" />
              </div>
              <div className="input_box">
                <div>
                  <label className="labels" htmlFor="phone_no">
                    Phone No
                  </label>
                </div>
                <input className="input_field" type="tel" id="phone_no" />
              </div>
              <div className="input_box">
                <div>
                  <label className="labels" htmlFor="subject">
                    Subject
                  </label>
                </div>
                <input className="input_field" type="text" id="subject" />
              </div>
              <div className="input_box">
                <div>
                  <label className="labels" htmlFor="message">
                    Message
                  </label>
                </div>
                <div>
                  <textarea  className="input_field" style={{height:"186px"}}  id="message" />
                </div>
                <div className="input_box">
                <div style={{textAlign:"center",marginTop:"20px"}}>
                <button>submit</button>
                </div>
                </div>
              </div>
              
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ContactUs;
