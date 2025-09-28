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
 * Model: odataV2WithActions
 */
export const odataV2WithActionsConsts = {
  "ODataDemo": {
    "Product": {
      fields: ["ID", "Name", "Description", "ReleaseDate", "DiscontinuedDate", "Rating", "Price"] as const,
      keys: ["ID"] as const,
      measures: [] as const,
    },
  },
};

/**
 * Types for Keys and Fields
 * 
 * Model: odataV2WithActions
 */
export interface TOdataV2WithActions {
  "ODataDemo": {
    "Product": {
      fields: (typeof odataV2WithActionsConsts)["ODataDemo"]["Product"]["fields"][number];
      keys: (typeof odataV2WithActionsConsts)["ODataDemo"]["Product"]["keys"][number];
      measures: (typeof odataV2WithActionsConsts)["ODataDemo"]["Product"]["measures"][number];
    };
  };
}

/**
 * Main OData Interface
 * 
 * Model: odataV2WithActions
 */
export interface TOdataV2WithActionsOData extends TOdataDummyInterface {
  entitySets: {
    'Products': "ODataDemo.Product";
  };
  entityTypes: {
    'ODataDemo.Product': {
      keys: TOdataV2WithActions["ODataDemo"]["Product"]["keys"];
      fields: TOdataV2WithActions["ODataDemo"]["Product"]["fields"];
      measures: TOdataV2WithActions["ODataDemo"]["Product"]["measures"];
      navToMany: {};
      navToOne: {};
      record: {
        ID: number;
        Name?: string;
        Description?: string;
        ReleaseDate: string;
        DiscontinuedDate?: string;
        Rating: number;
        Price: number;
      };
      actions: "CreateProduct";
      functions: "GetProductsByRating";
    };
  };
  complexTypes: {
    'ODataDemo.Address': {
      Street?: string;
      City?: string;
      State?: string;
      ZipCode?: string;
      Country?: string;
    };
  };
  enumTypes: {};
  functions: {
    'GetProductsByRating': {
      params: {
        rating: number | null;
      };
      returnType: Array<TOdataV2WithActionsOData['entityTypes']['ODataDemo.Product']['record']>;
    };
  };
  actions: {
    'CreateProduct': {
      params: {
        Name: string;
        Rating: number | null;
        Price: number | null;
      };
      returnType: TOdataV2WithActionsOData['entityTypes']['ODataDemo.Product']['record'];
    };
    'ResetDatabase': {
      params: never;
      returnType: void;
    };
    'UpdateProductAddress': {
      params: {
        ProductID: number | null;
        Address: TOdataV2WithActionsOData['complexTypes']['ODataDemo.Address'] | null;
      };
      returnType: { 'UpdateProductAddress': boolean };
    };
  };
}

/**
 * oData class
 * 
 * Model: OdataV2WithActions
 * 
 * @example
 * const model = OdataV2WithActions.getInstance()
 */
export class OdataV2WithActions extends OData<TOdataV2WithActionsOData> {
  public static readonly serviceName = "odataV2WithActions" as const;
  private static instance?: OdataV2WithActions;
  public static getInstance() {
    if (!OdataV2WithActions.instance) {
      OdataV2WithActions.instance = new OdataV2WithActions()
    }
    return OdataV2WithActions.instance
  }
  public static async entitySet<T extends keyof TOdataV2WithActionsOData['entitySets']>(name: T) {
    const instance = OdataV2WithActions.getInstance()
    return instance.entitySet<T>(name)
  }
  private constructor(opts?: TODataOptions) {
    super("odataV2WithActions", {...opts, path: "/odata/path/odata-v2-with-actions"})
  }
}

