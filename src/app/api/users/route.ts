
// import { createClient } from "@/authlib/client";
// import { NextResponse } from "next/server";

// export async function GET() {
//   const supabase = createClient();

//   const { data, error } = await supabase.auth.admin.listUsers();
//   if (error) {
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }

//   return NextResponse.json({ success: true, users: data.users });
// }


import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ Keep private
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");
  const name = searchParams.get("name");

  try {
    // ✅ 1️⃣ Fetch by ID (for logged-in user)
    if (userId) {
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
      if (error || !data?.user)
        return NextResponse.json({ error: "User not found" }, { status: 404 });

      const user = data.user;
      const username =
        user.user_metadata?.name ||
        user.user_metadata?.username ||
        user.email?.split("@")[0] ||
        "Unknown";

      return NextResponse.json({ user: { id: user.id, name: username, email: user.email } });
    }

    // ✅ 3️⃣ Fetch all users (admin use)
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;

    const users = data.users.map((u) => ({
      id: u.id,
      name:
        u.user_metadata?.name ||
        u.user_metadata?.username ||
        u.email?.split("@")[0],
      email: u.email,
    }));

    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}



























// import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";

// export async function GET() {
//   const supabaseAdmin = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ use service role key
//   );

//   try {
//     const { data, error } = await supabaseAdmin.auth.admin.listUsers();

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 400 });
//     }

//     return NextResponse.json({ users: data.users });
//   } catch (err) {
//     return NextResponse.json(
//       { error: err instanceof Error ? err.message : "Server error" },
//       { status: 500 }
//     );
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";

// export async function GET(req: NextRequest) {
//   const supabaseAdmin = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ service role key (admin)
//   );

//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("id");

//     if (userId) {
//       // 🔹 Get single user by ID
//       const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
//       if (error) return NextResponse.json({ error: error.message }, { status: 400 });
//       return NextResponse.json({ user: data.user });
//     } else {
//       // 🔹 Get all users
//       const { data, error } = await supabaseAdmin.auth.admin.listUsers();
//       if (error) return NextResponse.json({ error: error.message }, { status: 400 });
//       return NextResponse.json({ users: data.users });
//     }
//   } catch (err) {
//     return NextResponse.json(
//       { error: err instanceof Error ? err.message : "Server error" },
//       { status: 500 }
//     );
//   }
// }
