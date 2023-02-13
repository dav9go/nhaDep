import Navbar from "./Navbar";
import Loader from "./Loader";
import Card from "./Card";
import { useState, useEffect } from "react";
import FormField from "./FormField";
import Footer from "./Footer";
import { Link } from "react-router-dom";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);

  const [postsOfLastMonth, setPostsOfLastMonth] = useState([]);
  const [topFiveLikedPostsLastMonth, setTopFiveLikedPostsLastMonth] = useState(
    []
  );

  const [searchText, setSearchText] = useState("");
  const [searchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const RenderCards = ({ data, title }) => {
    if (data?.length > 0)
      return data.map((post) => (
        <Card
          setAllPosts={setAllPosts}
          allPosts={allPosts}
          data={data}
          key={post._id}
          {...post}
        />
      ));

    return <h2 className="mt-5 font-bold text-xl uppercase">{title}</h2>;
  };

  useEffect(() => {
    function fivePostOfTheMonth() {
      /** Set the posts of the last month only **/
      const today = new Date().getTime();
      console.log("TODAY", today);
      console.log("allposts", allPosts);
      const lastMonthPosts = allPosts.filter(
        (post) => today - new Date(post.createdAt).getTime() < 2629800000
      );
      console.log("lastMonthPosts", lastMonthPosts);

      setPostsOfLastMonth(lastMonthPosts);
    }
    fivePostOfTheMonth();
  }, [allPosts]);

  useEffect(() => {
    function fivePostLkOfTheMonth() {
      const fiveMostLiked = postsOfLastMonth
        .sort((a, b) => a.likes.length - b.likes.length)
        .reverse()
        .slice(0, 5);

      console.log("fiveMostLiked", fiveMostLiked);
      setTopFiveLikedPostsLastMonth(fiveMostLiked);
    }
    fivePostLkOfTheMonth();
  }, [postsOfLastMonth]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          "https://nhadep.onrender.com/api/v1/post",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setAllPosts(result.data.reverse());
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);

    /** Clear timeout to search again **/
    clearTimeout(searchTimeout);
    setSearchTimeout(
      /** Timeout of 500ms to dont make a request every single character when searching **/
      setTimeout(() => {
        const searchResults = allPosts.filter(
          (item) =>
            item.title.toLowerCase().includes(searchText.toLowerCase()) ||
            item.tags.toLowerCase().includes(searchText.toLowerCase())
        );

        setSearchedResults(searchResults);
      }, 500)
    );
  };

  return (
    <div className="flex flex-col min-h-screen max-w-screen">
      <Navbar />
      <div className="flex-1">
        {allPosts && (
          <>
            <section className="max-w-7xl mx-auto mt-10 flex flex-col gap-5 px-5 lg:px-0 ">
              <div>
                <h1 className="font-bold text-4xl text-center lg:text-start ">
                  The Community Showcase
                </h1>
                <p className="font-montserrat mt-2 text-md max-w-7xl text-justify lg:text-start">
                  Discover the latest interior design trends and transform your
                  home into a beautiful oasis with the help of our online
                  interior house design platform. Browse thousands of inspiring
                  home decor ideas, from modern to traditional, and everything
                  in between. Get inspired by a vast library of customizable
                  furniture, materials, and color palettes. Collaborate with our
                  professional interior designers and receive tailored design
                  plans and shopping lists. Create the home of your dreams with
                  our easy-to-use, user-friendly platform, available 24/7. Start
                  designing your perfect interior space now.
                </p>
              </div>
            </section>
            <div className="max-w-7xl mx-auto mt-10 flex flex-col gap-5">
              <h2 className="text-3xl text-center">
                Top 5 posts of the last 30 days
              </h2>
            </div>
            <section className="relative flex w-full h-[430px] mt-10">
              <div className="relative w-[0px] group grow object-cover opacity-80 duration-500 ease-in hover:w-[300px] hover:opacity-100 hover:contrast-125 hover:cursor-pointer hover:text-white">
                <Link to={`/post/${topFiveLikedPostsLastMonth[3]?._id}`}>
                  <img
                    className="h-full w-full grow object-cover"
                    src={topFiveLikedPostsLastMonth[3]?.photo}
                  />
                  <div className="absolute rounded-md bottom-0 mx-auto m-5 p-10 w-9/12 bg-black/40 group-hover:bg-black/75 hidden group-hover:flex justify-around">
                    <div>{topFiveLikedPostsLastMonth[3]?.user}</div>
                    <div className="flex items-center gap-2">
                      {topFiveLikedPostsLastMonth[3]?.likes.length}{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="relative w-[0px] group grow object-cover opacity-80 duration-500 ease-in hover:w-[300px] hover:opacity-100 hover:contrast-125 hover:cursor-pointer hover:text-white">
                <Link to={`/post/${topFiveLikedPostsLastMonth[1]?._id}`}>
                  <img
                    className="h-full w-full grow object-cover"
                    src={topFiveLikedPostsLastMonth[1]?.photo}
                  />
                  <div className="absolute rounded-md bottom-0 mx-auto m-5 p-10 w-9/12 bg-black/40 group-hover:bg-black/75 hidden group-hover:flex justify-around">
                    <div>{topFiveLikedPostsLastMonth[1]?.user}</div>
                    <div className="flex items-center gap-2">
                      {topFiveLikedPostsLastMonth[1]?.likes.length}{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="relative w-[0px] group grow object-cover opacity-80 duration-500 ease-in hover:w-[300px] hover:opacity-100 hover:contrast-125 hover:cursor-pointer hover:text-white">
                <Link to={`/post/${topFiveLikedPostsLastMonth[0]?._id}`}>
                  <img
                    className="h-full w-full grow object-cover"
                    src={topFiveLikedPostsLastMonth[0]?.photo}
                  />
                  <div className="absolute rounded-md bottom-0 mx-auto m-5 p-10 w-9/12 bg-black/40 group-hover:bg-black/75 hidden group-hover:flex justify-around">
                    <div>{topFiveLikedPostsLastMonth[0]?.user}</div>
                    <div className="flex items-center gap-2">
                      {topFiveLikedPostsLastMonth[0]?.likes.length}{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="relative w-[0px] group grow object-cover opacity-80 duration-500 ease-in hover:w-[300px] hover:opacity-100 hover:contrast-125 hover:cursor-pointer hover:text-white">
                <Link to={`/post/${topFiveLikedPostsLastMonth[2]?._id}`}>
                  <img
                    className="h-full w-full grow object-cover"
                    src={topFiveLikedPostsLastMonth[2]?.photo}
                  />
                  <div className="absolute rounded-md bottom-0 mx-auto m-5 p-10 w-9/12 bg-black/40 group-hover:bg-black/75 hidden group-hover:flex justify-around">
                    <div>{topFiveLikedPostsLastMonth[2]?.user}</div>
                    <div className="flex items-center gap-2">
                      {topFiveLikedPostsLastMonth[2]?.likes.length}{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="relative w-[0px] group grow object-cover opacity-80 duration-500 ease-in hover:w-[300px] hover:opacity-100 hover:contrast-125 hover:cursor-pointer hover:text-white">
                <Link to={`/post/${topFiveLikedPostsLastMonth[4]?._id}`}>
                  <img
                    className="h-full w-full grow object-cover"
                    src={topFiveLikedPostsLastMonth[4]?.photo}
                  />
                  <div className="absolute rounded-md bottom-0 mx-auto m-5 p-10 w-9/12 bg-black/40 group-hover:bg-black/75 hidden group-hover:flex justify-around">
                    <div>{topFiveLikedPostsLastMonth[4]?.user}</div>
                    <div className="flex items-center gap-2">
                      {topFiveLikedPostsLastMonth[4]?.likes.length}{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            </section>
            <section className="max-w-7xl mx-auto mt-10 flex flex-col gap-5">
              <div className="px-5 lg:px-0">
                <FormField
                  labelName="Search posts"
                  type="text"
                  name="text"
                  placeholder="Search posts"
                  value={searchText}
                  handleChange={handleSearchChange}
                />
              </div>

              <div className="mt-10">
                {loading ? (
                  <div className="flex justify-center items-center">
                    <Loader />
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                      {searchText ? (
                        <RenderCards
                          data={searchedResults}
                          title="No search results found"
                        />
                      ) : (
                        <RenderCards
                          allPosts={allPosts}
                          data={allPosts}
                          setAllPosts={setAllPosts}
                          title="No posts found"
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            </section>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
