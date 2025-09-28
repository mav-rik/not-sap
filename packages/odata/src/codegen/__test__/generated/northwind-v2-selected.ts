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
      keys: ["ProductID"] as const,
      measures: [] as const,
    },
    "Supplier": {
      fields: ["SupplierID", "CompanyName", "ContactName", "ContactTitle", "Address", "City", "Region", "PostalCode", "Country", "Phone", "Fax", "HomePage"] as const,
      keys: ["SupplierID"] as const,
      measures: [] as const,
    },
    "Category": {
      fields: ["CategoryID", "CategoryName", "Description", "Picture"] as const,
      keys: ["CategoryID"] as const,
      measures: [] as const,
    },
    "Order_Detail": {
      fields: ["OrderID", "ProductID", "UnitPrice", "Quantity", "Discount"] as const,
      keys: ["OrderID", "ProductID"] as const,
      measures: [] as const,
    },
    "Order": {
      fields: ["OrderID", "CustomerID", "EmployeeID", "OrderDate", "RequiredDate", "ShippedDate", "ShipVia", "Freight", "ShipName", "ShipAddress", "ShipCity", "ShipRegion", "ShipPostalCode", "ShipCountry"] as const,
      keys: ["OrderID"] as const,
      measures: [] as const,
    },
    "Customer": {
      fields: ["CustomerID", "CompanyName", "ContactName", "ContactTitle", "Address", "City", "Region", "PostalCode", "Country", "Phone", "Fax"] as const,
      keys: ["CustomerID"] as const,
      measures: [] as const,
    },
    "Employee": {
      fields: ["EmployeeID", "LastName", "FirstName", "Title", "TitleOfCourtesy", "BirthDate", "HireDate", "Address", "City", "Region", "PostalCode", "Country", "HomePhone", "Extension", "Photo", "Notes", "ReportsTo", "PhotoPath"] as const,
      keys: ["EmployeeID"] as const,
      measures: [] as const,
    },
    "Shipper": {
      fields: ["ShipperID", "CompanyName", "Phone"] as const,
      keys: ["ShipperID"] as const,
      measures: [] as const,
    },
    "Territory": {
      fields: ["TerritoryID", "TerritoryDescription", "RegionID"] as const,
      keys: ["TerritoryID"] as const,
      measures: [] as const,
    },
    "Region": {
      fields: ["RegionID", "RegionDescription"] as const,
      keys: ["RegionID"] as const,
      measures: [] as const,
    },
    "CustomerDemographic": {
      fields: ["CustomerTypeID", "CustomerDesc"] as const,
      keys: ["CustomerTypeID"] as const,
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
    "Category": {
      fields: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Category"]["fields"][number];
      keys: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Category"]["keys"][number];
      measures: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Category"]["measures"][number];
    };
    "Order_Detail": {
      fields: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Order_Detail"]["fields"][number];
      keys: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Order_Detail"]["keys"][number];
      measures: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Order_Detail"]["measures"][number];
    };
    "Order": {
      fields: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Order"]["fields"][number];
      keys: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Order"]["keys"][number];
      measures: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Order"]["measures"][number];
    };
    "Customer": {
      fields: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Customer"]["fields"][number];
      keys: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Customer"]["keys"][number];
      measures: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Customer"]["measures"][number];
    };
    "Employee": {
      fields: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Employee"]["fields"][number];
      keys: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Employee"]["keys"][number];
      measures: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Employee"]["measures"][number];
    };
    "Shipper": {
      fields: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Shipper"]["fields"][number];
      keys: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Shipper"]["keys"][number];
      measures: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Shipper"]["measures"][number];
    };
    "Territory": {
      fields: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Territory"]["fields"][number];
      keys: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Territory"]["keys"][number];
      measures: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Territory"]["measures"][number];
    };
    "Region": {
      fields: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Region"]["fields"][number];
      keys: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Region"]["keys"][number];
      measures: (typeof northwindV2SelectedConsts)["NorthwindModel"]["Region"]["measures"][number];
    };
    "CustomerDemographic": {
      fields: (typeof northwindV2SelectedConsts)["NorthwindModel"]["CustomerDemographic"]["fields"][number];
      keys: (typeof northwindV2SelectedConsts)["NorthwindModel"]["CustomerDemographic"]["keys"][number];
      measures: (typeof northwindV2SelectedConsts)["NorthwindModel"]["CustomerDemographic"]["measures"][number];
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
    'Products': "NorthwindModel.Product";
    'Suppliers': "NorthwindModel.Supplier";
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
      record: {
        ProductID: number;
        ProductName: string;
        SupplierID?: number;
        CategoryID?: number;
        QuantityPerUnit?: string;
        UnitPrice?: number;
        UnitsInStock?: number;
        UnitsOnOrder?: number;
        ReorderLevel?: number;
        Discontinued: boolean;
        Category?: TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Category']['record'] | null;
        Order_Details?: { results: Array<TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Order_Detail']['record']> };
        Supplier?: TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Supplier']['record'] | null;
      };
      actions: never;
      functions: never;
    };
    'NorthwindModel.Supplier': {
      keys: TNorthwindV2Selected["NorthwindModel"]["Supplier"]["keys"];
      fields: TNorthwindV2Selected["NorthwindModel"]["Supplier"]["fields"];
      measures: TNorthwindV2Selected["NorthwindModel"]["Supplier"]["measures"];
      navToMany: {
        Products: "NorthwindModel.Product";
      };
      navToOne: {};
      record: {
        SupplierID: number;
        CompanyName: string;
        ContactName?: string;
        ContactTitle?: string;
        Address?: string;
        City?: string;
        Region?: string;
        PostalCode?: string;
        Country?: string;
        Phone?: string;
        Fax?: string;
        HomePage?: string;
        Products?: { results: Array<TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Product']['record']> };
      };
      actions: never;
      functions: never;
    };
    'NorthwindModel.Category': {
      keys: TNorthwindV2Selected["NorthwindModel"]["Category"]["keys"];
      fields: TNorthwindV2Selected["NorthwindModel"]["Category"]["fields"];
      measures: TNorthwindV2Selected["NorthwindModel"]["Category"]["measures"];
      navToMany: {
        Products: "NorthwindModel.Product";
      };
      navToOne: {};
      record: {
        CategoryID: number;
        CategoryName: string;
        Description?: string;
        Picture?: string;
        Products?: { results: Array<TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Product']['record']> };
      };
      actions: never;
      functions: never;
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
      record: {
        OrderID: number;
        ProductID: number;
        UnitPrice: number;
        Quantity: number;
        Discount: number;
        Order?: TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Order']['record'] | null;
        Product?: TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Product']['record'] | null;
      };
      actions: never;
      functions: never;
    };
    'NorthwindModel.Order': {
      keys: TNorthwindV2Selected["NorthwindModel"]["Order"]["keys"];
      fields: TNorthwindV2Selected["NorthwindModel"]["Order"]["fields"];
      measures: TNorthwindV2Selected["NorthwindModel"]["Order"]["measures"];
      navToMany: {
        Order_Details: "NorthwindModel.Order_Detail";
      };
      navToOne: {
        Customer: "NorthwindModel.Customer";
        Employee: "NorthwindModel.Employee";
        Shipper: "NorthwindModel.Shipper";
      };
      record: {
        OrderID: number;
        CustomerID?: string;
        EmployeeID?: number;
        OrderDate?: string;
        RequiredDate?: string;
        ShippedDate?: string;
        ShipVia?: number;
        Freight?: number;
        ShipName?: string;
        ShipAddress?: string;
        ShipCity?: string;
        ShipRegion?: string;
        ShipPostalCode?: string;
        ShipCountry?: string;
        Customer?: TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Customer']['record'] | null;
        Employee?: TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Employee']['record'] | null;
        Order_Details?: { results: Array<TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Order_Detail']['record']> };
        Shipper?: TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Shipper']['record'] | null;
      };
      actions: never;
      functions: never;
    };
    'NorthwindModel.Customer': {
      keys: TNorthwindV2Selected["NorthwindModel"]["Customer"]["keys"];
      fields: TNorthwindV2Selected["NorthwindModel"]["Customer"]["fields"];
      measures: TNorthwindV2Selected["NorthwindModel"]["Customer"]["measures"];
      navToMany: {
        Orders: "NorthwindModel.Order";
        CustomerDemographics: "NorthwindModel.CustomerDemographic";
      };
      navToOne: {};
      record: {
        CustomerID: string;
        CompanyName: string;
        ContactName?: string;
        ContactTitle?: string;
        Address?: string;
        City?: string;
        Region?: string;
        PostalCode?: string;
        Country?: string;
        Phone?: string;
        Fax?: string;
        Orders?: { results: Array<TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Order']['record']> };
        CustomerDemographics?: { results: Array<TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.CustomerDemographic']['record']> };
      };
      actions: never;
      functions: never;
    };
    'NorthwindModel.Employee': {
      keys: TNorthwindV2Selected["NorthwindModel"]["Employee"]["keys"];
      fields: TNorthwindV2Selected["NorthwindModel"]["Employee"]["fields"];
      measures: TNorthwindV2Selected["NorthwindModel"]["Employee"]["measures"];
      navToMany: {
        Employees1: "NorthwindModel.Employee";
        Orders: "NorthwindModel.Order";
        Territories: "NorthwindModel.Territory";
      };
      navToOne: {
        Employee1: "NorthwindModel.Employee";
      };
      record: {
        EmployeeID: number;
        LastName: string;
        FirstName: string;
        Title?: string;
        TitleOfCourtesy?: string;
        BirthDate?: string;
        HireDate?: string;
        Address?: string;
        City?: string;
        Region?: string;
        PostalCode?: string;
        Country?: string;
        HomePhone?: string;
        Extension?: string;
        Photo?: string;
        Notes?: string;
        ReportsTo?: number;
        PhotoPath?: string;
        Employees1?: { results: Array<TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Employee']['record']> };
        Employee1?: TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Employee']['record'] | null;
        Orders?: { results: Array<TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Order']['record']> };
        Territories?: { results: Array<TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Territory']['record']> };
      };
      actions: never;
      functions: never;
    };
    'NorthwindModel.Shipper': {
      keys: TNorthwindV2Selected["NorthwindModel"]["Shipper"]["keys"];
      fields: TNorthwindV2Selected["NorthwindModel"]["Shipper"]["fields"];
      measures: TNorthwindV2Selected["NorthwindModel"]["Shipper"]["measures"];
      navToMany: {
        Orders: "NorthwindModel.Order";
      };
      navToOne: {};
      record: {
        ShipperID: number;
        CompanyName: string;
        Phone?: string;
        Orders?: { results: Array<TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Order']['record']> };
      };
      actions: never;
      functions: never;
    };
    'NorthwindModel.Territory': {
      keys: TNorthwindV2Selected["NorthwindModel"]["Territory"]["keys"];
      fields: TNorthwindV2Selected["NorthwindModel"]["Territory"]["fields"];
      measures: TNorthwindV2Selected["NorthwindModel"]["Territory"]["measures"];
      navToMany: {
        Employees: "NorthwindModel.Employee";
      };
      navToOne: {
        Region: "NorthwindModel.Region";
      };
      record: {
        TerritoryID: string;
        TerritoryDescription: string;
        RegionID: number;
        Region?: TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Region']['record'] | null;
        Employees?: { results: Array<TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Employee']['record']> };
      };
      actions: never;
      functions: never;
    };
    'NorthwindModel.Region': {
      keys: TNorthwindV2Selected["NorthwindModel"]["Region"]["keys"];
      fields: TNorthwindV2Selected["NorthwindModel"]["Region"]["fields"];
      measures: TNorthwindV2Selected["NorthwindModel"]["Region"]["measures"];
      navToMany: {
        Territories: "NorthwindModel.Territory";
      };
      navToOne: {};
      record: {
        RegionID: number;
        RegionDescription: string;
        Territories?: { results: Array<TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Territory']['record']> };
      };
      actions: never;
      functions: never;
    };
    'NorthwindModel.CustomerDemographic': {
      keys: TNorthwindV2Selected["NorthwindModel"]["CustomerDemographic"]["keys"];
      fields: TNorthwindV2Selected["NorthwindModel"]["CustomerDemographic"]["fields"];
      measures: TNorthwindV2Selected["NorthwindModel"]["CustomerDemographic"]["measures"];
      navToMany: {
        Customers: "NorthwindModel.Customer";
      };
      navToOne: {};
      record: {
        CustomerTypeID: string;
        CustomerDesc?: string;
        Customers?: { results: Array<TNorthwindV2SelectedOData['entityTypes']['NorthwindModel.Customer']['record']> };
      };
      actions: never;
      functions: never;
    };
  };
  complexTypes: {};
  enumTypes: {};
  functions: {};
  actions: {};
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

