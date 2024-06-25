// Define the base URL for your API
const BASE_URL = "https://8104-105-120-130-2.ngrok-free.app"; // Replace with your API URL

// Define the function to send a POST request with a bearer token using fetch
export const BankGet = async (
  endpoint: string,
  token: string | null | undefined
) => {
  try {
    const response = await fetch(`${BASE_URL}/api/bankoperations/${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add any other headers if needed
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error);
  }
};
