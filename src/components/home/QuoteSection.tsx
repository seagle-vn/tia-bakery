'use client';

import { useState } from 'react';
import { useCart } from 'react-use-cart';

export default function QuoteSection() {
  const { items, emptyCart, cartTotal } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    details: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        ...formData,
        items: items.map((item) => ({
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          product_url: item.product_url || '',
        })),
        total: cartTotal,
        orderDate: new Date().toISOString(),
      };

      // Submit to Google Sheets API
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      setIsSuccess(true);
      emptyCart();

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          eventDate: '',
          details: '',
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert('Failed to submit quote. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section
      id="quote"
      style={{
        background: '#41B9D2',
        padding: 'clamp(48px, 7vw, 90px) clamp(20px, 5vw, 56px)',
      }}
    >
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(32px, 5vw, 56px)',
            alignItems: 'start',
          }}
        >
          {/* Left Column - Contact Info */}
          <div style={{ color: 'white' }}>
            <div style={{ marginBottom: '28px' }}>
              <p
                style={{
                  textTransform: 'uppercase',
                  letterSpacing: '2.5px',
                  fontWeight: 700,
                  marginBottom: '12px',
                  fontSize: '13px',
                }}
              >
                GET IN TOUCH
              </p>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  lineHeight: 1.15,
                  fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                  margin: 0,
                }}
              >
                Ready to Order Your Dream Cake?
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Phone */}
              <div>
                <p style={{ fontWeight: 600, marginBottom: '4px', fontSize: '15px' }}>Phone</p>
                <a
                  href="tel:2267003943"
                  style={{
                    color: 'rgba(255, 255, 255, 0.95)',
                    textDecoration: 'none',
                    fontSize: '15px',
                  }}
                >
                  (226) 700-3943
                </a>
              </div>

              {/* Email */}
              <div>
                <p style={{ fontWeight: 600, marginBottom: '4px', fontSize: '15px' }}>Email</p>
                <a
                  href="mailto:Orders@tiabakery.ca"
                  style={{
                    color: 'rgba(255, 255, 255, 0.95)',
                    textDecoration: 'none',
                    fontSize: '15px',
                  }}
                >
                  Orders@tiabakery.ca
                </a>
              </div>

              {/* Location */}
              <div>
                <p style={{ fontWeight: 600, marginBottom: '4px', fontSize: '15px' }}>Location</p>
                <p style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '15px', margin: 0 }}>
                  London, Ontario, Canada
                  <br />
                  Local pickup & delivery available
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div
            style={{
              background: 'white',
              borderRadius: '24px',
              padding: 'clamp(28px, 4vw, 36px)',
              boxShadow: '0 20px 50px -20px rgba(0, 0, 0, 0.25)',
            }}
          >
            {isSuccess ? (
              /* Success State */
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '48px 0',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(65, 185, 210, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <svg
                    style={{ width: '32px', height: '32px', color: '#41B9D2' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#2E9FBE',
                    marginBottom: '8px',
                  }}
                >
                  Thank You!
                </h3>
                <p style={{ color: '#7E6B62', fontSize: '15px' }}>
                  We&apos;ve received your request and will be in touch soon.
                </p>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 600,
                    color: '#2E9FBE',
                    marginBottom: '6px',
                    fontSize: 'clamp(1.5rem, 2vw, 1.75rem)',
                  }}
                >
                  Request a Quote
                </h3>

                {/* Cart Items Summary */}
                {items.length > 0 && (
                  <div style={{ marginBottom: '6px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#7E6B62', marginBottom: '12px' }}>
                      Items in your quote:
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        maxHeight: '192px',
                        overflowY: 'auto',
                      }}
                    >
                      {items.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px',
                            borderRadius: '12px',
                            border: '1px solid #F3DCE3',
                            background: '#FCF8EF',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div>
                              <p style={{ fontWeight: 600, fontSize: '14px', color: '#7E6B62', margin: 0 }}>
                                {item.name}
                              </p>
                              <p style={{ fontSize: '12px', color: '#8A776E', margin: 0 }}>
                                Size: {item.size} × {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p style={{ fontWeight: 700, color: '#41B9D2', margin: 0 }}>${item.price}</p>
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid #F3DCE3',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: '#7E6B62' }}>Estimated Total:</span>
                        <span style={{ fontSize: '20px', fontWeight: 700, color: '#41B9D2' }}>${cartTotal}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#8A776E', marginTop: '4px' }}>
                        Final price may vary based on customization
                      </p>
                    </div>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label htmlFor="name" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#7E6B62', marginBottom: '6px' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #F3DCE3',
                      fontSize: '15px',
                      fontFamily: 'inherit',
                    }}
                    placeholder="Jane Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#7E6B62', marginBottom: '6px' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #F3DCE3',
                      fontSize: '15px',
                      fontFamily: 'inherit',
                    }}
                    placeholder="jane@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#7E6B62', marginBottom: '6px' }}>
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #F3DCE3',
                      fontSize: '15px',
                      fontFamily: 'inherit',
                    }}
                    placeholder="(555) 123-4567"
                  />
                </div>

                {/* Event Date */}
                <div>
                  <label htmlFor="eventDate" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#7E6B62', marginBottom: '6px' }}>
                    Event Date *
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #F3DCE3',
                      fontSize: '15px',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* Details */}
                <div>
                  <label htmlFor="details" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#7E6B62', marginBottom: '6px' }}>
                    Additional Details
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #F3DCE3',
                      fontSize: '15px',
                      fontFamily: 'inherit',
                      resize: 'none',
                    }}
                    placeholder="Tell us about your vision, design ideas, dietary restrictions, etc."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    borderRadius: '14px',
                    border: 'none',
                    background: '#41B9D2',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
