/**
 * Password strength indicator component
 */
export default function PasswordStrength({ password }) {
  const getStrength = (pwd) => {
    let score = 0;
    if (!pwd) return { score: 0, label: '', color: '' };
    if (pwd.length >= 8)   score++;
    if (pwd.length >= 12)  score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: 'Too weak',  color: 'bg-red-400' };
    if (score === 2) return { score: 2, label: 'Weak',      color: 'bg-orange-400' };
    if (score === 3) return { score: 3, label: 'Fair',      color: 'bg-turmeric-500' };
    if (score === 4) return { score: 4, label: 'Strong',    color: 'bg-herb-sage' };
    return              { score: 5, label: 'Very strong', color: 'bg-forest-500' };
  };

  const { score, label, color } = getStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      {/* Bars */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? color : 'bg-beige-200'
            }`}
          />
        ))}
      </div>

      {/* Label */}
      <div className="flex justify-between items-center">
        <p className={`text-xs font-semibold ${
          score <= 1 ? 'text-red-500'
          : score === 2 ? 'text-orange-500'
          : score === 3 ? 'text-turmeric-600'
          : 'text-forest-600'
        }`}>
          {label}
        </p>
        <p className="text-xs text-beige-400">
          {score < 3 ? 'Use uppercase, numbers & symbols' : 'Good password!'}
        </p>
      </div>
    </div>
  );
}
