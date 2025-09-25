/*
* This code was GENERATED using the vite plugin odata-codegen.
* It contains TypeScript type definitions for OData services.
* Do not modify this file manually as it will be overwritten on the next build.
* For any changes, update the OData service definitions or plugin configuration.
*/

/* eslint-disable */
/* prettier-ignore */

import { OData, type TOdataDummyInterface, type TODataOptions } from "notsapodata"


export const northwindV2Name = "northwindV2";

// northwindV2/Categories
export const northwindV2CategoriesEntitySet = "Categories";
export const northwindV2CategoriesFields = [
  "CategoryID",
  "CategoryName",
  "Description",
  "Picture"
] as const;
export const northwindV2CategoriesKeys = [
  "CategoryID"
] as const;
export const northwindV2CategoriesMeasures = [] as const;
export type TnorthwindV2CategoriesFields = typeof northwindV2CategoriesFields[number];
export type TnorthwindV2CategoriesKeys = typeof northwindV2CategoriesKeys[number];
export type TnorthwindV2CategoriesMeasures = typeof northwindV2CategoriesMeasures[number];
// northwindV2/CustomerDemographics
export const northwindV2CustomerDemographicsEntitySet = "CustomerDemographics";
export const northwindV2CustomerDemographicsFields = [
  "CustomerTypeID",
  "CustomerDesc"
] as const;
export const northwindV2CustomerDemographicsKeys = [
  "CustomerTypeID"
] as const;
export const northwindV2CustomerDemographicsMeasures = [] as const;
export type TnorthwindV2CustomerDemographicsFields = typeof northwindV2CustomerDemographicsFields[number];
export type TnorthwindV2CustomerDemographicsKeys = typeof northwindV2CustomerDemographicsKeys[number];
export type TnorthwindV2CustomerDemographicsMeasures = typeof northwindV2CustomerDemographicsMeasures[number];
// northwindV2/Customers
export const northwindV2CustomersEntitySet = "Customers";
export const northwindV2CustomersFields = [
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
export const northwindV2CustomersKeys = [
  "CustomerID"
] as const;
export const northwindV2CustomersMeasures = [] as const;
export type TnorthwindV2CustomersFields = typeof northwindV2CustomersFields[number];
export type TnorthwindV2CustomersKeys = typeof northwindV2CustomersKeys[number];
export type TnorthwindV2CustomersMeasures = typeof northwindV2CustomersMeasures[number];
// northwindV2/Employees
export const northwindV2EmployeesEntitySet = "Employees";
export const northwindV2EmployeesFields = [
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
export const northwindV2EmployeesKeys = [
  "EmployeeID"
] as const;
export const northwindV2EmployeesMeasures = [] as const;
export type TnorthwindV2EmployeesFields = typeof northwindV2EmployeesFields[number];
export type TnorthwindV2EmployeesKeys = typeof northwindV2EmployeesKeys[number];
export type TnorthwindV2EmployeesMeasures = typeof northwindV2EmployeesMeasures[number];
// northwindV2/Order_Details
export const northwindV2Order_DetailsEntitySet = "Order_Details";
export const northwindV2Order_DetailsFields = [
  "OrderID",
  "ProductID",
  "UnitPrice",
  "Quantity",
  "Discount"
] as const;
export const northwindV2Order_DetailsKeys = [
  "OrderID",
  "ProductID"
] as const;
export const northwindV2Order_DetailsMeasures = [] as const;
export type TnorthwindV2Order_DetailsFields = typeof northwindV2Order_DetailsFields[number];
export type TnorthwindV2Order_DetailsKeys = typeof northwindV2Order_DetailsKeys[number];
export type TnorthwindV2Order_DetailsMeasures = typeof northwindV2Order_DetailsMeasures[number];
// northwindV2/Orders
export const northwindV2OrdersEntitySet = "Orders";
export const northwindV2OrdersFields = [
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
export const northwindV2OrdersKeys = [
  "OrderID"
] as const;
export const northwindV2OrdersMeasures = [] as const;
export type TnorthwindV2OrdersFields = typeof northwindV2OrdersFields[number];
export type TnorthwindV2OrdersKeys = typeof northwindV2OrdersKeys[number];
export type TnorthwindV2OrdersMeasures = typeof northwindV2OrdersMeasures[number];
// northwindV2/Products
export const northwindV2ProductsEntitySet = "Products";
export const northwindV2ProductsFields = [
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
export const northwindV2ProductsKeys = [
  "ProductID"
] as const;
export const northwindV2ProductsMeasures = [] as const;
export type TnorthwindV2ProductsFields = typeof northwindV2ProductsFields[number];
export type TnorthwindV2ProductsKeys = typeof northwindV2ProductsKeys[number];
export type TnorthwindV2ProductsMeasures = typeof northwindV2ProductsMeasures[number];
// northwindV2/Regions
export const northwindV2RegionsEntitySet = "Regions";
export const northwindV2RegionsFields = [
  "RegionID",
  "RegionDescription"
] as const;
export const northwindV2RegionsKeys = [
  "RegionID"
] as const;
export const northwindV2RegionsMeasures = [] as const;
export type TnorthwindV2RegionsFields = typeof northwindV2RegionsFields[number];
export type TnorthwindV2RegionsKeys = typeof northwindV2RegionsKeys[number];
export type TnorthwindV2RegionsMeasures = typeof northwindV2RegionsMeasures[number];
// northwindV2/Shippers
export const northwindV2ShippersEntitySet = "Shippers";
export const northwindV2ShippersFields = [
  "ShipperID",
  "CompanyName",
  "Phone"
] as const;
export const northwindV2ShippersKeys = [
  "ShipperID"
] as const;
export const northwindV2ShippersMeasures = [] as const;
export type TnorthwindV2ShippersFields = typeof northwindV2ShippersFields[number];
export type TnorthwindV2ShippersKeys = typeof northwindV2ShippersKeys[number];
export type TnorthwindV2ShippersMeasures = typeof northwindV2ShippersMeasures[number];
// northwindV2/Suppliers
export const northwindV2SuppliersEntitySet = "Suppliers";
export const northwindV2SuppliersFields = [
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
export const northwindV2SuppliersKeys = [
  "SupplierID"
] as const;
export const northwindV2SuppliersMeasures = [] as const;
export type TnorthwindV2SuppliersFields = typeof northwindV2SuppliersFields[number];
export type TnorthwindV2SuppliersKeys = typeof northwindV2SuppliersKeys[number];
export type TnorthwindV2SuppliersMeasures = typeof northwindV2SuppliersMeasures[number];
// northwindV2/Territories
export const northwindV2TerritoriesEntitySet = "Territories";
export const northwindV2TerritoriesFields = [
  "TerritoryID",
  "TerritoryDescription",
  "RegionID"
] as const;
export const northwindV2TerritoriesKeys = [
  "TerritoryID"
] as const;
export const northwindV2TerritoriesMeasures = [] as const;
export type TnorthwindV2TerritoriesFields = typeof northwindV2TerritoriesFields[number];
export type TnorthwindV2TerritoriesKeys = typeof northwindV2TerritoriesKeys[number];
export type TnorthwindV2TerritoriesMeasures = typeof northwindV2TerritoriesMeasures[number];
// northwindV2/Alphabetical_list_of_products
export const northwindV2Alphabetical_list_of_productsEntitySet = "Alphabetical_list_of_products";
export const northwindV2Alphabetical_list_of_productsFields = [
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
export const northwindV2Alphabetical_list_of_productsKeys = [
  "CategoryName",
  "Discontinued",
  "ProductID",
  "ProductName"
] as const;
export const northwindV2Alphabetical_list_of_productsMeasures = [] as const;
export type TnorthwindV2Alphabetical_list_of_productsFields = typeof northwindV2Alphabetical_list_of_productsFields[number];
export type TnorthwindV2Alphabetical_list_of_productsKeys = typeof northwindV2Alphabetical_list_of_productsKeys[number];
export type TnorthwindV2Alphabetical_list_of_productsMeasures = typeof northwindV2Alphabetical_list_of_productsMeasures[number];
// northwindV2/Category_Sales_for_1997
export const northwindV2Category_Sales_for_1997EntitySet = "Category_Sales_for_1997";
export const northwindV2Category_Sales_for_1997Fields = [
  "CategoryName",
  "CategorySales"
] as const;
export const northwindV2Category_Sales_for_1997Keys = [
  "CategoryName"
] as const;
export const northwindV2Category_Sales_for_1997Measures = [] as const;
export type TnorthwindV2Category_Sales_for_1997Fields = typeof northwindV2Category_Sales_for_1997Fields[number];
export type TnorthwindV2Category_Sales_for_1997Keys = typeof northwindV2Category_Sales_for_1997Keys[number];
export type TnorthwindV2Category_Sales_for_1997Measures = typeof northwindV2Category_Sales_for_1997Measures[number];
// northwindV2/Current_Product_Lists
export const northwindV2Current_Product_ListsEntitySet = "Current_Product_Lists";
export const northwindV2Current_Product_ListsFields = [
  "ProductID",
  "ProductName"
] as const;
export const northwindV2Current_Product_ListsKeys = [
  "ProductID",
  "ProductName"
] as const;
export const northwindV2Current_Product_ListsMeasures = [] as const;
export type TnorthwindV2Current_Product_ListsFields = typeof northwindV2Current_Product_ListsFields[number];
export type TnorthwindV2Current_Product_ListsKeys = typeof northwindV2Current_Product_ListsKeys[number];
export type TnorthwindV2Current_Product_ListsMeasures = typeof northwindV2Current_Product_ListsMeasures[number];
// northwindV2/Customer_and_Suppliers_by_Cities
export const northwindV2Customer_and_Suppliers_by_CitiesEntitySet = "Customer_and_Suppliers_by_Cities";
export const northwindV2Customer_and_Suppliers_by_CitiesFields = [
  "City",
  "CompanyName",
  "ContactName",
  "Relationship"
] as const;
export const northwindV2Customer_and_Suppliers_by_CitiesKeys = [
  "CompanyName",
  "Relationship"
] as const;
export const northwindV2Customer_and_Suppliers_by_CitiesMeasures = [] as const;
export type TnorthwindV2Customer_and_Suppliers_by_CitiesFields = typeof northwindV2Customer_and_Suppliers_by_CitiesFields[number];
export type TnorthwindV2Customer_and_Suppliers_by_CitiesKeys = typeof northwindV2Customer_and_Suppliers_by_CitiesKeys[number];
export type TnorthwindV2Customer_and_Suppliers_by_CitiesMeasures = typeof northwindV2Customer_and_Suppliers_by_CitiesMeasures[number];
// northwindV2/Invoices
export const northwindV2InvoicesEntitySet = "Invoices";
export const northwindV2InvoicesFields = [
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
export const northwindV2InvoicesKeys = [
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
export const northwindV2InvoicesMeasures = [] as const;
export type TnorthwindV2InvoicesFields = typeof northwindV2InvoicesFields[number];
export type TnorthwindV2InvoicesKeys = typeof northwindV2InvoicesKeys[number];
export type TnorthwindV2InvoicesMeasures = typeof northwindV2InvoicesMeasures[number];
// northwindV2/Order_Details_Extendeds
export const northwindV2Order_Details_ExtendedsEntitySet = "Order_Details_Extendeds";
export const northwindV2Order_Details_ExtendedsFields = [
  "OrderID",
  "ProductID",
  "ProductName",
  "UnitPrice",
  "Quantity",
  "Discount",
  "ExtendedPrice"
] as const;
export const northwindV2Order_Details_ExtendedsKeys = [
  "Discount",
  "OrderID",
  "ProductID",
  "ProductName",
  "Quantity",
  "UnitPrice"
] as const;
export const northwindV2Order_Details_ExtendedsMeasures = [] as const;
export type TnorthwindV2Order_Details_ExtendedsFields = typeof northwindV2Order_Details_ExtendedsFields[number];
export type TnorthwindV2Order_Details_ExtendedsKeys = typeof northwindV2Order_Details_ExtendedsKeys[number];
export type TnorthwindV2Order_Details_ExtendedsMeasures = typeof northwindV2Order_Details_ExtendedsMeasures[number];
// northwindV2/Order_Subtotals
export const northwindV2Order_SubtotalsEntitySet = "Order_Subtotals";
export const northwindV2Order_SubtotalsFields = [
  "OrderID",
  "Subtotal"
] as const;
export const northwindV2Order_SubtotalsKeys = [
  "OrderID"
] as const;
export const northwindV2Order_SubtotalsMeasures = [] as const;
export type TnorthwindV2Order_SubtotalsFields = typeof northwindV2Order_SubtotalsFields[number];
export type TnorthwindV2Order_SubtotalsKeys = typeof northwindV2Order_SubtotalsKeys[number];
export type TnorthwindV2Order_SubtotalsMeasures = typeof northwindV2Order_SubtotalsMeasures[number];
// northwindV2/Orders_Qries
export const northwindV2Orders_QriesEntitySet = "Orders_Qries";
export const northwindV2Orders_QriesFields = [
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
export const northwindV2Orders_QriesKeys = [
  "CompanyName",
  "OrderID"
] as const;
export const northwindV2Orders_QriesMeasures = [] as const;
export type TnorthwindV2Orders_QriesFields = typeof northwindV2Orders_QriesFields[number];
export type TnorthwindV2Orders_QriesKeys = typeof northwindV2Orders_QriesKeys[number];
export type TnorthwindV2Orders_QriesMeasures = typeof northwindV2Orders_QriesMeasures[number];
// northwindV2/Product_Sales_for_1997
export const northwindV2Product_Sales_for_1997EntitySet = "Product_Sales_for_1997";
export const northwindV2Product_Sales_for_1997Fields = [
  "CategoryName",
  "ProductName",
  "ProductSales"
] as const;
export const northwindV2Product_Sales_for_1997Keys = [
  "CategoryName",
  "ProductName"
] as const;
export const northwindV2Product_Sales_for_1997Measures = [] as const;
export type TnorthwindV2Product_Sales_for_1997Fields = typeof northwindV2Product_Sales_for_1997Fields[number];
export type TnorthwindV2Product_Sales_for_1997Keys = typeof northwindV2Product_Sales_for_1997Keys[number];
export type TnorthwindV2Product_Sales_for_1997Measures = typeof northwindV2Product_Sales_for_1997Measures[number];
// northwindV2/Products_Above_Average_Prices
export const northwindV2Products_Above_Average_PricesEntitySet = "Products_Above_Average_Prices";
export const northwindV2Products_Above_Average_PricesFields = [
  "ProductName",
  "UnitPrice"
] as const;
export const northwindV2Products_Above_Average_PricesKeys = [
  "ProductName"
] as const;
export const northwindV2Products_Above_Average_PricesMeasures = [] as const;
export type TnorthwindV2Products_Above_Average_PricesFields = typeof northwindV2Products_Above_Average_PricesFields[number];
export type TnorthwindV2Products_Above_Average_PricesKeys = typeof northwindV2Products_Above_Average_PricesKeys[number];
export type TnorthwindV2Products_Above_Average_PricesMeasures = typeof northwindV2Products_Above_Average_PricesMeasures[number];
// northwindV2/Products_by_Categories
export const northwindV2Products_by_CategoriesEntitySet = "Products_by_Categories";
export const northwindV2Products_by_CategoriesFields = [
  "CategoryName",
  "ProductName",
  "QuantityPerUnit",
  "UnitsInStock",
  "Discontinued"
] as const;
export const northwindV2Products_by_CategoriesKeys = [
  "CategoryName",
  "Discontinued",
  "ProductName"
] as const;
export const northwindV2Products_by_CategoriesMeasures = [] as const;
export type TnorthwindV2Products_by_CategoriesFields = typeof northwindV2Products_by_CategoriesFields[number];
export type TnorthwindV2Products_by_CategoriesKeys = typeof northwindV2Products_by_CategoriesKeys[number];
export type TnorthwindV2Products_by_CategoriesMeasures = typeof northwindV2Products_by_CategoriesMeasures[number];
// northwindV2/Sales_by_Categories
export const northwindV2Sales_by_CategoriesEntitySet = "Sales_by_Categories";
export const northwindV2Sales_by_CategoriesFields = [
  "CategoryID",
  "CategoryName",
  "ProductName",
  "ProductSales"
] as const;
export const northwindV2Sales_by_CategoriesKeys = [
  "CategoryID",
  "CategoryName",
  "ProductName"
] as const;
export const northwindV2Sales_by_CategoriesMeasures = [] as const;
export type TnorthwindV2Sales_by_CategoriesFields = typeof northwindV2Sales_by_CategoriesFields[number];
export type TnorthwindV2Sales_by_CategoriesKeys = typeof northwindV2Sales_by_CategoriesKeys[number];
export type TnorthwindV2Sales_by_CategoriesMeasures = typeof northwindV2Sales_by_CategoriesMeasures[number];
// northwindV2/Sales_Totals_by_Amounts
export const northwindV2Sales_Totals_by_AmountsEntitySet = "Sales_Totals_by_Amounts";
export const northwindV2Sales_Totals_by_AmountsFields = [
  "SaleAmount",
  "OrderID",
  "CompanyName",
  "ShippedDate"
] as const;
export const northwindV2Sales_Totals_by_AmountsKeys = [
  "CompanyName",
  "OrderID"
] as const;
export const northwindV2Sales_Totals_by_AmountsMeasures = [] as const;
export type TnorthwindV2Sales_Totals_by_AmountsFields = typeof northwindV2Sales_Totals_by_AmountsFields[number];
export type TnorthwindV2Sales_Totals_by_AmountsKeys = typeof northwindV2Sales_Totals_by_AmountsKeys[number];
export type TnorthwindV2Sales_Totals_by_AmountsMeasures = typeof northwindV2Sales_Totals_by_AmountsMeasures[number];
// northwindV2/Summary_of_Sales_by_Quarters
export const northwindV2Summary_of_Sales_by_QuartersEntitySet = "Summary_of_Sales_by_Quarters";
export const northwindV2Summary_of_Sales_by_QuartersFields = [
  "ShippedDate",
  "OrderID",
  "Subtotal"
] as const;
export const northwindV2Summary_of_Sales_by_QuartersKeys = [
  "OrderID"
] as const;
export const northwindV2Summary_of_Sales_by_QuartersMeasures = [] as const;
export type TnorthwindV2Summary_of_Sales_by_QuartersFields = typeof northwindV2Summary_of_Sales_by_QuartersFields[number];
export type TnorthwindV2Summary_of_Sales_by_QuartersKeys = typeof northwindV2Summary_of_Sales_by_QuartersKeys[number];
export type TnorthwindV2Summary_of_Sales_by_QuartersMeasures = typeof northwindV2Summary_of_Sales_by_QuartersMeasures[number];
// northwindV2/Summary_of_Sales_by_Years
export const northwindV2Summary_of_Sales_by_YearsEntitySet = "Summary_of_Sales_by_Years";
export const northwindV2Summary_of_Sales_by_YearsFields = [
  "ShippedDate",
  "OrderID",
  "Subtotal"
] as const;
export const northwindV2Summary_of_Sales_by_YearsKeys = [
  "OrderID"
] as const;
export const northwindV2Summary_of_Sales_by_YearsMeasures = [] as const;
export type TnorthwindV2Summary_of_Sales_by_YearsFields = typeof northwindV2Summary_of_Sales_by_YearsFields[number];
export type TnorthwindV2Summary_of_Sales_by_YearsKeys = typeof northwindV2Summary_of_Sales_by_YearsKeys[number];
export type TnorthwindV2Summary_of_Sales_by_YearsMeasures = typeof northwindV2Summary_of_Sales_by_YearsMeasures[number];
export interface TnorthwindV2Type extends TOdataDummyInterface {
  entitySets: {
    Categories: {
      keys: TnorthwindV2CategoriesKeys;
      fields: TnorthwindV2CategoriesFields;
      measures: TnorthwindV2CategoriesMeasures;
    };
    CustomerDemographics: {
      keys: TnorthwindV2CustomerDemographicsKeys;
      fields: TnorthwindV2CustomerDemographicsFields;
      measures: TnorthwindV2CustomerDemographicsMeasures;
    };
    Customers: {
      keys: TnorthwindV2CustomersKeys;
      fields: TnorthwindV2CustomersFields;
      measures: TnorthwindV2CustomersMeasures;
    };
    Employees: {
      keys: TnorthwindV2EmployeesKeys;
      fields: TnorthwindV2EmployeesFields;
      measures: TnorthwindV2EmployeesMeasures;
    };
    Order_Details: {
      keys: TnorthwindV2Order_DetailsKeys;
      fields: TnorthwindV2Order_DetailsFields;
      measures: TnorthwindV2Order_DetailsMeasures;
    };
    Orders: {
      keys: TnorthwindV2OrdersKeys;
      fields: TnorthwindV2OrdersFields;
      measures: TnorthwindV2OrdersMeasures;
    };
    Products: {
      keys: TnorthwindV2ProductsKeys;
      fields: TnorthwindV2ProductsFields;
      measures: TnorthwindV2ProductsMeasures;
    };
    Regions: {
      keys: TnorthwindV2RegionsKeys;
      fields: TnorthwindV2RegionsFields;
      measures: TnorthwindV2RegionsMeasures;
    };
    Shippers: {
      keys: TnorthwindV2ShippersKeys;
      fields: TnorthwindV2ShippersFields;
      measures: TnorthwindV2ShippersMeasures;
    };
    Suppliers: {
      keys: TnorthwindV2SuppliersKeys;
      fields: TnorthwindV2SuppliersFields;
      measures: TnorthwindV2SuppliersMeasures;
    };
    Territories: {
      keys: TnorthwindV2TerritoriesKeys;
      fields: TnorthwindV2TerritoriesFields;
      measures: TnorthwindV2TerritoriesMeasures;
    };
    Alphabetical_list_of_products: {
      keys: TnorthwindV2Alphabetical_list_of_productsKeys;
      fields: TnorthwindV2Alphabetical_list_of_productsFields;
      measures: TnorthwindV2Alphabetical_list_of_productsMeasures;
    };
    Category_Sales_for_1997: {
      keys: TnorthwindV2Category_Sales_for_1997Keys;
      fields: TnorthwindV2Category_Sales_for_1997Fields;
      measures: TnorthwindV2Category_Sales_for_1997Measures;
    };
    Current_Product_Lists: {
      keys: TnorthwindV2Current_Product_ListsKeys;
      fields: TnorthwindV2Current_Product_ListsFields;
      measures: TnorthwindV2Current_Product_ListsMeasures;
    };
    Customer_and_Suppliers_by_Cities: {
      keys: TnorthwindV2Customer_and_Suppliers_by_CitiesKeys;
      fields: TnorthwindV2Customer_and_Suppliers_by_CitiesFields;
      measures: TnorthwindV2Customer_and_Suppliers_by_CitiesMeasures;
    };
    Invoices: {
      keys: TnorthwindV2InvoicesKeys;
      fields: TnorthwindV2InvoicesFields;
      measures: TnorthwindV2InvoicesMeasures;
    };
    Order_Details_Extendeds: {
      keys: TnorthwindV2Order_Details_ExtendedsKeys;
      fields: TnorthwindV2Order_Details_ExtendedsFields;
      measures: TnorthwindV2Order_Details_ExtendedsMeasures;
    };
    Order_Subtotals: {
      keys: TnorthwindV2Order_SubtotalsKeys;
      fields: TnorthwindV2Order_SubtotalsFields;
      measures: TnorthwindV2Order_SubtotalsMeasures;
    };
    Orders_Qries: {
      keys: TnorthwindV2Orders_QriesKeys;
      fields: TnorthwindV2Orders_QriesFields;
      measures: TnorthwindV2Orders_QriesMeasures;
    };
    Product_Sales_for_1997: {
      keys: TnorthwindV2Product_Sales_for_1997Keys;
      fields: TnorthwindV2Product_Sales_for_1997Fields;
      measures: TnorthwindV2Product_Sales_for_1997Measures;
    };
    Products_Above_Average_Prices: {
      keys: TnorthwindV2Products_Above_Average_PricesKeys;
      fields: TnorthwindV2Products_Above_Average_PricesFields;
      measures: TnorthwindV2Products_Above_Average_PricesMeasures;
    };
    Products_by_Categories: {
      keys: TnorthwindV2Products_by_CategoriesKeys;
      fields: TnorthwindV2Products_by_CategoriesFields;
      measures: TnorthwindV2Products_by_CategoriesMeasures;
    };
    Sales_by_Categories: {
      keys: TnorthwindV2Sales_by_CategoriesKeys;
      fields: TnorthwindV2Sales_by_CategoriesFields;
      measures: TnorthwindV2Sales_by_CategoriesMeasures;
    };
    Sales_Totals_by_Amounts: {
      keys: TnorthwindV2Sales_Totals_by_AmountsKeys;
      fields: TnorthwindV2Sales_Totals_by_AmountsFields;
      measures: TnorthwindV2Sales_Totals_by_AmountsMeasures;
    };
    Summary_of_Sales_by_Quarters: {
      keys: TnorthwindV2Summary_of_Sales_by_QuartersKeys;
      fields: TnorthwindV2Summary_of_Sales_by_QuartersFields;
      measures: TnorthwindV2Summary_of_Sales_by_QuartersMeasures;
    };
    Summary_of_Sales_by_Years: {
      keys: TnorthwindV2Summary_of_Sales_by_YearsKeys;
      fields: TnorthwindV2Summary_of_Sales_by_YearsFields;
      measures: TnorthwindV2Summary_of_Sales_by_YearsMeasures;
    };
  };
  functions: {
  };
}

export class northwindV2 extends OData<TnorthwindV2Type> {
  public static readonly serviceName = "northwindV2" as const;
  private static instance?: northwindV2;
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
    if (!northwindV2.instance) {
      northwindV2.instance = new northwindV2()
    }
    return northwindV2.instance
  }
  private constructor(opts?: TODataOptions) {
    super("northwindV2", {...opts, host: "http://localhost", path: "/odata/northwind-v2"})
  }
}

