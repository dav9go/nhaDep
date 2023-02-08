export default function FormField({
  labelName,
  type,
  title,
  placeholder,
  value,
  handleChange,
  name,
  errorMsg,
  formError,
  helpMsg,
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-3">
          <label
            htmlFor={title}
            className="block text-sm font-medium text-gray-900"
          >
            {labelName}
          </label>
          <p
            className={`${
              formError ? "text-red-600 text-sm font-medium" : "hidden"
            }`}
          >
            {errorMsg}
          </p>
        </div>
      </div>
      {handleChange ? (
        <div className="relative">
          <input
            type={type}
            id={title}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            required
            className="relative peer z-20 bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none block w-full p-3"
          />
          <p className="z-10 ml-12 text-sm text-green-500 absolute top-2 peer-focus:top-11 peer-focus:block transition-all">
            {helpMsg}
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

/**ml-12 text-sm text-green-500 absolute hidden top-16 peer-focus:top-11 peer-focus:block transition-all */
