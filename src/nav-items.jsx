import { Home, Brain, Settings } from "lucide-react";
import Index from "./pages/Index.jsx";
import TensorflowDemo from "./pages/TensorflowDemo.jsx";
import SettingsPage from "./pages/Settings.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "TensorFlow Demo",
    to: "/tensorflow-demo",
    icon: <Brain className="h-4 w-4" />,
    page: <TensorflowDemo />,
  },
  {
    title: "Settings",
    to: "/settings",
    icon: <Settings className="h-4 w-4" />,
    page: <SettingsPage />,
  },
];