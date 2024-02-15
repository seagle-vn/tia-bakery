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
