import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="text-center lg:text-start p-4 bg-white shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 mt-10">
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
        © 2023{" "}
        <Link to="#" className="hover:underline">
          Nội thất nhà đẹp™
        </Link>
        . All Rights Reserved.
      </span>
      <ul className="flex flex-wrap items-center justify-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
          <Link to="#" className="mr-4 hover:underline md:mr-6 ">
            About
          </Link>
        </li>
        <li>
          <Link to="#" className="mr-4 hover:underline md:mr-6">
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link to="#" className="mr-4 hover:underline md:mr-6">
            Licensing
          </Link>
        </li>
        <li>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
        </li>
      </ul>
    </footer>
  );
}
