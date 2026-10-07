// Derived from a sample QA response for GET /license-management/v1/customers.
// quotationRequested, cancellationRequested and autoRenewalDate are null for
// some customers in QA, so null is allowed for those fields.
// autoRenewalDate starts with a date but is not strict ISO 8601, so only
// the string type is enforced.
export const licenseCustomersSchema = {
  type: 'object',
  required: ['data', 'page', 'size', 'totalCount', 'totalPages'],
  properties: {
    data: {
      type: 'array',
      items: {
        type: 'object',
        required: [
          'id',
          'quotationRequested',
          'cancellationRequested',
          'autoRenewalDate',
          'numberOfAssets'
        ],
        properties: {
          id: { type: 'number' },
          quotationRequested: { type: ['boolean', 'null'] },
          cancellationRequested: { type: ['boolean', 'null'] },
          autoRenewalDate: { type: ['string', 'null'] },
          numberOfAssets: { type: 'number' }
        }
      }
    },
    page: { type: 'number' },
    size: { type: 'number' },
    totalCount: { type: 'number' },
    totalPages: { type: 'number' }
  }
};
