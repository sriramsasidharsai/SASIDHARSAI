import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for real-time intern metrics
  app.get("/api/interns/metrics", (req, res) => {
    const seed = Date.now();
    const mockData = [
      { week: 'Week 1', tasksCompleted: 4, hoursWorked: 35, productivityScore: 72 },
      { week: 'Week 2', tasksCompleted: 6, hoursWorked: 40, productivityScore: 85 },
      { week: 'Week 3', tasksCompleted: 5, hoursWorked: 38, productivityScore: 78 },
      { week: 'Week 4', tasksCompleted: 8, hoursWorked: 45, productivityScore: 92 },
      { week: 'Week 5', tasksCompleted: 7 + Math.sin(seed / 1000) * 1, hoursWorked: 42, productivityScore: 88 + Math.cos(seed / 1000) * 5 },
    ];
    
    // Randomize current values slightly to simulate "real-time" data changes
    const currentMetrics = {
      avgTasks: (6.0 + Math.random() * 0.5).toFixed(1),
      utilization: (84.5 + Math.random() * 2).toFixed(1),
      history: mockData
    };

    res.json(currentMetrics);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
