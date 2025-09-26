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
 * Model: northwindV2
 */
export const northwindV2Consts = {
  "NorthwindModel": {
    "Category": {
      fields: ["CategoryID", "CategoryName", "Description", "Picture"] as const,
      keys: ["CategoryID", "CategoryName", "Description", "Picture"] as const,
      measures: [] as const,
    },
    "CustomerDemographic": {
      fields: ["CustomerTypeID", "CustomerDesc"] as const,
      keys: ["CustomerTypeID", "CustomerDesc"] as const,
      measures: [] as const,
    },
    "Customer": {
      fields: ["CustomerID", "CompanyName", "ContactName", "ContactTitle", "Address", "City", "Region", "PostalCode", "Country", "Phone", "Fax"] as const,
      keys: ["CustomerID", "CompanyName", "ContactName", "ContactTitle", "Address", "City", "Region", "PostalCode", "Country", "Phone", "Fax"] as const,
      measures: [] as const,
    },
    "Employee": {
      fields: ["EmployeeID", "LastName", "FirstName", "Title", "TitleOfCourtesy", "BirthDate", "HireDate", "Address", "City", "Region", "PostalCode", "Country", "HomePhone", "Extension", "Photo", "Notes", "ReportsTo", "PhotoPath"] as const,
      keys: ["EmployeeID", "LastName", "FirstName", "Title", "TitleOfCourtesy", "BirthDate", "HireDate", "Address", "City", "Region", "PostalCode", "Country", "HomePhone", "Extension", "Photo", "Notes", "ReportsTo", "PhotoPath"] as const,
      measures: [] as const,
    },
    "Order_Detail": {
      fields: ["OrderID", "ProductID", "UnitPrice", "Quantity", "Discount"] as const,
      keys: ["OrderID", "ProductID", "UnitPrice", "Quantity", "Discount"] as const,
      measures: [] as const,
    },
    "Order": {
      fields: ["OrderID", "CustomerID", "EmployeeID", "OrderDate", "RequiredDate", "ShippedDate", "ShipVia", "Freight", "ShipName", "ShipAddress", "ShipCity", "ShipRegion", "ShipPostalCode", "ShipCountry"] as const,
      keys: ["OrderID", "CustomerID", "EmployeeID", "OrderDate", "RequiredDate", "ShippedDate", "ShipVia", "Freight", "ShipName", "ShipAddress", "ShipCity", "ShipRegion", "ShipPostalCode", "ShipCountry"] as const,
      measures: [] as const,
    },
    "Product": {
      fields: ["ProductID", "ProductName", "SupplierID", "CategoryID", "QuantityPerUnit", "UnitPrice", "UnitsInStock", "UnitsOnOrder", "ReorderLevel", "Discontinued"] as const,
      keys: ["ProductID", "ProductName", "SupplierID", "CategoryID", "QuantityPerUnit", "UnitPrice", "UnitsInStock", "UnitsOnOrder", "ReorderLevel", "Discontinued"] as const,
      measures: [] as const,
    },
    "Region": {
      fields: ["RegionID", "RegionDescription"] as const,
      keys: ["RegionID", "RegionDescription"] as const,
      measures: [] as const,
    },
    "Shipper": {
      fields: ["ShipperID", "CompanyName", "Phone"] as const,
      keys: ["ShipperID", "CompanyName", "Phone"] as const,
      measures: [] as const,
    },
    "Supplier": {
      fields: ["SupplierID", "CompanyName", "ContactName", "ContactTitle", "Address", "City", "Region", "PostalCode", "Country", "Phone", "Fax", "HomePage"] as const,
      keys: ["SupplierID", "CompanyName", "ContactName", "ContactTitle", "Address", "City", "Region", "PostalCode", "Country", "Phone", "Fax", "HomePage"] as const,
      measures: [] as const,
    },
    "Territory": {
      fields: ["TerritoryID", "TerritoryDescription", "RegionID"] as const,
      keys: ["TerritoryID", "TerritoryDescription", "RegionID"] as const,
      measures: [] as const,
    },
    "Alphabetical_list_of_product": {
      fields: ["ProductID", "ProductName", "SupplierID", "CategoryID", "QuantityPerUnit", "UnitPrice", "UnitsInStock", "UnitsOnOrder", "ReorderLevel", "Discontinued", "CategoryName"] as const,
      keys: ["ProductID", "ProductName", "SupplierID", "CategoryID", "QuantityPerUnit", "UnitPrice", "UnitsInStock", "UnitsOnOrder", "ReorderLevel", "Discontinued", "CategoryName"] as const,
      measures: [] as const,
    },
    "Category_Sales_for_1997": {
      fields: ["CategoryName", "CategorySales"] as const,
      keys: ["CategoryName", "CategorySales"] as const,
      measures: [] as const,
    },
    "Current_Product_List": {
      fields: ["ProductID", "ProductName"] as const,
      keys: ["ProductID", "ProductName"] as const,
      measures: [] as const,
    },
    "Customer_and_Suppliers_by_City": {
      fields: ["City", "CompanyName", "ContactName", "Relationship"] as const,
      keys: ["City", "CompanyName", "ContactName", "Relationship"] as const,
      measures: [] as const,
    },
    "Invoice": {
      fields: ["ShipName", "ShipAddress", "ShipCity", "ShipRegion", "ShipPostalCode", "ShipCountry", "CustomerID", "CustomerName", "Address", "City", "Region", "PostalCode", "Country", "Salesperson", "OrderID", "OrderDate", "RequiredDate", "ShippedDate", "ShipperName", "ProductID", "ProductName", "UnitPrice", "Quantity", "Discount", "ExtendedPrice", "Freight"] as const,
      keys: ["ShipName", "ShipAddress", "ShipCity", "ShipRegion", "ShipPostalCode", "ShipCountry", "CustomerID", "CustomerName", "Address", "City", "Region", "PostalCode", "Country", "Salesperson", "OrderID", "OrderDate", "RequiredDate", "ShippedDate", "ShipperName", "ProductID", "ProductName", "UnitPrice", "Quantity", "Discount", "ExtendedPrice", "Freight"] as const,
      measures: [] as const,
    },
    "Order_Details_Extended": {
      fields: ["OrderID", "ProductID", "ProductName", "UnitPrice", "Quantity", "Discount", "ExtendedPrice"] as const,
      keys: ["OrderID", "ProductID", "ProductName", "UnitPrice", "Quantity", "Discount", "ExtendedPrice"] as const,
      measures: [] as const,
    },
    "Order_Subtotal": {
      fields: ["OrderID", "Subtotal"] as const,
      keys: ["OrderID", "Subtotal"] as const,
      measures: [] as const,
    },
    "Orders_Qry": {
      fields: ["OrderID", "CustomerID", "EmployeeID", "OrderDate", "RequiredDate", "ShippedDate", "ShipVia", "Freight", "ShipName", "ShipAddress", "ShipCity", "ShipRegion", "ShipPostalCode", "ShipCountry", "CompanyName", "Address", "City", "Region", "PostalCode", "Country"] as const,
      keys: ["OrderID", "CustomerID", "EmployeeID", "OrderDate", "RequiredDate", "ShippedDate", "ShipVia", "Freight", "ShipName", "ShipAddress", "ShipCity", "ShipRegion", "ShipPostalCode", "ShipCountry", "CompanyName", "Address", "City", "Region", "PostalCode", "Country"] as const,
      measures: [] as const,
    },
    "Product_Sales_for_1997": {
      fields: ["CategoryName", "ProductName", "ProductSales"] as const,
      keys: ["CategoryName", "ProductName", "ProductSales"] as const,
      measures: [] as const,
    },
    "Products_Above_Average_Price": {
      fields: ["ProductName", "UnitPrice"] as const,
      keys: ["ProductName", "UnitPrice"] as const,
      measures: [] as const,
    },
    "Products_by_Category": {
      fields: ["CategoryName", "ProductName", "QuantityPerUnit", "UnitsInStock", "Discontinued"] as const,
      keys: ["CategoryName", "ProductName", "QuantityPerUnit", "UnitsInStock", "Discontinued"] as const,
      measures: [] as const,
    },
    "Sales_by_Category": {
      fields: ["CategoryID", "CategoryName", "ProductName", "ProductSales"] as const,
      keys: ["CategoryID", "CategoryName", "ProductName", "ProductSales"] as const,
      measures: [] as const,
    },
    "Sales_Totals_by_Amount": {
      fields: ["SaleAmount", "OrderID", "CompanyName", "ShippedDate"] as const,
      keys: ["SaleAmount", "OrderID", "CompanyName", "ShippedDate"] as const,
      measures: [] as const,
    },
    "Summary_of_Sales_by_Quarter": {
      fields: ["ShippedDate", "OrderID", "Subtotal"] as const,
      keys: ["ShippedDate", "OrderID", "Subtotal"] as const,
      measures: [] as const,
    },
    "Summary_of_Sales_by_Year": {
      fields: ["ShippedDate", "OrderID", "Subtotal"] as const,
      keys: ["ShippedDate", "OrderID", "Subtotal"] as const,
      measures: [] as const,
    },
  },
};

/**
 * Types for Keys and Fields
 * 
 * Model: northwindV2
 */
export interface TNorthwindV2 {
  "NorthwindModel": {
    "Category": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Category"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Category"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Category"]["measures"][number];
    };
    "CustomerDemographic": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["CustomerDemographic"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["CustomerDemographic"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["CustomerDemographic"]["measures"][number];
    };
    "Customer": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Customer"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Customer"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Customer"]["measures"][number];
    };
    "Employee": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Employee"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Employee"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Employee"]["measures"][number];
    };
    "Order_Detail": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Order_Detail"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Order_Detail"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Order_Detail"]["measures"][number];
    };
    "Order": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Order"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Order"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Order"]["measures"][number];
    };
    "Product": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Product"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Product"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Product"]["measures"][number];
    };
    "Region": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Region"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Region"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Region"]["measures"][number];
    };
    "Shipper": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Shipper"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Shipper"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Shipper"]["measures"][number];
    };
    "Supplier": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Supplier"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Supplier"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Supplier"]["measures"][number];
    };
    "Territory": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Territory"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Territory"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Territory"]["measures"][number];
    };
    "Alphabetical_list_of_product": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Alphabetical_list_of_product"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Alphabetical_list_of_product"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Alphabetical_list_of_product"]["measures"][number];
    };
    "Category_Sales_for_1997": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Category_Sales_for_1997"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Category_Sales_for_1997"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Category_Sales_for_1997"]["measures"][number];
    };
    "Current_Product_List": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Current_Product_List"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Current_Product_List"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Current_Product_List"]["measures"][number];
    };
    "Customer_and_Suppliers_by_City": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Customer_and_Suppliers_by_City"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Customer_and_Suppliers_by_City"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Customer_and_Suppliers_by_City"]["measures"][number];
    };
    "Invoice": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Invoice"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Invoice"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Invoice"]["measures"][number];
    };
    "Order_Details_Extended": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Order_Details_Extended"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Order_Details_Extended"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Order_Details_Extended"]["measures"][number];
    };
    "Order_Subtotal": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Order_Subtotal"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Order_Subtotal"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Order_Subtotal"]["measures"][number];
    };
    "Orders_Qry": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Orders_Qry"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Orders_Qry"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Orders_Qry"]["measures"][number];
    };
    "Product_Sales_for_1997": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Product_Sales_for_1997"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Product_Sales_for_1997"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Product_Sales_for_1997"]["measures"][number];
    };
    "Products_Above_Average_Price": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Products_Above_Average_Price"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Products_Above_Average_Price"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Products_Above_Average_Price"]["measures"][number];
    };
    "Products_by_Category": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Products_by_Category"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Products_by_Category"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Products_by_Category"]["measures"][number];
    };
    "Sales_by_Category": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Sales_by_Category"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Sales_by_Category"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Sales_by_Category"]["measures"][number];
    };
    "Sales_Totals_by_Amount": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Sales_Totals_by_Amount"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Sales_Totals_by_Amount"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Sales_Totals_by_Amount"]["measures"][number];
    };
    "Summary_of_Sales_by_Quarter": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Summary_of_Sales_by_Quarter"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Summary_of_Sales_by_Quarter"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Summary_of_Sales_by_Quarter"]["measures"][number];
    };
    "Summary_of_Sales_by_Year": {
      fields: (typeof northwindV2Consts)["NorthwindModel"]["Summary_of_Sales_by_Year"]["fields"][number];
      keys: (typeof northwindV2Consts)["NorthwindModel"]["Summary_of_Sales_by_Year"]["keys"][number];
      measures: (typeof northwindV2Consts)["NorthwindModel"]["Summary_of_Sales_by_Year"]["measures"][number];
    };
  };
}

/**
 * Main OData Interface
 * 
 * Model: northwindV2
 */
export interface TNorthwindV2OData extends TOdataDummyInterface {
  entitySets: {
    'ODataWeb.Northwind.Model.Categories': "NorthwindModel.Category";
    'ODataWeb.Northwind.Model.CustomerDemographics': "NorthwindModel.CustomerDemographic";
    'ODataWeb.Northwind.Model.Customers': "NorthwindModel.Customer";
    'ODataWeb.Northwind.Model.Employees': "NorthwindModel.Employee";
    'ODataWeb.Northwind.Model.Order_Details': "NorthwindModel.Order_Detail";
    'ODataWeb.Northwind.Model.Orders': "NorthwindModel.Order";
    'ODataWeb.Northwind.Model.Products': "NorthwindModel.Product";
    'ODataWeb.Northwind.Model.Regions': "NorthwindModel.Region";
    'ODataWeb.Northwind.Model.Shippers': "NorthwindModel.Shipper";
    'ODataWeb.Northwind.Model.Suppliers': "NorthwindModel.Supplier";
    'ODataWeb.Northwind.Model.Territories': "NorthwindModel.Territory";
    'ODataWeb.Northwind.Model.Alphabetical_list_of_products': "NorthwindModel.Alphabetical_list_of_product";
    'ODataWeb.Northwind.Model.Category_Sales_for_1997': "NorthwindModel.Category_Sales_for_1997";
    'ODataWeb.Northwind.Model.Current_Product_Lists': "NorthwindModel.Current_Product_List";
    'ODataWeb.Northwind.Model.Customer_and_Suppliers_by_Cities': "NorthwindModel.Customer_and_Suppliers_by_City";
    'ODataWeb.Northwind.Model.Invoices': "NorthwindModel.Invoice";
    'ODataWeb.Northwind.Model.Order_Details_Extendeds': "NorthwindModel.Order_Details_Extended";
    'ODataWeb.Northwind.Model.Order_Subtotals': "NorthwindModel.Order_Subtotal";
    'ODataWeb.Northwind.Model.Orders_Qries': "NorthwindModel.Orders_Qry";
    'ODataWeb.Northwind.Model.Product_Sales_for_1997': "NorthwindModel.Product_Sales_for_1997";
    'ODataWeb.Northwind.Model.Products_Above_Average_Prices': "NorthwindModel.Products_Above_Average_Price";
    'ODataWeb.Northwind.Model.Products_by_Categories': "NorthwindModel.Products_by_Category";
    'ODataWeb.Northwind.Model.Sales_by_Categories': "NorthwindModel.Sales_by_Category";
    'ODataWeb.Northwind.Model.Sales_Totals_by_Amounts': "NorthwindModel.Sales_Totals_by_Amount";
    'ODataWeb.Northwind.Model.Summary_of_Sales_by_Quarters': "NorthwindModel.Summary_of_Sales_by_Quarter";
    'ODataWeb.Northwind.Model.Summary_of_Sales_by_Years': "NorthwindModel.Summary_of_Sales_by_Year";
  };
  entityTypes: {
    'NorthwindModel.Category': {
      keys: TNorthwindV2["NorthwindModel"]["Category"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Category"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Category"]["measures"];
      navToMany: {
        Products: "NorthwindModel.Product";
      };
      navToOne: {};
    };
    'NorthwindModel.CustomerDemographic': {
      keys: TNorthwindV2["NorthwindModel"]["CustomerDemographic"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["CustomerDemographic"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["CustomerDemographic"]["measures"];
      navToMany: {
        Customers: "NorthwindModel.Customer";
      };
      navToOne: {};
    };
    'NorthwindModel.Customer': {
      keys: TNorthwindV2["NorthwindModel"]["Customer"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Customer"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Customer"]["measures"];
      navToMany: {
        Orders: "NorthwindModel.Order";
        CustomerDemographics: "NorthwindModel.CustomerDemographic";
      };
      navToOne: {};
    };
    'NorthwindModel.Employee': {
      keys: TNorthwindV2["NorthwindModel"]["Employee"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Employee"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Employee"]["measures"];
      navToMany: {
        Employees1: "NorthwindModel.Employee";
        Orders: "NorthwindModel.Order";
        Territories: "NorthwindModel.Territory";
      };
      navToOne: {
        Employee1: "NorthwindModel.Employee";
      };
    };
    'NorthwindModel.Order_Detail': {
      keys: TNorthwindV2["NorthwindModel"]["Order_Detail"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Order_Detail"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Order_Detail"]["measures"];
      navToMany: {};
      navToOne: {
        Order: "NorthwindModel.Order";
        Product: "NorthwindModel.Product";
      };
    };
    'NorthwindModel.Order': {
      keys: TNorthwindV2["NorthwindModel"]["Order"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Order"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Order"]["measures"];
      navToMany: {
        Order_Details: "NorthwindModel.Order_Detail";
      };
      navToOne: {
        Customer: "NorthwindModel.Customer";
        Employee: "NorthwindModel.Employee";
        Shipper: "NorthwindModel.Shipper";
      };
    };
    'NorthwindModel.Product': {
      keys: TNorthwindV2["NorthwindModel"]["Product"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Product"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Product"]["measures"];
      navToMany: {
        Order_Details: "NorthwindModel.Order_Detail";
      };
      navToOne: {
        Category: "NorthwindModel.Category";
        Supplier: "NorthwindModel.Supplier";
      };
    };
    'NorthwindModel.Region': {
      keys: TNorthwindV2["NorthwindModel"]["Region"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Region"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Region"]["measures"];
      navToMany: {
        Territories: "NorthwindModel.Territory";
      };
      navToOne: {};
    };
    'NorthwindModel.Shipper': {
      keys: TNorthwindV2["NorthwindModel"]["Shipper"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Shipper"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Shipper"]["measures"];
      navToMany: {
        Orders: "NorthwindModel.Order";
      };
      navToOne: {};
    };
    'NorthwindModel.Supplier': {
      keys: TNorthwindV2["NorthwindModel"]["Supplier"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Supplier"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Supplier"]["measures"];
      navToMany: {
        Products: "NorthwindModel.Product";
      };
      navToOne: {};
    };
    'NorthwindModel.Territory': {
      keys: TNorthwindV2["NorthwindModel"]["Territory"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Territory"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Territory"]["measures"];
      navToMany: {
        Employees: "NorthwindModel.Employee";
      };
      navToOne: {
        Region: "NorthwindModel.Region";
      };
    };
    'NorthwindModel.Alphabetical_list_of_product': {
      keys: TNorthwindV2["NorthwindModel"]["Alphabetical_list_of_product"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Alphabetical_list_of_product"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Alphabetical_list_of_product"]["measures"];
      navToMany: {};
      navToOne: {};
    };
    'NorthwindModel.Category_Sales_for_1997': {
      keys: TNorthwindV2["NorthwindModel"]["Category_Sales_for_1997"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Category_Sales_for_1997"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Category_Sales_for_1997"]["measures"];
      navToMany: {};
      navToOne: {};
    };
    'NorthwindModel.Current_Product_List': {
      keys: TNorthwindV2["NorthwindModel"]["Current_Product_List"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Current_Product_List"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Current_Product_List"]["measures"];
      navToMany: {};
      navToOne: {};
    };
    'NorthwindModel.Customer_and_Suppliers_by_City': {
      keys: TNorthwindV2["NorthwindModel"]["Customer_and_Suppliers_by_City"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Customer_and_Suppliers_by_City"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Customer_and_Suppliers_by_City"]["measures"];
      navToMany: {};
      navToOne: {};
    };
    'NorthwindModel.Invoice': {
      keys: TNorthwindV2["NorthwindModel"]["Invoice"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Invoice"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Invoice"]["measures"];
      navToMany: {};
      navToOne: {};
    };
    'NorthwindModel.Order_Details_Extended': {
      keys: TNorthwindV2["NorthwindModel"]["Order_Details_Extended"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Order_Details_Extended"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Order_Details_Extended"]["measures"];
      navToMany: {};
      navToOne: {};
    };
    'NorthwindModel.Order_Subtotal': {
      keys: TNorthwindV2["NorthwindModel"]["Order_Subtotal"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Order_Subtotal"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Order_Subtotal"]["measures"];
      navToMany: {};
      navToOne: {};
    };
    'NorthwindModel.Orders_Qry': {
      keys: TNorthwindV2["NorthwindModel"]["Orders_Qry"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Orders_Qry"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Orders_Qry"]["measures"];
      navToMany: {};
      navToOne: {};
    };
    'NorthwindModel.Product_Sales_for_1997': {
      keys: TNorthwindV2["NorthwindModel"]["Product_Sales_for_1997"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Product_Sales_for_1997"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Product_Sales_for_1997"]["measures"];
      navToMany: {};
      navToOne: {};
    };
    'NorthwindModel.Products_Above_Average_Price': {
      keys: TNorthwindV2["NorthwindModel"]["Products_Above_Average_Price"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Products_Above_Average_Price"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Products_Above_Average_Price"]["measures"];
      navToMany: {};
      navToOne: {};
    };
    'NorthwindModel.Products_by_Category': {
      keys: TNorthwindV2["NorthwindModel"]["Products_by_Category"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Products_by_Category"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Products_by_Category"]["measures"];
      navToMany: {};
      navToOne: {};
    };
    'NorthwindModel.Sales_by_Category': {
      keys: TNorthwindV2["NorthwindModel"]["Sales_by_Category"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Sales_by_Category"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Sales_by_Category"]["measures"];
      navToMany: {};
      navToOne: {};
    };
    'NorthwindModel.Sales_Totals_by_Amount': {
      keys: TNorthwindV2["NorthwindModel"]["Sales_Totals_by_Amount"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Sales_Totals_by_Amount"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Sales_Totals_by_Amount"]["measures"];
      navToMany: {};
      navToOne: {};
    };
    'NorthwindModel.Summary_of_Sales_by_Quarter': {
      keys: TNorthwindV2["NorthwindModel"]["Summary_of_Sales_by_Quarter"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Summary_of_Sales_by_Quarter"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Summary_of_Sales_by_Quarter"]["measures"];
      navToMany: {};
      navToOne: {};
    };
    'NorthwindModel.Summary_of_Sales_by_Year': {
      keys: TNorthwindV2["NorthwindModel"]["Summary_of_Sales_by_Year"]["keys"];
      fields: TNorthwindV2["NorthwindModel"]["Summary_of_Sales_by_Year"]["fields"];
      measures: TNorthwindV2["NorthwindModel"]["Summary_of_Sales_by_Year"]["measures"];
      navToMany: {};
      navToOne: {};
    };
  };
  functions: {};
}

/**
 * oData class
 * 
 * Model: NorthwindV2
 * 
 * @example
 * const model = NorthwindV2.getInstance()
 */
export class NorthwindV2 extends OData<TNorthwindV2OData> {
  public static readonly serviceName = "northwindV2" as const;
  private static instance?: NorthwindV2;
  public static getInstance() {
    if (!NorthwindV2.instance) {
      NorthwindV2.instance = new NorthwindV2()
    }
    return NorthwindV2.instance
  }
  public static async entitySet<T extends keyof TNorthwindV2OData['entitySets']>(name: T) {
    const instance = NorthwindV2.getInstance()
    return instance.entitySet<T>(name)
  }
  private constructor(opts?: TODataOptions) {
    super("northwindV2", {...opts, path: "/odata/northwind-v2"})
  }
}

