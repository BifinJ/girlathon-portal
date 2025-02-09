"use client";

import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {useForm} from "react-hook-form"


import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import axios from "axios";
import {redirect, useRouter} from "next/navigation";
import {useToast} from "@/components/ui/use-toast";
import Link from "next/link";
import Provider from "@/lib/authProvider";
import {useSession} from "next-auth/react";


const API = process.env.NEXT_PUBLIC_API_URL

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }), password: z.string().min(2, {
        message: "Minimum password must be at least 2 characters.",
    }), cpassword: z.string().min(2, {
        message: "Minimum password must be at least 2 characters.",
    }), email: z.string().email({
        message: "Invalid email address",
    }), phone: z.string().min(10, {
        message: "Invalid phone number",
    }), username: z.string().min(2, {
        message: "Invalid username",
    })
}).refine((data) => data.password === data.cpassword, {
    message: "Password must match", path: ["cpassword"],

})
export default function Auth() {
    const {data: session, status} = useSession();
    const router = useRouter()
    const {toast}=useToast()
    // @ts-ignore
    const form = useForm({
        resolver: zodResolver(formSchema), defaultValues: {
            name: "", password: "", cpassword: "", email: "", phone: "", username: ""

        },
    });

    const onSubmit = async (values: any) => {
        // alert(JSON.stringify(values))
        const data = {
            name: values.name,
            password: values.password,
            email: values.email,
            phone: values.phone,
            username: values.username

        }
        try {
            const res = await axios.post(`${API}/user/admin/register`, data,{withCredentials: true})
            console.log(res)
            if (res.status === 200) {
                toast({
                    title:"Admin added",
                    description:"please go back now..."
                })
                
            } else {
                toast({
                    title:"Something went wrong",
                    description:"Please try again if error persist contact"
                })
            }
        } catch (err) {
            console.log(err)
            toast({
                title:"Something went wrong",
                description:"Please try again"
            })
        }

    }
    if(status === "loading")
        return <div className="flex flex-row justify-center items-center h-screen text-3xl font-extrabold">Loading ... </div>
    if(status === "unauthenticated")
        redirect('/signin')
    // @ts-ignore
    if(session?.role !== "owner")
        return <div className="flex flex-row justify-center items-center h-screen text-3xl font-extrabold">You are not authorized to view this page</div>

        return (<>
        <Provider>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-1/2 bg-white  p-20 flex flex-col justify-center items-center rounded-2xl shadow-2xl"
                >
                    <h2 className="text-black text-5xl font-extrabold underline-offset-2">
                        REGISTER
                    </h2>
                    <div className="w-full flex flex-row justify-evenly items-center">
                        <div className="w-1/2  p-5 flex flex-col justify-center items-center">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => (<FormItem className="text-black text-4xl w-full">
                                    <FormLabel>Userame</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="username"
                                            {...field}
                                            className="rounded-xl border-neutral-200"
                                        />
                                    </FormControl>

                                    <FormMessage/>
                                </FormItem>)}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (<FormItem className="text-black text-4xl w-full">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Robert"
                                            {...field}
                                            className="rounded-xl border-neutral-200"
                                        />
                                    </FormControl>

                                    <FormMessage/>
                                </FormItem>)}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (<FormItem className="text-black text-4xl w-full">
                                    <FormLabel>email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="username@gmail.com"
                                            {...field}
                                            className="rounded-xl border-neutral-200"
                                        />
                                    </FormControl>

                                    <FormMessage/>
                                </FormItem>)}
                            />

                        </div>
                        <div className="w-1/2 flex flex-col justify-center items-center">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({field}) => (<FormItem className="text-black text-4xl w-full">
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="9**********x"
                                            {...field}
                                            className="rounded-xl border-neutral-200"
                                        />
                                    </FormControl>

                                    <FormMessage/>
                                </FormItem>)}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (<FormItem className="text-black text-4xl w-full">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="1321243"
                                            {...field}
                                            className="rounded-xl border-neutral-200"
                                        />
                                    </FormControl>

                                    <FormMessage/>
                                </FormItem>)}
                            />
                            <FormField
                                control={form.control}
                                name="cpassword"
                                render={({field}) => (<FormItem className="text-black text-4xl w-full">
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="1321243"
                                            {...field}
                                            className="rounded-xl border-neutral-200"
                                        />
                                    </FormControl>

                                    <FormMessage/>
                                </FormItem>)}
                            />

                        </div>
                    </div>



                    <Button
                        type="submit"
                        className="bg-black mt-6 hover:bg-black rounded-2xl w-1/4 text-white"
                    >
                        Register
                    </Button>
                    <div className="w-full flex flex-row justify-evenly items-center">

                        <Link href={"/signin"} className="underline mt-6">Login</Link>
                    </div>
                </form>
            </Form>
        </Provider>

    </>);
}
