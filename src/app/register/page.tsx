"use client"
import CustomInput from "@/components/CustomAuth-input"
import anxiosInstance from "@/lib/axiosInstance"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const registerSchema =z.object({
    name:z.string().min(3,{message:"name is required"}),
    email:z.string().email({message: "invalid email address"}),
    password: z.string().min(6,{message: "password must be atleast 6 character"}).max(100)
})
type registerSchemaData =z.infer<typeof registerSchema>
const Register = () => {
    const router =useRouter();
    const {control, handleSubmit} = useForm({
        defaultValues:{
            name: "",
            email: "",
            password: ""
        },
        resolver: zodResolver(registerSchema)
    })
   
    const mutation = useMutation({
        mutationFn: async (payload:registerSchemaData)=>{
            const res = await anxiosInstance.post("/auth/register", payload)
            console.log(res," this is the console log")
            return res.data;
        },
        onSuccess:()=>{
            toast.success("registered successfully",{duration:2000})
            setTimeout(()=>router.push("/login"),1500)
        },
        onError:(error:any)=>{
            toast.error(error.response?.data?.message || error.message || "fail to register " ,{duration:2000})
        }
    })
     const onSubmit =(data: registerSchemaData)=>{
        mutation.mutate(data)
        console.log(data, "data for register")
    }
  return (
    <form action="" onSubmit={handleSubmit(onSubmit)}
    className="bg-gray-300 lg:w-[40%] w-full mx-auto p-4 rounded-xl space-y-4 "
    >
    <CustomInput
    label="Name"
    name="name"
    type="text"
    placeholder="name"
    control={control}
    required
    />
    <CustomInput
    label="Email"
    name="email"
    type="email"
    placeholder="enter email"
    control={control}
    required
    />
    <CustomInput
    label="Password"
    name="password"
    type="password"
    placeholder="password"
    control={control}
    required
    />
    <button 
    type="submit" className="w-full cursor-pointer bg-blue-700 h-[45px] text-white rounded-xl">
        {mutation.isPending ? "Registering...":"Register"}
    </button>

    {mutation.error &&(
        <p className="text-red-600 text-sm mt-2">
            {mutation.error instanceof Error ? mutation.error.message: "something went wrong"}
        </p>
    )}

    {/* {mutation.data &&(
        <p className="text-green-600">data saved successfully</p>
    )} */}
    
    <p className="text-white">
        Already have Account ?  {""}
        <Link href="/login" className="underline tex-white"> Login</Link>
    </p>
    </form>
  )
}

export default Register