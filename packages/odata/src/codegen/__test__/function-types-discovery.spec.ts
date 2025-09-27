import { describe, it, expect } from 'vitest'
import { Metadata } from '../../metadata'
import { generateModelTypes } from '../types-generators'

describe('Function Type Discovery', () => {
  it('should discover and generate ComplexTypes from function parameters', () => {
    // Create a test metadata with a function that uses a ComplexType in parameters
    const metadataXml = `
<edmx:Edmx xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx" Version="4.0">
  <edmx:DataServices>
    <Schema xmlns="http://docs.oasis-open.org/odata/ns/edm" Namespace="Test">
      <ComplexType Name="SearchCriteria">
        <Property Name="Query" Type="Edm.String" />
        <Property Name="MaxResults" Type="Edm.Int32" />
      </ComplexType>
      <EntityType Name="Product">
        <Key><PropertyRef Name="ID" /></Key>
        <Property Name="ID" Type="Edm.Int32" Nullable="false" />
        <Property Name="Name" Type="Edm.String" />
      </EntityType>
      <Function Name="SearchProducts">
        <Parameter Name="criteria" Type="Test.SearchCriteria" />
        <ReturnType Type="Collection(Test.Product)" />
      </Function>
      <EntityContainer Name="Container">
        <EntitySet Name="Products" EntityType="Test.Product" />
        <FunctionImport Name="SearchProducts" Function="Test.SearchProducts" EntitySet="Products" />
      </EntityContainer>
    </Schema>
  </edmx:DataServices>
</edmx:Edmx>`

    const metadata = new Metadata<any>(metadataXml, {} as any, 'Test')
    const generatedCode = generateModelTypes(metadata, { alias: 'test' })

    // The SearchCriteria ComplexType should be discovered from the function parameter
    // and included in the generated code
    expect(generatedCode).toContain("'Test.SearchCriteria': {")
    expect(generatedCode).toContain("Query?:")
    expect(generatedCode).toContain("MaxResults?:")

    // Function should reference the ComplexType
    expect(generatedCode).toContain("'SearchProducts': {")
    expect(generatedCode).toContain("criteria:")
    expect(generatedCode).toContain("TTestOData['complexTypes']['Test.SearchCriteria']")
  })

  it('should discover EntityTypes from function return types', () => {
    // Create a test metadata where only functions reference certain entity types
    const metadataXml = `
<edmx:Edmx xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx" Version="4.0">
  <edmx:DataServices>
    <Schema xmlns="http://docs.oasis-open.org/odata/ns/edm" Namespace="Test">
      <EntityType Name="User">
        <Key><PropertyRef Name="ID" /></Key>
        <Property Name="ID" Type="Edm.Int32" Nullable="false" />
        <Property Name="Name" Type="Edm.String" />
      </EntityType>
      <EntityType Name="SpecialUser">
        <Key><PropertyRef Name="ID" /></Key>
        <Property Name="ID" Type="Edm.Int32" Nullable="false" />
        <Property Name="Role" Type="Edm.String" />
      </EntityType>
      <Function Name="GetSpecialUser">
        <ReturnType Type="Test.SpecialUser" />
      </Function>
      <EntityContainer Name="Container">
        <EntitySet Name="Users" EntityType="Test.User" />
        <FunctionImport Name="GetSpecialUser" Function="Test.GetSpecialUser" />
      </EntityContainer>
    </Schema>
  </edmx:DataServices>
</edmx:Edmx>`

    const metadata = new Metadata<any>(metadataXml, {} as any, 'Test')
    const generatedCode = generateModelTypes(metadata, { alias: 'test' })

    // SpecialUser should be discovered from function return type
    expect(generatedCode).toContain("'Test.SpecialUser': {")

    // Function should have correct return type
    expect(generatedCode).toContain("returnType: TTestOData['entityTypes']['Test.SpecialUser']['record']")
  })
})