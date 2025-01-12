import React, { useState, useEffect } from 'react';
import PaymentModal from './PaymentModal'; // Import the PaymentModal
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/EventModal.css";

const EventModal = ({ event, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    guests: '',
    occasion: ''
  });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // State to manage Payment Modal visibility

  useEffect(() => {
    if (event) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [event]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for the fade-out transition to finish before calling onClose
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.guests > 10) {
      toast.error(`No booking for ${formData.guests} members!`);
      return;
    }
    setIsPaymentModalOpen(true); // Open the payment modal upon form submission
  };

  const handleCancel = () => {
    setIsPaymentModalOpen(false); // Close the payment modal
    toast.error('Your booking has been cancelled!');
  };

  const generateNext10Days = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);

      // Format date as dd/mm/yyyy
      const day = String(nextDate.getDate()).padStart(2, '0');
      const month = String(nextDate.getMonth() + 1).padStart(2, '0');
      const year = nextDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      dates.push(formattedDate);
    }
    return dates;
  };

  const timeOptions = [
    "07:30 p.m", "08:00 p.m", "08:30 p.m", "09:00 p.m", "09:30 p.m", "10:00 p.m", "10:30 p.m", "11:00 p.m"
  ];

  if (!event && !isVisible) return null; // Return null if no event is selected and not visible

  return (
    <>
      {/* Background overlay with blur */}
      <div className={`backdrop ${isVisible ? 'blur-in' : 'blur-out'}`}></div>

      {/* Modal Overlay */}
      <div className={`modal-overlay ${isVisible ? 'fade-in' : 'fade-out'}`} onClick={handleClose}>
        <button className="close-button" onClick={handleClose}>✖</button> {/* Close button outside the modal */}
        <div className={`modal-content ${isVisible ? 'scale-in' : 'scale-out'}`} onClick={(e) => e.stopPropagation()}>
          <div className="modal-container">
            <h2 className="modal-name">{event.name}</h2>
            
            {/* Form inside the modal */}
            <form className="event-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Enter your Name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="date">Date of Booking*</label>
                <select
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" hidden>Select Date</option>
                  {generateNext10Days().map((date, index) => (
                    <option key={index} value={date}>{date}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="time"> Time Slot*</label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" hidden>Select Time</option>
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="guests">No. of Guests*</label>
                <input
                  type="number"
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="occasion">Occasion (Optional) </label>
                <select
                  id="occasion"
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleInputChange}
                >
                  <option value="" hidden>Select Occasion</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Reunion">Reunion</option>
                  <option value="Date">Date</option>
                  <option value="Business">Business</option>
                  <option value="Celebration">Celebration</option>
                </select>
              </div>

              <div className="buttons-container">
                <button type="submit" className="confirm-button">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleCancel} // Handle cancel action
        formData={formData}
        onConfirm={() => {
          toast.success('Your booking has been confirmed!');
          setIsPaymentModalOpen(false); // Close Payment Modal
        }} // Handle confirm action to show the payment details
      />

      <ToastContainer />
    </>
  );
};

export default EventModal;
