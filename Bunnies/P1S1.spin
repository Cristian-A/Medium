/// Problem 1, Solution n. 1
/// Time Complexity: O(2^g)
/// Memory Complexity: O(2^g)
func f(g: Integer, n: Integer): Integer {
	if (g < 1 || n < 2) return n;
	return n + f(g - 1, n) + f(g - 2, n) + 1;
}