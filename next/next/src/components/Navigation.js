// import Link from 'next/link';
// import { IMAGES } from '@/constants/images';
// import { FiArrowRight } from 'react-icons/fi';



// export default function Navigation() {
//   return (
//     <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent py-4 px-6">
//       <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <img
//             src="/asset/Rakshana Logo.svg"
//             alt="Rakshana TV Logo"
//             style={{
//               width: '190px',
//               height: '124px',
//               opacity: 1
//             }}
//             className="mb-4"
//           />
//         <div className="hidden md:flex items-center">
//           <div className="flex items-center space-x-4">
//             <Link href="/" className="text-white hover:text-gray-200 transition-colors text-sm font-medium">
//               Home
//             </Link>
//             <Link href="/about" className="text-white hover:text-gray-200 transition-colors text-sm font-medium">
//               About Us
//             </Link>
//             <Link href="/live" className="text-white hover:text-gray-200 transition-colors text-sm font-medium">
//               Watch Live
//             </Link>
//             <Link href="/programs" className="text-white hover:text-gray-200 transition-colors text-sm font-medium">
//               Programs
//             </Link>
//           </div>
//           <div className="flex items-center space-x-3 ml-4">
//             <Link 
//               href="/contact" 
//               className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
//             >
//               Contact Us
//             </Link>
//             <Link 
//               href="/login"
//               className="border-2 border-white text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
//             >
//               Login
//             </Link>
//             <Link 
//               href="/donate" 
//               className="bg-gradient-to-r from-purple-600 to-red-500 hover:from-purple-700 hover:to-red-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center"
//             >
//               Donate <FiArrowRight className="ml-2" />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }
