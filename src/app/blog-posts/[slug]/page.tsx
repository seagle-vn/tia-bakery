'use client';

import { gql, useSuspenseQuery } from '@apollo/client';
import { Link } from '@chakra-ui/next-js';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Avatar, 
  Image,
} from '@chakra-ui/react';
import { decode } from 'he'; 

const query = gql`
  query BlogPost($slug: String) {
    blogPost(where: { slug: $slug }) {
      id
      title
      excerpt
      date
      readTime
      image
      slug
      content {
        html
      }
    }
  }
`;

export default function BlogPostPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const { data } = useSuspenseQuery(query, {
    fetchPolicy: 'cache-first',
    variables: { slug },
  });

  const { blogPost } = data as any;
  console.log({blogPost})
  const cleanHtml = decode(blogPost.content.html);
  


  if (!blogPost) {
    return (
      <VStack minH="100vh" bg="white" justify="center">
        <Heading color="#53B7D2" fontFamily="poppins">
          Blog post not found
        </Heading>
        <Link href="/sharing" color="#53B7D2">
          ← Back to all posts
        </Link>
      </VStack>
    );
  }

  return (
    <VStack minH="100vh" bg="white">
      {/* Hero Image */}
      <Box w="full" h="400px" position="relative">
        <Image
          src={blogPost.image?.url}
          alt={blogPost.title}
          w="full"
          h="full"
          objectFit="cover"
        />
      </Box>

      {/* Main Content */}
      <Box as="main" flex="1" w="full" py="4rem" px="2rem" bg="white">
        <Container maxW="70%" mx="auto">
          <VStack spacing="3rem" align="stretch">

            {/* Article Header */}
            <VStack spacing="1rem" textAlign="center">
              <Heading
                fontSize="3rem"
                fontWeight="600"
                color="#374151"
                fontFamily="poppins"
                lineHeight="1.2"
              >
                {blogPost.title}
              </Heading>
              
              {/* Meta Information */}
              <HStack spacing="1rem" fontSize="0.875rem" color="#6B7280" fontFamily="poppins">
                <HStack spacing="0.5rem">
                  <Avatar
                    size="sm"
                    bg="linear-gradient(135deg, #7DD3C0, #53B7D2)"
                    color="white"
                    fontWeight="600"
                    fontSize="0.875rem"
                  />
                  <Text>Tia Dang</Text>
                </HStack>
                <Text>•</Text>
                <Text>{blogPost.date}</Text>
                <Text>•</Text>
                <Text>{blogPost.readTime} min read</Text>
              </HStack>

              {/* Excerpt */}
              <Text
                fontSize="1.25rem"
                color="#6B7280"
                lineHeight="1.6"
                fontFamily="poppins"
                fontStyle="italic"
                maxW="70%"
              >
                {blogPost.excerpt}
              </Text>
            </VStack>

            {/* Article Content */}
            <Box
              fontSize="1.125rem"
              lineHeight="1.8"
              color="#374151"
              fontFamily="poppins"
            >
              <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
            </Box>

            {/* Back to Posts Link */}
            <Box textAlign="center" pt="2rem">
              <Link
                href="/sharing"
                color="#53B7D2"
                fontFamily="poppins"
                fontWeight="500"
                _hover={{ textDecoration: 'underline' }}
              >
                ← Back to all posts
              </Link>
            </Box>
          </VStack>
        </Container>
      </Box>
    </VStack>
  );
} 