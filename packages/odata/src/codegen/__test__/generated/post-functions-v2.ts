/*
* This code was GENERATED using the vite plugin odata-codegen.
* It contains TypeScript type definitions for OData services.
* Do not modify this file manually as it will be overwritten on the next build.
* For any changes, update the OData service definitions or plugin configuration.
*/

/* eslint-disable */
/* prettier-ignore */

import { OData, type TOdataDummyInterface, type TODataOptions } from "notsapodata"


/**
 * Fields and Keys as Constants
 * 
 * Model: postFunctionsV2
 */
export const postFunctionsV2Consts = {
  "InvoiceService": {
    "Invoice": {
      fields: ["InvoiceID", "Customer", "Amount", "Status"] as const,
      keys: ["InvoiceID"] as const,
      measures: [] as const,
    },
  },
};

/**
 * Types for Keys and Fields
 * 
 * Model: postFunctionsV2
 */
export interface TPostFunctionsV2 {
  "InvoiceService": {
    "Invoice": {
      fields: (typeof postFunctionsV2Consts)["InvoiceService"]["Invoice"]["fields"][number];
      keys: (typeof postFunctionsV2Consts)["InvoiceService"]["Invoice"]["keys"][number];
      measures: (typeof postFunctionsV2Consts)["InvoiceService"]["Invoice"]["measures"][number];
    };
  };
}

/**
 * Main OData Interface
 * 
 * Model: postFunctionsV2
 */
export interface TPostFunctionsV2OData extends TOdataDummyInterface {
  entitySets: {
    'Invoices': "InvoiceService.Invoice";
  };
  entityTypes: {
    'InvoiceService.Invoice': {
      keys: TPostFunctionsV2["InvoiceService"]["Invoice"]["keys"];
      fields: TPostFunctionsV2["InvoiceService"]["Invoice"]["fields"];
      measures: TPostFunctionsV2["InvoiceService"]["Invoice"]["measures"];
      navToMany: {};
      navToOne: {};
      record: {
        InvoiceID: number;
        Customer?: string;
        Amount: number;
        Status?: string;
      };
      actions: "CloseInvoice";
      functions: never;
    };
  };
  complexTypes: {};
  enumTypes: {};
  functions: {};
  actions: {
    'CreateInvoice': {
      params: {
        Customer: string;
        Amount: number;
      };
      returnType: TPostFunctionsV2OData['entityTypes']['InvoiceService.Invoice']['record'];
    };
    'CloseInvoice': {
      params: {
        InvoiceID: number;
        Reason: string;
      };
      returnType: { 'CloseInvoice': boolean };
    };
  };
}

/**
 * oData class
 * 
 * Model: PostFunctionsV2
 * 
 * @example
 * const model = PostFunctionsV2.getInstance()
 */
export class PostFunctionsV2 extends OData<TPostFunctionsV2OData> {
  public static readonly serviceName = "postFunctionsV2" as const;
  private static instance?: PostFunctionsV2;
  public static getInstance() {
    if (!PostFunctionsV2.instance) {
      PostFunctionsV2.instance = new PostFunctionsV2()
    }
    return PostFunctionsV2.instance
  }
  public static async entitySet<T extends keyof TPostFunctionsV2OData['entitySets']>(name: T) {
    const instance = PostFunctionsV2.getInstance()
    return instance.entitySet<T>(name)
  }
  private constructor(opts?: TODataOptions) {
    super("postFunctionsV2", {...opts, path: "/odata/path/post-functions-v2"})
  }
}

