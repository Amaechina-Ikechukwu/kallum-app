// Define the base URL for your API
const BASE_URL = "https://4baf-105-113-33-121.ngrok-free.app"; // Replace with your API URL

// Define the function to send a POST request with a bearer token using fetch
export const AuthPatch = async (
  endpoint: string,
  token: string | null | undefined,
  requestBody: any // Adjust the type of requestBody according to your payload structure
) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json-patch+json",
        Authorization: `Bearer ${token}`,
        // Add any other headers if needed
      },

      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return;
  } catch (error: any) {
    throw new Error(error);
  }
};
