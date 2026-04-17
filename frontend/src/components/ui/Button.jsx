import Spinner from './Spinner.jsx';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
  ...props
}) {
  const variants = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    outline:   'btn-outline',
    ghost:     'btn-ghost',
    danger:    'inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-soft',
  };

  const sizes = {
    sm:  'text-sm py-2 px-4',
    md:  'text-sm py-3 px-6',
    lg:  'text-base py-3.5 px-8',
    xl:  'text-lg py-4 px-10',
  };

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" color={variant === 'outline' || variant === 'ghost' ? 'forest' : 'white'} />
      ) : (
        icon && <span>{icon}</span>
      )}
      {children}
    </button>
  );
}
