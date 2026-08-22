'use client';

import React from 'react';

interface EditableImageProps {
  currentUrl: string;
  onImageChange?: (newUrl: string) => void;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  children?: React.ReactNode;
}

export default function EditableImage({
  currentUrl,
  alt = 'Image',
  className = '',
  style,
  children,
}: EditableImageProps) {
  if (children) {
    return (
      <div className={`relative ${className}`} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      <img src={currentUrl} alt={alt} className="w-full h-full object-cover rounded-xl" />
    </div>
  );
}
