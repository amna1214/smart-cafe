import { useState } from "react";
import { useCart } from "../context/CartContext";
import "../style.css";

export default function SideCart() {
  const { cart, increase, decrease, removeFromCart, clearCart, isCartOpen, setIsCartOpen } = useCart();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: ""
  });
  const [paymentForm, setPaymentForm] = useState({
    tableNumber: "1",
    name: "",
    phone: "+92",
    transactionId: ""
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isCartOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handlePaymentChange = (e) => {
    setPaymentForm({ ...paymentForm, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleCardChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith("+92")) value = "+92";
    let digits = value.slice(3).replace(/[^0-9]/g, "").slice(0, 10);
    setPaymentForm({ ...paymentForm, phone: "+92" + digits });
    if (errors.phone) {
      setErrors({ ...errors, phone: "" });
    }
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, "").replace(/[^0-9]/g, "").slice(0, 16);
    let formatted = value.replace(/(.{4})/g, "$1 ").trim();
    setCardDetails({ ...cardDetails, cardNumber: formatted });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setCardDetails({ ...cardDetails, expiry: value });
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "").slice(0, 3);
    setCardDetails({ ...cardDetails, cvv: value });
  };

  // ✅ VALIDATION FUNCTION (FIXED)
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!paymentForm.name.trim()) {
      newErrors.name = "Please enter your name";
    }

    // ✅ Phone validation - 9 digits minimum
    const phoneDigits = paymentForm.phone.replace("+92", "");
    if (phoneDigits === "") {
      newErrors.phone = "Phone number is required";
    } else if (phoneDigits.length < 9) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Transaction ID validation (for JazzCash/EasyPaisa)
    if (paymentMethod !== 'card' && !paymentForm.transactionId.trim()) {
      newErrors.transactionId = "Please enter Transaction ID";
    }

    // Card validation
    if (paymentMethod === 'card') {
      if (cardDetails.cardNumber.replace(/\s/g, "").length < 16) {
        newErrors.cardNumber = "Please enter valid 16-digit card number";
      }
      if (cardDetails.expiry.length < 5) {
        newErrors.expiry = "Please enter valid expiry (MM/YY)";
      }
      if (cardDetails.cvv.length < 3) {
        newErrors.cvv = "Please enter valid CVV";
      }
      if (!cardDetails.cardName.trim()) {
        newErrors.cardName = "Please enter card holder name";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    // ✅ Validate first
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    setPaymentSuccess(true);
    
    console.log("Payment Data:", {
      ...paymentForm,
      cardDetails: paymentMethod === 'card' ? cardDetails : null,
      items: cart,
      total: total,
      method: paymentMethod
    });
  };

  const handleDone = () => {
    clearCart();
    setShowPayment(false);
    setPaymentMethod("");
    setPaymentSuccess(false);
    setPaymentForm({ tableNumber: "1", name: "", phone: "+92", transactionId: "" });
    setCardDetails({ cardNumber: "", expiry: "", cvv: "", cardName: "" });
    setErrors({});
    setIsCartOpen(false);
  };

  return (
    <div className="side-cart">
      {/* Close Button */}
      <button onClick={() => setIsCartOpen(false)} className="side-cart-close">
        ✕ Close
      </button>

      {!showPayment ? (
        <>
          <h2>YOUR ORDER</h2>

          {cart.length === 0 ? (
            <p className="empty-cart">No items in cart</p>
          ) : (
            <>
              {cart.map((item, i) => (
                <div key={i} className="side-item">
                  <p className="side-item-name">{item.name}</p>
                  
                  {item.options && Object.entries(item.options).map(([key, value]) => 
                    value ? (
                      <p key={key} className="side-item-option">
                        {key}: {value}
                      </p>
                    ) : null
                  )}
                  
                  <p className="side-item-price">Rs. {item.price}</p>

                  <div className="qty-box">
                    {item.qty > 1 ? (
                      <button onClick={() => decrease(i)}>−</button>
                    ) : (
                      <button onClick={() => removeFromCart(i)} className="delete-btn">
                        🗑️
                      </button>
                    )}
                    <span>{item.qty}</span>
                    <button onClick={() => increase(i)}>+</button>
                  </div>
                </div>
              ))}

              <h3>Total: Rs. {total}</h3>

              <button 
                className="proceed-pay-btn"
                onClick={() => setShowPayment(true)}
              >
                PROCEED TO PAY 💳
              </button>
            </>
          )}
        </>
      ) : (
        <>
          {!paymentSuccess ? (
            <>
              <h2>PAYMENT</h2>
              
              <button onClick={() => setShowPayment(false)} className="back-btn">
                ← Back to Cart
              </button>

              <div className="payment-order-summary">
                <h4>Order Summary</h4>
                {cart.map((item, i) => (
                  <div key={i} className="payment-summary-item">
                    <span>{item.qty}x {item.name}</span>
                    <span>Rs. {item.price * item.qty}</span>
                  </div>
                ))}
                <div className="payment-summary-total">
                  <strong>TOTAL: Rs. {total}</strong>
                </div>
              </div>

              <h4 className="payment-method-title">SELECT PAYMENT METHOD</h4>
              <div className="payment-methods-grid">
                
                <div 
                  className={`payment-method-card ${paymentMethod === 'jazzcash' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('jazzcash')}
                >
                  <img src="/images/jazzcash.png" alt="JazzCash" className="payment-method-img" />
                  {paymentMethod === 'jazzcash' && <span className="check-mark">✓</span>}
                </div>
                
                <div 
                  className={`payment-method-card ${paymentMethod === 'easypaisa' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('easypaisa')}
                >
                  <img src="/images/easypaisa.png" alt="EasyPaisa" className="payment-method-img" />
                  {paymentMethod === 'easypaisa' && <span className="check-mark">✓</span>}
                </div>
                
                <div 
                  className={`payment-method-card ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <img src="/images/card.png" alt="Card Payment" className="payment-method-img" />
                  {paymentMethod === 'card' && <span className="check-mark">✓</span>}
                </div>
              </div>

              {paymentMethod && (
                <form className="payment-side-form" onSubmit={handlePaymentSubmit}>
                  <select 
                    name="tableNumber" 
                    value={paymentForm.tableNumber}
                    onChange={handlePaymentChange}
                    required
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <option key={n} value={n}>Table {n}</option>
                    ))}
                  </select>

                  {/* Name with Error */}
                  <div className="input-group">
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Your Name" 
                      value={paymentForm.name} 
                      onChange={handlePaymentChange} 
                      required 
                      className={errors.name ? 'input-error' : ''}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  {/* Phone with Error */}
                  <div className="input-group">
                    <input 
                      type="text" 
                      value={paymentForm.phone} 
                      onChange={handlePhoneChange} 
                      placeholder="+923001234567" 
                      required 
                      className={errors.phone ? 'input-error' : ''}
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="card-details-form">
                      <div className="card-preview">
                        <div className="card-brand">💳</div>
                        <div className="card-number-display">{cardDetails.cardNumber || "XXXX XXXX XXXX XXXX"}</div>
                        <div className="card-info-row">
                          <div><small>CARD HOLDER</small><p>{cardDetails.cardName || "YOUR NAME"}</p></div>
                          <div><small>EXPIRES</small><p>{cardDetails.expiry || "MM/YY"}</p></div>
                        </div>
                      </div>

                      <div className="input-group">
                        <input type="text" name="cardNumber" placeholder="Card Number" value={cardDetails.cardNumber} onChange={handleCardNumberChange} maxLength="19" required className={errors.cardNumber ? 'input-error' : ''} />
                        {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                      </div>
                      <div className="card-row">
                        <div className="input-group">
                          <input type="text" name="expiry" placeholder="MM/YY" value={cardDetails.expiry} onChange={handleExpiryChange} maxLength="5" required className={errors.expiry ? 'input-error' : ''} />
                          {errors.expiry && <span className="error-text">{errors.expiry}</span>}
                        </div>
                        <div className="input-group">
                          <input type="text" name="cvv" placeholder="CVV" value={cardDetails.cvv} onChange={handleCvvChange} maxLength="3" required className={errors.cvv ? 'input-error' : ''} />
                          {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                        </div>
                      </div>
                      <div className="input-group">
                        <input type="text" name="cardName" placeholder="Card Holder Name" value={cardDetails.cardName} onChange={handleCardChange} required className={errors.cardName ? 'input-error' : ''} />
                        {errors.cardName && <span className="error-text">{errors.cardName}</span>}
                      </div>
                    </div>
                  )}

                  {paymentMethod !== 'card' && (
                    <>
                      {/* Transaction ID with Error */}
                      <div className="input-group">
                        <input 
                          type="text" 
                          name="transactionId" 
                          placeholder="Transaction ID (TID)" 
                          value={paymentForm.transactionId} 
                          onChange={handlePaymentChange} 
                          required 
                          className={errors.transactionId ? 'input-error' : ''}
                        />
                        {errors.transactionId && <span className="error-text">{errors.transactionId}</span>}
                      </div>
                      
                      <div className="payment-instructions-box">
                        <p>📱 Send <strong>Rs. {total}</strong> to:</p>
                        {paymentMethod === 'jazzcash' && <p><strong>JazzCash:</strong> 0300-1234567</p>}
                        {paymentMethod === 'easypaisa' && <p><strong>EasyPaisa:</strong> 0300-1234567</p>}
                        <p>Account Name: <strong>Smart Cafe</strong></p>
                        <p className="payment-note">⚠️ Enter TID after payment</p>
                      </div>
                    </>
                  )}

                  <button type="submit" className="confirm-pay-btn">
                    {paymentMethod === 'card' ? 'PAY Rs. ' + total : 'CONFIRM PAYMENT'}
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="payment-success-box">
              <span className="success-big-icon">✅</span>
              <h2>Payment Confirmed!</h2>
              <div className="success-details">
                <p><strong>Table:</strong> {paymentForm.tableNumber}</p>
                <p><strong>Total:</strong> Rs. {total}</p>
                <p><strong>Method:</strong> {paymentMethod === 'jazzcash' ? 'JazzCash' : paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'Card Payment'}</p>
              </div>
              <p className="success-message-text">
                Your order has been sent to the kitchen. It will be served shortly! 🍽️
              </p>
              <button onClick={handleDone} className="done-btn">
                DONE
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}