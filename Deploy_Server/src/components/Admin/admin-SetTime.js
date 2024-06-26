import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Adminmenu from "./admin-menu";
import UserAdmin from '../../list/userIAdmin';

export default function AdminSetTime() {
  const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimes, setSelectedTimes] = useState([]);
  const timeSlots = [
    { id: "time1", display: "8:00 - 10:00" },
    { id: "time2", display: "11:00 - 13:00" },
    { id: "time3", display: "14:00 - 16:00" },
    { id: "time4", display: "17:00 - 19:00" }
  ];

  useEffect(() => {
    console.log("Ngày đã chọn:", moment(selectedDate).format('YYYY-MM-DD'));
    console.log("Các khung thời gian đã chọn:");
    selectedTimes.forEach(id => {
      console.log(`${id}: "${getTimeDisplay(id)}"`);
    });
  }, [selectedDate, selectedTimes]);

  const getTimeDisplay = (id) => {
    switch (id) {
      case "time1":
        return "8:00 - 10:00";
      case "time2":
        return "11:00 - 13:00";
      case "time3":
        return "14:00 - 16:00";
      case "time4":
        return "17:00 - 19:00";
      default:
        return "";
    }
  };

  const handleSubmit = async () => {
    try {
      const requestData = {
        date: moment(selectedDate).format('YYYY-MM-DD'),
        ...selectedTimes.reduce((acc, id) => {
          acc[id] = getTimeDisplay(id);
          return acc;
        }, {})
      };
      console.log("Data sent:", requestData);
      const response = await axios.post('http://swprealestatev2-001-site1.etempurl.com/api/ReservationTime/CreateReservationTimeByAdmin', requestData);
      console.log(response.data);
      toast.success('Set lịch thành công!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Đã xảy ra lỗi khi gửi thông tin.');
    }
  };

  const handleTimeClick = (time) => {
    const index = selectedTimes.indexOf(time);
    if (index !== -1) {
      setSelectedTimes(selectedTimes.filter(selectedTime => selectedTime !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  return (
    <>
      <div className="admin-all-account">
        <Adminmenu
          userLoginBasicInformationDto={userLoginBasicInformationDto}
          UserMenu={UserAdmin}
        />
        <div>
          <h2 style={{ marginTop: '10px',fontWeight: "500"}}>TÙY CHỈNH THỜI GIAN ĐẶT LỊCH</h2>
          <div className="datepicker-container">
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
            />
          
          <div className="time-buttons">
            {timeSlots.map(slot => (
              <button
                key={slot.id}
                className={selectedTimes.includes(slot.id) ? "selected" : ""}
                onClick={() => handleTimeClick(slot.id)}
              >
                {slot.display}
              </button>
            ))}
          </div>
          </div>
          <button onClick={handleSubmit} style={{marginTop: '10px' ,backgroundColor: '#359950', borderRadius: '8px'}}>Xác nhận</button>
        </div></div>
      <ToastContainer />
    </>
  );
}
