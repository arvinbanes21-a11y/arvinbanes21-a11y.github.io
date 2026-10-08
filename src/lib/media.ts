const OPTIMIZED_PORTRAITS: Record<string, string> = {
  '/profile-picture.jpeg': '/profile-picture-optimized.jpg',
  '/dark-profile.png': '/dark-profile-optimized.jpg',
  '/profile-light.png': '/profile-light-optimized.jpg',
  '/profile-dark.png': '/profile-dark-optimized.jpg',
};

export function getOptimizedPortraitUrl(image: string | null | undefined): string {
  return OPTIMIZED_PORTRAITS[image ?? ''] || image || '/profile-picture-optimized.jpg';
}
