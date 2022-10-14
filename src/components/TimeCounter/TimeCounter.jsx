
import React, {useEffect,useState, useRef } from "react";
import { FetchUrl } from "../../requestMethod"

const TimeCounter = () => {
    const [saleProductDate, setSaleProductdate] = useState('');
    const componentMounted = useRef(true);

    useEffect(() => {
        let item = {
          getTopProducts: 'true',
        }
        fetch(FetchUrl + `Home/get-onsale-products`, item).then(
          (result) => {
              if(componentMounted.current){
                result.json().then((resp) => {
                  setSaleProductdate(resp.data)
                });
              }
            }
        );
        return () =>{
          componentMounted.current = false
        }
      }, []);
      const calculateTimeLeft = () => {
        //let year = new Date().getFullYear();
        let difference = +new Date(saleProductDate.discountEnd) - (+new Date());
    
        let timeLeft = {};
    
        if (difference > 0) {
          timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
          };
        }
    
        return timeLeft;
      }
      const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
      useEffect(() => {
        const timer = setTimeout(() => {
          setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
      });
      const timerComponents = [];
      Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval]) {
          return;
        }
    
        timerComponents.push(
          <span key={interval}>
             {timeLeft[interval]}  {"  :"}
          </span>
        );
      });
  return (
    <button  className="d-inline discount-time-btn" style={{ width: "auto", height: "20px",padding:"3px" }}>
        <span className="timer">
           {timerComponents.length ? timerComponents : <span>Sale time</span>}
        </span>
    </button>
  )
}

export default TimeCounter