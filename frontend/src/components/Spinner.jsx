export default function Spinner() {
  return (
    <div
      aria-label="loading"
      className="w-5 h-5 border-2 border-gray-300 rounded-full"
      style={{ borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }}
    />
  );
}
