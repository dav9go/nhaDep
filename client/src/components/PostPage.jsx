import Navbar from "./Navbar";
import Footer from "./Footer";
import Loader from "./Loader";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PostCard from "./PostCard";

export default function PostPage() {
  const [onePost, setOnePost] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  const RenderPost = ({ data, title }) => {
    console.log(onePost);
    if (data?.length > 0)
      return data.map((post) => <PostCard key={post._id} {...post} />);

    return <h2 className="mt-5 font-bold text-xl uppercase">{title}</h2>;
  };

  useEffect(() => {
    setLoading(true);

    async function fetchThePost() {
      try {
        const response = await fetch(
          `https://nhadep.onrender.com/api/v1/post${location.pathname}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setOnePost([result.data]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchThePost();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <section className="max-w-7xl mx-auto mt-10 flex flex-col gap-5">
          <div className="mt-10">
            {loading ? (
              <div className="flex justify-center items-center">
                <Loader />
              </div>
            ) : (
              <>
                <RenderPost data={onePost} title="Post not found" />
              </>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
