/// Problem 1, Solution n. 2
/// Time Complexity: O(g)
/// Memory Complexity: Θ(1)
func f(g: Integer, n: Integer): Integer {
	if (g < 1 || n < 2) return n;
	var c: Integer = 0;
	var w: Integer = n;
	var k: Integer = n;
	while (g > 0) {
		c = n + w + k + 1;
		k = w;
		w = c;
		g -= 1;
	}
	return c;
}