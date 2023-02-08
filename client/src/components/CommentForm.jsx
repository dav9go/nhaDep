import { useState } from "react";
import { useAuth } from "./auth";

export default function CommentForm({
  handleSubmit,
  submitLabel,
  hasCancelButton = false,
  initialText = "",
  handleCancel,
}) {
  const auth = useAuth();
  const [text, setText] = useState(initialText);

  function onSubmit(e) {
    e.preventDefault();
    handleSubmit(text);
    setText("");
  }

  return (
    <form className="mt-3" onSubmit={onSubmit}>
      <textarea
        required
        maxLength="3000"
        className="resize-none h-40 relative peer z-20 bg-blue-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-blue-300 block w-full p-3"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <div className="w-full flex justify-center items-center">
        <button
          className={`mb-5 text-white ${
            !auth.user?._id ? "bg-gray-700 cursor-not-allowed" : "bg-green-700"
          }  font-medium rounded-md text-sm w-full px-5 py-2.5 mt-7 text-center max-w-xl`}
          type="submit"
        >
          {!auth.user?._id ? <p>Login to {submitLabel} </p> : submitLabel}
        </button>

        {hasCancelButton && (
          <button
            type="button"
            className="mb-5 text-white bg-red-700 font-medium rounded-md text-sm w-full px-5 py-2.5 mt-7 text-center max-w-xl"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
