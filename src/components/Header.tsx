import { WalletSelector } from "./WalletSelector";
import localFont from "next/font/local";
const boldonse = localFont({ src: "../fonts/Boldonse-Regular.ttf" });

export function Header() {
  return (
    <div className="container flex items-center justify-between py-2 w-full pt-10">
      <h1 className={`text-2xl text-white ${boldonse.className} sm:display`}>Todo De-Centralized</h1>
      <div className="flex gap-2 items-center flex-wrap">
        <WalletSelector />
      </div>
    </div>
  );
}
