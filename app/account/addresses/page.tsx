import type { Metadata } from "next";
import { getMyAddresses } from "@/lib/server/account";
import AddressManager from "@/components/account/AddressManager";

export const metadata: Metadata = { title: "My addresses" };

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function AddressesPage() {
  const addresses = await getMyAddresses();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-[34px] font-bold leading-tight sm:text-[40px]">Addresses</h1>
        <p className="mt-1 text-[17px] text-[#171717]/70">Your default address is filled in automatically at checkout.</p>
      </div>
      <AddressManager addresses={addresses} />
    </div>
  );
}
