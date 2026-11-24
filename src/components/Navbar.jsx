// // import {useRouter} from "next/navigation";
// import Link from "next/link";

// export default function Navbar() {
//     // const router = useRouter();
//     return (
//         <>
//             {/* <div className='w-1/3 flex justify-evenly items-center p-4 bg-gray-800 text-white'> */}
//             <div className='flex flex-nowrap gap-8 items-center p-4 bg-gray-800 text-white rounded-lg whitespace-nowrap'>
//                 <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
//                 <Link href="/services" className="hover:text-blue-400 transition-colors">Services</Link>
//                 <Link href="/products" className="hover:text-blue-400 transition-colors">Products</Link>
//                 <Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link>
//                 <Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link>
//             </div>
//         </>
//     )
// }



import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex flex-wrap justify-center gap-3 sm:gap-6 items-center px-3 py-3 bg-gray-800 text-white rounded-lg">
            <Link href="/" className="hover:text-blue-400 transition-colors">
                Home
            </Link>

            <Link href="/services" className="hover:text-blue-400 transition-colors">
                Services
            </Link>

            <Link href="/products" className="hover:text-blue-400 transition-colors">
                Products
            </Link>

            <Link href="/contact" className="hover:text-blue-400 transition-colors">
                Contact Us
            </Link>

            <Link href="/about" className="hover:text-blue-400 transition-colors">
                About Us
            </Link>
        </nav>
    );
}
