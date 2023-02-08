import Navbar from "./Navbar";
import { useAuth } from "./auth";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";
import Card from "./Card";

export default function Profile() {
  const auth = useAuth();
  console.log(auth);
  const location = useLocation();

  const [allUserPosts, setAllUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [totalLikes, setTotalLikes] = useState(0);

  console.log("All user posts", allUserPosts);

  /** Format creation date of the post **/
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formatDate = new Date(auth.user?.createdAt).toLocaleDateString(
    "en-US",
    options
  );

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/post${location.pathname}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setAllUserPosts(result.data.posts.reverse());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const allLikes = allUserPosts.reduce(
      (acc, currentValue) => acc + currentValue.likes.length,
      0
    );

    setTotalLikes(allLikes);
  }, [allUserPosts]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const RenderCards = ({ data, title, setAllUserPosts }) => {
    console.log(data);
    if (data?.length > 0)
      return data.map((post) => (
        <Card
          data={data}
          setAllUserPosts={setAllUserPosts}
          key={post._id}
          {...post}
          setTotalLikes={setTotalLikes}
          totalLikes={totalLikes}
        />
      ));

    return <h2 className="mt-5 font-bold text-xl uppercase">{title}</h2>;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <section className="max-w-7xl mx-auto mt-10 flex flex-col gap-5">
          <div className="flex gap-5">
            <img src={auth.user?.picture} />
            <div className="flex justify-between w-full">
              <div className="flex flex-col justify-around">
                <div className="text-3xl flex items-center gap-3">
                  {auth.user?.name}{" "}
                  <div className="text-xs">
                    {auth.user?.isDesigner ? (
                      <span className="bg-orange-300 px-2 rounded-xl">
                        Verified designer
                      </span>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className="text-xl text-slate-500">{auth.user?.email}</div>
              </div>
              <div className="flex h-full items-center mr-20">
                <div className="text-xl">Total Likes: {totalLikes}</div>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <div>
              <span className="font-semibold">Member since:</span> {formatDate}
            </div>
            <div>
              <span className="font-semibold">Proffesional designer:</span>{" "}
              {auth.user?.isDesigner ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-semibold">Premium account:</span>{" "}
              {auth.user?.isPremium ? "Yes" : "No"}
            </div>
          </div>
          <div className="mt-5">{auth.user?.bio}</div>
          <div className="mt-5">
            <div>
              <span className="font-semibold">Posts:</span>
            </div>
          </div>
          <div className="mt-10">
            {loading ? (
              <div className="flex justify-center items-center">
                <Loader />
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                  {allUserPosts ? (
                    <RenderCards
                      data={allUserPosts}
                      setAllUserPosts={setAllUserPosts}
                      title="No posts found"
                    />
                  ) : (
                    <div>No posts found</div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
