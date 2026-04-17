/**
 * Scale ingredient quantities from 1 day to N days.
 */
export function scaleIngredients(ingredients, days) {
  if (!ingredients || !Array.isArray(ingredients)) return [];
  return ingredients.map((ing) => ({
    ...ing,
    quantity_scaled: parseFloat((ing.quantity_per_day * days).toFixed(2)),
  }));
}

/**
 * Format a quantity with its unit for display.
 */
export function formatQuantity(quantity, unit) {
  if (quantity === undefined || quantity === null) return '';
  return `${quantity} ${unit}`;
}

/**
 * Common unit conversions for display
 */
export const UNIT_LABELS = {
  grams:  'g',
  ml:     'ml',
  tsp:    'tsp',
  tbsp:   'tbsp',
  pieces: 'pcs',
  drops:  'drops',
  cups:   'cups',
  mg:     'mg',
};

export const shortUnit = (unit) => UNIT_LABELS[unit?.toLowerCase()] || unit || '';
