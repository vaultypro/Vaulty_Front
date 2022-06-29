import React, { useEffect, useState } from "react";

function CounterComponent(props) {
  const [CounterValue, setCounterValue] = useState("");
  const [second, setSecond] = useState("00");

  const [minute, setMinute] = useState(0);
  const [hour, setHour] = useState(0);
  const [day, setDay] = useState(0);
  const setTime = props.endDate;

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
    <div
      className="flex justify-evenly my-[20px]"
      style={{
        padding: 10,
        background: "rgba(255, 255, 255, 0.05 )",
        borderRadius: "16px",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(1.5px)",
        webkitBackdropFilter: "blur(1.5px)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
      }}
    >
      <div className="flex flex-col">
        <span
          className="font-bold text"
          style={{ fontSize: 14, textAlign: "center" }}
        >
          {day}
        </span>
        <span className="text-[9px]" style={{ fontSize: 14 }}>
          Days
        </span>
      </div>
      <div className="flex flex-col">
        <span
          className="font-bold "
          style={{ fontSize: 14, textAlign: "center" }}
        >
          {hour}
        </span>
        <span className="text-[9px]" style={{ fontSize: 14 }}>
          Hours
        </span>
      </div>
      <div className="flex flex-col">
        <span
          className="font-bold "
          style={{ fontSize: 14, textAlign: "center" }}
        >
          {minute}
        </span>
        <span className="text-[9px]" style={{ fontSize: 14 }}>
          Minute
        </span>
      </div>
      <div className="flex flex-col">
        <span
          className="font-bold "
          style={{ fontSize: 14, textAlign: "center" }}
        >
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
