import { useState, useEffect } from "react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { useLocation } from "react-router-dom";
import { useAuth } from "./auth";
import Loader from "./Loader";

export default function Comments({ currentUserId }) {
  const auth = useAuth();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  /** All the comments of the post from the backend **/
  const [backendComments, setBackendComments] = useState([]);
  /** Get only the comments that are not replies **/
  const [rootComments, setRootComments] = useState([]);

  /** Make an onject to send through put request to delete the comment and the coment in post array **/
  const [commentIdObject, setCommentIdObject] = useState({});

  /** State to bring all the data toghether in a state to send through post request, or I got is not json **/
  const [commentData, setCommentData] = useState({});

  /** State to know if we are editing or replying **/
  const [activeComment, setActiveComment] = useState(null);

  /** State to prepare the object to send through put request to edit comment **/
  const [editCommentObject, setEditCommentObject] = useState({});

  /** Function to get the replies of a given comment **/
  function getReplies(commentId) {
    return backendComments.filter(
      (backendComment) => backendComment?.parentId === commentId
    );
  }

  /** Function to pass to CommentForm and add a comment, then store information in a state to send trough post request **/
  function addComment(text, parentId) {
    console.log("addComment", text, parentId);
    commentData.description = text;
    commentData.parentId = parentId || null;
    commentData.userId = auth.user._id;
    setCommentData({ ...commentData });

    console.log("CommentData", commentData);
    async function createComment() {
      try {
        await fetch(
          `https://nhadep.onrender.com/api/v1/comment${location.pathname}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(commentData),
          }
        ).then(async (res) => {
          const result = await res.json();
          console.log("insideeeee", result);
          setBackendComments([...backendComments, result.data]);
          console.log("Backend comments after ALL", backendComments);
        });
      } catch {
        console.log(error);
      } finally {
        setCommentData({});
        setActiveComment(null);
      }
    }
    createComment();
  }

  function deleteComment(commentId) {
    if (window.confirm("Are you sure that you want to remove this comment?")) {
      commentIdObject.commentId = commentId;
      setCommentIdObject({ ...commentIdObject });
      console.log(commentIdObject);
      const fetchDeleteComment = async () => {
        try {
          await fetch(
            `https://nhadep.onrender.com/api/v1/comment/delete${location.pathname}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(commentIdObject),
            }
          );

          const updatedBackendComments = backendComments.filter(
            (backendComment) => backendComment._id !== commentId
          );

          setBackendComments(updatedBackendComments);
        } catch {
          console.log(error);
        }
      };
      fetchDeleteComment();
    }
  }

  function updateComment(text, commentId) {
    console.log("text edit", text);
    console.log("comment ID", commentId);
    editCommentObject.text = text;
    editCommentObject.id = commentId;
    setEditCommentObject({ ...editCommentObject });
    console.log("Edit Comment object", editCommentObject);

    const fetchUpdateComment = async () => {
      try {
        await fetch("https://nhadep.onrender.com/api/v1/comment/edit-comment", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editCommentObject),
        }).then((res) => {
          const updatedBackendComments = backendComments.map(
            (backendComment) => {
              if (backendComment._id === commentId) {
                return { ...backendComment, body: text };
              }
              return backendComment;
            }
          );
          setBackendComments(updatedBackendComments);
          setActiveComment(null);
        });
      } catch {
        console.log(error);
      }
    };

    fetchUpdateComment();
  }

  /** FETCH BACKEND COMMENTS */
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `https://nhadep.onrender.com/api/v1/comment${location.pathname}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          const allBackendPosts = result.data.postComments;
          setBackendComments(allBackendPosts);
          console.log("Backend comments", backendComments);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  /** Update root Comments when create or delete one **/

  useEffect(() => {
    const updatedRootComments = backendComments.filter(
      (backendComment) => backendComment?.parentId === null
    );
    setRootComments(updatedRootComments);
  }, [backendComments]);

  return (
    <div className="w-full">
      <h3 className="text-3xl text-center lg:text-start">Comments</h3>

      {/** Comment Form  **/}

      <div className="mt-5">
        <CommentForm submitLabel="Write" handleSubmit={addComment} />
      </div>

      {/** Comments  **/}

      {backendComments.length > 0 && (
        <div>
          <div>
            <h4 className="text-xl">All comments</h4>
          </div>
          {rootComments.map((rootComment) => (
            <Comment
              key={rootComment._id}
              comment={rootComment}
              replies={getReplies(rootComment._id)}
              currentUserId={currentUserId}
              deleteComment={deleteComment}
              updateComment={updateComment}
              activeComment={activeComment}
              setActiveComment={setActiveComment}
              addComment={addComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
