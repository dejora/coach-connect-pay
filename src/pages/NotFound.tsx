
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-yellow-500">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        
        <p className="text-gray-500 mb-6">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        
        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full">Return to Home</Button>
          </Link>
          
          <Link to="/calendar">
            <Button variant="outline" className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
