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
    "Category": {
      fields: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Category"]["fields"][number];
      keys: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Category"]["keys"][number];
      measures: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Category"]["measures"][number];
    };
    "Order_Detail": {
      fields: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Order_Detail"]["fields"][number];
      keys: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Order_Detail"]["keys"][number];
      measures: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Order_Detail"]["measures"][number];
    };
    "Order": {
      fields: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Order"]["fields"][number];
      keys: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Order"]["keys"][number];
      measures: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Order"]["measures"][number];
    };
    "Customer": {
      fields: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Customer"]["fields"][number];
      keys: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Customer"]["keys"][number];
      measures: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Customer"]["measures"][number];
    };
    "Employee": {
      fields: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Employee"]["fields"][number];
      keys: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Employee"]["keys"][number];
      measures: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Employee"]["measures"][number];
    };
    "Shipper": {
      fields: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Shipper"]["fields"][number];
      keys: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Shipper"]["keys"][number];
      measures: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Shipper"]["measures"][number];
    };
    "Territory": {
      fields: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Territory"]["fields"][number];
      keys: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Territory"]["keys"][number];
      measures: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Territory"]["measures"][number];
    };
    "Region": {
      fields: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Region"]["fields"][number];
      keys: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Region"]["keys"][number];
      measures: (typeof northwindV4SelectedConsts)["NorthwindModel"]["Region"]["measures"][number];
    };
    "CustomerDemographic": {
      fields: (typeof northwindV4SelectedConsts)["NorthwindModel"]["CustomerDemographic"]["fields"][number];
      keys: (typeof northwindV4SelectedConsts)["NorthwindModel"]["CustomerDemographic"]["keys"][number];
      measures: (typeof northwindV4SelectedConsts)["NorthwindModel"]["CustomerDemographic"]["measures"][number];
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
    'Products': "NorthwindModel.Product";
    'Suppliers': "NorthwindModel.Supplier";
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
      record: {
        ProductID: number;
        ProductName?: string;
        SupplierID?: number;
        CategoryID?: number;
        QuantityPerUnit?: string;
        UnitPrice?: number;
        UnitsInStock?: number;
        UnitsOnOrder?: number;
        ReorderLevel?: number;
        Discontinued: boolean;
        Category?: TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Category']['record'] | null;
        Order_Details?: Array<TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Order_Detail']['record']>;
        Supplier?: TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Supplier']['record'] | null;
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
      record: {
        SupplierID: number;
        CompanyName?: string;
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
        Products?: Array<TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Product']['record']>;
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
      record: {
        CategoryID: number;
        CategoryName?: string;
        Description?: string;
        Picture?: string;
        Products?: Array<TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Product']['record']>;
      };
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
      record: {
        OrderID: number;
        ProductID: number;
        UnitPrice: number;
        Quantity: number;
        Discount: number;
        Order?: TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Order']['record'] | null;
        Product?: TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Product']['record'] | null;
      };
    };
    'NorthwindModel.Order': {
      keys: TNorthwindV4Selected["NorthwindModel"]["Order"]["keys"];
      fields: TNorthwindV4Selected["NorthwindModel"]["Order"]["fields"];
      measures: TNorthwindV4Selected["NorthwindModel"]["Order"]["measures"];
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
        Customer?: TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Customer']['record'] | null;
        Employee?: TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Employee']['record'] | null;
        Order_Details?: Array<TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Order_Detail']['record']>;
        Shipper?: TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Shipper']['record'] | null;
      };
    };
    'NorthwindModel.Customer': {
      keys: TNorthwindV4Selected["NorthwindModel"]["Customer"]["keys"];
      fields: TNorthwindV4Selected["NorthwindModel"]["Customer"]["fields"];
      measures: TNorthwindV4Selected["NorthwindModel"]["Customer"]["measures"];
      navToMany: {
        Orders: "NorthwindModel.Order";
        CustomerDemographics: "NorthwindModel.CustomerDemographic";
      };
      navToOne: {};
      record: {
        CustomerID: string;
        CompanyName?: string;
        ContactName?: string;
        ContactTitle?: string;
        Address?: string;
        City?: string;
        Region?: string;
        PostalCode?: string;
        Country?: string;
        Phone?: string;
        Fax?: string;
        Orders?: Array<TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Order']['record']>;
        CustomerDemographics?: Array<TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.CustomerDemographic']['record']>;
      };
    };
    'NorthwindModel.Employee': {
      keys: TNorthwindV4Selected["NorthwindModel"]["Employee"]["keys"];
      fields: TNorthwindV4Selected["NorthwindModel"]["Employee"]["fields"];
      measures: TNorthwindV4Selected["NorthwindModel"]["Employee"]["measures"];
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
        LastName?: string;
        FirstName?: string;
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
        Employees1?: Array<TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Employee']['record']>;
        Employee1?: TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Employee']['record'] | null;
        Orders?: Array<TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Order']['record']>;
        Territories?: Array<TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Territory']['record']>;
      };
    };
    'NorthwindModel.Shipper': {
      keys: TNorthwindV4Selected["NorthwindModel"]["Shipper"]["keys"];
      fields: TNorthwindV4Selected["NorthwindModel"]["Shipper"]["fields"];
      measures: TNorthwindV4Selected["NorthwindModel"]["Shipper"]["measures"];
      navToMany: {
        Orders: "NorthwindModel.Order";
      };
      navToOne: {};
      record: {
        ShipperID: number;
        CompanyName?: string;
        Phone?: string;
        Orders?: Array<TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Order']['record']>;
      };
    };
    'NorthwindModel.Territory': {
      keys: TNorthwindV4Selected["NorthwindModel"]["Territory"]["keys"];
      fields: TNorthwindV4Selected["NorthwindModel"]["Territory"]["fields"];
      measures: TNorthwindV4Selected["NorthwindModel"]["Territory"]["measures"];
      navToMany: {
        Employees: "NorthwindModel.Employee";
      };
      navToOne: {
        Region: "NorthwindModel.Region";
      };
      record: {
        TerritoryID: string;
        TerritoryDescription?: string;
        RegionID: number;
        Region?: TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Region']['record'] | null;
        Employees?: Array<TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Employee']['record']>;
      };
    };
    'NorthwindModel.Region': {
      keys: TNorthwindV4Selected["NorthwindModel"]["Region"]["keys"];
      fields: TNorthwindV4Selected["NorthwindModel"]["Region"]["fields"];
      measures: TNorthwindV4Selected["NorthwindModel"]["Region"]["measures"];
      navToMany: {
        Territories: "NorthwindModel.Territory";
      };
      navToOne: {};
      record: {
        RegionID: number;
        RegionDescription?: string;
        Territories?: Array<TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Territory']['record']>;
      };
    };
    'NorthwindModel.CustomerDemographic': {
      keys: TNorthwindV4Selected["NorthwindModel"]["CustomerDemographic"]["keys"];
      fields: TNorthwindV4Selected["NorthwindModel"]["CustomerDemographic"]["fields"];
      measures: TNorthwindV4Selected["NorthwindModel"]["CustomerDemographic"]["measures"];
      navToMany: {
        Customers: "NorthwindModel.Customer";
      };
      navToOne: {};
      record: {
        CustomerTypeID: string;
        CustomerDesc?: string;
        Customers?: Array<TNorthwindV4SelectedOData['entityTypes']['NorthwindModel.Customer']['record']>;
      };
    };
  };
  complexTypes: {};
  enumTypes: {};
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

