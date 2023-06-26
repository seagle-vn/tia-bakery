import { gql, useSuspenseQuery } from '@apollo/client';
import {
  Box,
  Container,
  Flex,
  Image,
  Stack,
  Text,
  VisuallyHidden,
  chakra,
  useColorModeValue,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

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
      fontFamily='roboto'
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
    }
  }
`;

export function Footer() {
  const { data } = useSuspenseQuery(query, {
    fetchPolicy: 'cache-first',
  });

  const { store } = data as any;
  return (
    <Box backgroundColor='#FBD4D7'>
      <Container as={Stack} maxW={'80%'} py={10}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          w='100%'
          justifyContent='space-between'
          gap={8}
        >
          <Stack alignItems={{ base: 'start', md: 'center' }} spacing={6}>
            <Image
              borderRadius='50%'
              width={{ base: '13rem', md: '15rem' }}
              height={{ base: '13rem', md: '15rem' }}
              src='/logo.png'
              alt='Logo'
              marginLeft={{ base: '-2.5rem', md: '0' }}
            />

            <Stack direction={'row'} spacing={6}>
              <SocialButton label={'Twitter'} href={store.facebook}>
                <FaTwitter />
              </SocialButton>
              <SocialButton label={'YouTube'} href={store.youtube}>
                <FaYoutube />
              </SocialButton>
              <SocialButton label={'Instagram'} href={store.instagram}>
                <FaInstagram />
              </SocialButton>
            </Stack>
          </Stack>
          <Stack fontFamily='grandiflora' mt='1rem' align='flex-start'>
            <ListHeader>Visit our store</ListHeader>
            <Text fontWeight='700' fontSize={'lg'}>
              {store.address}
            </Text>
            <Text fontWeight='700' fontSize={'lg'}>
              {store.phone}
            </Text>
            <Text
              _hover={{ textDecoration: 'underline' }}
              fontWeight='700'
              fontSize={'lg'}
            >
              <a href={`mailto:${store.email}`}>{store.email}</a>
            </Text>
          </Stack>
          <Stack
            fontFamily='grandiflora'
            mt='1rem'
            align={{ base: 'flex-start', md: 'flex-end' }}
          >
            <ListHeader>Open times</ListHeader>
            <Text fontWeight='700' fontSize={'lg'}>
              Mon - Fri: {store.openTime1}
            </Text>
            <Text fontWeight='700' fontSize={'lg'}>
              Sat - Sun: {store.openTime2}
            </Text>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
}
