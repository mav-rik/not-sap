/*
* This code was GENERATED using the vite plugin odata-codegen.
* It contains TypeScript type definitions for OData services.
* Do not modify this file manually as it will be overwritten on the next build.
* For any changes, update the OData service definitions or plugin configuration.
*/

/* eslint-disable */
/* prettier-ignore */

import { OData, type TOdataDummyInterface, type TODataOptions } from "notsapodata"


export const northwindV4Name = "northwindV4";

// northwindV4/Categories
export const northwindV4CategoriesEntitySet = "Categories";
export const northwindV4CategoriesFields = [
  "CategoryID",
  "CategoryName",
  "Description",
  "Picture"
] as const;
export const northwindV4CategoriesKeys = [
  "CategoryID"
] as const;
export const northwindV4CategoriesMeasures = [] as const;
export type TnorthwindV4CategoriesFields = typeof northwindV4CategoriesFields[number];
export type TnorthwindV4CategoriesKeys = typeof northwindV4CategoriesKeys[number];
export type TnorthwindV4CategoriesMeasures = typeof northwindV4CategoriesMeasures[number];
// northwindV4/CustomerDemographics
export const northwindV4CustomerDemographicsEntitySet = "CustomerDemographics";
export const northwindV4CustomerDemographicsFields = [
  "CustomerTypeID",
  "CustomerDesc"
] as const;
export const northwindV4CustomerDemographicsKeys = [
  "CustomerTypeID"
] as const;
export const northwindV4CustomerDemographicsMeasures = [] as const;
export type TnorthwindV4CustomerDemographicsFields = typeof northwindV4CustomerDemographicsFields[number];
export type TnorthwindV4CustomerDemographicsKeys = typeof northwindV4CustomerDemographicsKeys[number];
export type TnorthwindV4CustomerDemographicsMeasures = typeof northwindV4CustomerDemographicsMeasures[number];
// northwindV4/Customers
export const northwindV4CustomersEntitySet = "Customers";
export const northwindV4CustomersFields = [
  "CustomerID",
  "CompanyName",
  "ContactName",
  "ContactTitle",
  "Address",
  "City",
  "Region",
  "PostalCode",
  "Country",
  "Phone",
  "Fax"
] as const;
export const northwindV4CustomersKeys = [
  "CustomerID"
] as const;
export const northwindV4CustomersMeasures = [] as const;
export type TnorthwindV4CustomersFields = typeof northwindV4CustomersFields[number];
export type TnorthwindV4CustomersKeys = typeof northwindV4CustomersKeys[number];
export type TnorthwindV4CustomersMeasures = typeof northwindV4CustomersMeasures[number];
// northwindV4/Employees
export const northwindV4EmployeesEntitySet = "Employees";
export const northwindV4EmployeesFields = [
  "EmployeeID",
  "LastName",
  "FirstName",
  "Title",
  "TitleOfCourtesy",
  "BirthDate",
  "HireDate",
  "Address",
  "City",
  "Region",
  "PostalCode",
  "Country",
  "HomePhone",
  "Extension",
  "Photo",
  "Notes",
  "ReportsTo",
  "PhotoPath"
] as const;
export const northwindV4EmployeesKeys = [
  "EmployeeID"
] as const;
export const northwindV4EmployeesMeasures = [] as const;
export type TnorthwindV4EmployeesFields = typeof northwindV4EmployeesFields[number];
export type TnorthwindV4EmployeesKeys = typeof northwindV4EmployeesKeys[number];
export type TnorthwindV4EmployeesMeasures = typeof northwindV4EmployeesMeasures[number];
// northwindV4/Order_Details
export const northwindV4Order_DetailsEntitySet = "Order_Details";
export const northwindV4Order_DetailsFields = [
  "OrderID",
  "ProductID",
  "UnitPrice",
  "Quantity",
  "Discount"
] as const;
export const northwindV4Order_DetailsKeys = [
  "OrderID",
  "ProductID"
] as const;
export const northwindV4Order_DetailsMeasures = [] as const;
export type TnorthwindV4Order_DetailsFields = typeof northwindV4Order_DetailsFields[number];
export type TnorthwindV4Order_DetailsKeys = typeof northwindV4Order_DetailsKeys[number];
export type TnorthwindV4Order_DetailsMeasures = typeof northwindV4Order_DetailsMeasures[number];
// northwindV4/Orders
export const northwindV4OrdersEntitySet = "Orders";
export const northwindV4OrdersFields = [
  "OrderID",
  "CustomerID",
  "EmployeeID",
  "OrderDate",
  "RequiredDate",
  "ShippedDate",
  "ShipVia",
  "Freight",
  "ShipName",
  "ShipAddress",
  "ShipCity",
  "ShipRegion",
  "ShipPostalCode",
  "ShipCountry"
] as const;
export const northwindV4OrdersKeys = [
  "OrderID"
] as const;
export const northwindV4OrdersMeasures = [] as const;
export type TnorthwindV4OrdersFields = typeof northwindV4OrdersFields[number];
export type TnorthwindV4OrdersKeys = typeof northwindV4OrdersKeys[number];
export type TnorthwindV4OrdersMeasures = typeof northwindV4OrdersMeasures[number];
// northwindV4/Products
export const northwindV4ProductsEntitySet = "Products";
export const northwindV4ProductsFields = [
  "ProductID",
  "ProductName",
  "SupplierID",
  "CategoryID",
  "QuantityPerUnit",
  "UnitPrice",
  "UnitsInStock",
  "UnitsOnOrder",
  "ReorderLevel",
  "Discontinued"
] as const;
export const northwindV4ProductsKeys = [
  "ProductID"
] as const;
export const northwindV4ProductsMeasures = [] as const;
export type TnorthwindV4ProductsFields = typeof northwindV4ProductsFields[number];
export type TnorthwindV4ProductsKeys = typeof northwindV4ProductsKeys[number];
export type TnorthwindV4ProductsMeasures = typeof northwindV4ProductsMeasures[number];
// northwindV4/Regions
export const northwindV4RegionsEntitySet = "Regions";
export const northwindV4RegionsFields = [
  "RegionID",
  "RegionDescription"
] as const;
export const northwindV4RegionsKeys = [
  "RegionID"
] as const;
export const northwindV4RegionsMeasures = [] as const;
export type TnorthwindV4RegionsFields = typeof northwindV4RegionsFields[number];
export type TnorthwindV4RegionsKeys = typeof northwindV4RegionsKeys[number];
export type TnorthwindV4RegionsMeasures = typeof northwindV4RegionsMeasures[number];
// northwindV4/Shippers
export const northwindV4ShippersEntitySet = "Shippers";
export const northwindV4ShippersFields = [
  "ShipperID",
  "CompanyName",
  "Phone"
] as const;
export const northwindV4ShippersKeys = [
  "ShipperID"
] as const;
export const northwindV4ShippersMeasures = [] as const;
export type TnorthwindV4ShippersFields = typeof northwindV4ShippersFields[number];
export type TnorthwindV4ShippersKeys = typeof northwindV4ShippersKeys[number];
export type TnorthwindV4ShippersMeasures = typeof northwindV4ShippersMeasures[number];
// northwindV4/Suppliers
export const northwindV4SuppliersEntitySet = "Suppliers";
export const northwindV4SuppliersFields = [
  "SupplierID",
  "CompanyName",
  "ContactName",
  "ContactTitle",
  "Address",
  "City",
  "Region",
  "PostalCode",
  "Country",
  "Phone",
  "Fax",
  "HomePage"
] as const;
export const northwindV4SuppliersKeys = [
  "SupplierID"
] as const;
export const northwindV4SuppliersMeasures = [] as const;
export type TnorthwindV4SuppliersFields = typeof northwindV4SuppliersFields[number];
export type TnorthwindV4SuppliersKeys = typeof northwindV4SuppliersKeys[number];
export type TnorthwindV4SuppliersMeasures = typeof northwindV4SuppliersMeasures[number];
// northwindV4/Territories
export const northwindV4TerritoriesEntitySet = "Territories";
export const northwindV4TerritoriesFields = [
  "TerritoryID",
  "TerritoryDescription",
  "RegionID"
] as const;
export const northwindV4TerritoriesKeys = [
  "TerritoryID"
] as const;
export const northwindV4TerritoriesMeasures = [] as const;
export type TnorthwindV4TerritoriesFields = typeof northwindV4TerritoriesFields[number];
export type TnorthwindV4TerritoriesKeys = typeof northwindV4TerritoriesKeys[number];
export type TnorthwindV4TerritoriesMeasures = typeof northwindV4TerritoriesMeasures[number];
// northwindV4/Alphabetical_list_of_products
export const northwindV4Alphabetical_list_of_productsEntitySet = "Alphabetical_list_of_products";
export const northwindV4Alphabetical_list_of_productsFields = [
  "ProductID",
  "ProductName",
  "SupplierID",
  "CategoryID",
  "QuantityPerUnit",
  "UnitPrice",
  "UnitsInStock",
  "UnitsOnOrder",
  "ReorderLevel",
  "Discontinued",
  "CategoryName"
] as const;
export const northwindV4Alphabetical_list_of_productsKeys = [
  "CategoryName",
  "Discontinued",
  "ProductID",
  "ProductName"
] as const;
export const northwindV4Alphabetical_list_of_productsMeasures = [] as const;
export type TnorthwindV4Alphabetical_list_of_productsFields = typeof northwindV4Alphabetical_list_of_productsFields[number];
export type TnorthwindV4Alphabetical_list_of_productsKeys = typeof northwindV4Alphabetical_list_of_productsKeys[number];
export type TnorthwindV4Alphabetical_list_of_productsMeasures = typeof northwindV4Alphabetical_list_of_productsMeasures[number];
// northwindV4/Category_Sales_for_1997
export const northwindV4Category_Sales_for_1997EntitySet = "Category_Sales_for_1997";
export const northwindV4Category_Sales_for_1997Fields = [
  "CategoryName",
  "CategorySales"
] as const;
export const northwindV4Category_Sales_for_1997Keys = [
  "CategoryName"
] as const;
export const northwindV4Category_Sales_for_1997Measures = [] as const;
export type TnorthwindV4Category_Sales_for_1997Fields = typeof northwindV4Category_Sales_for_1997Fields[number];
export type TnorthwindV4Category_Sales_for_1997Keys = typeof northwindV4Category_Sales_for_1997Keys[number];
export type TnorthwindV4Category_Sales_for_1997Measures = typeof northwindV4Category_Sales_for_1997Measures[number];
// northwindV4/Current_Product_Lists
export const northwindV4Current_Product_ListsEntitySet = "Current_Product_Lists";
export const northwindV4Current_Product_ListsFields = [
  "ProductID",
  "ProductName"
] as const;
export const northwindV4Current_Product_ListsKeys = [
  "ProductID",
  "ProductName"
] as const;
export const northwindV4Current_Product_ListsMeasures = [] as const;
export type TnorthwindV4Current_Product_ListsFields = typeof northwindV4Current_Product_ListsFields[number];
export type TnorthwindV4Current_Product_ListsKeys = typeof northwindV4Current_Product_ListsKeys[number];
export type TnorthwindV4Current_Product_ListsMeasures = typeof northwindV4Current_Product_ListsMeasures[number];
// northwindV4/Customer_and_Suppliers_by_Cities
export const northwindV4Customer_and_Suppliers_by_CitiesEntitySet = "Customer_and_Suppliers_by_Cities";
export const northwindV4Customer_and_Suppliers_by_CitiesFields = [
  "City",
  "CompanyName",
  "ContactName",
  "Relationship"
] as const;
export const northwindV4Customer_and_Suppliers_by_CitiesKeys = [
  "CompanyName",
  "Relationship"
] as const;
export const northwindV4Customer_and_Suppliers_by_CitiesMeasures = [] as const;
export type TnorthwindV4Customer_and_Suppliers_by_CitiesFields = typeof northwindV4Customer_and_Suppliers_by_CitiesFields[number];
export type TnorthwindV4Customer_and_Suppliers_by_CitiesKeys = typeof northwindV4Customer_and_Suppliers_by_CitiesKeys[number];
export type TnorthwindV4Customer_and_Suppliers_by_CitiesMeasures = typeof northwindV4Customer_and_Suppliers_by_CitiesMeasures[number];
// northwindV4/Invoices
export const northwindV4InvoicesEntitySet = "Invoices";
export const northwindV4InvoicesFields = [
  "ShipName",
  "ShipAddress",
  "ShipCity",
  "ShipRegion",
  "ShipPostalCode",
  "ShipCountry",
  "CustomerID",
  "CustomerName",
  "Address",
  "City",
  "Region",
  "PostalCode",
  "Country",
  "Salesperson",
  "OrderID",
  "OrderDate",
  "RequiredDate",
  "ShippedDate",
  "ShipperName",
  "ProductID",
  "ProductName",
  "UnitPrice",
  "Quantity",
  "Discount",
  "ExtendedPrice",
  "Freight"
] as const;
export const northwindV4InvoicesKeys = [
  "CustomerName",
  "Discount",
  "OrderID",
  "ProductID",
  "ProductName",
  "Quantity",
  "Salesperson",
  "ShipperName",
  "UnitPrice"
] as const;
export const northwindV4InvoicesMeasures = [] as const;
export type TnorthwindV4InvoicesFields = typeof northwindV4InvoicesFields[number];
export type TnorthwindV4InvoicesKeys = typeof northwindV4InvoicesKeys[number];
export type TnorthwindV4InvoicesMeasures = typeof northwindV4InvoicesMeasures[number];
// northwindV4/Order_Details_Extendeds
export const northwindV4Order_Details_ExtendedsEntitySet = "Order_Details_Extendeds";
export const northwindV4Order_Details_ExtendedsFields = [
  "OrderID",
  "ProductID",
  "ProductName",
  "UnitPrice",
  "Quantity",
  "Discount",
  "ExtendedPrice"
] as const;
export const northwindV4Order_Details_ExtendedsKeys = [
  "Discount",
  "OrderID",
  "ProductID",
  "ProductName",
  "Quantity",
  "UnitPrice"
] as const;
export const northwindV4Order_Details_ExtendedsMeasures = [] as const;
export type TnorthwindV4Order_Details_ExtendedsFields = typeof northwindV4Order_Details_ExtendedsFields[number];
export type TnorthwindV4Order_Details_ExtendedsKeys = typeof northwindV4Order_Details_ExtendedsKeys[number];
export type TnorthwindV4Order_Details_ExtendedsMeasures = typeof northwindV4Order_Details_ExtendedsMeasures[number];
// northwindV4/Order_Subtotals
export const northwindV4Order_SubtotalsEntitySet = "Order_Subtotals";
export const northwindV4Order_SubtotalsFields = [
  "OrderID",
  "Subtotal"
] as const;
export const northwindV4Order_SubtotalsKeys = [
  "OrderID"
] as const;
export const northwindV4Order_SubtotalsMeasures = [] as const;
export type TnorthwindV4Order_SubtotalsFields = typeof northwindV4Order_SubtotalsFields[number];
export type TnorthwindV4Order_SubtotalsKeys = typeof northwindV4Order_SubtotalsKeys[number];
export type TnorthwindV4Order_SubtotalsMeasures = typeof northwindV4Order_SubtotalsMeasures[number];
// northwindV4/Orders_Qries
export const northwindV4Orders_QriesEntitySet = "Orders_Qries";
export const northwindV4Orders_QriesFields = [
  "OrderID",
  "CustomerID",
  "EmployeeID",
  "OrderDate",
  "RequiredDate",
  "ShippedDate",
  "ShipVia",
  "Freight",
  "ShipName",
  "ShipAddress",
  "ShipCity",
  "ShipRegion",
  "ShipPostalCode",
  "ShipCountry",
  "CompanyName",
  "Address",
  "City",
  "Region",
  "PostalCode",
  "Country"
] as const;
export const northwindV4Orders_QriesKeys = [
  "CompanyName",
  "OrderID"
] as const;
export const northwindV4Orders_QriesMeasures = [] as const;
export type TnorthwindV4Orders_QriesFields = typeof northwindV4Orders_QriesFields[number];
export type TnorthwindV4Orders_QriesKeys = typeof northwindV4Orders_QriesKeys[number];
export type TnorthwindV4Orders_QriesMeasures = typeof northwindV4Orders_QriesMeasures[number];
// northwindV4/Product_Sales_for_1997
export const northwindV4Product_Sales_for_1997EntitySet = "Product_Sales_for_1997";
export const northwindV4Product_Sales_for_1997Fields = [
  "CategoryName",
  "ProductName",
  "ProductSales"
] as const;
export const northwindV4Product_Sales_for_1997Keys = [
  "CategoryName",
  "ProductName"
] as const;
export const northwindV4Product_Sales_for_1997Measures = [] as const;
export type TnorthwindV4Product_Sales_for_1997Fields = typeof northwindV4Product_Sales_for_1997Fields[number];
export type TnorthwindV4Product_Sales_for_1997Keys = typeof northwindV4Product_Sales_for_1997Keys[number];
export type TnorthwindV4Product_Sales_for_1997Measures = typeof northwindV4Product_Sales_for_1997Measures[number];
// northwindV4/Products_Above_Average_Prices
export const northwindV4Products_Above_Average_PricesEntitySet = "Products_Above_Average_Prices";
export const northwindV4Products_Above_Average_PricesFields = [
  "ProductName",
  "UnitPrice"
] as const;
export const northwindV4Products_Above_Average_PricesKeys = [
  "ProductName"
] as const;
export const northwindV4Products_Above_Average_PricesMeasures = [] as const;
export type TnorthwindV4Products_Above_Average_PricesFields = typeof northwindV4Products_Above_Average_PricesFields[number];
export type TnorthwindV4Products_Above_Average_PricesKeys = typeof northwindV4Products_Above_Average_PricesKeys[number];
export type TnorthwindV4Products_Above_Average_PricesMeasures = typeof northwindV4Products_Above_Average_PricesMeasures[number];
// northwindV4/Products_by_Categories
export const northwindV4Products_by_CategoriesEntitySet = "Products_by_Categories";
export const northwindV4Products_by_CategoriesFields = [
  "CategoryName",
  "ProductName",
  "QuantityPerUnit",
  "UnitsInStock",
  "Discontinued"
] as const;
export const northwindV4Products_by_CategoriesKeys = [
  "CategoryName",
  "Discontinued",
  "ProductName"
] as const;
export const northwindV4Products_by_CategoriesMeasures = [] as const;
export type TnorthwindV4Products_by_CategoriesFields = typeof northwindV4Products_by_CategoriesFields[number];
export type TnorthwindV4Products_by_CategoriesKeys = typeof northwindV4Products_by_CategoriesKeys[number];
export type TnorthwindV4Products_by_CategoriesMeasures = typeof northwindV4Products_by_CategoriesMeasures[number];
// northwindV4/Sales_by_Categories
export const northwindV4Sales_by_CategoriesEntitySet = "Sales_by_Categories";
export const northwindV4Sales_by_CategoriesFields = [
  "CategoryID",
  "CategoryName",
  "ProductName",
  "ProductSales"
] as const;
export const northwindV4Sales_by_CategoriesKeys = [
  "CategoryID",
  "CategoryName",
  "ProductName"
] as const;
export const northwindV4Sales_by_CategoriesMeasures = [] as const;
export type TnorthwindV4Sales_by_CategoriesFields = typeof northwindV4Sales_by_CategoriesFields[number];
export type TnorthwindV4Sales_by_CategoriesKeys = typeof northwindV4Sales_by_CategoriesKeys[number];
export type TnorthwindV4Sales_by_CategoriesMeasures = typeof northwindV4Sales_by_CategoriesMeasures[number];
// northwindV4/Sales_Totals_by_Amounts
export const northwindV4Sales_Totals_by_AmountsEntitySet = "Sales_Totals_by_Amounts";
export const northwindV4Sales_Totals_by_AmountsFields = [
  "SaleAmount",
  "OrderID",
  "CompanyName",
  "ShippedDate"
] as const;
export const northwindV4Sales_Totals_by_AmountsKeys = [
  "CompanyName",
  "OrderID"
] as const;
export const northwindV4Sales_Totals_by_AmountsMeasures = [] as const;
export type TnorthwindV4Sales_Totals_by_AmountsFields = typeof northwindV4Sales_Totals_by_AmountsFields[number];
export type TnorthwindV4Sales_Totals_by_AmountsKeys = typeof northwindV4Sales_Totals_by_AmountsKeys[number];
export type TnorthwindV4Sales_Totals_by_AmountsMeasures = typeof northwindV4Sales_Totals_by_AmountsMeasures[number];
// northwindV4/Summary_of_Sales_by_Quarters
export const northwindV4Summary_of_Sales_by_QuartersEntitySet = "Summary_of_Sales_by_Quarters";
export const northwindV4Summary_of_Sales_by_QuartersFields = [
  "ShippedDate",
  "OrderID",
  "Subtotal"
] as const;
export const northwindV4Summary_of_Sales_by_QuartersKeys = [
  "OrderID"
] as const;
export const northwindV4Summary_of_Sales_by_QuartersMeasures = [] as const;
export type TnorthwindV4Summary_of_Sales_by_QuartersFields = typeof northwindV4Summary_of_Sales_by_QuartersFields[number];
export type TnorthwindV4Summary_of_Sales_by_QuartersKeys = typeof northwindV4Summary_of_Sales_by_QuartersKeys[number];
export type TnorthwindV4Summary_of_Sales_by_QuartersMeasures = typeof northwindV4Summary_of_Sales_by_QuartersMeasures[number];
// northwindV4/Summary_of_Sales_by_Years
export const northwindV4Summary_of_Sales_by_YearsEntitySet = "Summary_of_Sales_by_Years";
export const northwindV4Summary_of_Sales_by_YearsFields = [
  "ShippedDate",
  "OrderID",
  "Subtotal"
] as const;
export const northwindV4Summary_of_Sales_by_YearsKeys = [
  "OrderID"
] as const;
export const northwindV4Summary_of_Sales_by_YearsMeasures = [] as const;
export type TnorthwindV4Summary_of_Sales_by_YearsFields = typeof northwindV4Summary_of_Sales_by_YearsFields[number];
export type TnorthwindV4Summary_of_Sales_by_YearsKeys = typeof northwindV4Summary_of_Sales_by_YearsKeys[number];
export type TnorthwindV4Summary_of_Sales_by_YearsMeasures = typeof northwindV4Summary_of_Sales_by_YearsMeasures[number];
export interface TnorthwindV4Type extends TOdataDummyInterface {
  entitySets: {
    Categories: {
      keys: TnorthwindV4CategoriesKeys;
      fields: TnorthwindV4CategoriesFields;
      measures: TnorthwindV4CategoriesMeasures;
    };
    CustomerDemographics: {
      keys: TnorthwindV4CustomerDemographicsKeys;
      fields: TnorthwindV4CustomerDemographicsFields;
      measures: TnorthwindV4CustomerDemographicsMeasures;
    };
    Customers: {
      keys: TnorthwindV4CustomersKeys;
      fields: TnorthwindV4CustomersFields;
      measures: TnorthwindV4CustomersMeasures;
    };
    Employees: {
      keys: TnorthwindV4EmployeesKeys;
      fields: TnorthwindV4EmployeesFields;
      measures: TnorthwindV4EmployeesMeasures;
    };
    Order_Details: {
      keys: TnorthwindV4Order_DetailsKeys;
      fields: TnorthwindV4Order_DetailsFields;
      measures: TnorthwindV4Order_DetailsMeasures;
    };
    Orders: {
      keys: TnorthwindV4OrdersKeys;
      fields: TnorthwindV4OrdersFields;
      measures: TnorthwindV4OrdersMeasures;
    };
    Products: {
      keys: TnorthwindV4ProductsKeys;
      fields: TnorthwindV4ProductsFields;
      measures: TnorthwindV4ProductsMeasures;
    };
    Regions: {
      keys: TnorthwindV4RegionsKeys;
      fields: TnorthwindV4RegionsFields;
      measures: TnorthwindV4RegionsMeasures;
    };
    Shippers: {
      keys: TnorthwindV4ShippersKeys;
      fields: TnorthwindV4ShippersFields;
      measures: TnorthwindV4ShippersMeasures;
    };
    Suppliers: {
      keys: TnorthwindV4SuppliersKeys;
      fields: TnorthwindV4SuppliersFields;
      measures: TnorthwindV4SuppliersMeasures;
    };
    Territories: {
      keys: TnorthwindV4TerritoriesKeys;
      fields: TnorthwindV4TerritoriesFields;
      measures: TnorthwindV4TerritoriesMeasures;
    };
    Alphabetical_list_of_products: {
      keys: TnorthwindV4Alphabetical_list_of_productsKeys;
      fields: TnorthwindV4Alphabetical_list_of_productsFields;
      measures: TnorthwindV4Alphabetical_list_of_productsMeasures;
    };
    Category_Sales_for_1997: {
      keys: TnorthwindV4Category_Sales_for_1997Keys;
      fields: TnorthwindV4Category_Sales_for_1997Fields;
      measures: TnorthwindV4Category_Sales_for_1997Measures;
    };
    Current_Product_Lists: {
      keys: TnorthwindV4Current_Product_ListsKeys;
      fields: TnorthwindV4Current_Product_ListsFields;
      measures: TnorthwindV4Current_Product_ListsMeasures;
    };
    Customer_and_Suppliers_by_Cities: {
      keys: TnorthwindV4Customer_and_Suppliers_by_CitiesKeys;
      fields: TnorthwindV4Customer_and_Suppliers_by_CitiesFields;
      measures: TnorthwindV4Customer_and_Suppliers_by_CitiesMeasures;
    };
    Invoices: {
      keys: TnorthwindV4InvoicesKeys;
      fields: TnorthwindV4InvoicesFields;
      measures: TnorthwindV4InvoicesMeasures;
    };
    Order_Details_Extendeds: {
      keys: TnorthwindV4Order_Details_ExtendedsKeys;
      fields: TnorthwindV4Order_Details_ExtendedsFields;
      measures: TnorthwindV4Order_Details_ExtendedsMeasures;
    };
    Order_Subtotals: {
      keys: TnorthwindV4Order_SubtotalsKeys;
      fields: TnorthwindV4Order_SubtotalsFields;
      measures: TnorthwindV4Order_SubtotalsMeasures;
    };
    Orders_Qries: {
      keys: TnorthwindV4Orders_QriesKeys;
      fields: TnorthwindV4Orders_QriesFields;
      measures: TnorthwindV4Orders_QriesMeasures;
    };
    Product_Sales_for_1997: {
      keys: TnorthwindV4Product_Sales_for_1997Keys;
      fields: TnorthwindV4Product_Sales_for_1997Fields;
      measures: TnorthwindV4Product_Sales_for_1997Measures;
    };
    Products_Above_Average_Prices: {
      keys: TnorthwindV4Products_Above_Average_PricesKeys;
      fields: TnorthwindV4Products_Above_Average_PricesFields;
      measures: TnorthwindV4Products_Above_Average_PricesMeasures;
    };
    Products_by_Categories: {
      keys: TnorthwindV4Products_by_CategoriesKeys;
      fields: TnorthwindV4Products_by_CategoriesFields;
      measures: TnorthwindV4Products_by_CategoriesMeasures;
    };
    Sales_by_Categories: {
      keys: TnorthwindV4Sales_by_CategoriesKeys;
      fields: TnorthwindV4Sales_by_CategoriesFields;
      measures: TnorthwindV4Sales_by_CategoriesMeasures;
    };
    Sales_Totals_by_Amounts: {
      keys: TnorthwindV4Sales_Totals_by_AmountsKeys;
      fields: TnorthwindV4Sales_Totals_by_AmountsFields;
      measures: TnorthwindV4Sales_Totals_by_AmountsMeasures;
    };
    Summary_of_Sales_by_Quarters: {
      keys: TnorthwindV4Summary_of_Sales_by_QuartersKeys;
      fields: TnorthwindV4Summary_of_Sales_by_QuartersFields;
      measures: TnorthwindV4Summary_of_Sales_by_QuartersMeasures;
    };
    Summary_of_Sales_by_Years: {
      keys: TnorthwindV4Summary_of_Sales_by_YearsKeys;
      fields: TnorthwindV4Summary_of_Sales_by_YearsFields;
      measures: TnorthwindV4Summary_of_Sales_by_YearsMeasures;
    };
  };
  functions: {
  };
}

export class northwindV4 extends OData<TnorthwindV4Type> {
  public static readonly serviceName = "northwindV4" as const;
  private static instance?: northwindV4;
  static entityAliases = {
    Categories: "Categories" as const,
    CustomerDemographics: "CustomerDemographics" as const,
    Customers: "Customers" as const,
    Employees: "Employees" as const,
    Order_Details: "Order_Details" as const,
    Orders: "Orders" as const,
    Products: "Products" as const,
    Regions: "Regions" as const,
    Shippers: "Shippers" as const,
    Suppliers: "Suppliers" as const,
    Territories: "Territories" as const,
    Alphabetical_list_of_products: "Alphabetical_list_of_products" as const,
    Category_Sales_for_1997: "Category_Sales_for_1997" as const,
    Current_Product_Lists: "Current_Product_Lists" as const,
    Customer_and_Suppliers_by_Cities: "Customer_and_Suppliers_by_Cities" as const,
    Invoices: "Invoices" as const,
    Order_Details_Extendeds: "Order_Details_Extendeds" as const,
    Order_Subtotals: "Order_Subtotals" as const,
    Orders_Qries: "Orders_Qries" as const,
    Product_Sales_for_1997: "Product_Sales_for_1997" as const,
    Products_Above_Average_Prices: "Products_Above_Average_Prices" as const,
    Products_by_Categories: "Products_by_Categories" as const,
    Sales_by_Categories: "Sales_by_Categories" as const,
    Sales_Totals_by_Amounts: "Sales_Totals_by_Amounts" as const,
    Summary_of_Sales_by_Quarters: "Summary_of_Sales_by_Quarters" as const,
    Summary_of_Sales_by_Years: "Summary_of_Sales_by_Years" as const
  };
  public static getInstance() {
    if (!northwindV4.instance) {
      northwindV4.instance = new northwindV4()
    }
    return northwindV4.instance
  }
  private constructor(opts?: TODataOptions) {
    super("northwindV4", {...opts, host: "http://localhost", path: "/odata/northwind-v4"})
  }
}

