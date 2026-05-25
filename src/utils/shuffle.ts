// Fisher-Yates, in place. Randomness is injected so callers can be made
// deterministic (e.g. tests, or the canonical fallback that passes a constant).
export const shuffleInPlace = <T>(
  array: T[],
  random: () => number = Math.random
): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default shuffleInPlace;
