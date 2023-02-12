import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <section className="max-w-7xl mx-auto mt-10 flex flex-col gap-5">
          <div>
            <h1 className="font-bold text-4xl text-center lg:text-start ">
              Contact Us
            </h1>
            <br></br>
            <br></br>
            At NỘI THẤT NHÀ ĐẸP, we value your opinions, feedback and questions.
            That's why we make it easy for you to get in touch with us anytime.
            Whether you have a general inquiry or a specific request, we're here
            to help.<br></br>
            <br></br>
            You can reach us through the following channels:<br></br>
            <br></br>
            Email: david9go@gmail.com<br></br>
            We check our email regularly and strive to respond to all messages
            within 24 hours. If you have a more pressing matter, please don't
            hesitate to send us an email.<br></br>
            <br></br>
            WhatsApp: +34 608638374<br></br>
            For a quick and convenient way to get in touch, you can send us a
            message on WhatsApp. We'll do our best to respond to your message as
            soon as possible.<br></br>
            <br></br>
            Zalo: +34 608638374<br></br>
            If you prefer to use the Zalo app, we'd be happy to receive your
            message there as well.<br></br>
            <br></br>
            No matter how you choose to reach us, we promise to respond promptly
            and provide the information or assistance you need.<br></br>
            <br></br>
            Best regards,<br></br>
            NỘI THẤT NHÀ ĐẸP<br></br>
            <br></br>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
