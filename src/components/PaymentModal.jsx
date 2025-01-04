import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/PaymentModal.css'

const PaymentModal = ({ isOpen, onClose, formData }) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(false);
  const [baseAmount, setBaseAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalAmountToBePaid, setTotalAmountToBePaid] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  // Calculate Base Amount and GST (once on mount or when guests change)
  useEffect(() => {
    if (!formData.guests) return;

    // Base Amount Logic
    let base = 0;
    if (formData.guests === 1) {
      base = Math.floor(Math.random() * (2100 - 2000 + 1) + 500);
    } else if (formData.guests >= 2 && formData.guests <= 4) {
      base = Math.floor(Math.random() * (2500 - 2000 + 1) + 2000);
    } else if (formData.guests >= 5 && formData.guests <= 8) {
      base = Math.floor(Math.random() * (3500 - 2400 + 1) + 5000);
    }
    else if (formData.guests > 8 && formData.guests <= 10) {
      base = Math.floor(Math.random() * (4500 - 2400 + 1) + 8000);
    }

    // GST Logic
    const gst = base * (Math.random() * (0.05 - 0.02) + 0.01);

    // Set constant values
    setBaseAmount(base);
    setGstAmount(gst);
    setDiscount(0); // Default no discount
    setTotalAmountToBePaid(base + gst); // Initial total amount
  }, [formData.guests]);

  // Update Total Amount when Coupon Code Changes
  useEffect(() => {
    let discountValue = 0;
    if (couponCode === 'EARLY100') {
      discountValue = 100;
      setAppliedCoupon(true);
      toast.success('Coupon code has been Applied!');
    } else {
      setAppliedCoupon(false);
    }

    setDiscount(discountValue);
    setTotalAmountToBePaid(baseAmount + gstAmount - discountValue);
  }, [couponCode, baseAmount, gstAmount]);

  // Handle Coupon Code Change
  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
  };

  // Handle Payment Method Change
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Handle Form Submit
  const handleSubmit = () => {
    if (paymentMethod) {
      toast.success('Payment Successful!');
      setShowDetails(true);
    } else {
      toast.error('Please select a payment method!');
    }
  };

  // Close Modal
  const handleCancel = () => {
    onClose();
    setShowDetails(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Payment Modal */}
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Payment Details </h2>

          <div className="amount-container">
            <p><strong>Base Amount : </strong>${baseAmount.toFixed(2)}</p>
          </div>

          <p><strong>GST Charges : </strong>${gstAmount.toFixed(2)}</p>

          <div className="coupon-container">
            <label>
              Have a coupon code?
            </label>
            <input
              type="text"
              value={couponCode}
              onChange={handleCouponChange}
              placeholder="Enter coupon code"
            />
            {couponCode ? (
              appliedCoupon ? (
                <p className='coupon-success'>Coupon Code Applied!</p>
              ) : (
                <p className='coupon-error'>Coupon code is not valid.</p>
              )
            ) : null}

            <p><strong>Total Amount to be Paid : </strong>${totalAmountToBePaid.toFixed(2)}</p>
          </div>

          <div className="payment-method-container">
            <label>Payment Method:</label>
            <select onChange={handlePaymentMethodChange}>
              <option value="" hidden>Select Payment Method</option>
              <option value="Gpay">Gpay</option>
              <option value="Paytm">Paytm</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="NetBanking">NetBanking</option>
            </select>
          </div>

          <div className="buttons-container">
            <button onClick={handleSubmit} className="confirm-button">Confirm</button>
            <button onClick={handleCancel} className="cancel-button">Cancel</button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Booking Details</h2>

            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Booking Date:</strong> {new Date(formData.date).toLocaleDateString()}</p>
            <p><strong>Number of Guests:</strong>{formData.guests}</p>
            <p><strong>Time Slot:</strong>{formData.time}</p>
            <p><strong>Amount Paid:</strong> ${totalAmountToBePaid.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> {paymentMethod}</p>
            <p><strong>Transaction ID:</strong> {Math.floor(Math.random() * 10000000000)}</p>
            <p className='details'>The order above has been confirmed, please contact the restaurant to change or cancel your order</p>
            <button className="close-button" onClick={handleCancel}>X</button>
          </div>

        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default PaymentModal;
