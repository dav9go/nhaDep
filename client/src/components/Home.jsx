import Navbar from "./Navbar";
import Loader from "./Loader";
import Card from "./Card";
import { useState, useEffect } from "react";
import FormField from "./FormField";
import Footer from "./Footer";
import prueba1 from "../assets/prueba1.jpg";
import prueba2 from "../assets/prueba2.jpg";
import prueba3 from "../assets/prueba3.jpg";
import prueba4 from "../assets/prueba4.jpg";
import prueba5 from "../assets/prueba5.jpg";

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
    console.log(data);
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

      const fiveMostLiked = postsOfLastMonth
        .sort((a, b) => a.likes.length - b.likes.length)
        .reverse()
        .slice(0, 5);

      console.log("fiveMostLiked", fiveMostLiked);
      setTopFiveLikedPostsLastMonth(fiveMostLiked);
    }
    fivePostOfTheMonth();
  }, [allPosts]);

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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <section className="max-w-7xl mx-auto mt-10 flex flex-col gap-5">
          <div>
            <h1 className="font-bold text-4xl">The Community Showcase</h1>
            <p className="font-montserrat mt-2 text-md max-w-7xl">
              Discover the latest interior design trends and transform your home
              into a beautiful oasis with the help of our online interior house
              design platform. Browse thousands of inspiring home decor ideas,
              from modern to traditional, and everything in between. Get
              inspired by a vast library of customizable furniture, materials,
              and color palettes. Collaborate with our professional interior
              designers and receive tailored design plans and shopping lists.
              Create the home of your dreams with our easy-to-use, user-friendly
              platform, available 24/7. Start designing your perfect interior
              space now.
            </p>
          </div>
        </section>
        <div className="max-w-7xl mx-auto mt-10 flex flex-col gap-5">
          <h2 className="text-3xl text-center">
            Top 5 posts of the last 30 days
          </h2>
        </div>
        <section className="w-full flex h-[430px] mt-10">
          <img
            className="w-[0px] grow object-cover opacity-80 duration-500 ease-in hover:w-[300px] hover:opacity-100 hover:contrast-125 hover:cursor-pointer"
            src={topFiveLikedPostsLastMonth[3]?.photo}
          />
          <img
            className="w-[0px] grow object-cover opacity-80 duration-500 ease-in hover:w-[300px] hover:opacity-100 hover:contrast-125 hover:cursor-pointer"
            src={topFiveLikedPostsLastMonth[1]?.photo}
          />
          <img
            className="w-[0px] grow object-cover opacity-80 duration-500 ease-in hover:w-[300px] hover:opacity-100 hover:contrast-125 hover:cursor-pointer"
            src={topFiveLikedPostsLastMonth[0]?.photo}
          />
          <img
            className="w-[0px] grow object-cover opacity-80 duration-500 ease-in hover:w-[300px] hover:opacity-100 hover:contrast-125 hover:cursor-pointer"
            src={topFiveLikedPostsLastMonth[2]?.photo}
          />
          <img
            className="w-[0px] grow object-cover opacity-80 duration-500 ease-in hover:w-[300px] hover:opacity-100 hover:contrast-125 hover:cursor-pointer"
            src={topFiveLikedPostsLastMonth[4]?.photo}
          />
        </section>
        <section className="max-w-7xl mx-auto mt-10 flex flex-col gap-5">
          <div>
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
      </div>
      <Footer />
    </div>
  );
}
