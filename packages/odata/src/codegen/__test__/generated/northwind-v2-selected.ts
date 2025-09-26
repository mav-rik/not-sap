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
 * Model: northwindV2Selected
 */
export const northwindV2SelectedConsts = {
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
 * Model: northwindV2Selected
 */
export interface TNorthwindV2Selected {
  "NorthwindModel": {
    "Product": {
      fields: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Product"]["fields"][number];
      keys: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Product"]["keys"][number];
      measures: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Product"]["measures"][number];
    };
    "Supplier": {
      fields: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Supplier"]["fields"][number];
      keys: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Supplier"]["keys"][number];
      measures: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Supplier"]["measures"][number];
    };
    "Order_Detail": {
      fields: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Order_Detail"]["fields"][number];
      keys: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Order_Detail"]["keys"][number];
      measures: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Order_Detail"]["measures"][number];
    };
    "Category": {
      fields: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Category"]["fields"][number];
      keys: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Category"]["keys"][number];
      measures: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Category"]["measures"][number];
    };
  };
}

/**
 * Main OData Interface
 * 
 * Model: northwindV2Selected
 */
export interface TNorthwindV2SelectedOData extends TOdataDummyInterface {
  entitySets: {
    'ODataWeb.Northwind.Model.Products': "NorthwindModel.Product";
    'ODataWeb.Northwind.Model.Suppliers': "NorthwindModel.Supplier";
  };
  entityTypes: {
    'NorthwindModel.Product': {
      keys: TNorthwindV2Selected["NorthwindModel"]["Product"]["keys"];
      fields: TNorthwindV2Selected["NorthwindModel"]["Product"]["fields"];
      measures: TNorthwindV2Selected["NorthwindModel"]["Product"]["measures"];
      navToMany: {
        Order_Details: "NorthwindModel.Order_Detail";
      };
      navToOne: {
        Category: "NorthwindModel.Category";
        Supplier: "NorthwindModel.Supplier";
      };
    };
    'NorthwindModel.Supplier': {
      keys: TNorthwindV2Selected["NorthwindModel"]["Supplier"]["keys"];
      fields: TNorthwindV2Selected["NorthwindModel"]["Supplier"]["fields"];
      measures: TNorthwindV2Selected["NorthwindModel"]["Supplier"]["measures"];
      navToMany: {
        Products: "NorthwindModel.Product";
      };
      navToOne: {};
    };
    'NorthwindModel.Order_Detail': {
      keys: TNorthwindV2Selected["NorthwindModel"]["Order_Detail"]["keys"];
      fields: TNorthwindV2Selected["NorthwindModel"]["Order_Detail"]["fields"];
      measures: TNorthwindV2Selected["NorthwindModel"]["Order_Detail"]["measures"];
      navToMany: {};
      navToOne: {
        Order: "NorthwindModel.Order";
        Product: "NorthwindModel.Product";
      };
    };
    'NorthwindModel.Category': {
      keys: TNorthwindV2Selected["NorthwindModel"]["Category"]["keys"];
      fields: TNorthwindV2Selected["NorthwindModel"]["Category"]["fields"];
      measures: TNorthwindV2Selected["NorthwindModel"]["Category"]["measures"];
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
 * Model: NorthwindV2Selected
 * 
 * @example
 * const model = NorthwindV2Selected.getInstance()
 */
export class NorthwindV2Selected extends OData<TNorthwindV2SelectedOData> {
  public static readonly serviceName = "northwindV2Selected" as const;
  private static instance?: NorthwindV2Selected;
  public static getInstance() {
    if (!NorthwindV2Selected.instance) {
      NorthwindV2Selected.instance = new NorthwindV2Selected()
    }
    return NorthwindV2Selected.instance
  }
  public static async entitySet<T extends keyof TNorthwindV2SelectedOData['entitySets']>(name: T) {
    const instance = NorthwindV2Selected.getInstance()
    return instance.entitySet<T>(name)
  }
  private constructor(opts?: TODataOptions) {
    super("northwindV2Selected", {...opts, path: "/odata/northwind-v2"})
  }
}

