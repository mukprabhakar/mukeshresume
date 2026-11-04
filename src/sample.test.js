// Simple test to verify Jest is working
// This test doesn't require any React components or complex dependencies

describe('Sample Test Suite', () => {
  it('should pass basic math test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
   const text = 'hello';
    expect(text).toContain('ell');
    expect(text.length).toBe(5);
  });

  it('should handle array operations', () => {
   const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
    expect(arr).toContain(2);
  });
});