'use client';
import { gql, useSuspenseQuery } from '@apollo/client';
import { Box, Center, Text, VStack } from '@chakra-ui/react';
import { Category } from '../components/home/Category';
import styles from './page.module.css';

const query = gql`
  query HomePage($slug: String) {
    categories {
      name
      id
      slug
      products(first: 4) {
        id
        name
        slug
        image
      }
    }

    page(where: { slug: $slug }) {
      heroBackground
      heroText
      heroTitle
      id
      name
    }
  }
`;

export default function Home() {
  const { data } = useSuspenseQuery(query, {
    fetchPolicy: 'cache-first',
    variables: {
      slug: 'home',
    },
  });

  const { page, categories } = data as any;

  return (
    <main className={styles.main}>
      <Box
        backgroundImage={`url('${page.heroBackground.url}')`}
        backgroundPosition='center'
        backgroundRepeat='no-repeat'
        backgroundSize='cover'
        height='425px'
        width='100%'
      />
      <Center
        backgroundImage="url('/banner_text_background.png')"
        backgroundPosition='center'
        backgroundRepeat='no-repeat'
        backgroundSize='cover'
        py='4rem'
        className={styles.banner}
        position='relative'
      >
        <VStack>
          <Text
            fontFamily='amatic'
            fontWeight='700'
            fontSize='4rem'
            color='primary.200'
            lineHeight='1.1'
            letterSpacing={1}
            borderTop='3px solid'
            borderTopColor='primary.200'
            py='2rem'
            textAlign='center'
            maxWidth='35rem'
            position='relative'
            className={styles.bannerText}
          >
            {page.heroTitle}
          </Text>
          <Text
            fontFamily='roboto'
            fontSize='3rem'
            color='primary.200'
            textTransform='uppercase'
            className={styles.descriptionText}
          >
            {page.heroText}
          </Text>
        </VStack>
      </Center>
      <VStack>
        {categories.map((category: any) => (
          <Category
            title={category.name}
            link={`/shop/${category.slug}`}
            key={category.id}
            products={category.products}
          />
        ))}
      </VStack>
    </main>
  );
}
