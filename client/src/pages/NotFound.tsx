export default function NotFound() {
  return (
    <div className="w-full h-[calc(100dvh-60px)] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex justify-center items-center text-2xl font-bold">
      <div className="text-center">
        <h1 className="text-4xl sm:text-6xl mb-4 animate-pulse">404</h1>
        <p className="text-xl sm:text-2xl">Page nahi mila bhai</p>
        <p className="text-sm sm:text-base mt-2 text-gray-400">
          Lagta hai aap galat jagah aa gaye ho. Wapas jaane ke liye{" "}
          <a href="/" className="text-blue-400 underline">
            yaha click karein
          </a>
          .
        </p>
      </div>
    </div>
  );
}
