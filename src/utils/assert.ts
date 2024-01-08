/**
 * Makes sure the `condition` is `true`.
 * @param condition Condition to test.
 * @param message Error message if assertion fails.
 */
export default function assert(
  condition: unknown,
  message: string
): asserts condition {
  if (!condition) throw new Error(message);
}
