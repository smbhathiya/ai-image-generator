export default function Loader() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative w-24 h-16 flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-3 bg-primary rounded animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
}
