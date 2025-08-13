import { gql, useSuspenseQuery } from '@apollo/client';
import { Link } from '@chakra-ui/next-js';
import {
  Box,
  Container,
  Flex,
  Stack,
  Text,
  VStack,
  VisuallyHidden,
  chakra,
  useColorModeValue,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
      target='_blank'
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text
      fontFamily='poppins'
      fontWeight={'600'}
      textTransform='uppercase'
      letterSpacing={1}
      fontSize={'2rem'}
      mb={2}
    >
      {children}
    </Text>
  );
};

const query = gql`
  query StoreQuery {
    store(where: { slug: "london" }) {
      email
      facebook
      address
      instagram
      openTime1
      openTime2
      phone
      youtube
      videoUrl
    }
  }
`;

export function Footer() {
  const { data } = useSuspenseQuery(query, {
    fetchPolicy: 'cache-first',
  });

  const { store } = data as any;
  console.log('Store data:', store);
  return (
    <VStack pb='1rem' backgroundColor='#FBD4D7'>
      <Container as={Stack} maxW={'80%'} py={10}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          w='100%'
          justifyContent='space-between'
          gap={8}
        >
          <Stack alignItems={{ base: 'start', md: 'center' }} spacing={6}>
            <Box
              borderRadius='50%'
              width={{ base: '13rem', md: '15rem' }}
              height={{ base: '13rem', md: '15rem' }}
              display='flex'
              alignItems='center'
              justifyContent='center'
              marginLeft={{ base: '-2.5rem', md: '0' }}
            >
              <img
                src='/logo.png'
                alt='Logo'
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  mixBlendMode: 'multiply',
                  filter: 'contrast(1.2) brightness(1.1) saturate(1.1)',
                  borderRadius: '50%',
                }}
              />
            </Box>

            <Stack direction={'row'} spacing={6}>
              <SocialButton label={'Twitter'} href={store.facebook}>
                <FaFacebook />
              </SocialButton>
              <SocialButton label={'YouTube'} href={store.youtube}>
                <FaYoutube />
              </SocialButton>
              <SocialButton label={'Instagram'} href={store.instagram}>
                <FaInstagram />
              </SocialButton>
            </Stack>
          </Stack>
          <Stack fontFamily='poppins' mt='1rem' align='flex-start'>
            <ListHeader>Contact me</ListHeader>
            <Text fontSize={'lg'}>{store.address}</Text>
            <Text fontSize={'lg'}>{store.phone}</Text>
            <Text _hover={{ textDecoration: 'underline' }} fontSize={'lg'}>
              <a href={`mailto:${store.email}`}>{store.email}</a>
            </Text>
          </Stack>
          <Stack
            fontFamily='poppins'
            mt='1rem'
            align={{ base: 'flex-start', md: 'flex-end' }}
          >
            <ListHeader>Watch My Story</ListHeader>
            <Box
              width={{ base: '280px', md: '320px' }}
              height={{ base: '157px', md: '180px' }}
              borderRadius='8px'
              overflow='hidden'
              boxShadow='0 4px 8px rgba(0, 0, 0, 0.1)'
            >
              <iframe
                width='100%'
                height='100%'
                src={store.videoUrl ? store.videoUrl.replace('watch?v=', 'embed/') : 'https://www.youtube.com/embed/BPLO7ZEYbAI'}
                title='Tia Bakery Story'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                style={{
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
            </Box>
          </Stack>
        </Flex>
      </Container>
      <Text fontSize='14px' color='#6b7280'>
        This website is made by{' '}
        <Link
          textDecor='underline'
          target='_blank'
          href='https://portfolio-seagle.vercel.app/'
        >
          seagle
        </Link>
      </Text>
    </VStack>
  );
}
