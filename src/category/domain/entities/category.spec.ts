import Category from "./category";

describe('Category Test', () => {
  test('constructor of category', () => {
    const category = new Category("tests")
    expect(category.name).toBe("tests")
  });
});