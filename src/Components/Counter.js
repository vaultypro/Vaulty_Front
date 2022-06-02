import React, { useEffect, useState } from "react";

function CounterComponent(props) {
  const [CounterValue, setCounterValue] = useState("");
  const [second, setSecond] = useState("00");

  const [minute, setMinute] = useState(0);
  const [hour, setHour] = useState(0);
  const [day, setDay] = useState(0);
  const setTime = props.endDate;
  console.log(setTime);

  useEffect(() => {
    function counter() {
      timeBetweenDates(setTime);
      setCounterValue(CounterValue + 1);
    }

    function timeBetweenDates(toDate) {
      var now = new Date();

      var difference = setTime - parseInt(now.getTime() / 1000);
      if (difference <= 0) {
        // Timer done
        clearInterval();
      } else {
        var seconds = Math.floor(difference);
        var minutes = Math.floor(difference / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);

        hours %= 24;
        minutes %= 60;
        seconds %= 60;

        setSecond(seconds);
        setMinute(minutes);
        setHour(hours);
        setDay(days);
      }
    }
    setTimeout(() => {
      counter();
    }, 1000);
  }, [CounterValue]);

  return (
    <div className="flex justify-between my-[20px]">
      <div className="flex flex-col">
        <span className="font-bold text" style={{ fontSize: 14 }}>
          {day}
        </span>
        <span className="text-[9px]" style={{ fontSize: 14 }}>
          Days
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold " style={{ fontSize: 14 }}>
          {hour}
        </span>
        <span className="text-[9px]" style={{ fontSize: 14 }}>
          Hours
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold " style={{ fontSize: 14 }}>
          {minute}
        </span>
        <span className="text-[9px]" style={{ fontSize: 14 }}>
          Minute
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold " style={{ fontSize: 14 }}>
          {second}
        </span>
        <span className="text-[9px]" style={{ fontSize: 14 }}>
          Seconds
        </span>
      </div>
    </div>
  );
}

export default CounterComponent;
