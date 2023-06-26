'use client';
import { gql, useSuspenseQuery } from '@apollo/client';
import { Box, Center, Flex, Image, Text, VStack } from '@chakra-ui/react';
import { Resize } from '@cloudinary/url-gen/actions/resize';
import { cld } from '../../constants/cloudinary';
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

export default function AboutClientPage() {
  const { data } = useSuspenseQuery(query, {
    fetchPolicy: 'cache-first',
    variables: {
      slug: 'about',
    },
  });
  const { page } = data as any;

  const url = cld
    .image(page.heroBackground.public_id)
    .quality('auto')
    .format('auto')
    .resize(Resize.scale().width(1920).height(900))
    .toURL();

  return (
    <main>
      <Box
        className={styles.image}
        style={{ backgroundImage: `url(${url})` }}
        backgroundRepeat='no-repeat'
        backgroundSize='cover'
        height='425px'
        w='full'
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
          </Text>
          <Text
            fontFamily='roboto'
            fontSize={{ base: '2rem', md: '3rem' }}
            color='primary.200'
            textTransform='uppercase'
            className={styles.descriptionText}
            textAlign='center'
          >
            {page.heroText}
          </Text>
        </VStack>
      </Center>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        py='4rem'
        px={{ base: '1rem' }}
        width={{ base: '100%', md: '80%' }}
        margin='0 auto'
        alignItems={{ base: 'center' }}
        gap={{ base: '2rem', md: '4rem' }}
      >
        <Image
          borderRadius='50%'
          src={page.descriptionImage.url}
          alt='about image'
          width={{ base: '10rem', md: '20rem' }}
        />
        <div dangerouslySetInnerHTML={{ __html: page.description.html }}></div>
      </Flex>
    </main>
  );
}
