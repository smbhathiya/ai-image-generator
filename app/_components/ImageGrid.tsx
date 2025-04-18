// "use client";

// import React from "react";
// import useSWR from "swr";
// import { Skeleton } from "@/components/ui/skeleton";

// interface ViewImagesProps {
//   apiUrl: string;
//   title: string;
//   imageLimit?: number;
// }

// const fetcher = async (url: string) => {
//   const res = await fetch(url);
//   if (!res.ok) {
//     throw new Error("Failed to fetch images");
//   }
//   return res.json();
// };

// const ImageGrid: React.FC<ViewImagesProps> = ({ apiUrl, title, imageLimit = 6 }) => {
//   const { data: images, error, isLoading } = useSWR(`${apiUrl}?limit=${imageLimit}`, fetcher);

//   if (error) {
//     return <div className="text-red-500">Failed to load images</div>;
//   }

//   return (
//     <div className="mt-8">
//       <h2 className="text-xl font-bold mb-4">{title}</h2>

//       {isLoading ? (
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//           {Array.from({ length: imageLimit }).map((_, idx) => (
//             <Skeleton key={idx} className="h-48 w-full rounded-lg" />
//           ))}
//         </div>
//       ) : (
//         <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
//           {images?.map((image: any) => (
//             <div key={image.id} className="break-inside-avoid overflow-hidden rounded-lg shadow">
//               <img
//                 src={image.cloudinaryUrl}
//                 alt="Generated"
//                 className="w-full h-auto object-cover transition duration-300 hover:scale-105"
//               />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageGrid;
