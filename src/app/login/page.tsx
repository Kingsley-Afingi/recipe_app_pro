
"use client";

import CustomInput from "@/components/CustomAuth-input";
import anxiosInstance from "@/lib/axiosInstance";
import { useCartStore } from "@/store/useCartStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createClient } from "@/authlib/client";
import { useGetCurrentUser } from "@/hooks/useGetUser";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(3, { message: "Password must be at least 6 characters" })
    .max(100),
});

type LoginSchemaData = z.infer<typeof loginSchema>;

const Login = () => {
  const router = useRouter();
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { refetch } = useGetCurrentUser(); // 👈 Hook for re-fetching the logged user
  const { control, handleSubmit } = useForm<LoginSchemaData>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: async (payload: LoginSchemaData) => {
      // 🟢 1️⃣ Login through your Supabase-backed API
      const res = await anxiosInstance.post("/auth/login", payload);
      return res.data;
    },

    onSuccess: async (res) => {
      toast.success("Login successful", { duration: 2000 });

      // 🟢 2️⃣ Ensure Supabase session is set (if using Supabase login)
      const { data: session } = await supabase.auth.getSession();

      if (!session?.session) {
        // If session not yet available, wait briefly for Supabase to sync it
        setTimeout(async () => {
          await refetch(); // 👈 3️⃣ Force re-fetch current user
        }, 500);
      } else {
        await refetch(); // 👈 Instantly re-fetch if session exists
      }

      // 🟢 4️⃣ Update Cart (if using user ID from Supabase)
      const userId = res.data.user?.id;
      if (userId) {
        const { fetchCartFromDB } = useCartStore.getState();
        await fetchCartFromDB(userId);
      }

      // 🟢 5️⃣ Navigate to homepage
      setTimeout(() => router.push("/"), 1500);
    },

    onError: (error: any) => {
      toast.error(
        error.response?.data.message || error.message || "Login failed",
        { duration: 3000 }
      );
    },
  });

  const onSubmit = (data: LoginSchemaData) => {
    mutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gray-300 lg:w-[40%] w-full p-2 mx-auto rounded-xl space-y-4"
    >
      <CustomInput
        name="email"
        label="Email"
        type="email"
        control={control}
        placeholder="email"
        required
      />

      <CustomInput
        label="Password"
        name="password"
        placeholder="password"
        type="password"
        control={control}
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white w-full rounded-xl px-4 py-2"
      >
        {mutation.isPending ? "Login..." : "Login"}
      </button>

      <p className="text-white text-center">
        Don’t have an account?{" "}
        <Link href="/register" className="underline tex-white">
          Register
        </Link>
      </p>
    </form>
  );
};

export default Login;
