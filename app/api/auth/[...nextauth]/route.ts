import NextAuth from "next-auth";
export const handler = NextAuth({});
export { handler as GET, handler as POST }; 