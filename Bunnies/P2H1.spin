/// Problem 2, Hint n. 1
/// Time Complexity: O(g)
/// Memory Complexity: O(g)
func f(g: Integer): Integer {
	if (g < 1) return 2;
	return f(g - 1) + 5;
}