'use client';
import { gql, useSuspenseQuery } from '@apollo/client';
import { Box, Center, HStack, Image, Text, VStack } from '@chakra-ui/react';
import styles from './page.module.css';

const query = gql`
  query AboutPage($slug: String) {
    page(where: { slug: $slug }) {
      heroBackground
      heroText
      heroTitle
      id
      name
      description {
        html
      }
      descriptionImage
    }
  }
`;

export default function AboutPage() {
  const { data } = useSuspenseQuery(query, {
    fetchPolicy: 'cache-first',
    variables: {
      slug: 'about',
    },
  });
  const { page } = data as any;

  return (
    <main>
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
            maxWidth='80%'
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
      <HStack py='4rem' spacing='4rem' width='80%' margin='0 auto'>
        <Image
          borderRadius='50%'
          src={page.descriptionImage.url}
          alt='about image'
          width='20rem'
        />
        <div dangerouslySetInnerHTML={{ __html: page.description.html }}></div>
      </HStack>
    </main>
  );
}
