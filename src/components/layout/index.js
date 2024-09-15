import Navbar from './Navbar';
import Footer from './Footer';

export const Layout = ({active,  children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar active={active} />
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <Footer />
    </div>
  );
};
