export function waitForPromise(
  timeInMs: number,
  valueToReturn: any = 'resolved'
) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(valueToReturn), timeInMs);
  });
}
