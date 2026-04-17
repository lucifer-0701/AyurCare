export default function Spinner({ size = 'md', color = 'forest', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10', xl: 'w-14 h-14' };
  const colors = {
    forest:    'border-forest-500',
    turmeric:  'border-turmeric-500',
    white:     'border-white',
  };

  return (
    <div
      className={`${sizes[size]} rounded-full border-2 border-transparent ${colors[color]} border-t-current animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
