// Define the base URL for your API
const BASE_URL = "https://4baf-105-113-33-121.ngrok-free.app"; // Replace with your API URL

// Define the function to send a POST request with a bearer token using fetch
export const AuthPost = async (
  endpoint: string,

  requestBody: any, // Adjust the type of requestBody according to your payload structure
  token?: string | undefined | null
) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any other headers if needed
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error);
  }
};
