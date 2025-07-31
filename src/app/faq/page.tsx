'use client';

import { gql, useSuspenseQuery } from '@apollo/client';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Container,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

// Default FAQ data
const defaultFAQs = [
  {
    id: '1',
    category: 'Ordering & Customization',
    questions: [
      {
        id: '1-1',
        question: 'How far in advance should I place my order?',
        answer: 'We recommend placing your order at least 3-5 days in advance for custom cakes to allow time for design and preparation. For larger or more complex orders, booking 2-3 weeks ahead is ideal.'
      },
      {
        id: '1-2',
        question: 'Can I customize my cake?',
        answer: 'Absolutely! We specialize in custom cakes. You can choose flavors, fillings, design themes, colors, and decorations. You can also upload reference images to help us understand your vision.'
      },
      {
        id: '1-3',
        question: 'How do I submit my design ideas?',
        answer: 'When placing your order online, you\'ll find an option to upload any images, sketches, or inspirations. You can also add specific notes for colors, themes, and flavors.'
      },
      {
        id: '1-4',
        question: 'Can you accommodate dietary restrictions?',
        answer: 'Yes! We offer gluten-free, vegan, nut-free, and dairy-free options. Please specify any dietary requirements when ordering, and we\'ll ensure your cake meets your needs.'
      },
      {
        id: '1-5',
        question: 'What flavors and fillings do you offer?',
        answer: 'We have a wide range of flavors and fillings, including vanilla, chocolate, red velvet, carrot cake, and many more. Popular fillings include buttercream, cream cheese, chocolate ganache, and fruit preserves. If you have any specific requests, let us know, and we\'ll do our best to accommodate.'
      },
      {
        id: '1-6',
        question: 'Is there a minimum order for custom cakes?',
        answer: 'Our minimum order for custom cakes is typically 6-8 servings. However, smaller sizes may be available for simple designs. Please reach out for specific requirements.'
      }
    ]
  },
  {
    id: '2',
    category: 'Pricing & Payment',
    questions: [
      {
        id: '2-1',
        question: 'How much do custom cakes cost?',
        answer: 'Pricing varies depending on the size, complexity, and level of detail. Our custom cakes start at $30-40 for basic designs. For a detailed quote, please contact us with your specifications.'
      },
      {
        id: '2-2',
        question: 'Do you require a deposit?',
        answer: 'Yes, a 50% deposit is required to secure your order. Full payment is due 2-3 days before delivery or pickup.'
      },
      {
        id: '2-3',
        question: 'What payment methods do you accept?',
        answer: 'We accept major credit/debit cards, PayPal, and other online payment options. We also offer gift cards for future orders!'
      },
      {
        id: '2-4',
        question: 'Are there any extra fees for rush orders?',
        answer: 'Yes, rush orders may incur an additional fee of 15-25%. Please contact us as soon as possible if you need a cake on short notice, and we\'ll do our best to accommodate.'
      }
    ]
  },
  {
    id: '3',
    category: 'Pickup & Delivery',
    questions: [
      {
        id: '3-1',
        question: 'Do you offer delivery?',
        answer: 'Yes, we offer delivery within London, Ontario and surrounding areas. Delivery fees vary based on distance from our bakery. You can also choose to pick up your order from our location.'
      },
      {
        id: '3-2',
        question: 'What if I need to reschedule my delivery?',
        answer: 'We understand that things change! Please notify us at least 24 hours in advance to reschedule your delivery. Last-minute changes may incur a fee.'
      },
      {
        id: '3-3',
        question: 'How do I transport my cake if I\'m picking it up?',
        answer: 'We recommend placing the cake on a flat surface, such as the trunk or the floor of your vehicle, to ensure stability. Avoid direct sunlight and heat to keep the cake fresh.'
      },
      {
        id: '3-4',
        question: 'Can you ship cakes outside of London, Ontario?',
        answer: 'At this time, we only deliver within London, Ontario and surrounding areas. Shipping cakes long distances can affect quality, so we limit our delivery range to maintain freshness.'
      }
    ]
  },
  {
    id: '4',
    category: 'Allergies & Ingredients',
    questions: [
      {
        id: '4-1',
        question: 'Do you use fresh ingredients?',
        answer: 'Yes! We use only high-quality, fresh ingredients in our cakes, including real butter, high-quality chocolate, and fresh fruits.'
      },
      {
        id: '4-2',
        question: 'Can I request allergen-free cakes?',
        answer: 'Yes, we can make allergen-free cakes (e.g., nut-free, dairy-free, gluten-free). However, our bakery does handle allergens, so while we take precautions, we cannot guarantee zero cross-contamination.'
      },
      {
        id: '4-3',
        question: 'Are your cakes made from scratch?',
        answer: 'Yes, every cake is made from scratch in our bakery. We take pride in crafting each layer, filling, and decoration by hand.'
      }
    ]
  },
  {
    id: '5',
    category: 'After-Sale Support',
    questions: [
      {
        id: '5-1',
        question: 'How should I store my cake?',
        answer: 'If you\'re storing the cake overnight, keep it in the fridge and bring it to room temperature about an hour before serving. If it has fondant decorations, avoid refrigerating, as it can affect the look.'
      },
      {
        id: '5-2',
        question: 'Can I freeze leftover cake?',
        answer: 'Yes! Wrap individual slices in plastic wrap and store them in an airtight container in the freezer for up to 3 months. Defrost in the fridge or at room temperature.'
      },
      {
        id: '5-3',
        question: 'What should I do if I\'m not satisfied with my order?',
        answer: 'Your satisfaction is our priority! If you have any concerns, please contact us immediately, and we\'ll work to resolve the issue.'
      }
    ]
  },
  {
    id: '6',
    category: 'Other Common Questions',
    questions: [
      {
        id: '6-1',
        question: 'Do you offer cake tastings?',
        answer: 'Yes! We offer cake tastings for orders over 20 servings. Please schedule a tasting appointment on our website, and choose from a selection of our popular flavors.'
      },
      {
        id: '6-2',
        question: 'Can I order other baked goods from your website?',
        answer: 'Yes, in addition to custom cakes, we offer cupcakes, cookies, and other treats. Check our website for a full menu of items available for order.'
      }
    ]
  }
];

export default function FAQPage() {
  // For now, use static data instead of fetching from backend
  // const { data } = useSuspenseQuery(query, {
  //   fetchPolicy: 'cache-first',
  // });
  // const { faqs } = data as any;

  return (
    <VStack minH="100vh" bg="white">
      {/* Main Content */}
      <Box 
        as="main" 
        flex="1" 
        w="full" 
        py="4rem" 
        px="2rem"
      >
        <Container maxW="800px" mx="auto">
          <VStack spacing="3rem">
            {/* Header */}
            <VStack spacing="1rem" textAlign="center">
              <Heading
                fontSize="3rem"
                fontWeight="600"
                color="#53B7D2"
                fontFamily="Poppins, sans-serif"
              >
                Frequently Asked Questions
              </Heading>
              <Text
                fontSize="1.125rem"
                color="#6B7280"
                maxW="600px"
              >
                Find answers to common questions about our custom cakes, ordering process, and delivery services.
              </Text>
            </VStack>

            {/* FAQ Accordion */}
            <Box
              w="full"
              bg="#FBD4D7"
              borderRadius="1rem"
              p="3rem 2rem"
              boxShadow="0 10px 15px -3px rgba(0, 0, 0, 0.1)"
            >
              <Accordion allowToggle>
                {defaultFAQs.map((category) => (
                  <Box key={category.id} mb="2rem">
                    <Heading
                      fontSize="1.5rem"
                      fontWeight="600"
                      color="#53B7D2"
                      mb="1rem"
                      fontFamily="Poppins, sans-serif"
                    >
                      {category.category}
                    </Heading>
                    {category.questions.map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        border="1px solid #E5E7EB"
                        borderRadius="0.5rem"
                        mb="1rem"
                        _hover={{
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        }}
                      >
                        <AccordionButton
                          py="1.5rem"
                          px="1.5rem"
                          bg="#F9FAFB"
                          _hover={{ bg: "#F3F4F6" }}
                          _expanded={{
                            bg: "#F0F9FF",
                            color: "#5CB8A3"
                          }}
                        >
                          <Box
                            flex="1"
                            textAlign="left"
                            fontSize="1.125rem"
                            fontWeight="600"
                            color="#374151"
                          >
                            {faq.question}
                          </Box>
                          <AccordionIcon
                            color="#7DD3C0"
                            fontSize="1.25rem"
                            fontWeight="bold"
                          />
                        </AccordionButton>
                        <AccordionPanel
                          py="1.5rem"
                          px="1.5rem"
                          fontSize="1rem"
                          color="#6B7280"
                          lineHeight="1.7"
                          borderTop="1px solid #E5E7EB"
                          bg="white"
                        >
                          {faq.answer}
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Box>
                ))}
              </Accordion>
            </Box>

            {/* Contact Section */}
            <Box
              w="full"
              bg="#FBD4D7"
              borderRadius="1rem"
              p="2rem"
              textAlign="center"
            >
              <Heading
                fontSize="1.5rem"
                fontWeight="600"
                color="#53B7D2"
                mb="1rem"
              >
                Still have questions?
              </Heading>
              <Text
                fontSize="1rem"
                color="#6B7280"
                lineHeight="1.6"
                mb="1rem"
              >
                We're here to help! Contact us directly for personalized assistance.
              </Text>
              <Text
                fontSize="1rem"
                color="#6B7280"
                lineHeight="1.6"
              >
                Phone: 226 700 3943 | Email: tiabakery2019@gmail.com
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
    </VStack>
  );
} 