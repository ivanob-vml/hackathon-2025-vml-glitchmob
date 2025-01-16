import axios from 'axios';

// Define the type for the request body
interface RequestPromptBody {
  prompt: string;
}

const apiEndpoint = 'https://i91lhpkm59.execute-api.us-west-2.amazonaws.com/dev'; // Replace with your AWS API endpoint

// Function to make the POST request
export const postGenerateImage = async (prompt: string): Promise<void> => {
  // Define the request body
  const requestBody: RequestPromptBody = { prompt };

  try {
    // Make the POST request using axios
    const response = await axios.post(apiEndpoint + '/generate-image', requestBody, {
      headers: {
        'Content-Type': 'application/json', // Specify the content type
      },
    });

    // Log the response from the API
    console.log('Response:', response.data);
  } catch (error) {
    // Handle errors
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}