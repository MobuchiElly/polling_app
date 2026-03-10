export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-border text-gray-950 py-6 text-center font-semibold">
      &copy; {new Date().getFullYear()} PollApp. All rights reserved.
    </footer>
  );
};