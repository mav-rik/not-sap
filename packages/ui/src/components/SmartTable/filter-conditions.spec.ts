import { describe, it, expect } from 'vitest';
import { odataFilterFormat } from '@notsap/odata';
import { fieldsFiltersToODataFilters } from './filter-conditions.utils'

describe('filter-conditions', () => {
  it('should transform typed filter to OData filter', () => {
    expect(
      odataFilterFormat.fromTypedValue({
        type: 'notBw',
        value: ['1', '2'],
      })
    ).toEqual({ notBw: ['1', '2'] });
  });
  it('should transform OData filter to typed filter', () => {
    expect(odataFilterFormat.toTypedValue({ notBw: ['1', '2'] })).toEqual({
      type: 'notBw',
      value: ['1', '2'],
    });
  });
  it('should convert fields filters to OData filters', () => {
    const odataFilters = fieldsFiltersToODataFilters({
      fieldName: [
        {
          notBw: ['1', '2'],
        },
        {
          bw: ['3', '4'],
        },
        {
          notEq: '5',
        },
        {
          eq: '6',
        },
      ],
    });

    expect(odataFilters).toEqual([
      {
        $and: [
          {
            $or: [{ fieldName: { bw: ['3', '4'] } }, { fieldName: { eq: '6' } }],
          },
          {
            $and: [{ fieldName: { notBw: ['1', '2'] } }, { fieldName: { notEq: '5' } }],
          },
        ],
      },
    ]);
  });
});
