import { useAuth } from "./auth";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Card({
  photo,
  title,
  description,
  user,
  tags,
  likes,
  createdAt,
  userId,
  postComments,
  _id,
  setAllPosts,
  data,
  setAllUserPosts,
}) {
  const location = useLocation();
  const auth = useAuth();
  /** String to array of tags and split to show only the first 5 to improve UI **/
  const tagsArray = tags.split(", ").slice(0, 5);

  /** Format the date of the post **/
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formatDate = new Date(createdAt).toLocaleDateString("en-US", options);

  /** State with an object containing post id and author id and send it through put request **/
  const [userData, setUserData] = useState({});

  const [likesNumber, setLikesNumber] = useState(0);
  const [liked, setLiked] = useState(false);

  /** State to create the object needed to send through put request to delete post and post comments **/
  const [deletePostObject, setDeletePostObject] = useState({});

  async function handleLikeClick() {
    console.log("author Id", auth.user._id);
    console.log("post IDr Id", _id);
    /**Format author ID and post ID data to send throught put request **/
    const authorId = auth.user._id;
    userData.authorId = authorId;
    userData.postId = _id;
    setUserData({ ...userData });
    console.log("AFTER SETUSERDATA", userData);
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

  async function handleDeletePost() {
    try {
      /** userId._id for home page and userId for profile page **/
      if (auth.user?._id === (userId._id || userId)) {
        console.log("id of the POST", _id);
        deletePostObject.id = _id;
        deletePostObject.userId = auth.user._id;
        const photoIdArray = photo.split("/");
        console.log("PHOTOIDARRAY", photoIdArray);
        const lastUrlPart = photoIdArray[photoIdArray.length - 1];
        console.log("lastUrlPart", lastUrlPart);
        const codeId = lastUrlPart.split(".");
        console.log("codeId", codeId);
        const codeNeeded = codeId[0];
        console.log("codeNeeded", codeNeeded);
        deletePostObject.photoId = codeNeeded;
        setDeletePostObject({ ...deletePostObject });
        console.log("delete post object", deletePostObject);

        const deletePost = await fetch(
          "https://nhadep.onrender.com/api/v1/post/delete",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(deletePostObject),
          }
        );
        const deleteCloudinary = await fetch(
          "https://nhadep.onrender.com/api/v1/post/deleteCloudinary",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(deletePostObject),
          }
        );
        const updatedPosts = data.filter((post) => post._id !== _id);
        if (location.pathname === "/home") {
          setAllPosts(updatedPosts);
        } else {
          setAllUserPosts(updatedPosts);
        }
      }
    } catch {
      console.log(error);
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
    <div className="flex flex-col font-sans">
      <div className="flex-none h-[300px] relative rounded-lg overflow-hidden">
        <img
          src={photo}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <form className="flex-auto p-6">
        <div className="flex flex-wrap items-center">
          <h1 className="flex-auto text-lg font-semibold text-slate-900">
            {title}
          </h1>
          <div className="text-sm font-semibold text-slate-500">
            {formatDate}
          </div>
          <div className="w-full flex-none text-sm font-medium text-slate-700 mt-2">
            <div className="flex items-center gap-3">
              {user}{" "}
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
        </div>
        <div className="flex items-baseline lg:max-w-mlg h-[75px] mt-4 mb-3 pb-6 border-b border-slate-200">
          <div className="space-x-2 flex text-sm line-clamp-3">
            {description}
          </div>
        </div>
        <div className="text-xs lg:text-sm text-slate-700 mb-3 flex items-center gap-3 w-full">
          Tags:{" "}
          {tagsArray.map((tag) => {
            return (
              <div
                key={tag}
                className="bg-gray-200 px-2 rounded-lg line-clamp-1"
              >
                {tag}
              </div>
            );
          })}
        </div>

        {/** Likes and Comments of the post **/}
        <div className="flex justify-around">
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
          <div className="text-slate-400 flex items-center mb-3">
            Comments: {postComments?.length}
          </div>
        </div>
        <div className="flex space-x-4 mb-6 text-sm font-medium">
          <div className="flex-auto flex space-x-4">
            <Link
              to={`/post/${_id}`}
              className="h-10 px-6 font-semibold rounded-md bg-black text-white w-full flex justify-center items-center"
            >
              Check Out
            </Link>
            {/** userId._id for home page and userId for profile page **/}
            {auth.user?._id === (userId._id || userId) && (
              <button
                type="button"
                className="h-10 px-6 font-semibold rounded-md bg-red-700 text-white w-full flex justify-center items-center"
                onClick={handleDeletePost}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
