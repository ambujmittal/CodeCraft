import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "@/redux/store";
export default function Home() {
  const isLoggedIn = useSelector(
    (state: RootState) => state.appSlice.isLoggedIn
  );
  return (
    <div className="w-full h-[calc(100dvh-60px)] bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex justify-center items-center flex-col gap-4 p-4">
      <h1 className="text-4xl sm:text-7xl font-extrabold text-center bg-gradient-to-r from-blue-200 to-blue-500 text-transparent bg-clip-text">
        CodeCraft
      </h1>
      <p className="text-lg sm:text-2xl text-gray-400 text-center px-4 max-w-2xl">
        Real-time collaborative editor with live code compilation for HTML, CSS,
        and JavaScript
      </p>
      {!isLoggedIn && (
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Link to="/login">
            <button className="px-6 py-3 w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow-md transition duration-300 ease-in-out">
              Get Started
            </button>
          </Link>
          <Link to="/all-codes">
            <button className="px-6 py-3 w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold shadow-md transition duration-300 ease-in-out">
              Showcase
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
