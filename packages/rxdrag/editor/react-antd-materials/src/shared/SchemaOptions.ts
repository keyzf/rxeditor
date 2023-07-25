import { FieldOptions } from "./createFieldSchema";
import { IComponentEvent } from "./createControllerSchema";
import { ISlotSchema } from "./transSlotSchemas";
import { INodeSchema } from "@rxdrag/schema";
import { IFieldMeta } from "@rxdrag/fieldy-schema";
import { ILogicFlowControllerMeta } from "@rxdrag/minions-runtime-react";

export type SchemaOptions = {
  props?: INodeSchema<IFieldMeta, ILogicFlowControllerMeta>[];
  slots?: ISlotSchema[];
  fieldOptions?: FieldOptions;
  events?: IComponentEvent[];
};
