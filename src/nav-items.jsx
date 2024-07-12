import { Home, Brain } from "lucide-react";
import Index from "./pages/Index.jsx";
import TensorflowDemo from "./pages/TensorflowDemo.jsx";

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
];