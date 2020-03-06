import app from "./app";

process.on("uncaughtException", err => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () =>
  console.log(`App running on port ${port}...`)
);

process.on("unhandledRejection", err => {
  console.log(err.name, err.message);
  console.log("UNHANDELD REJECTION! Shutting down...");
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("✋ SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
