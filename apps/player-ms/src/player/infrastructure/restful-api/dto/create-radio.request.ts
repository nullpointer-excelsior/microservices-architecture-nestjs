import { OmitType } from "@nestjs/swagger";
import { RadioModel } from "../../../domain/model/radio.model";

export class CreateRadioRequest extends OmitType(RadioModel, ['id'] as const) {}