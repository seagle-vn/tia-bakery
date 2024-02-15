const breakpoints = [4320, 2160, 1080, 640, 384, 256, 128];

const unsplashLink = (id: string, width: number, height: number) =>
  `https://source.unsplash.com/${id}/${width}x${height}`;

export function generateSlides(menus: { image: any; id: string }[]) {
  return menus.map(({ image, id }) => {
    const width = image.width * 4;
    const height = image.height * 4;
    return {
      src: image.url,
      width,
      height,
    };
  });
}
