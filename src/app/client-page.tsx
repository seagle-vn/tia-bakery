'use client';

import { gql, useQuery } from '@apollo/client';
import { Box, Spinner, VStack, Text } from '@chakra-ui/react';
import HeroSection from '../components/home/HeroSection';
import TrustBanner from '../components/home/TrustBanner';
import MenuSection from '../components/home/MenuSection';
import GallerySection from '../components/home/GallerySection';
import AboutSection from '../components/home/AboutSection';
import WatchSection from '../components/home/WatchSection';
import FAQSection from '../components/home/FAQSection';
import QuoteSection from '../components/home/QuoteSection';

const query = gql`
  query HomePage($slug: String) {
    categories {
      name
      id
      slug
      products(first: 8) {
        id
        name
        slug
        image
        description {
          text
        }
      }
    }

    page(where: { slug: $slug }) {
      heroBackground
      heroText
      heroTitle
      aboutImage
      id
      name
    }

    products(first: 20) {
      id
      name
      slug
      image
      description {
        text
      }
    }
  }
`;

export default function HomeClientPage() {
  const { data, loading, error } = useQuery(query, {
    fetchPolicy: 'cache-first',
    variables: {
      slug: 'home',
    },
  });

  if (loading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="bg.primary"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.400" thickness="4px" />
          <Text color="text.dark">Loading...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="bg.primary"
        p={6}
      >
        <VStack spacing={4} maxW="lg" textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" color="text.dark">
            Error Loading Page
          </Text>
          <Text color="text.dark">{error.message}</Text>
          <Box
            p={4}
            bg="red.50"
            borderRadius="md"
            borderWidth="1px"
            borderColor="red.200"
            maxW="100%"
            overflow="auto"
          >
            <Text fontSize="sm" fontFamily="mono" color="red.600">
              {JSON.stringify(error, null, 2)}
            </Text>
          </Box>
        </VStack>
      </Box>
    );
  }

  const { page, categories, products } = data as any;

  if (!page || !page.heroBackground) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="bg.primary"
        p={6}
      >
        <VStack spacing={4}>
          <Text fontSize="2xl" fontWeight="bold" color="text.dark">
            Page Not Found
          </Text>
          <Text color="text.dark">
            The home page data could not be found in your CMS.
          </Text>
        </VStack>
      </Box>
    );
  }

  // Prepare products with category information and sizes
  const productsWithCategories = (products || []).map((product: any) => ({
    ...product,
    // Add logic to determine category based on product data
    category: product.name.toLowerCase().includes('cupcake') || product.name.toLowerCase().includes('treat')
      ? 'Treats'
      : 'Signature Cakes',
    sizes: [
      { name: '6"', price: 45 },
      { name: '8"', price: 65 },
      { name: '10"', price: 85 },
    ],
  }));

  return (
    <main>
      <HeroSection
        heroImage={page.heroBackground.public_id}
        heroTitle={page.heroTitle}
        heroText={page.heroText}
      />

      <TrustBanner />

      <MenuSection products={productsWithCategories} />

      <GallerySection categories={categories || []} />

      <AboutSection aboutImage={page.aboutImage?.public_id} />

      <WatchSection />

      <FAQSection />

      <QuoteSection />
    </main>
  );
}
