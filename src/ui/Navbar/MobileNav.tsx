import { Link } from '@chakra-ui/next-js';
import { Box, Stack, Text } from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const MobileNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/' && window.location.hash) {
      const targetId = window.location.hash;
      setTimeout(() => {
        const element = document.querySelector(targetId);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [pathname]);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();

    if (pathname !== '/') {
      router.push(`/${targetId}`);
      return;
    }

    const element = document.querySelector(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Stack
      bg='bg.primary'
      p={4}
      display={{ md: 'none' }}
      spacing={2}
      borderBottom='1px solid'
      borderColor='border.light'
    >
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Link
            href={navItem.href}
            onClick={(e) => handleSmoothScroll(e, navItem.href)}
            display='block'
            py={3}
            px={4}
            borderRadius='md'
            _hover={{
              bg: 'bg.card',
              textDecoration: 'none',
            }}
            _active={{
              bg: 'pink.50',
            }}
          >
            <Text fontWeight={500} color='text.dark' fontSize='16px'>
              {navItem.label}
            </Text>
          </Link>
        </Box>
      ))}
    </Stack>
  );
};

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Home',
    href: '#hero',
  },
  {
    label: 'Gallery',
    href: '#gallery',
  },
  {
    label: 'Menu',
    href: '#menu',
  },
  {
    label: 'About',
    href: '#about',
  },
  {
    label: 'FAQ',
    href: '#faq',
  },
  {
    label: 'Contact',
    href: '#quote',
  },
];
