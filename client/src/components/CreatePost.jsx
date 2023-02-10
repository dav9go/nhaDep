import Navbar from "./Navbar";
import { useState } from "react";
import FormField from "./FormField";
import preview from "../assets/preview.png";
import kitchenSKETCH from "../assets/kitchenSKETCH.jpeg";
import { useNavigate, useLocation } from "react-router-dom";
import Loader2 from "./Loader2";
import axios from "axios";
import { useAuth } from "./auth";
import Footer from "./Footer";

export default function CreatePost() {
  /** Get logged user through Google login **/
  const auth = useAuth();

  /** Navigate to Homepage after upload **/
  const navigate = useNavigate();

  /** Navigate to Homepage after upload **/
  const location = useLocation();

  const [form, setForm] = useState({
    title: "",
    tags: "",
    photo: "",
    description: "",
    user: auth.user?.name,
    userEmail: auth.user?.email,
  });

  const [imageSelected, setImageSelected] = useState("");
  const [generatingImg, setGeneratingImg] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const [formTitleError, setFormTitleError] = useState(false);
  const [formTagsError, setFormTagsError] = useState(false);
  const [formPhotoError, setFormPhotoError] = useState(false);
  const [formDescriptionError, setFormDescriptionError] = useState(false);

  const [uploadError, setUploadError] = useState(false);

  function handleTitleError(title) {
    if (!title) {
      setFormTitleError(true);
      setTimeout(() => {
        setFormTitleError(false);
      }, 10000);
    }
  }
  function handleTagsError(tags) {
    if (!tags) {
      setFormTagsError(true);
      setTimeout(() => {
        setFormTagsError(false);
      }, 10000);
    }
  }
  function handlePhotoError(photo) {
    if (!photo) {
      setFormPhotoError(true);
      setTimeout(() => {
        setFormPhotoError(false);
      }, 10000);
    }
  }

  function handleDescriptionError(photo) {
    if (!photo) {
      setFormDescriptionError(true);
      setTimeout(() => {
        setFormDescriptionError(false);
      }, 10000);
    }
  }

  const uploadImage = (e) => {
    e.preventDefault();
    if (form.title && form.tags && imageSelected && form.description) {
      setGeneratingImg(true);
      const formData = new FormData();
      formData.append("file", imageSelected);
      formData.append("upload_preset", "bfexi6se");
      try {
        async function requestsFn() {
          console.log("start axios");
          await axios
            .post(
              "https://api.cloudinary.com/v1_1/dg4ieuvqx/image/upload",
              formData
            )
            .then(async (response) => {
              console.log("form before setForm", form);
              console.log(response.data.secure_url);
              console.log(response.data);
              console.log("form before url await response data", form);
              const url = response.data.secure_url;
              form.photo = url;
              setForm({ ...form });
              console.log("form after setForm", form);
              console.log("setForm finished");
            });
          await fetch(
            `https://nhadep.onrender.com/api/v1/post${location.pathname}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(form),
            }
          ).then(() => {
            setGeneratingImg(false);
            setUploaded(true);
            navigate("/home");
          });
          console.log("finish fetch");
          console.log("form after finish fetch", form);
        }
        requestsFn();
        setImageSelected("");
      } catch (error) {
        console.log(error);
        setUploadError(true);
        setTimeout(() => {
          setUploadError(false);
        }, 10000);
      } finally {
        setTimeout(() => {
          setGeneratingImg(false);
          console.log("form after 10 seconds", form);
        }, 10000);
      }
    } else {
      handleTitleError(form.title);
      handleTagsError(form.tags);
      handlePhotoError(imageSelected);
      handleDescriptionError(form.description);
    }

    console.log("form at last", form);
  };

  function generateImage() {}

  function handleSubmit() {}

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleTextAreaChange(e) {
    setForm({ ...form, description: e.target.value });
  }

  return (
    <div className="flex flex-col min-h-screen max-w-screen">
      <Navbar />
      <div className="flex-1">
        <section className="max-w-7xl mx-auto mt-10 flex gap-5">
          <div className="w-full lg:w-1/2">
            <div className="px-5 lg:px-0">
              <h1 className="font-bold text-[32px] text-center lg:text-start">
                Upload ashtonishing designs
              </h1>
              <p className="mt-2 text-[14px] max-w-[500px] text-center lg:text-start">
                Share your best designs with the community and earn reputation
                through the process.
              </p>
            </div>

            <form className="mt-10 max-w-3xl" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5">
                <FormField
                  labelName="Title"
                  type="text"
                  name="title"
                  placeholder="Cozy wooden kitchen"
                  value={form.title}
                  handleChange={handleChange}
                  errorMsg="Write a title"
                  formError={formTitleError}
                  helpMsg="Create an appealing title"
                />
                <FormField
                  labelName="Tags"
                  type="text"
                  name="tags"
                  placeholder="japanese, kitchen..."
                  value={form.tags}
                  handleChange={handleChange}
                  errorMsg="Post some tags"
                  formError={formTagsError}
                  helpMsg="Address tags to help people find your design"
                />
                <FormField
                  labelName="Photo"
                  name="Photo"
                  errorMsg="Select a photo"
                  formError={formPhotoError}
                />
                <div>
                  <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-96 p-3 h-64 flex justify-center items-center">
                    {form.photo ? (
                      <img
                        src={form.photo}
                        alt={form.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <img
                        src={preview}
                        alt="preview"
                        className="w-6/12 h-9/12 object-contain opacity-40"
                      />
                    )}

                    {generatingImg && (
                      <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                        <Loader2 />
                      </div>
                    )}
                  </div>

                  <div>
                    <input
                      className="mt-5"
                      type="file"
                      onChange={(event) => {
                        setImageSelected(event.target.files[0]);
                      }}
                    />

                    <div className="flex items-center gap-2 mb-2 mt-5">
                      <div className="flex items-center gap-3">
                        <label
                          htmlFor="Description"
                          className="block text-sm font-medium text-gray-900"
                        >
                          Description{" "}
                          <span className="text-gray-500">
                            (max. 3000 caracters)
                          </span>
                        </label>
                        <p
                          className={`${
                            formDescriptionError
                              ? "text-red-600 text-sm font-medium"
                              : "hidden"
                          }`}
                        >
                          Explain your design to other people
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <textarea
                        value={form.description}
                        onChange={handleTextAreaChange}
                        maxLength="3000"
                        rows="7"
                        cols="66"
                        name="description"
                        id="description"
                        className="resize-none relative peer z-20 bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none block w-full p-3"
                        required
                      ></textarea>
                      <p className="z-10 ml-12 text-sm text-green-500 absolute bottom-5 peer-focus:-bottom-5 peer-focus:block transition-all">
                        Creative description of your image
                      </p>
                    </div>
                    {uploaded ? (
                      <button
                        disabled
                        type="submit"
                        onClick={(e) => {
                          uploadImage(e);
                          generateImage;
                        }}
                        className="mb-5 text-white bg-gray-700/50 font-medium rounded-md text-sm w-full px-5 py-2.5 mt-7 text-center"
                      >
                        Uploaded
                      </button>
                    ) : (
                      <button
                        type="submit"
                        onClick={(e) => {
                          uploadImage(e);
                          generateImage;
                        }}
                        className={
                          generatingImg
                            ? "mb-5 text-white bg-green-700/50 font-medium rounded-md text-sm w-full px-5 py-2.5 mt-7 text-center"
                            : "mb-5 text-white bg-green-700 font-medium rounded-md text-sm w-full px-5 py-2.5 mt-7 text-center"
                        }
                      >
                        {generatingImg ? "Uploading..." : "Upload"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="hidden lg:flex w-1/2 h-full justify-center items-center">
            <img src={kitchenSKETCH}></img>
          </div>
        </section>
        {uploadError && (
          <div className="h-16 w-full bg-red-500 rounded-md sticky bottom-0 text-white text-sm lg:text-lg text-center flex justify-center items-center">
            <p>
              An error has occurred, and the image hasn't been uploaded. Please
              check the F.A.Q. or contact page support.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
