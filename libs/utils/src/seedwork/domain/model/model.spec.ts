import { IsString } from "class-validator";
import { Model, ValidationModelExeption } from "./model";

class TestModel extends Model {
    @IsString()
    name: string;
}

describe('Model', () => {
    let model: TestModel;

    beforeEach(() => {
        model = new TestModel();
        model.id = "A48BCD55-B248-4377-8BCD-E9687768BA07";
        model.name = "Test Name";
    });

    it('updateAndValidate: should update and validate the model', () => {
        const updatedModel = Model.updateAndValidate(model, (prev) => {
            prev.name = "Updated Name";
            return prev;
        });

        expect(updatedModel.name).toBe("Updated Name");
    });

    it('updateAndValidate: should throw ValidationModelExeption if validation fails', () => {
        model.name = ""; // Invalid name

        expect(() => {
            Model.updateAndValidate(model, (prev) => {
                prev.id = "abc1234"
                prev.name = "Updated Name";
                return prev;
            });
        }).toThrowError(ValidationModelExeption);
    });
});