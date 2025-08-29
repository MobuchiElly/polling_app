export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-950 py-4 text-center">
      &copy; {new Date().getFullYear()} PollApp. All rights reserved.
    </footer>
  );
}