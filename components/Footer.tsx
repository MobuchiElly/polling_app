export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-950 py-4 text-center mt-10">
      &copy; {new Date().getFullYear()} PollApp. All rights reserved.
    </footer>
  );
}