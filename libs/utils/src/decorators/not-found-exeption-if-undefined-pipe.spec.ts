import { NotFoundException } from "@nestjs/common";
import { Observable, lastValueFrom, of } from "rxjs";
import { NotFoundExceptionIfUndefinedPipe } from "./not-found-exeption-if-undefined-pipe";


describe("NotFoundExceptionIfUndefinedPipe", () => {
  class TestClass {
    @NotFoundExceptionIfUndefinedPipe()
    getData(): Observable<any> {
      // Simulate an asynchronous operation that returns undefined
      return of(undefined);
    }
  }

  let instance: TestClass;

  beforeEach(() => {
    instance = new TestClass();
  });

  it("should throw NotFoundException if data is undefined", async () => {
    await expect(lastValueFrom(instance.getData())).rejects.toThrow(
      NotFoundException
    );
  });

  it("should not throw NotFoundException if data is defined", async () => {
    const data = { id: 1, name: "Test" };
    jest.spyOn(instance, "getData").mockReturnValue(of(data));
    await expect(lastValueFrom(instance.getData())).resolves.toBe(data);
  });
});