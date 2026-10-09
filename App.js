// Snack-compatible entry point.
// The full app continues to use Expo Router in the native project.
// This entry renders the Home screen so Snack can import and preview the UI.
import HomeScreen from "./app/index";

export default function App() {
  return <HomeScreen />;
}
