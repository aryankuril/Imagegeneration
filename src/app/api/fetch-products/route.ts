import { NextResponse } from "next/server";

const GRAPHQL_API_ENDPOINT = "/admin/api/2023-01/graphql.json";

// Helper to normalize the Shopify store URL
function normalizeShopifyUrl(url: string): string {
  let normalized = url.trim();
  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
    normalized = `https://${normalized}`;
  }
  // Strip /admin if the user included it
  normalized = normalized.replace(/\/admin\/?$/, "");
  // Remove trailing slashes
  return normalized.replace(/\/+$/, "");
}

// Define types for GraphQL response structure
interface ImageNode {
  id: string;
}

interface ImageEdge {
  node: ImageNode;
}

interface ProductNode {
  id: string;
  title: string;
  images: {
    edges: ImageEdge[];
  };
}

interface ProductEdge {
  node: ProductNode;
}

interface ProductsResponse {
  data?: {
    products?: {
      edges: ProductEdge[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
  };
  errors?: Array<{ message: string; locations?: any; path?: any }>;
}

// Function to fetch all products using pagination
async function fetchAllProducts(
  store: string,
  apiKey: string,
  filterZeroMedia: boolean
) {
  const normalizedStore = normalizeShopifyUrl(store);
  const query = `
    query ($after: String) {
      products(first: 250, after: $after) {
        edges {
          node {
            id
            title
            images(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  let allProducts: ProductNode[] = [];
  let hasNextPage = true;
  let endCursor: string | null = null;

  while (hasNextPage) {
    const apiUrl = `${normalizedStore}${GRAPHQL_API_ENDPOINT}`;
    console.log(`Fetching products from: ${apiUrl}`);

    const response: Response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": apiKey,
      },
      body: JSON.stringify({
        query,
        variables: { after: endCursor },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Shopify API error at ${apiUrl} (${response.status}): ${errorText}`);
      throw new Error(`Failed to fetch products at ${apiUrl}: ${response.status} ${response.statusText}`);
    }

    const data: ProductsResponse = await response.json();

    // Check for GraphQL errors
    if (data.errors && data.errors.length > 0) {
      console.error("GraphQL errors:", JSON.stringify(data.errors, null, 2));
      throw new Error(`Shopify GraphQL Error: ${data.errors[0].message}`);
    }

    if (!data.data || !data.data.products) {
      console.error("Invalid response structure from Shopify:", JSON.stringify(data, null, 2));
      throw new Error("Invalid response from Shopify. Please check your API permissions.");
    }

    const products = data.data.products.edges.map((edge) => edge.node);

    // Filter products with zero media if the option is selected
    const filteredProducts = filterZeroMedia
      ? products.filter((product) => product.images.edges.length === 0)
      : products;

    allProducts = [...allProducts, ...filteredProducts];

    const { hasNextPage: nextPage, endCursor: cursor } =
      data.data.products.pageInfo;
    hasNextPage = nextPage;
    endCursor = cursor;
  }

  return allProducts;
}

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error("Failed to parse request JSON:", e);
      return NextResponse.json(
        { error: "Invalid request body. Expected JSON." },
        { status: 400 }
      );
    }
    const { store, apiKey, filterZeroMedia } = body;

    if (!store || !apiKey) {
      return NextResponse.json(
        { error: "Store link or API key is missing" },
        { status: 400 }
      );
    }

    console.log(`Starting fetch for store: ${store}`);
    const products = await fetchAllProducts(store, apiKey, filterZeroMedia);
    console.log(`Successfully fetched ${products.length} products`);

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Unexpected error in /api/fetch-products:", error);
    return NextResponse.json(
      { error: (error as Error).message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";

// const GRAPHQL_API_ENDPOINT = "/admin/api/2023-10/graphql.json";

// // Function to fetch all products using pagination
// async function fetchAllProducts(
//   store: string,
//   apiKey: string,
//   filterZeroMedia: boolean
// ) {
//   const query = `
//     query ($after: String) {
//       products(first: 250, after: $after) {
//         edges {
//           node {
//             id
//             title
//             images(first: 1) {
//               edges {
//                 node {
//                   id
//                 }
//               }
//             }
//           }
//         }
//         pageInfo {
//           hasNextPage
//           endCursor
//         }
//       }
//     }
//   `;

//   let allProducts: any[] = [];
//   let hasNextPage = true;
//   let endCursor = null;

//   while (hasNextPage) {
//     const response: Response = await fetch(`${store}${GRAPHQL_API_ENDPOINT}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Shopify-Access-Token": apiKey,
//       },
//       body: JSON.stringify({
//         query,
//         variables: { after: endCursor },
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch products: ${response.statusText}`);
//     }

//     const data = await response.json();
//     const products = data.data.products.edges.map((edge: any) => edge.node);

//     // Filter products with zero media if the option is selected
//     const filteredProducts = filterZeroMedia
//       ? products.filter((product: any) => product.images.edges.length === 0)
//       : products;

//     allProducts = [...allProducts, ...filteredProducts];

//     const { hasNextPage: nextPage, endCursor: cursor } =
//       data.data.products.pageInfo;
//     hasNextPage = nextPage;
//     endCursor = cursor;
//   }

//   return allProducts;
// }

// export async function POST(request: Request) {
//   try {
//     const { store, apiKey, filterZeroMedia } = await request.json();

//     if (!store || !apiKey) {
//       return NextResponse.json(
//         { error: "Store link or API key is missing" },
//         { status: 400 }
//       );
//     }

//     const products = await fetchAllProducts(store, apiKey, filterZeroMedia);

//     return NextResponse.json({ products });
//   } catch (error) {
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// }
