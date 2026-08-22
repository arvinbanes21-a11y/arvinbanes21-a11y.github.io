'use client';

import React from 'react';

interface EditableTextProps {
  value: string;
  onChange?: (newValue: string) => void;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  placeholder?: string;
  multiline?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function EditableText({
  value,
  className = '',
  as: Component = 'span',
  style,
  children,
}: EditableTextProps) {
  if (children) {
    return (
      <Component className={className} style={style}>
        {children}
      </Component>
    );
  }
  return (
    <Component className={className} style={style}>
      {value}
    </Component>
  );
}
