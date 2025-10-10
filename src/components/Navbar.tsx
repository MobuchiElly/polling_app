import {createClient} from "@/lib/supabase/server";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const supabase = await createClient();
  const {data: {user}} = await supabase.auth.getUser();

  return (
    <nav>
      <NavbarClient user={user}/>
    </nav>
  );
}