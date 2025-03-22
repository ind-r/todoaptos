export default function Footer() {
  return (
    <footer>
      <div className="container mx-auto py-10 fixed bottom-0 left-0 right-0 bg-black rounded-t-xl">
        <div className="flex justify-between items-center">
          <p className="text-white">© 2025 Todo De-Centralized</p>
          <div className="flex gap-2">
            <a href="" className="text-white">
              Privacy Policy
            </a>
            <a href="" className="text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
