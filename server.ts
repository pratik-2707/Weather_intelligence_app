import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/ai-recommendations", async (req, res) => {
    try {
      const { weatherData, city, queryType, userPrompt } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({
          success: false,
          fallback: true,
          message: "Gemini API key not configured. Using rule-based intelligence engine."
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `You are an expert Weather Intelligence Assistant for ${city || 'the selected location'}.
Current Weather Context:
- Temperature: ${weatherData?.current?.temperature ?? 'N/A'}°C
- Weather condition: ${weatherData?.current?.weatherLabel ?? 'N/A'}
- Wind speed: ${weatherData?.current?.windSpeed ?? 'N/A'} km/h
- Humidity: ${weatherData?.current?.humidity ?? 'N/A'}%
- UV Index: ${weatherData?.current?.uvIndex ?? 'N/A'}
- Today's Max/Min: ${weatherData?.daily?.temperatureMax?.[0] ?? 'N/A'}°C / ${weatherData?.daily?.temperatureMin?.[0] ?? 'N/A'}°C
- Precipitation Probability: ${weatherData?.daily?.precipitationProbabilityMax?.[0] ?? '0'}%

Request Type: ${queryType || 'general_planning'}
User Prompt / Question: ${userPrompt || 'Provide structured planning recommendations for activities, attire, travel, and health safety.'}

Return a valid JSON object matching this exact structure:
{
  "summary": "Short 2-sentence weather briefing.",
  "activityRecommendations": [
    { "activity": "Outdoor Running / Jogging", "suitability": "Optimal", "rationale": "Reason...", "bestTimeWindow": "Morning (7-10 AM)" },
    { "activity": "Outdoor Dining", "suitability": "Caution", "rationale": "Reason...", "bestTimeWindow": "Afternoon" }
  ],
  "clothingPlanner": {
    "summary": "Clothing summary...",
    "itemsToBring": ["Umbrella", "Light jacket", "Sunglasses"],
    "layeringAdvice": "Layering tips..."
  },
  "commuteTravelAdvice": "Advice for driving/cycling/transit...",
  "healthSafety": {
    "uvPrecaution": "UV advice...",
    "airQualityOrComfort": "Comfort / Hydration advice..."
  },
  "proTips": ["Tip 1", "Tip 2"]
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "";
      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        parsed = { rawText: text };
      }

      return res.json({
        success: true,
        data: parsed
      });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      return res.status(500).json({
        success: false,
        error: err.message || "Failed to generate AI recommendations"
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
