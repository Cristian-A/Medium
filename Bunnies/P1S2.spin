
/// Problem 1, Solution n. 2
/// Time Complexity: O(g)
/// Memory Complexity: O(1)
func f(g: Integer, n: Integer) -> Integer {
	if (g < 1 || n < 2) return n;
	Integer c = 0;
	for (Integer w = n, k = n; g > 0; g -= 1) {
		c = n + w + k + 1;
		k = w;
		w = c;
	}
	return c;
}
