'use client';

import { useState } from 'react';

interface Question {
  question: string;
  answer: string;
}

interface FAQ {
  id: string;
  category: string;
  question: Question[];
}

interface FAQSectionProps {
  faqs: FAQ[];
}

interface FlattenedFAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (faqId: string) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  const flattenedFaqs: FlattenedFAQ[] = faqs.flatMap((faq) =>
    faq.question.map((q, index) => ({
      id: `${faq.id}-${index}`,
      category: faq.category,
      question: q.question,
      answer: q.answer,
    }))
  );

  const groupedByCategory = flattenedFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FlattenedFAQ[]>);

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
      {flattenedFaqs.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#7E6B62', fontSize: '16px' }}>
          No FAQs available yet. Check back soon!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {Object.entries(groupedByCategory).map(([category, categoryFaqs]) => (
            <div key={category}>
              {/* Category Header */}
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
                  color: '#2E9FBE',
                  marginBottom: '16px',
                  marginTop: 0,
                }}
              >
                {category}
              </h3>

              {/* Questions in this category */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {categoryFaqs.map((faq) => {
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
                              whiteSpace: 'pre-wrap',
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
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
