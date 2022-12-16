import { IDesignerEngine, IDocument } from "core";
import { createContext } from "react";
import { IComponents } from "./interfaces";

export interface IComponentsParams {
  components: IComponents,
  registerComponents: (...components: IComponents[]) => void
}

export const initialParams: IComponentsParams = {
  components: {},
  registerComponents: function (...components: IComponents[]): void {
    throw new Error("Function not implemented.");
  }
}

export const DesignerEngineContext = createContext<IDesignerEngine | undefined>(undefined)
export const DesignComponentsContext = createContext<IComponentsParams>(initialParams)
export const PreviewComponentsContext = createContext<IComponentsParams>(initialParams)
export const DocumentContext = createContext<IDocument | undefined>(undefined)