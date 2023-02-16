export default function LoaderNoImg() {
  return (
    <div className="h-full">
      <div
        className="relative h-full flex items-center justify-center gap-3"
        role="status"
      >
        <div className="absolute h-full m-auto left-0 right-0">
          <div className="spinner">
            <div className="cube1"></div>
            <div className="cube2"></div>
          </div>
        </div>
        <p>Fetching data from the server...</p>
      </div>
    </div>
  );
}
