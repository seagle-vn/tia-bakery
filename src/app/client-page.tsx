'use client';

import { gql, useSuspenseQuery } from '@apollo/client';
import { Box, Center, Heading, Text, VStack } from '@chakra-ui/react';
import { Resize } from '@cloudinary/url-gen/actions/resize';
import { Category } from '../components/home/Category';
import { Menu } from '../components/home/Menu';
import { cld } from '../constants/cloudinary';
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

    menus {
      id
      image
    }
  }
`;

export default function HomeClientPage() {
  const { data } = useSuspenseQuery(query, {
    fetchPolicy: 'cache-first',
    variables: {
      slug: 'home',
    },
  });

  const { page, categories, menus } = data as any;

  const url = cld
    .image(page.heroBackground.public_id)
    .quality('auto')
    .format('auto')
    .resize(Resize.scale().width(1920).height(900))
    .toURL();

  return (
    <main className={styles.main}>
      <Box
        backgroundSize='cover'
        backgroundPosition='center'
        style={{ backgroundImage: `url(${url})` }}
        height='500px'
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
          <Heading
            as='h2'
            fontFamily='amatic'
            fontWeight='700'
            fontSize={{ base: '40px', md: '4rem' }}
            color='primary.200'
            lineHeight='1.1'
            letterSpacing={1}
            borderTop='3px solid'
            borderTopColor='primary.200'
            py={{ base: '2rem', md: '2rem' }}
            textAlign='center'
            maxWidth={{ base: '80%', md: '35rem' }}
            position='relative'
            className={styles.bannerText}
          >
            {page.heroTitle}
          </Heading>
          <Text
            fontFamily='roboto'
            fontSize={{ base: '2rem', md: '3rem' }}
            color='primary.200'
            className={styles.descriptionText}
          >
            {page.heroText}
          </Text>
        </VStack>
      </Center>
      <VStack>
        <Menu menus={menus} />
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
