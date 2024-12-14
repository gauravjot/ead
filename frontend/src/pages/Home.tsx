import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import InputField from "@/components/custom-ui/InputField";
import {useMutation} from "@tanstack/react-query";
import {doRegister} from "@/services/auth/register";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";

const formSchema = z
	.object({
		first_name: z.string().min(2, {
			message: "First name must be at least 2 characters.",
		}),
		last_name: z.string().min(2, {
			message: "Last name must be at least 2 characters.",
		}),
		email: z.string().email({
			message: "Please enter a valid email address.",
		}),
		password: z.string().min(8, {
			message: "Password must be at least 8 characters.",
		}),
		confirm_password: z.string().min(8, {
			message: "Password must be at least 8 characters.",
		}),
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirm_password) {
			ctx.addIssue({
				code: "custom",
				message: "Passwords do not match.",
				path: ["confirm_password"],
			});
		}
	});

export default function HomePage() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: (data: any) => doRegister(data),
		onSuccess: () => {
			navigate("/dashboard");
		},
	});

	const HandleValidSubmit = (data: any) => {
		mutation.mutate(data);
	};

	return (
		<div className="container max-w-7xl px-4 mx-auto">
			<div className="relative">
				<div className="rounded-b shadow-lg relative overflow-hidden bg-black z-10">
					<div className="absolute inset-0 moving-bg z-20"></div>
					<div className="relative z-30 h-48 px-16 flex place-items-center">
						<h1 className="text-5xl font-black leading-none text-white">Master EAD</h1>
					</div>
				</div>
			</div>
			<div className="my-6 border p-8 rounded-lg shadow-sm flex gap-16">
				<div className="basis-1/2">
					<h2 className="text-2xl font-bold mb-6">Already have an account?</h2>
					<Button
						variant={"black"}
						size={"lg"}
						onClick={() => {
							window.location.href = "http://localhost:8000/auth/?redirect=http://localhost:5173";
						}}
					>
						Go to Sign In
					</Button>
				</div>
				<div className="basis-1/2">
					<h2 className="text-2xl font-bold mb-6">Or Create Your Account!</h2>
					{mutation.isError && (
						<p className="text-red-700 text-bb my-1.5 leading-5">{mutation.error.message}</p>
					)}
					<Form {...form}>
						<form onSubmit={form.handleSubmit(HandleValidSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="first_name"
								render={({field}) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="last_name"
								render={({field}) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({field}) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input type="email" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({field}) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirm_password"
								render={({field}) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full">
								Sign Up
							</Button>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
