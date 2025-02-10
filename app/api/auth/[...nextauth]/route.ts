import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// ✅ Correctly initialize NextAuth
const handler = NextAuth(authOptions);

// ✅ Export as GET and POST (for Next.js API routes)
export { handler as GET, handler as POST };
