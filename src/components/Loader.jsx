export default function Loader({ size = "md" }) {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4"
  };

  return (
    <div className="flex justify-center items-center py-10" id="spinner-loader">
      <div 
        className={`${sizeClasses[size]} animate-spin rounded-full border-peach-200 border-t-peach-500`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
