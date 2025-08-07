// Export the getBaseUrl function so it can be used in other components
export function getBaseUrl() {
  // For server-side calls, we need an absolute URL
  if (typeof window === "undefined") {
    // Use NEXT_PUBLIC_API_URL if available, otherwise default to http://localhost:3000
    return process.env.NEXTAUTH_URL || "http://localhost:3000"
  }

  // For client-side calls, we can use relative URLs
  return ""
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData.error || `API error: ${response.status} - ${response.statusText}`
    console.error(errorMessage)
    throw new Error(errorMessage)
  }

  try {
    return await response.json()
  } catch (error) {
    console.error("Error parsing JSON response:", error)
    throw new Error("Failed to parse server response")
  }
}





// Get homepage section by ID
export async function getHomepageSectionById(id: string): Promise<any | null> {
  const url = `${getBaseUrl()}/api/admin/homepage-sections/${id}`

  try {
    const response = await fetch(url)
    const data = await handleResponse<any>(response)
    return data || null
  
  } catch (error) {
    console.error("Error fetching homepage section:", error)
    return null
  }
}

/* ───────────────────────────────────────────────
   Get every DESKTOP banner  (type = "banner")
─────────────────────────────────────────────── */
export async function getBannerSections(): Promise<any[]> {
  const url = `${getBaseUrl()}/api/admin/homepage-sections?type=banner`;

  try {
    const res = await fetch(url, { cache: "no-store" });   // always fresh
    return await handleResponse<any[]>(res);
  } catch (err) {
    console.error("Error fetching banner sections:", err);
    return [];
  }
}

/* ───────────────────────────────────────────────
   Get every MOBILE banner  (type = "mobile-banner")
─────────────────────────────────────────────── */
export async function getMobileBannerSections(): Promise<any[]> {
  const url = `${getBaseUrl()}/api/admin/homepage-sections?type=mobile-banner`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    return await handleResponse<any[]>(res);
  } catch (err) {
    console.error("Error fetching mobile‑banner sections:", err);
    return [];
  }
}

/* ───────────────────────────────────────────────
   Get every Dekstop Product banner  (type = "product-banner")
─────────────────────────────────────────────── */
export async function getProductBannerSections(): Promise<any[]> {
  const url = `${getBaseUrl()}/api/admin/homepage-sections?type=product-banner`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    return await handleResponse<any[]>(res);
  } catch (err) {
    console.error("Error fetching mobile‑banner sections:", err);
    return [];
  }
}


/* ───────────────────────────────────────────────
   Get every Dekstop Service banner  (type = "services")
─────────────────────────────────────────────── */
export async function getServicesSections(): Promise<any[]> {
  const url = `${getBaseUrl()}/api/admin/homepage-sections?type=services`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    return await handleResponse<any[]>(res);
  } catch (err) {
    console.error("Error fetching mobile‑banner sections:", err);
    return [];
  }
}


/* ───────────────────────────────────────────────
   Get every Mobile Service banner  (type = "mobile-services")
─────────────────────────────────────────────── */
export async function getMobileServicesSections(): Promise<any[]> {
  const url = `${getBaseUrl()}/api/admin/homepage-sections?type=mobile-services`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    return await handleResponse<any[]>(res);
  } catch (err) {
    console.error("Error fetching mobile‑banner sections:", err);
    return [];
  }
}

/* ───────────────────────────────────────────────
   Get every Dekstop Mega banner  (type = "mobile-services")
─────────────────────────────────────────────── */
export async function getMegaSaleSections(): Promise<any[]> {
  const url = `${getBaseUrl()}/api/admin/homepage-sections?type=mega-sale`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    return await handleResponse<any[]>(res);
  } catch (err) {
    console.error("Error fetching mobile‑banner sections:", err);
    return [];
  }
}

/* ───────────────────────────────────────────────
   Get every Mobile Megasale banner  (type = "mobile-mega-sale")
─────────────────────────────────────────────── */
export async function getMobileMegaSaleSections(): Promise<any[]> {
  const url = `${getBaseUrl()}/api/admin/homepage-sections?type=mobile-mega-sale`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    return await handleResponse<any[]>(res);
  } catch (err) {
    console.error("Error fetching mobile‑banner sections:", err);
    return [];
  }
}
