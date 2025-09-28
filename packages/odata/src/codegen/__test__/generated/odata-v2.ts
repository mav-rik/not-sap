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
 * Model: odataV2
 */
export const odataV2Consts = {
  "ODataDemo": {
    "Product": {
      fields: ["ID", "Name", "Description", "ReleaseDate", "DiscontinuedDate", "Rating", "Price"] as const,
      keys: ["ID"] as const,
      measures: [] as const,
    },
    "Category": {
      fields: ["ID", "Name"] as const,
      keys: ["ID"] as const,
      measures: [] as const,
    },
    "Supplier": {
      fields: ["ID", "Name", "Address", "Concurrency"] as const,
      keys: ["ID"] as const,
      measures: [] as const,
    },
  },
};

/**
 * Types for Keys and Fields
 * 
 * Model: odataV2
 */
export interface TOdataV2 {
  "ODataDemo": {
    "Product": {
      fields: (typeof odataV2Consts)["ODataDemo"]["Product"]["fields"][number];
      keys: (typeof odataV2Consts)["ODataDemo"]["Product"]["keys"][number];
      measures: (typeof odataV2Consts)["ODataDemo"]["Product"]["measures"][number];
    };
    "Category": {
      fields: (typeof odataV2Consts)["ODataDemo"]["Category"]["fields"][number];
      keys: (typeof odataV2Consts)["ODataDemo"]["Category"]["keys"][number];
      measures: (typeof odataV2Consts)["ODataDemo"]["Category"]["measures"][number];
    };
    "Supplier": {
      fields: (typeof odataV2Consts)["ODataDemo"]["Supplier"]["fields"][number];
      keys: (typeof odataV2Consts)["ODataDemo"]["Supplier"]["keys"][number];
      measures: (typeof odataV2Consts)["ODataDemo"]["Supplier"]["measures"][number];
    };
  };
}

/**
 * Main OData Interface
 * 
 * Model: odataV2
 */
export interface TOdataV2OData extends TOdataDummyInterface {
  entitySets: {
    'Products': "ODataDemo.Product";
    'Categories': "ODataDemo.Category";
    'Suppliers': "ODataDemo.Supplier";
  };
  entityTypes: {
    'ODataDemo.Product': {
      keys: TOdataV2["ODataDemo"]["Product"]["keys"];
      fields: TOdataV2["ODataDemo"]["Product"]["fields"];
      measures: TOdataV2["ODataDemo"]["Product"]["measures"];
      navToMany: {};
      navToOne: {
        Category: "ODataDemo.Category";
        Supplier: "ODataDemo.Supplier";
      };
      record: {
        ID: number;
        Name?: string;
        Description?: string;
        ReleaseDate: string;
        DiscontinuedDate?: string;
        Rating: number;
        Price: number;
        Category?: TOdataV2OData['entityTypes']['ODataDemo.Category']['record'] | null;
        Supplier?: TOdataV2OData['entityTypes']['ODataDemo.Supplier']['record'] | null;
      };
    };
    'ODataDemo.Category': {
      keys: TOdataV2["ODataDemo"]["Category"]["keys"];
      fields: TOdataV2["ODataDemo"]["Category"]["fields"];
      measures: TOdataV2["ODataDemo"]["Category"]["measures"];
      navToMany: {
        Products: "ODataDemo.Product";
      };
      navToOne: {};
      record: {
        ID: number;
        Name?: string;
        Products?: { results: Array<TOdataV2OData['entityTypes']['ODataDemo.Product']['record']> };
      };
    };
    'ODataDemo.Supplier': {
      keys: TOdataV2["ODataDemo"]["Supplier"]["keys"];
      fields: TOdataV2["ODataDemo"]["Supplier"]["fields"];
      measures: TOdataV2["ODataDemo"]["Supplier"]["measures"];
      navToMany: {
        Products: "ODataDemo.Product";
      };
      navToOne: {};
      record: {
        ID: number;
        Name?: string;
        Address: TOdataV2OData['complexTypes']['ODataDemo.Address'];
        Concurrency: number;
        Products?: { results: Array<TOdataV2OData['entityTypes']['ODataDemo.Product']['record']> };
      };
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
      returnType: Array<TOdataV2OData['entityTypes']['ODataDemo.Product']['record']>;
    };
  };
}

/**
 * oData class
 * 
 * Model: OdataV2
 * 
 * @example
 * const model = OdataV2.getInstance()
 */
export class OdataV2 extends OData<TOdataV2OData> {
  public static readonly serviceName = "odataV2" as const;
  private static instance?: OdataV2;
  public static getInstance() {
    if (!OdataV2.instance) {
      OdataV2.instance = new OdataV2()
    }
    return OdataV2.instance
  }
  public static async entitySet<T extends keyof TOdataV2OData['entitySets']>(name: T) {
    const instance = OdataV2.getInstance()
    return instance.entitySet<T>(name)
  }
  private constructor(opts?: TODataOptions) {
    super("odataV2", {...opts, path: "/V2/odata/odata.svc"})
  }
}

