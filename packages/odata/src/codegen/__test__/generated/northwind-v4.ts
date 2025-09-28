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
 * Model: northwindV4
 */
export const northwindV4Consts = {
  "NorthwindModel": {
    "Category": {
      fields: ["CategoryID", "CategoryName", "Description", "Picture"] as const,
      keys: ["CategoryID"] as const,
      measures: [] as const,
    },
    "CustomerDemographic": {
      fields: ["CustomerTypeID", "CustomerDesc"] as const,
      keys: ["CustomerTypeID"] as const,
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
    "Product": {
      fields: ["ProductID", "ProductName", "SupplierID", "CategoryID", "QuantityPerUnit", "UnitPrice", "UnitsInStock", "UnitsOnOrder", "ReorderLevel", "Discontinued"] as const,
      keys: ["ProductID"] as const,
      measures: [] as const,
    },
    "Region": {
      fields: ["RegionID", "RegionDescription"] as const,
      keys: ["RegionID"] as const,
      measures: [] as const,
    },
    "Shipper": {
      fields: ["ShipperID", "CompanyName", "Phone"] as const,
      keys: ["ShipperID"] as const,
      measures: [] as const,
    },
    "Supplier": {
      fields: ["SupplierID", "CompanyName", "ContactName", "ContactTitle", "Address", "City", "Region", "PostalCode", "Country", "Phone", "Fax", "HomePage"] as const,
      keys: ["SupplierID"] as const,
      measures: [] as const,
    },
    "Territory": {
      fields: ["TerritoryID", "TerritoryDescription", "RegionID"] as const,
      keys: ["TerritoryID"] as const,
      measures: [] as const,
    },
    "Alphabetical_list_of_product": {
      fields: ["ProductID", "ProductName", "SupplierID", "CategoryID", "QuantityPerUnit", "UnitPrice", "UnitsInStock", "UnitsOnOrder", "ReorderLevel", "Discontinued", "CategoryName"] as const,
      keys: ["CategoryName", "Discontinued", "ProductID", "ProductName"] as const,
      measures: [] as const,
    },
    "Category_Sales_for_1997": {
      fields: ["CategoryName", "CategorySales"] as const,
      keys: ["CategoryName"] as const,
      measures: [] as const,
    },
    "Current_Product_List": {
      fields: ["ProductID", "ProductName"] as const,
      keys: ["ProductID", "ProductName"] as const,
      measures: [] as const,
    },
    "Customer_and_Suppliers_by_City": {
      fields: ["City", "CompanyName", "ContactName", "Relationship"] as const,
      keys: ["CompanyName", "Relationship"] as const,
      measures: [] as const,
    },
    "Invoice": {
      fields: ["ShipName", "ShipAddress", "ShipCity", "ShipRegion", "ShipPostalCode", "ShipCountry", "CustomerID", "CustomerName", "Address", "City", "Region", "PostalCode", "Country", "Salesperson", "OrderID", "OrderDate", "RequiredDate", "ShippedDate", "ShipperName", "ProductID", "ProductName", "UnitPrice", "Quantity", "Discount", "ExtendedPrice", "Freight"] as const,
      keys: ["CustomerName", "Discount", "OrderID", "ProductID", "ProductName", "Quantity", "Salesperson", "ShipperName", "UnitPrice"] as const,
      measures: [] as const,
    },
    "Order_Details_Extended": {
      fields: ["OrderID", "ProductID", "ProductName", "UnitPrice", "Quantity", "Discount", "ExtendedPrice"] as const,
      keys: ["Discount", "OrderID", "ProductID", "ProductName", "Quantity", "UnitPrice"] as const,
      measures: [] as const,
    },
    "Order_Subtotal": {
      fields: ["OrderID", "Subtotal"] as const,
      keys: ["OrderID"] as const,
      measures: [] as const,
    },
    "Orders_Qry": {
      fields: ["OrderID", "CustomerID", "EmployeeID", "OrderDate", "RequiredDate", "ShippedDate", "ShipVia", "Freight", "ShipName", "ShipAddress", "ShipCity", "ShipRegion", "ShipPostalCode", "ShipCountry", "CompanyName", "Address", "City", "Region", "PostalCode", "Country"] as const,
      keys: ["CompanyName", "OrderID"] as const,
      measures: [] as const,
    },
    "Product_Sales_for_1997": {
      fields: ["CategoryName", "ProductName", "ProductSales"] as const,
      keys: ["CategoryName", "ProductName"] as const,
      measures: [] as const,
    },
    "Products_Above_Average_Price": {
      fields: ["ProductName", "UnitPrice"] as const,
      keys: ["ProductName"] as const,
      measures: [] as const,
    },
    "Products_by_Category": {
      fields: ["CategoryName", "ProductName", "QuantityPerUnit", "UnitsInStock", "Discontinued"] as const,
      keys: ["CategoryName", "Discontinued", "ProductName"] as const,
      measures: [] as const,
    },
    "Sales_by_Category": {
      fields: ["CategoryID", "CategoryName", "ProductName", "ProductSales"] as const,
      keys: ["CategoryID", "CategoryName", "ProductName"] as const,
      measures: [] as const,
    },
    "Sales_Totals_by_Amount": {
      fields: ["SaleAmount", "OrderID", "CompanyName", "ShippedDate"] as const,
      keys: ["CompanyName", "OrderID"] as const,
      measures: [] as const,
    },
    "Summary_of_Sales_by_Quarter": {
      fields: ["ShippedDate", "OrderID", "Subtotal"] as const,
      keys: ["OrderID"] as const,
      measures: [] as const,
    },
    "Summary_of_Sales_by_Year": {
      fields: ["ShippedDate", "OrderID", "Subtotal"] as const,
      keys: ["OrderID"] as const,
      measures: [] as const,
    },
  },
};

/**
 * Types for Keys and Fields
 * 
 * Model: northwindV4
 */
export interface TNorthwindV4 {
  "NorthwindModel": {
    "Category": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Category"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Category"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Category"]["measures"][number];
    };
    "CustomerDemographic": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["CustomerDemographic"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["CustomerDemographic"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["CustomerDemographic"]["measures"][number];
    };
    "Customer": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Customer"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Customer"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Customer"]["measures"][number];
    };
    "Employee": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Employee"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Employee"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Employee"]["measures"][number];
    };
    "Order_Detail": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Order_Detail"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Order_Detail"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Order_Detail"]["measures"][number];
    };
    "Order": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Order"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Order"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Order"]["measures"][number];
    };
    "Product": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Product"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Product"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Product"]["measures"][number];
    };
    "Region": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Region"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Region"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Region"]["measures"][number];
    };
    "Shipper": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Shipper"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Shipper"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Shipper"]["measures"][number];
    };
    "Supplier": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Supplier"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Supplier"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Supplier"]["measures"][number];
    };
    "Territory": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Territory"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Territory"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Territory"]["measures"][number];
    };
    "Alphabetical_list_of_product": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Alphabetical_list_of_product"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Alphabetical_list_of_product"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Alphabetical_list_of_product"]["measures"][number];
    };
    "Category_Sales_for_1997": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Category_Sales_for_1997"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Category_Sales_for_1997"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Category_Sales_for_1997"]["measures"][number];
    };
    "Current_Product_List": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Current_Product_List"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Current_Product_List"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Current_Product_List"]["measures"][number];
    };
    "Customer_and_Suppliers_by_City": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Customer_and_Suppliers_by_City"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Customer_and_Suppliers_by_City"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Customer_and_Suppliers_by_City"]["measures"][number];
    };
    "Invoice": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Invoice"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Invoice"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Invoice"]["measures"][number];
    };
    "Order_Details_Extended": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Order_Details_Extended"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Order_Details_Extended"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Order_Details_Extended"]["measures"][number];
    };
    "Order_Subtotal": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Order_Subtotal"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Order_Subtotal"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Order_Subtotal"]["measures"][number];
    };
    "Orders_Qry": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Orders_Qry"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Orders_Qry"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Orders_Qry"]["measures"][number];
    };
    "Product_Sales_for_1997": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Product_Sales_for_1997"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Product_Sales_for_1997"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Product_Sales_for_1997"]["measures"][number];
    };
    "Products_Above_Average_Price": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Products_Above_Average_Price"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Products_Above_Average_Price"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Products_Above_Average_Price"]["measures"][number];
    };
    "Products_by_Category": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Products_by_Category"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Products_by_Category"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Products_by_Category"]["measures"][number];
    };
    "Sales_by_Category": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Sales_by_Category"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Sales_by_Category"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Sales_by_Category"]["measures"][number];
    };
    "Sales_Totals_by_Amount": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Sales_Totals_by_Amount"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Sales_Totals_by_Amount"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Sales_Totals_by_Amount"]["measures"][number];
    };
    "Summary_of_Sales_by_Quarter": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Summary_of_Sales_by_Quarter"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Summary_of_Sales_by_Quarter"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Summary_of_Sales_by_Quarter"]["measures"][number];
    };
    "Summary_of_Sales_by_Year": {
      fields: (typeof northwindV4Consts)["NorthwindModel"]["Summary_of_Sales_by_Year"]["fields"][number];
      keys: (typeof northwindV4Consts)["NorthwindModel"]["Summary_of_Sales_by_Year"]["keys"][number];
      measures: (typeof northwindV4Consts)["NorthwindModel"]["Summary_of_Sales_by_Year"]["measures"][number];
    };
  };
}

/**
 * Main OData Interface
 * 
 * Model: northwindV4
 */
export interface TNorthwindV4OData extends TOdataDummyInterface {
  entitySets: {
    'Categories': "NorthwindModel.Category";
    'CustomerDemographics': "NorthwindModel.CustomerDemographic";
    'Customers': "NorthwindModel.Customer";
    'Employees': "NorthwindModel.Employee";
    'Order_Details': "NorthwindModel.Order_Detail";
    'Orders': "NorthwindModel.Order";
    'Products': "NorthwindModel.Product";
    'Regions': "NorthwindModel.Region";
    'Shippers': "NorthwindModel.Shipper";
    'Suppliers': "NorthwindModel.Supplier";
    'Territories': "NorthwindModel.Territory";
    'Alphabetical_list_of_products': "NorthwindModel.Alphabetical_list_of_product";
    'Category_Sales_for_1997': "NorthwindModel.Category_Sales_for_1997";
    'Current_Product_Lists': "NorthwindModel.Current_Product_List";
    'Customer_and_Suppliers_by_Cities': "NorthwindModel.Customer_and_Suppliers_by_City";
    'Invoices': "NorthwindModel.Invoice";
    'Order_Details_Extendeds': "NorthwindModel.Order_Details_Extended";
    'Order_Subtotals': "NorthwindModel.Order_Subtotal";
    'Orders_Qries': "NorthwindModel.Orders_Qry";
    'Product_Sales_for_1997': "NorthwindModel.Product_Sales_for_1997";
    'Products_Above_Average_Prices': "NorthwindModel.Products_Above_Average_Price";
    'Products_by_Categories': "NorthwindModel.Products_by_Category";
    'Sales_by_Categories': "NorthwindModel.Sales_by_Category";
    'Sales_Totals_by_Amounts': "NorthwindModel.Sales_Totals_by_Amount";
    'Summary_of_Sales_by_Quarters': "NorthwindModel.Summary_of_Sales_by_Quarter";
    'Summary_of_Sales_by_Years': "NorthwindModel.Summary_of_Sales_by_Year";
  };
  entityTypes: {
    'NorthwindModel.Category': {
      keys: TNorthwindV4["NorthwindModel"]["Category"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Category"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Category"]["measures"];
      navToMany: {
        Products: "NorthwindModel.Product";
      };
      navToOne: {};
      record: {
        CategoryID: number;
        CategoryName?: string;
        Description?: string;
        Picture?: string;
        Products?: Array<TNorthwindV4OData['entityTypes']['NorthwindModel.Product']['record']>;
      };
    };
    'NorthwindModel.CustomerDemographic': {
      keys: TNorthwindV4["NorthwindModel"]["CustomerDemographic"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["CustomerDemographic"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["CustomerDemographic"]["measures"];
      navToMany: {
        Customers: "NorthwindModel.Customer";
      };
      navToOne: {};
      record: {
        CustomerTypeID: string;
        CustomerDesc?: string;
        Customers?: Array<TNorthwindV4OData['entityTypes']['NorthwindModel.Customer']['record']>;
      };
    };
    'NorthwindModel.Customer': {
      keys: TNorthwindV4["NorthwindModel"]["Customer"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Customer"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Customer"]["measures"];
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
        Orders?: Array<TNorthwindV4OData['entityTypes']['NorthwindModel.Order']['record']>;
        CustomerDemographics?: Array<TNorthwindV4OData['entityTypes']['NorthwindModel.CustomerDemographic']['record']>;
      };
    };
    'NorthwindModel.Employee': {
      keys: TNorthwindV4["NorthwindModel"]["Employee"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Employee"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Employee"]["measures"];
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
        Employees1?: Array<TNorthwindV4OData['entityTypes']['NorthwindModel.Employee']['record']>;
        Employee1?: TNorthwindV4OData['entityTypes']['NorthwindModel.Employee']['record'] | null;
        Orders?: Array<TNorthwindV4OData['entityTypes']['NorthwindModel.Order']['record']>;
        Territories?: Array<TNorthwindV4OData['entityTypes']['NorthwindModel.Territory']['record']>;
      };
    };
    'NorthwindModel.Order_Detail': {
      keys: TNorthwindV4["NorthwindModel"]["Order_Detail"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Order_Detail"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Order_Detail"]["measures"];
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
        Order?: TNorthwindV4OData['entityTypes']['NorthwindModel.Order']['record'] | null;
        Product?: TNorthwindV4OData['entityTypes']['NorthwindModel.Product']['record'] | null;
      };
    };
    'NorthwindModel.Order': {
      keys: TNorthwindV4["NorthwindModel"]["Order"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Order"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Order"]["measures"];
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
        Customer?: TNorthwindV4OData['entityTypes']['NorthwindModel.Customer']['record'] | null;
        Employee?: TNorthwindV4OData['entityTypes']['NorthwindModel.Employee']['record'] | null;
        Order_Details?: Array<TNorthwindV4OData['entityTypes']['NorthwindModel.Order_Detail']['record']>;
        Shipper?: TNorthwindV4OData['entityTypes']['NorthwindModel.Shipper']['record'] | null;
      };
    };
    'NorthwindModel.Product': {
      keys: TNorthwindV4["NorthwindModel"]["Product"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Product"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Product"]["measures"];
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
        Category?: TNorthwindV4OData['entityTypes']['NorthwindModel.Category']['record'] | null;
        Order_Details?: Array<TNorthwindV4OData['entityTypes']['NorthwindModel.Order_Detail']['record']>;
        Supplier?: TNorthwindV4OData['entityTypes']['NorthwindModel.Supplier']['record'] | null;
      };
    };
    'NorthwindModel.Region': {
      keys: TNorthwindV4["NorthwindModel"]["Region"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Region"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Region"]["measures"];
      navToMany: {
        Territories: "NorthwindModel.Territory";
      };
      navToOne: {};
      record: {
        RegionID: number;
        RegionDescription?: string;
        Territories?: Array<TNorthwindV4OData['entityTypes']['NorthwindModel.Territory']['record']>;
      };
    };
    'NorthwindModel.Shipper': {
      keys: TNorthwindV4["NorthwindModel"]["Shipper"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Shipper"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Shipper"]["measures"];
      navToMany: {
        Orders: "NorthwindModel.Order";
      };
      navToOne: {};
      record: {
        ShipperID: number;
        CompanyName?: string;
        Phone?: string;
        Orders?: Array<TNorthwindV4OData['entityTypes']['NorthwindModel.Order']['record']>;
      };
    };
    'NorthwindModel.Supplier': {
      keys: TNorthwindV4["NorthwindModel"]["Supplier"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Supplier"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Supplier"]["measures"];
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
        Products?: Array<TNorthwindV4OData['entityTypes']['NorthwindModel.Product']['record']>;
      };
    };
    'NorthwindModel.Territory': {
      keys: TNorthwindV4["NorthwindModel"]["Territory"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Territory"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Territory"]["measures"];
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
        Region?: TNorthwindV4OData['entityTypes']['NorthwindModel.Region']['record'] | null;
        Employees?: Array<TNorthwindV4OData['entityTypes']['NorthwindModel.Employee']['record']>;
      };
    };
    'NorthwindModel.Alphabetical_list_of_product': {
      keys: TNorthwindV4["NorthwindModel"]["Alphabetical_list_of_product"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Alphabetical_list_of_product"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Alphabetical_list_of_product"]["measures"];
      navToMany: {};
      navToOne: {};
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
        CategoryName: string;
      };
    };
    'NorthwindModel.Category_Sales_for_1997': {
      keys: TNorthwindV4["NorthwindModel"]["Category_Sales_for_1997"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Category_Sales_for_1997"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Category_Sales_for_1997"]["measures"];
      navToMany: {};
      navToOne: {};
      record: {
        CategoryName: string;
        CategorySales?: number;
      };
    };
    'NorthwindModel.Current_Product_List': {
      keys: TNorthwindV4["NorthwindModel"]["Current_Product_List"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Current_Product_List"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Current_Product_List"]["measures"];
      navToMany: {};
      navToOne: {};
      record: {
        ProductID: number;
        ProductName: string;
      };
    };
    'NorthwindModel.Customer_and_Suppliers_by_City': {
      keys: TNorthwindV4["NorthwindModel"]["Customer_and_Suppliers_by_City"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Customer_and_Suppliers_by_City"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Customer_and_Suppliers_by_City"]["measures"];
      navToMany: {};
      navToOne: {};
      record: {
        City?: string;
        CompanyName: string;
        ContactName?: string;
        Relationship: string;
      };
    };
    'NorthwindModel.Invoice': {
      keys: TNorthwindV4["NorthwindModel"]["Invoice"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Invoice"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Invoice"]["measures"];
      navToMany: {};
      navToOne: {};
      record: {
        ShipName?: string;
        ShipAddress?: string;
        ShipCity?: string;
        ShipRegion?: string;
        ShipPostalCode?: string;
        ShipCountry?: string;
        CustomerID?: string;
        CustomerName: string;
        Address?: string;
        City?: string;
        Region?: string;
        PostalCode?: string;
        Country?: string;
        Salesperson: string;
        OrderID: number;
        OrderDate?: string;
        RequiredDate?: string;
        ShippedDate?: string;
        ShipperName: string;
        ProductID: number;
        ProductName: string;
        UnitPrice: number;
        Quantity: number;
        Discount: number;
        ExtendedPrice?: number;
        Freight?: number;
      };
    };
    'NorthwindModel.Order_Details_Extended': {
      keys: TNorthwindV4["NorthwindModel"]["Order_Details_Extended"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Order_Details_Extended"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Order_Details_Extended"]["measures"];
      navToMany: {};
      navToOne: {};
      record: {
        OrderID: number;
        ProductID: number;
        ProductName: string;
        UnitPrice: number;
        Quantity: number;
        Discount: number;
        ExtendedPrice?: number;
      };
    };
    'NorthwindModel.Order_Subtotal': {
      keys: TNorthwindV4["NorthwindModel"]["Order_Subtotal"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Order_Subtotal"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Order_Subtotal"]["measures"];
      navToMany: {};
      navToOne: {};
      record: {
        OrderID: number;
        Subtotal?: number;
      };
    };
    'NorthwindModel.Orders_Qry': {
      keys: TNorthwindV4["NorthwindModel"]["Orders_Qry"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Orders_Qry"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Orders_Qry"]["measures"];
      navToMany: {};
      navToOne: {};
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
        CompanyName: string;
        Address?: string;
        City?: string;
        Region?: string;
        PostalCode?: string;
        Country?: string;
      };
    };
    'NorthwindModel.Product_Sales_for_1997': {
      keys: TNorthwindV4["NorthwindModel"]["Product_Sales_for_1997"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Product_Sales_for_1997"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Product_Sales_for_1997"]["measures"];
      navToMany: {};
      navToOne: {};
      record: {
        CategoryName: string;
        ProductName: string;
        ProductSales?: number;
      };
    };
    'NorthwindModel.Products_Above_Average_Price': {
      keys: TNorthwindV4["NorthwindModel"]["Products_Above_Average_Price"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Products_Above_Average_Price"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Products_Above_Average_Price"]["measures"];
      navToMany: {};
      navToOne: {};
      record: {
        ProductName: string;
        UnitPrice?: number;
      };
    };
    'NorthwindModel.Products_by_Category': {
      keys: TNorthwindV4["NorthwindModel"]["Products_by_Category"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Products_by_Category"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Products_by_Category"]["measures"];
      navToMany: {};
      navToOne: {};
      record: {
        CategoryName: string;
        ProductName: string;
        QuantityPerUnit?: string;
        UnitsInStock?: number;
        Discontinued: boolean;
      };
    };
    'NorthwindModel.Sales_by_Category': {
      keys: TNorthwindV4["NorthwindModel"]["Sales_by_Category"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Sales_by_Category"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Sales_by_Category"]["measures"];
      navToMany: {};
      navToOne: {};
      record: {
        CategoryID: number;
        CategoryName: string;
        ProductName: string;
        ProductSales?: number;
      };
    };
    'NorthwindModel.Sales_Totals_by_Amount': {
      keys: TNorthwindV4["NorthwindModel"]["Sales_Totals_by_Amount"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Sales_Totals_by_Amount"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Sales_Totals_by_Amount"]["measures"];
      navToMany: {};
      navToOne: {};
      record: {
        SaleAmount?: number;
        OrderID: number;
        CompanyName: string;
        ShippedDate?: string;
      };
    };
    'NorthwindModel.Summary_of_Sales_by_Quarter': {
      keys: TNorthwindV4["NorthwindModel"]["Summary_of_Sales_by_Quarter"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Summary_of_Sales_by_Quarter"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Summary_of_Sales_by_Quarter"]["measures"];
      navToMany: {};
      navToOne: {};
      record: {
        ShippedDate?: string;
        OrderID: number;
        Subtotal?: number;
      };
    };
    'NorthwindModel.Summary_of_Sales_by_Year': {
      keys: TNorthwindV4["NorthwindModel"]["Summary_of_Sales_by_Year"]["keys"];
      fields: TNorthwindV4["NorthwindModel"]["Summary_of_Sales_by_Year"]["fields"];
      measures: TNorthwindV4["NorthwindModel"]["Summary_of_Sales_by_Year"]["measures"];
      navToMany: {};
      navToOne: {};
      record: {
        ShippedDate?: string;
        OrderID: number;
        Subtotal?: number;
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
 * Model: NorthwindV4
 * 
 * @example
 * const model = NorthwindV4.getInstance()
 */
export class NorthwindV4 extends OData<TNorthwindV4OData> {
  public static readonly serviceName = "northwindV4" as const;
  private static instance?: NorthwindV4;
  public static getInstance() {
    if (!NorthwindV4.instance) {
      NorthwindV4.instance = new NorthwindV4()
    }
    return NorthwindV4.instance
  }
  public static async entitySet<T extends keyof TNorthwindV4OData['entitySets']>(name: T) {
    const instance = NorthwindV4.getInstance()
    return instance.entitySet<T>(name)
  }
  private constructor(opts?: TODataOptions) {
    super("northwindV4", {...opts, path: "/V4/Northwind/Northwind.svc"})
  }
}

