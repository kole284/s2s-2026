const imagePreloadCache = new Map<string, Promise<void>>();

// Drži reference na učitane slike da browser ne odbaci već dekodirane bitmape.
const retainedImages = new Map<string, HTMLImageElement>();

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });

/**
 * Učitava i dekodira sliku pre nego što se koristi u SVG `<image>`.
 * Nikad ne odbija (reject): greška pri učitavanju ili dekodiranju ne sme da
 * sruši navigaciju. Neuspeh se ne kešira, pa sledeći poziv pokušava ponovo.
 */
export const preloadImage = (src: string): Promise<void> => {
  const existing = imagePreloadCache.get(src);
  if (existing) return existing;

  const promise = loadImage(src).then(async (image) => {
    if (!image) {
      imagePreloadCache.delete(src);
      return;
    }

    try {
      await image.decode();
    } catch {
      // decode() neuspeh ne sme da blokira promenu tima.
    }

    retainedImages.set(src, image);
  });

  imagePreloadCache.set(src, promise);

  return promise;
};
