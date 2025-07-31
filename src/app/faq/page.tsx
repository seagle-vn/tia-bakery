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

const query = gql`
  query GetAllFaqs {
    faqs {
      id
      category
      question {
        id 
        question
        answer
      }
  }
  }
`;


export default function FAQPage() {
  const { data } = useSuspenseQuery(query, {
    fetchPolicy: 'cache-first',
  });
  const { faqs } = data as any;

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
                {faqs.map((category: any) => (
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
                    {category.question.map((faq: any) => (
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
                We&apos;re here to help! Contact us directly for personalized assistance.
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