export default function randomize<T extends ArrayBufferView>(arr: T) {
  if(crypto && 'getRandomValues' in crypto) {
    crypto.getRandomValues(arr as any);
  } else {
    throw new Error('NO_SECURE_RANDOM');
  }

  return arr;
}
