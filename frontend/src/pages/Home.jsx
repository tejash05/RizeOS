import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Sprout, Handshake } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative bg-white font-sans overflow-hidden">
      {/* Top-right Circle with Sticker */}
      <div className="absolute top-[-200px] right-[-200px] w-[750px] h-[750px] bg-blue-500 rounded-full shadow-xl z-0 overflow-hidden">
        <img
          src="/assets/office.png"
          alt="creative workspace"
          className="absolute bottom-[40px] left-[40px] w-[340px] sm:w-[400px] md:w-[440px] drop-shadow-xl hidden sm:block"
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-28">
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-4">
            Empowering Careers with <br />
            AI and Web3 Technology
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Discover smarter hiring, decentralized identity, and skill-based job matching—only on RizeOS.
          </p>
          <div className="flex items-center gap-6 flex-wrap justify-center md:justify-start">
            <button
              onClick={() => navigate("/post-job")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-md transition"
            >
              Get Started Now
            </button>
            <div>
              <p className="font-semibold text-gray-800">Call us (0123) 456 – 789</p>
              <p className="text-sm text-gray-500">For any question or concern</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature + About Section */}
      <div className="bg-gray-50 min-h-[300px] py-14 px-6 md:px-20 flex flex-col items-center justify-center relative z-10">
        {/* Feature Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center w-full max-w-6xl mb-12">
          <div>
            <Users className="mx-auto h-8 w-8 text-blue-500 mb-3" />
            <h4 className="font-semibold text-lg text-gray-800">24/7 Support</h4>
            <p className="text-sm text-gray-600 mt-1">
              Always here to assist your needs.
            </p>
          </div>
          <div>
            <Sprout className="mx-auto h-8 w-8 text-green-600 mb-3" />
            <h4 className="font-semibold text-lg text-gray-800">Take Ownership</h4>
            <p className="text-sm text-gray-600 mt-1">
              Empower your team with confidence.
            </p>
          </div>
          <div>
            <Handshake className="mx-auto h-8 w-8 text-orange-500 mb-3" />
            <h4 className="font-semibold text-lg text-gray-800">Team Work</h4>
            <p className="text-sm text-gray-600 mt-1">
              Collaborate and grow together.
            </p>
          </div>
        </div>

        {/* About RizeOS */}
        <div className="max-w-4xl text-center px-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">About RizeOS</h3>
          <p className="text-gray-600 text-base leading-relaxed">
            RizeOS is a modern platform built to connect talented individuals with the best job opportunities in the tech industry.
            Leveraging the power of Web3 and AI, we simplify job posting, intelligent matchmaking, and decentralized verification—
            all while maintaining a clean, intuitive user experience. Whether you're a recruiter or a job seeker, RizeOS helps you grow faster, together.
          </p>
        </div>
      </div>
    </div>
  );
}
