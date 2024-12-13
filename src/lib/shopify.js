// Shopify API configuration
const SHOPIFY_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN;

// Helper function to find metafield value
const findMetafieldValue = (metafields, namespace, key) => {
  console.log(`Looking for metafield ${namespace}.${key} in:`, metafields);
  const metafield = metafields.find(
    edge => edge.node.namespace === namespace && edge.node.key === key
  );
  console.log(`Found metafield:`, metafield);
  return metafield ? metafield.node.value : null;
};

export const fetchShopifyProducts = async () => {
  try {
    const query = `{
      products(first: 100) {
        edges {
          node {
            id
            title
            handle
            status
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price
                  compareAtPrice
                  inventoryQuantity
                  inventoryPolicy
                }
              }
            }
            metafields(first: 20) {
              edges {
                node {
                  namespace
                  key
                  value
                  type
                }
              }
            }
            onSale: metafield(namespace: "custom", key: "OnSale") {
              value
              type
            }
            onSalePercentOff: metafield(namespace: "custom", key: "OnSalePercentOff") {
              value
              type
            }
            onSaleImage: metafield(namespace: "custom", key: "OnSaleImage") {
              value
              type
            }
          }
        }
      }
    }`;

    const response = await fetch('/shopify/admin/api/2024-01/graphql.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Full API Response:', data);
    
    // Transform the response data
    const transformedProducts = data.data.products.edges.map(({ node }) => {
      console.log('Raw product data:', node);
      
      const metafieldValues = {
        onSale: node.onSale?.value === 'true',
        onSalePercentOff: parseInt(node.onSalePercentOff?.value || '0', 10),
        onSaleImage: node.onSaleImage?.value || null
      };

      console.log(`Processed metafields for ${node.title}:`, metafieldValues);

      return {
        id: node.id,
        title: node.title,
        handle: node.handle,
        status: node.status,
        image: node.images.edges[0]?.node.url || '',
        variants: node.variants.edges.map(edge => ({
          id: edge.node.id,
          price: edge.node.price,
          compareAtPrice: edge.node.compareAtPrice,
          inventoryQuantity: edge.node.inventoryQuantity,
          inventoryPolicy: edge.node.inventoryPolicy
        })),
        metafields: metafieldValues
      };
    });

    return transformedProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const updateProductMetafields = async (productId, metafields) => {
  try {
    const mutation = `
      mutation updateProductMetafields($input: ProductInput!) {
        productUpdate(input: $input) {
          product {
            id
            metafields(first: 10) {
              edges {
                node {
                  key
                  namespace
                  value
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await fetch('/shopify/admin/api/2024-01/graphql.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            id: productId,
            metafields: Object.entries(metafields).map(([key, value]) => ({
              key: key.replace(/([A-Z])/g, '_$1').toLowerCase(),
              namespace: 'custom',
              value: String(value),
              type: key === 'onSalePercentOff' ? 'integer' : key === 'onSaleImage' ? 'url' : 'boolean'
            }))
          }
        }
      }),
    });

    const data = await response.json();
    
    if (data.errors || (data.data && data.data.productUpdate.userErrors.length > 0)) {
      throw new Error(JSON.stringify(data.errors || data.data.productUpdate.userErrors));
    }

    return data.data.productUpdate.product;
  } catch (error) {
    console.error('Error updating product metafields:', error);
    throw error;
  }
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(price);
};