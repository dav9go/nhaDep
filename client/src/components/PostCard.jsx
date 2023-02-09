import { useState, useEffect } from "react";
import { useAuth } from "./auth";
import Comments from "./Comments";

export default function PostCard({
  photo,
  title,
  user,
  userId,
  createdAt,
  description,
  tags,
  _id,
  likes,
}) {
  const auth = useAuth();
  /** State with an object containing post id and author id and send it through put request **/
  const [userData, setUserData] = useState({});

  const [likesNumber, setLikesNumber] = useState(0);
  const [liked, setLiked] = useState(false);

  const tagsArray = tags.split(", ");
  /** Format creation date of the post **/
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formatDate = new Date(createdAt).toLocaleDateString("en-US", options);

  async function handleLikeClick() {
    /**Format author ID and post ID data to send throught put request **/
    const authorId = auth.user._id;
    userData.authorId = authorId;
    userData.postId = _id;
    setUserData({ ...userData });
    /** Check if there is logged user and also if the user has given like to the post already. If so cannot send the put request to add more likes **/
    if (auth.user && !likes.some((item) => item == auth.user._id) && !liked) {
      setLikesNumber(likesNumber + 1);
      setLiked(true);
      try {
        async function LikeFn() {
          await fetch(`https://nhadep.onrender.com/api/v1/post/like`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
        }

        LikeFn();
      } catch (error) {
        console.log(error);
      }
    } else {
      if (liked) {
        setLikesNumber(likesNumber - 1);
        setLiked(false);
        try {
          async function unLikeFn() {
            await fetch(`https://nhadep.onrender.com/api/v1/post/unlike`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            });
          }

          unLikeFn();
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  useEffect(() => {
    setLikesNumber(likes.length);
    if (auth.user) {
      if (likes?.some((item) => item == auth.user._id)) {
        setLiked(true);
      }
    }
    return;
  }, []);

  return (
    <div className="w-full">
      <img className="mx-auto" src={photo} />
      <div className="flex justify-between items-baseline w-full">
        <div className="flex gap-5 items-baseline mt-10">
          <h1 className="text-3xl font-bold">{title}</h1>
          <div className="text-xl font-medium text-slate-700 flex items-center gap-3">
            {user}
            <div className="text-xs">
              {userId.isDesigner ? (
                <span className="bg-orange-300 px-2 rounded-xl">
                  Verified designer
                </span>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-5 items-baseline">
          <div className="text-md font-semibold text-slate-500">
            {formatDate}
          </div>

          <div className="flex items-center gap-3 mb-3">
            {/** Red heart if the user has given like to the post already **/}
            <button
              className={
                liked
                  ? "flex-none flex items-center justify-center w-9 h-9 rounded-md bg-red-600 text-white border-2 border-black"
                  : "flex-none flex items-center justify-center w-9 h-9 rounded-md text-slate-400 border border-slate-400 hover:bg-red-600 hover:text-white hover:border-2 hover:border-black"
              }
              type="button"
              aria-label="Like"
              onClick={handleLikeClick}
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                />
              </svg>
            </button>
            <div className="text-slate-400">Likes: {likesNumber}</div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="text-sm text-slate-700 mb-3 flex items-center gap-3 w-full">
          Tags:{" "}
          {tagsArray.map((tag) => {
            return (
              <button
                key={tag}
                className="bg-gray-200 hover:bg-gray-400 cursor-pointer px-2 rounded-lg line-clamp-1"
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10">{description}</div>

      <div className="mt-10">
        {/** Change currentuserId */}
        <Comments currentUserId={auth.user?._id} />
      </div>
    </div>
  );
}
