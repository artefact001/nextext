import { Link } from '@chakra-ui/react';

const Navbar = () => {
  return (
    <nav className="bg-red-500 p-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/">
          <div className="text-white font-bold">Home</div>
        </Link>
        <Link href="/qr/[matricule]">
          {/* <Link href="/qr/[matricule]" as="/qr/P7"> */}
          <div className="text-white">QR Code</div>
        </Link>
        <Link href="/profile">
          <div className="text-white">Profile</div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
