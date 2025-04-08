import React, { useState, useEffect } from "react";

const ContactForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add useEffect to clear status messages after 3 seconds
  useEffect(() => {
    let timeoutId;

    if (status) {
      timeoutId = setTimeout(() => {
        setStatus(null);
      }, 3000); // 3 seconds
    }

    // Cleanup function to clear timeout if component unmounts or status changes
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // Using FormSubmit.co as a free email service
      // Replace "your-email@example.com" with your actual email
      const response = await fetch(
        "https://formsubmit.co/ajax/valentajulyansaputra@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: email,
            message: message,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setStatus({ type: "success", message: "Message sent successfully!" });
        // Clear form
        setEmail("");
        setMessage("");
      } else {
        setStatus({
          type: "error",
          message: "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Network error. Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full px-4 md:px-0 max-w-lg mx-auto my-8 md:my-12"
      id="contact"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 md:space-y-6"
      >
        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="font-spartan text-sm md:text-base mb-1 md:mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black text-white border border-white rounded-md p-2 md:p-3 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-sm md:text-base"
            placeholder="example@email.com"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="message"
            className="font-spartan text-sm md:text-base mb-1 md:mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-black text-white border border-white rounded-md p-2 md:p-3 h-32 md:h-40 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-sm md:text-base resize-y min-h-[120px]"
            placeholder="Your message here..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`
            bg-primary text-white py-3 px-6 rounded-md font-spartan 
            transition-all duration-300 text-sm md:text-base
            ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-opacity-90 active:scale-95"
            }
            shadow-md hover:shadow-lg
          `}
        >
          {loading ? "Sending..." : "Submit"}
        </button>

        {status && (
          <div
            className={`p-3 md:p-4 rounded-md text-sm md:text-base ${
              status.type === "success" ? "bg-green-800" : "bg-red-800"
            } animate-fade-in-up`}
          >
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
