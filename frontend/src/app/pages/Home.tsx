import { PlanCard } from "@/components/PlanCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
	return (
		<main className="container mx-auto p-4 text-white">
			<section className="text-center mb-12 min-h-screen flex items-center justify-center">
				<div className="w-full">
					<h1 className="text-5xl font-bold mb-6">
						Amplizard: Your Ultimate Ratelimiter
					</h1>
					<p className="text-lg text-neutral-400 mb-8">
						Effortlessly manage ratelimits with our powerful rules engine, acting as a cheap and effective gateway.
					</p>
					<Link to="/auth">
						<Button variant="default" className="mt-4">
							Get Started
						</Button>
					</Link>
				</div>
			</section>

			<section className="mb-12 min-h-screen flex items-center justify-center">
				<div className="w-full">
					<h2 className="text-3xl font-semibold mb-6 text-center">Key Features</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						<Card className="p-4 flex flex-col items-start justify-between">
							<CardHeader>
								<CardTitle>Advanced Rule Engine</CardTitle >
								<CardDescription>Create custom rules to ratelimit your hosts.</CardDescription >
							</ CardHeader >
							<CardContent >
								<p>Define rules based on various parameters like URI, request method, and more.</p >
							</ CardContent >
						</ Card >

						<Card className="p-4 flex flex-col items-start justify-between">
							<CardHeader>
								<CardTitle>Gateway Functionality</CardTitle >
								<CardDescription>Use Amplizard as a gateway to manage and enforce ratelimits.</CardDescription >
							</ CardHeader >
							<CardContent>
								<p>Protect your backend by controlling the rate of incoming requests.</p >
							</ CardContent >
						</ Card >

						<Card className="p-4 flex flex-col items-start justify-between">
							<CardHeader>
								<CardTitle>Cost-Effective Solution</CardTitle >
								<CardDescription>No charge for ratelimited requests.</CardDescription >
							 </CardHeader >
							<CardContent>
								<p>Optimize costs by preventing abuse and reducing unnecessary traffic.</p >
							 </CardContent >
						 </Card >
					 </div >
				</div >
			</section >

			<section className="mb-12 min-h-screen flex items-center justify-center">
				<div className="w-full">
					<h2 className="text-3xl font-semibold mb-6 text-center">Choose Your Plan</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<PlanCard
							title="Free"
							description="Perfect for getting started."
							price="$0/month"
							features={["2 Rules", "Upto 10 rule expressions", "100k requests", "Ratlimited requests not counted towards usage"]}
							onUpgrade={() => window.location.href = '/auth'}
							upgradable={true}
							customButtonText="Get Started"
						/>
						<PlanCard
							title="Premium"
							description="For large scale projects."
							price="$4.99/month"
							features={["Upto 10 Rules", "Upto 10 rule expressions", "Unlimited Requests", "24/7 Support", "No charge for ratelimited requests", "Custom domain"]}
							onUpgrade={() => window.location.href = '/auth'}
							upgradable={true}
							customButtonText="Get Started"
						/>
						<PlanCard
							title="Custom Plan"
							price="$$$"
							description="Tailor-made solution for your specific requirements."
							features={["Unlimited Possibilities"]}
							upgradable={true}
							onUpgrade={() => window.location.href = '/auth'}
							customButtonText="Contact Us"
						/>
					</div>
				</div>
			</section>

			<section className="text-center min-h-screen flex items-center justify-center">
				<div className="w-full">
					<h2 className="text-3xl font-semibold mb-4">Ready to Get Started?</h2>
					<p className="text-lg text-gray-600 mb-6">
						Join Amplizard today and take control of your host ratelimits.
					</p>
					<Link to="/auth">
						<Button variant={"default"}>Join Now</Button>
					</Link>
				</div>
			</section>
		</main>
	);
}