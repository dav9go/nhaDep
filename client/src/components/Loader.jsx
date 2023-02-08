import loadingpic from "../assets/loadingpic.png";

export default function Loader() {
  return (
    <div>
      <div className="relative flex items-center gap-3" role="status">
        <img src={loadingpic}></img>
        <div className="absolute m-auto left-0 right-0">
          <div className="spinner">
            <div className="cube1"></div>
            <div className="cube2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
