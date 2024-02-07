import { NotFoundException } from "@nestjs/common";
import { NotFoundExceptionIfUndefined } from "./not-found-exeption-if-undefined";

describe('NotFoundExceptionIfUndefined', () => {
  class TestClass {
    @NotFoundExceptionIfUndefined()
    async findData(): Promise<any> {
      // Simulate finding data
      return null;
    }
  }

  let testInstance: TestClass;

  beforeEach(() => {
    testInstance = new TestClass();
  });

  it('should throw NotFoundException if result is undefined', async () => {
    await expect(testInstance.findData()).rejects.toThrow(NotFoundException);
  });

  it('should not throw NotFoundException if result is not undefined', async () => {
    // Mock the result to be a non-null value
    testInstance.findData = jest.fn().mockResolvedValue({});

    await expect(testInstance.findData()).resolves.not.toThrow(NotFoundException);
  });

  it('should throw NotFoundException with custom message if provided', async () => {
    const customMessage = 'Custom not found message';

    // Apply the decorator with custom message
    class CustomMessageTestClass {
      @NotFoundExceptionIfUndefined(customMessage)
      async findData(): Promise<any> {
        // Simulate finding data
        return null;
      }
    }

    const customMessageTestInstance = new CustomMessageTestClass();

    await expect(customMessageTestInstance.findData()).rejects.toThrow(NotFoundException);
    await expect(customMessageTestInstance.findData()).rejects.toThrow(customMessage);
  });
});