import AppRoutes from "./routes/AppRoutes";
import { HealthProvider } from "./context/HealthContext";

function App() {
  return (
    <HealthProvider>
      <AppRoutes />
    </HealthProvider>
  );
}

export default App;