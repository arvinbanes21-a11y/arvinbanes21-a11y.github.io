export function getOptimizedPortraitUrl(image: string | null | undefined): string {
  if (image === '/profile-picture.jpeg') return '/profile-picture-optimized.jpg';
  if (image === '/dark-profile.png') return '/dark-profile-optimized.jpg';
  return image || '/profile-picture-optimized.jpg';
}
