'use client';

import { DeleteIcon } from '@chakra-ui/icons';
import { useRef, useState } from 'react';
import { useCart } from 'react-use-cart';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';

type InspirationPhoto = {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
};

const MAX_INSPIRATION_PHOTO_SIZE = 8 * 1024 * 1024;
const INSPIRATION_PHOTO_MAX_WIDTH = 500;
const INSPIRATION_PHOTO_MAX_HEIGHT = 500;
const INSPIRATION_PHOTO_QUALITY = 0.72;

export default function QuoteSection() {
  const { items, emptyCart, cartTotal, removeItem } = useCart();
  const inspirationPhotoInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    details: '',
  });
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const [inspirationPhoto, setInspirationPhoto] = useState<InspirationPhoto | null>(null);
  const [inspirationPhotoError, setInspirationPhotoError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        ...formData,
        eventDate: eventDate.toISOString().split('T')[0],
        inspirationPhoto,
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
          details: '',
        });
        setEventDate(new Date());
        setInspirationPhoto(null);
        setInspirationPhotoError('');
        if (inspirationPhotoInputRef.current) {
          inspirationPhotoInputRef.current.value = '';
        }
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

  const handleInspirationPhoto = async (file?: File) => {
    setInspirationPhotoError('');

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setInspirationPhoto(null);
      setInspirationPhotoError('Please upload an image file.');
      return;
    }

    if (file.size > MAX_INSPIRATION_PHOTO_SIZE) {
      setInspirationPhoto(null);
      setInspirationPhotoError('Please upload an image smaller than 8 MB.');
      return;
    }

    try {
      const dataUrl = await compressImageToDataUrl(file);
      setInspirationPhoto({
        name: file.name,
        type: 'image/jpeg',
        size: dataUrl.length,
        dataUrl,
      });
    } catch (error) {
      setInspirationPhoto(null);
      setInspirationPhotoError('Unable to read this image. Please try another file.');
    }
  };

  const clearInspirationPhoto = () => {
    setInspirationPhoto(null);
    setInspirationPhotoError('');
    if (inspirationPhotoInputRef.current) {
      inspirationPhotoInputRef.current.value = '';
    }
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <p style={{ fontWeight: 700, color: '#41B9D2', margin: 0 }}>${item.price}</p>
                            <button
                              type="button"
                              aria-label={`Remove ${item.name} from quote`}
                              title="Remove from quote"
                              onClick={() => removeItem(item.id)}
                              style={{
                                width: '32px',
                                height: '32px',
                                border: 'none',
                                borderRadius: '999px',
                                background: 'rgba(126, 107, 98, 0.08)',
                                color: '#7E6B62',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <DeleteIcon aria-hidden="true" boxSize={3.5} />
                            </button>
                          </div>
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
                  <SingleDatepicker
                    name="eventDate"
                    date={eventDate}
                    onDateChange={setEventDate}
                    configs={{
                      dateFormat: 'MM/dd/yyyy',
                    }}
                    propsConfigs={{
                      inputProps: {
                        style: {
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1.5px solid #F3DCE3',
                          fontSize: '15px',
                          fontFamily: 'inherit',
                        },
                      },
                      dayOfMonthBtnProps: {
                        defaultBtnProps: {
                          _hover: {
                            background: '#41B9D2',
                            color: 'white',
                          },
                        },
                        selectedBtnProps: {
                          background: '#41B9D2',
                          color: 'white',
                        },
                        todayBtnProps: {
                          borderColor: '#41B9D2',
                        },
                      },
                      popoverCompProps: {
                        popoverContentProps: {
                          background: 'white',
                          borderColor: '#F3DCE3',
                        },
                      },
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

                {/* Inspiration Photo */}
                <div>
                  <label
                    htmlFor="inspirationPhoto"
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#7E6B62',
                      marginBottom: '8px',
                    }}
                  >
                    Inspiration photo <span style={{ fontWeight: 400, color: '#A68F87' }}>(optional)</span>
                  </label>
                  <input
                    ref={inspirationPhotoInputRef}
                    type="file"
                    id="inspirationPhoto"
                    name="inspirationPhoto"
                    accept="image/*"
                    onChange={(event) => handleInspirationPhoto(event.target.files?.[0])}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="inspirationPhoto"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      handleInspirationPhoto(event.dataTransfer.files?.[0]);
                    }}
                    style={{
                      width: 'min(100%, 360px)',
                      minHeight: '178px',
                      border: '2px dashed #B8B8B8',
                      borderRadius: '18px',
                      background: '#F7F7F7',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      padding: '24px',
                    }}
                  >
                    {inspirationPhoto ? (
                      <div>
                        <div
                          aria-label="Selected inspiration"
                          role="img"
                          style={{
                            width: '88px',
                            height: '88px',
                            borderRadius: '12px',
                            margin: '0 auto 10px',
                            backgroundImage: `url(${inspirationPhoto.dataUrl})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                          }}
                        />
                        <p style={{ margin: '0 0 10px', color: '#6F6560', fontWeight: 600 }}>
                          {inspirationPhoto.name}
                        </p>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            clearInspirationPhoto();
                          }}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#41B9D2',
                            cursor: 'pointer',
                            fontWeight: 700,
                            textDecoration: 'underline',
                          }}
                        >
                          Remove photo
                        </button>
                      </div>
                    ) : (
                      <div style={{ color: '#6F6F6F' }}>
                        <svg
                          aria-hidden="true"
                          width="42"
                          height="42"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#AFAFAF"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ marginBottom: '12px' }}
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                        <p style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 600 }}>
                          Drop a photo of the cake you love
                        </p>
                        <p style={{ margin: 0, fontSize: '14px' }}>
                          or <span style={{ textDecoration: 'underline' }}>browse files</span>
                        </p>
                      </div>
                    )}
                  </label>
                  {inspirationPhotoError ? (
                    <p style={{ color: '#C24D93', fontSize: '12px', margin: '6px 0 0' }}>
                      {inspirationPhotoError}
                    </p>
                  ) : null}
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

function compressImageToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      image.src = reader.result as string;
    };
    reader.onerror = reject;

    image.onload = () => {
      const scale = Math.min(
        INSPIRATION_PHOTO_MAX_WIDTH / image.width,
        INSPIRATION_PHOTO_MAX_HEIGHT / image.height,
        1
      );
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));

      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Unable to prepare image.'));
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', INSPIRATION_PHOTO_QUALITY));
    };
    image.onerror = reject;

    reader.readAsDataURL(file);
  });
}
