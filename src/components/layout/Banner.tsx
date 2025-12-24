// import React from "react";

// const Banner = () => {
//   return (
//     <div className="">
//       <div className='bg-[url("/images/banner.svg")] mt-10 bg-cover bg-center md:h-[312px] h-[170px] w-full md:rounded-4xl rounded-lg'>
//         <div className="w-[346px] md:ml-11 md:pt-17 pt-8 ml-3">
//           <small className="font-medium text-[1.4rem] leading-[127%] text-[#DC582A]">
//             Trending now
//           </small>
//           <p className="font-poppins font-bold md:text-[2.4rem] text-[1.9rem] leading-[117%] text-white">
//             Mike’s famous salad with cheese
//           </p>
//           <span className="font-poppins text-medium text-[1.25rem] leading-[127%] text-white">
//             By John Mike
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Banner;

"use client";
import React, { useEffect, useState } from "react";

const images = [
  "/images/banner.svg",
  "/images/recipe.png",
  "/images/recipe2.png",
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically change background every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 5000ms = 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`bg-cover bg-center md:h-[355px] h-[190px] w-full md:rounded-4xl rounded-lg transition-all duration-1000`}
      style={{ backgroundImage: `url(${images[currentIndex]})` }}
    >
      <div className="w-[346px] md:ml-11 md:pt-17 pt-8 ml-3">
        <small className="font-medium text-[1.4rem] leading-[127%] text-[#DC582A]">
          Trending now
        </small>
        <p className="font-poppins font-bold md:text-[2.4rem] text-[2rem] leading-[127%] text-white">
          Mike’s famous salad with cheese
        </p>
        <span className="font-poppins text-medium text-[1.25rem] leading-[127%] text-white">
          By John Mike
        </span>
      </div>
    </div>
  );
};

export default Banner;

// 