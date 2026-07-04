'use client';

import { useState } from 'react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    id: '1',
    question: 'How far in advance should I order my cake?',
    answer:
      'We recommend ordering at least 2-3 weeks in advance, especially for custom designs and wedding cakes. However, we can sometimes accommodate last-minute orders depending on our schedule.',
  },
  {
    id: '2',
    question: 'Do you offer delivery?',
    answer:
      'Yes! We offer local delivery within a 5-mile radius of our London location. Delivery fees vary based on distance and cake size.',
  },
  {
    id: '3',
    question: 'Can I schedule a tasting?',
    answer:
      'Absolutely! We offer tasting sessions for wedding and custom cake orders. Contact us to schedule an appointment.',
  },
  {
    id: '4',
    question: 'What flavors do you offer?',
    answer:
      'We offer a wide variety of cake flavors including vanilla, chocolate, red velvet, lemon, and seasonal specialties. Frosting options include buttercream, cream cheese, and fondant.',
  },
  {
    id: '5',
    question: 'Do you accommodate dietary restrictions?',
    answer:
      'Yes, we can create gluten-free and vegan options for many of our cakes. Please let us know your dietary needs when ordering.',
  },
  {
    id: '6',
    question: 'What is your cancellation policy?',
    answer:
      'Cancellations must be made at least 48 hours before pickup/delivery for a full refund. Orders cancelled within 48 hours are subject to a 50% cancellation fee.',
  },
];

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (faqId: string) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  return (
    <section
      id="faq"
      style={{
        maxWidth: '1160px',
        margin: '0 auto',
        padding: 'clamp(48px, 7vw, 90px) clamp(20px, 5vw, 56px)',
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 4vw, 48px)' }}>
        <div
          style={{
            fontSize: '13px',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            color: '#41B9D2',
            fontWeight: 700,
            marginBottom: '12px',
          }}
        >
          FAQ
        </div>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            fontSize: 'clamp(2rem, 4.5vw, 3rem)',
            margin: 0,
            lineHeight: 1.1,
            color: '#2E9FBE',
          }}
        >
          Frequently Asked Questions
        </h2>
      </div>

      {/* FAQ Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {FAQS.map((faq) => {
          const isOpen = openFaq === faq.id;

          return (
            <div
              key={faq.id}
              style={{
                background: '#FCF8EF',
                border: '1.5px solid #F3DCE3',
                borderRadius: '18px',
                overflow: 'hidden',
              }}
            >
              {/* Question */}
              <button
                onClick={() => toggleFaq(faq.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 24px',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    color: '#7E6B62',
                    paddingRight: '16px',
                    fontSize: 'clamp(15px, 1.1vw, 16.5px)',
                  }}
                >
                  {faq.question}
                </span>
                <svg
                  style={{
                    flexShrink: 0,
                    width: '22px',
                    height: '22px',
                    color: '#41B9D2',
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>

              {/* Answer */}
              {isOpen && (
                <div style={{ padding: '0 24px 20px 24px' }}>
                  <p
                    style={{
                      color: '#8A776E',
                      lineHeight: 1.65,
                      fontSize: '15px',
                      margin: 0,
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
