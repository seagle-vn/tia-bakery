'use client';

import { gql, useSuspenseQuery } from '@apollo/client';
import { Box, Container, Grid, Heading, Image, Text, VStack, HStack, Badge, Avatar } from '@chakra-ui/react';

const query = gql`
  query BlogPosts {
    blogPosts {
      id
      title
      excerpt
      date
      readTime
      image
    }
  }
`;

export default function SharingPage() {
  const { data } = useSuspenseQuery(query, {
    fetchPolicy: 'cache-first',
  });

  const { blogPosts } = data as any;
  return (
    <VStack minH="100vh" bg="white">
      {/* Banner Image */}
      <Box w="full" h="400px" position="relative">
        <Image
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop"
          alt="Tia's Bakery Kitchen"
          w="full"
          h="full"
          objectFit="cover"
        />
      </Box>

      {/* Main Content */}
      <Box as="main" flex="1" w="full" py="4rem" px="2rem" bg="white">
        <Container maxW="1000px" mx="auto">
          <VStack spacing="3rem">
            {/* Header */}
            <VStack spacing="1rem" textAlign="center" w="full">
              <Heading
                fontSize="2.5rem"
                fontWeight="600"
                color="#53B7D2"
                fontFamily="poppins"
                textAlign="center"
              >
                Latest Posts
              </Heading>
              <Text
                fontSize="1.125rem"
                color="#6B7280"
                maxW="600px"
                fontFamily="poppins"
                textAlign="center"
              >
                Discover baking tips, behind-the-scenes stories, and creative inspiration from my kitchen
              </Text>
            </VStack>

            {/* Blog Grid */}
            <VStack spacing="2rem" w="full">
              {blogPosts?.map((post: any) => (
                <Box
                  key={post.id}
                  w="full"
                  bg="white"
                  borderRadius="1rem"
                  boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  overflow="hidden"
                  transition="all 0.3s ease"
                  cursor="pointer"
                  _hover={{
                    transform: "translateY(-4px)",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                  }}
                  onClick={() => console.log(`Opening blog post ${post.id}`)}
                >
                  <Grid
                    templateColumns={{ base: "1fr", md: "300px 1fr" }}
                    w="full"
                  >
                    {/* Image Section */}
                    <Box position="relative">
                      <Image
                        src={post.image.url}
                        alt={post.title}
                        w={{ base: "full", md: "300px" }}
                        h="200px"
                        objectFit="cover"
                      />
                    </Box>

                    {/* Content Section */}
                    <Box p="1.5rem 2rem" display="flex" flexDirection="column" justifyContent="space-between">
                      <Box>
                        <Heading
                          fontSize="1.5rem"
                          fontWeight="600"
                          color="#374151"
                          mb="0.5rem"
                          lineHeight="1.4"
                          transition="color 0.2s"
                          _groupHover={{ color: "#53B7D2" }}
                          fontFamily="poppins"
                        >
                          {post.title}
                        </Heading>
                        
                        {/* Meta Information */}
                        <HStack spacing="1rem" mb="1rem" fontSize="0.875rem" color="#6B7280" fontFamily="poppins">
                          <HStack spacing="0.5rem">
                            <Avatar
                              size="sm"
                              bg="linear-gradient(135deg, #7DD3C0, #53B7D2)"
                              color="white"
                              fontWeight="600"
                              fontSize="0.875rem"
                            />
                            <Text fontFamily="poppins">Tia Dang</Text>
                          </HStack>
                          <Text fontFamily="poppins">•</Text>
                          <Text fontFamily="poppins">{post.date}</Text>
                          <Text fontFamily="poppins">•</Text>
                          <Text fontFamily="poppins">{post.readTime}</Text>
                        </HStack>

                        {/* Excerpt */}
                        <Text
                          fontSize="1rem"
                          color="#6B7280"
                          lineHeight="1.6"
                          mb="1rem"
                          noOfLines={3}
                          fontFamily="poppins"
                        >
                          {post.excerpt}
                        </Text>
                      </Box>
                    </Box>
                  </Grid>
                </Box>
              ))}
            </VStack>
          </VStack>
        </Container>
      </Box>
    </VStack>
  );
} 