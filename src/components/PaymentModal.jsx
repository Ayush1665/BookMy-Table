import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, formData }) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(false);
  const [baseAmount, setBaseAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalAmountToBePaid, setTotalAmountToBePaid] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [transactionId, setTransactionId] = useState(null); // Store Transaction ID

  const detailsRef = useRef(); // Reference to the details modal for PDF generation

  // Generate Transaction ID when the modal opens
  useEffect(() => {
    if (isOpen) {
      setTransactionId(Math.floor(1000000000 + Math.random() * 9000000000)); // Random 10-digit ID
    }
  }, [isOpen]);

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
    } else if (formData.guests > 8 && formData.guests <= 10) {
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

  // Download Booking Details as PDF
  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    
    // Heading: Booking Confirmation in Dark Blue
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(30);
    pdf.setTextColor(0, 51, 102);  // Dark blue color
    pdf.text('Booking Confirmation', 105, 20, { align: 'center' });

    // Contact Info Section (Email, Location, Contact) in Light Grey
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(169, 169, 169);  // Light grey color for contact details
    
    // Contact details
    const contactInfo = [
        'Email: booktable@gmail.com',
        'Location: Bangalore,India',
        'Contact: +91 9999999999'
    ];
    
    const spaceBetween = 65; 
    let y = 30; // Starting Y-coordinate for contact info
    let x = 20;

    contactInfo.forEach((line, index) => {
        // Adjust X-coordinate to place items horizontally with some spacing
        pdf.setTextColor(169, 169, 169); // Light grey for text
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text(line, x, y);
    
        // Update X-coordinate for the next item
        x += spaceBetween;
    });

    // Add a Divider before the Booking Details Section
    pdf.setDrawColor(211, 211, 211);  // Light grey for divider
    pdf.setLineWidth(0.5);
    pdf.line(10, y + 5, 200, y + 5); // Divider line
    
    // Booking Details Section in Dark Blue
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(0, 51, 102);  // Dark blue color for section title
    pdf.text('Booking Details', 20, y + 15);

    // Booking details
    pdf.setTextColor(0,0,0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    const bookingDetails = [
        `Booking Date: ${new Date(formData.date).toLocaleDateString()}`,
        `Guests: ${formData.guests}`,
        `Booking Number: ${transactionId}`,
        `Total Amount: Rs.${totalAmountToBePaid.toFixed(2)}`,
        `Status: Confirmed`
    ];
    
    let bookingDetailsY = y + 25;  // Start Y-coordinate for booking details
    bookingDetails.forEach((line) => {
      if (line.startsWith('Status:')) {
        
        pdf.setTextColor(34, 139, 34);
        pdf.setFont('helvetica','bold');
    } else {
        pdf.setTextColor(0, 0, 0); // Black color for other lines
    }
        pdf.text(line, 20, bookingDetailsY);
        bookingDetailsY += 10;
    });

    // Add a Divider before the Payment Details Section
    pdf.setDrawColor(211, 211, 211);  // Light grey color for line
    pdf.setLineWidth(0.5);
    pdf.line(10, bookingDetailsY + 5, 200, bookingDetailsY + 5);

    // Payment Details Section in Dark Blue
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(0, 51, 102);  // Dark blue color for section title
    pdf.text('Payment Details', 20, bookingDetailsY + 15);

    // Payment details
    pdf.setTextColor(0,0,0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    const paymentDetails = [
        `Payment ID: ${transactionId}`,
        `Payment Method: ${paymentMethod}`,
        `Payment Date: ${new Date().toLocaleDateString()}`,  // Current date for payment
        `Payment Time: ${new Date().toLocaleTimeString()}` 
    ];

    let paymentDetailsY = bookingDetailsY + 25;  // Start Y-coordinate for payment details
    paymentDetails.forEach((line, index) => {
        // Bold the total amount
        
            pdf.setFont('helvetica', 'normal');
        pdf.text(line, 20, paymentDetailsY);
        paymentDetailsY += 10;
    });

    // Add a Divider before the Footer
    pdf.setDrawColor(211, 211, 211);  // Light grey color for footer line
    pdf.setLineWidth(0.5);
    pdf.line(10, paymentDetailsY + 5, 200, paymentDetailsY + 5);

    // Footer Message in Italic Grey
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(11);
    pdf.setTextColor(169, 169, 169);  // Light grey color for footer
    pdf.text(
        'The order above has been confirmed. Please contact the restaurant for changes or cancellations.',
        20,
        paymentDetailsY + 15,
        { maxHeight: 50 },
        { maxWidth: 170 } // Wrap text to fit within the page
    );

    // Save the PDF
    pdf.save('BookingDetails.pdf');
};



  if (!isOpen) return null;

  return (
    <>
      {/* Payment Modal */}
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Payment Details</h2>

          <div className="amount-container">
            <p>
              <strong>Base Amount: </strong>₹ {baseAmount.toFixed(2)}
            </p>
          </div>

          <p>
            <strong>GST Charges: </strong>₹ {gstAmount.toFixed(2)}
          </p>

          <div className="coupon-container">
            <label>Have a coupon code?</label>
            <input
              type="text"
              value={couponCode}
              onChange={handleCouponChange}
              placeholder="Enter coupon code"
            />
            {couponCode ? (
              appliedCoupon ? (
                <p className="coupon-success">Coupon Code Applied!</p>
              ) : (
                <p className="coupon-error">Coupon code is not valid.</p>
              )
            ) : null}

            <p>
              <strong>Total Amount to be Paid: </strong>₹ {totalAmountToBePaid.toFixed(2)}
            </p>
          </div>

          <div className="payment-method-container">
            <label>Payment Method:</label>
            <select onChange={handlePaymentMethodChange}>
              <option value="" hidden>
                Select Payment Method
              </option>
              <option value="Gpay">Gpay</option>
              <option value="Paytm">Paytm</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="NetBanking">NetBanking</option>
            </select>
          </div>

          <div className="buttons-container">
            <button onClick={handleSubmit} className="confirm-button">
              Confirm
            </button>
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="modal-overlay">
          <div className="modal-content" ref={detailsRef}>
            <h2>Booking Details</h2>

            <p>
              <strong>Name:</strong> {formData.name}
            </p>
            <p>
              <strong>Booking Date:</strong> {new Date(formData.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Number of Guests:</strong> {formData.guests}
            </p>
            <p>
              <strong>Time Slot:</strong> {formData.time}
            </p>
            <p>
              <strong>Amount Paid:</strong> ₹ {totalAmountToBePaid.toFixed(2)}
            </p>
            <p>
              <strong>Payment Method:</strong> {paymentMethod}
            </p>
            <p>
              <strong>Transaction ID:</strong> {transactionId}
            </p>
            <p className="details">
              The order above has been confirmed, please contact the restaurant to change or cancel your order.
            </p>
            <button onClick={handleDownloadPDF} className="confirm-button">
              Download PDF
            </button>
            <button className="close-button" onClick={handleCancel}>
              X
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default PaymentModal;
