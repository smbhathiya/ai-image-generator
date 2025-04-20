// "use client";
// import React from "react";
// import { HeroHeader } from "@/components/hero5-header";
// import { TextEffect } from "./ui/text-effect";
// import { AnimatedGroup } from "./ui/animated-group";
// import { useUser } from "@clerk/nextjs";
// import Link from "next/link";
// import { Button } from "./ui/button";
// import { IconArrowBigRightFilled } from "@tabler/icons-react";

// const transitionVariants = {
//   item: {
//     hidden: {
//       opacity: 0,
//       filter: "blur(12px)",
//       y: 12,
//     },
//     visible: {
//       opacity: 1,
//       filter: "blur(0px)",
//       y: 0,
//       transition: {
//         type: "spring",
//         bounce: 0.3,
//         duration: 1.5,
//       },
//     },
//   },
// };

// export default function HeroSection() {
//   const { isSignedIn } = useUser();
//   return (
//     <>
//       <HeroHeader />

//       <main className="overflow-hidden">
//         <div
//           aria-hidden
//           className="absolute inset-0 isolate z-10 hidden opacity-65 contain-strict lg:block"
//         >
//           <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
//           <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
//           <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
//         </div>
//         <section>
//           <div className="relative mx-auto max-w-6xl px-6 pt-32 lg:pb-16 lg:pt-48">
//             <div className="relative z-10 mx-auto max-w-4xl text-center">
//               <TextEffect
//                 preset="fade-in-blur"
//                 speedSegment={0.3}
//                 as="h1"
//                 className="text-balance text-4xl font-medium sm:text-5xl md:text-6xl"
//               >
//                 Create Anything. Just Say It
//               </TextEffect>
//               <TextEffect
//                 per="line"
//                 preset="fade-in-blur"
//                 speedSegment={0.3}
//                 delay={0.5}
//                 as="p"
//                 className="mx-auto mt-12 max-w-2xl text-pretty text-lg"
//               >
//                 Generate beautiful images from your words using Google
//                 Gemini-powered AI
//               </TextEffect>

//               <AnimatedGroup
//                 variants={{
//                   container: {
//                     visible: {
//                       transition: {
//                         staggerChildren: 0.05,
//                         delayChildren: 0.75,
//                       },
//                     },
//                   },
//                   ...transitionVariants,
//                 }}
//                 className="mt-12"
//               >
//                 {isSignedIn ? (
//                   <>
//                     <Link href="/explorer">
//                       <Button className="cursor-pointer " size="lg">
//                         Let&apos;s Create
//                         <IconArrowBigRightFilled />
//                       </Button>
//                     </Link>
//                   </>
//                 ) : (
//                   <>
//                     <Link href="/sign-in">
//                       <Button className="cursor-pointer " size="lg">
//                         Get Started <IconArrowBigRightFilled />
//                       </Button>
//                     </Link>
//                   </>
//                 )}
//               </AnimatedGroup>
//             </div>
//             <div className="mx-auto md:-mt-20 lg:-mt-40">
//               <AnimatedGroup
//                 variants={{
//                   container: {
//                     visible: {
//                       transition: {
//                         staggerChildren: 0.05,
//                         delayChildren: 0.75,
//                       },
//                     },
//                   },
//                   ...transitionVariants,
//                 }}
//               >
//                 <div className="-rotate-30 aspect-3/2 relative mx-auto lg:w-2/3"></div>
//               </AnimatedGroup>
//             </div>
//           </div>
//         </section>
//       </main>
//     </>
//   );
// }
