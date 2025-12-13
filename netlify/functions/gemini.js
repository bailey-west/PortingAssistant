// netlify/functions/gemini.js

export default async (req, context) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // 1. Get the API Key from Netlify Environment Variables
    // Make sure to set GEMINI_API_KEY in your Netlify Site Settings
    const apiKey = Netlify.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Server Configuration Error: API Key missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Parse the incoming request body (the chat history)
    const body = await req.json();

    // 3. Forward the request to Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    // 4. Return the response back to the React app
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Or restrict to your domain
      },
    });

  } catch (error) {
    console.error("Proxy Error:", error);
    return new Response(JSON.stringify({ error: "Failed to connect to Gemini API" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
