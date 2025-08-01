import { Cloudinary } from '@cloudinary/url-gen';

export const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
  },
  url: {
    secure: true, // force https, set to false to force http
  },
});
