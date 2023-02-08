import CommentForm from "./CommentForm";

export default function Comment({
  comment,
  replies,
  currentUserId,
  deleteComment,
  updateComment,
  activeComment,
  setActiveComment,
  addComment,
  parentId = null,
}) {
  console.log("REPLIES", replies);

  /** Give only 5 minutes to edit or delete **/
  const fiveMinutes = 300000;
  const timePassed = new Date() - new Date(comment.createdAt) > fiveMinutes;
  const canReply = Boolean(currentUserId);
  const canEdit = currentUserId === comment.userId._id && !timePassed;
  const canDelete = currentUserId === comment.userId._id && !timePassed;
  const isReplying =
    activeComment &&
    activeComment.type === "replying" &&
    activeComment.id === comment._id;
  const isEditing =
    activeComment &&
    activeComment.type === "editing" &&
    activeComment.id === comment._id;
  /** If we are replying to a reply it will stick to the parent comment, because Im implementing only 2 coment leves
   * not more than one nested comment **/
  const replyId = parentId ? parentId : comment._id;

  /** Format creation date of the post **/
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formatDate = new Date(comment.createdAt).toLocaleDateString(
    "en-US",
    options
  );

  return (
    <div className="mt-5 p-5 border-2 border-blue-300 rounded-xl">
      <div className="flex gap-5">
        <div className="font-bold flex items-center gap-3">
          {comment.userId.name}
          <div className="text-xs">
            {comment.userId.isDesigner ? (
              <span className="bg-orange-300 px-2 rounded-xl">
                Verified designer
              </span>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="text-md font-semibold text-slate-500">{formatDate}</div>
      </div>
      {!isEditing && (
        <div className="mt-5 bg-blue-50 p-2 rounded-xl">{comment.body}</div>
      )}
      {isEditing && (
        <CommentForm
          submitLabel="Update"
          hasCancelButton
          initialText={comment.body}
          handleSubmit={(text) => updateComment(text, comment._id)}
          handleCancel={() => setActiveComment(null)}
        />
      )}
      <div className="flex gap-5 mt-5">
        {canReply && (
          <div
            className="bg-green-100 hover:bg-green-200 transition-all px-2 py-1 rounded-xl cursor-pointer w-16 flex justify-center items-center"
            onClick={() =>
              setActiveComment({ id: comment._id, type: "replying" })
            }
          >
            Reply
          </div>
        )}
        {canEdit && (
          <div
            className="bg-blue-100 hover:bg-blue-200 transition-all px-2 py-1 rounded-xl cursor-pointer w-16 flex justify-center items-center"
            onClick={() =>
              setActiveComment({ id: comment._id, type: "editing" })
            }
          >
            Edit
          </div>
        )}
        {canDelete && (
          <div
            className="bg-red-100 hover:bg-red-200 transition-all px-2 py-1 rounded-xl cursor-pointer w-16 flex justify-center items-center"
            onClick={() => deleteComment(comment._id)}
          >
            Delete
          </div>
        )}
      </div>
      <div className="ml-10">
        {isReplying && (
          <CommentForm
            submitLabel="Reply"
            handleSubmit={(text) => addComment(text, replyId)}
          />
        )}
        {replies.length > 0 && (
          <div>
            {replies.map((reply) => (
              <Comment
                comment={reply}
                key={reply._id}
                replies={[]}
                currentUserId={currentUserId}
                deleteComment={deleteComment}
                updateComment={updateComment}
                parentId={comment._id}
                addComment={addComment}
                setActiveComment={setActiveComment}
                activeComment={activeComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
