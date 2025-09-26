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
 * Model: northwindV4Selected
 */
export const northwindV4SelectedConsts = {
  "NorthwindModel": {
    "Product": {
      fields: ["ProductID", "ProductName", "SupplierID", "CategoryID", "QuantityPerUnit", "UnitPrice", "UnitsInStock", "UnitsOnOrder", "ReorderLevel", "Discontinued"] as const,
      keys: ["ProductID", "ProductName", "SupplierID", "CategoryID", "QuantityPerUnit", "UnitPrice", "UnitsInStock", "UnitsOnOrder", "ReorderLevel", "Discontinued"] as const,
      measures: [] as const,
    },
    "Supplier": {
      fields: ["SupplierID", "CompanyName", "ContactName", "ContactTitle", "Address", "City", "Region", "PostalCode", "Country", "Phone", "Fax", "HomePage"] as const,
      keys: ["SupplierID", "CompanyName", "ContactName", "ContactTitle", "Address", "City", "Region", "PostalCode", "Country", "Phone", "Fax", "HomePage"] as const,
      measures: [] as const,
    },
    "Order_Detail": {
      fields: ["OrderID", "ProductID", "UnitPrice", "Quantity", "Discount"] as const,
      keys: ["OrderID", "ProductID", "UnitPrice", "Quantity", "Discount"] as const,
      measures: [] as const,
    },
    "Category": {
      fields: ["CategoryID", "CategoryName", "Description", "Picture"] as const,
      keys: ["CategoryID", "CategoryName", "Description", "Picture"] as const,
      measures: [] as const,
    },
  },
};

/**
 * Types for Keys and Fields
 * 
 * Model: northwindV4Selected
 */
export interface TNorthwindV4Selected {
  "NorthwindModel": {
    "Product": {
      fields: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Product"]["fields"][number];
      keys: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Product"]["keys"][number];
      measures: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Product"]["measures"][number];
    };
    "Supplier": {
      fields: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Supplier"]["fields"][number];
      keys: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Supplier"]["keys"][number];
      measures: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Supplier"]["measures"][number];
    };
    "Order_Detail": {
      fields: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Order_Detail"]["fields"][number];
      keys: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Order_Detail"]["keys"][number];
      measures: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Order_Detail"]["measures"][number];
    };
    "Category": {
      fields: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Category"]["fields"][number];
      keys: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Category"]["keys"][number];
      measures: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Category"]["measures"][number];
    };
  };
}

/**
 * Main OData Interface
 * 
 * Model: northwindV4Selected
 */
export interface TNorthwindV4SelectedOData extends TOdataDummyInterface {
  entitySets: {
    'ODataWebV4.Northwind.Model.Products': "NorthwindModel.Product";
    'ODataWebV4.Northwind.Model.Suppliers': "NorthwindModel.Supplier";
  };
  entityTypes: {
    'NorthwindModel.Product': {
      keys: TNorthwindV4Selected["NorthwindModel"]["Product"]["keys"];
      fields: TNorthwindV4Selected["NorthwindModel"]["Product"]["fields"];
      measures: TNorthwindV4Selected["NorthwindModel"]["Product"]["measures"];
      navToMany: {
        Order_Details: "NorthwindModel.Order_Detail";
      };
      navToOne: {
        Category: "NorthwindModel.Category";
        Supplier: "NorthwindModel.Supplier";
      };
    };
    'NorthwindModel.Supplier': {
      keys: TNorthwindV4Selected["NorthwindModel"]["Supplier"]["keys"];
      fields: TNorthwindV4Selected["NorthwindModel"]["Supplier"]["fields"];
      measures: TNorthwindV4Selected["NorthwindModel"]["Supplier"]["measures"];
      navToMany: {
        Products: "NorthwindModel.Product";
      };
      navToOne: {};
    };
    'NorthwindModel.Order_Detail': {
      keys: TNorthwindV4Selected["NorthwindModel"]["Order_Detail"]["keys"];
      fields: TNorthwindV4Selected["NorthwindModel"]["Order_Detail"]["fields"];
      measures: TNorthwindV4Selected["NorthwindModel"]["Order_Detail"]["measures"];
      navToMany: {};
      navToOne: {
        Order: "NorthwindModel.Order";
        Product: "NorthwindModel.Product";
      };
    };
    'NorthwindModel.Category': {
      keys: TNorthwindV4Selected["NorthwindModel"]["Category"]["keys"];
      fields: TNorthwindV4Selected["NorthwindModel"]["Category"]["fields"];
      measures: TNorthwindV4Selected["NorthwindModel"]["Category"]["measures"];
      navToMany: {
        Products: "NorthwindModel.Product";
      };
      navToOne: {};
    };
  };
  functions: {};
}

/**
 * oData class
 * 
 * Model: NorthwindV4Selected
 * 
 * @example
 * const model = NorthwindV4Selected.getInstance()
 */
export class NorthwindV4Selected extends OData<TNorthwindV4SelectedOData> {
  public static readonly serviceName = "northwindV4Selected" as const;
  private static instance?: NorthwindV4Selected;
  public static getInstance() {
    if (!NorthwindV4Selected.instance) {
      NorthwindV4Selected.instance = new NorthwindV4Selected()
    }
    return NorthwindV4Selected.instance
  }
  public static async entitySet<T extends keyof TNorthwindV4SelectedOData['entitySets']>(name: T) {
    const instance = NorthwindV4Selected.getInstance()
    return instance.entitySet<T>(name)
  }
  private constructor(opts?: TODataOptions) {
    super("northwindV4Selected", {...opts, path: "/odata/northwind-v4"})
  }
}

