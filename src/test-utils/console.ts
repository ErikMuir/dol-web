let errorSpy: jest.SpyInstance | undefined;

export function suppressConsoleErrors(): void {
  beforeAll(() => {
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterAll(() => {
    errorSpy?.mockRestore();
  });
}


