import { PlanCard } from "@/components/PlanCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, ServerCrash, Rocket, Coins, ServerOff } from 'lucide-react';
import NodeAnimation from "@/components/NodeAnimation";

export default function Home() {
	return (
		<>
		<NodeAnimation particleCount={40}/>
		<main className="z-2 container mx-auto p-4 text-white">
			<section className="text-center mb-12 pb-40 min-h-screen flex items-center justify-center">
				<div className="w-full">
					<h1 className="text-5xl font-bold mb-6">
						<span className="text-gray-400">Amplizard</span>: Your Ultimate Ratelimiter
					</h1>
					<p className="text-lg text-neutral-400 mb-8">
						Effortlessly manage ratelimits with our powerful rules engine, acting as a cheap and effective gateway.
					</p>
					<a href="/auth">
						<Button variant="default" className="mt-4">
							Get Started
						</Button>
					</a>
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
							 </CardContent >
						 </Card >

						<Card className="p-4 flex flex-col items-start justify-between">
							<CardHeader>
								<CardTitle>Gateway Functionality</CardTitle >
								<CardDescription>Use Amplizard as a gateway to manage and enforce ratelimits.</CardDescription >
							 </CardHeader >
							<CardContent>
								<p>Protect your backend by controlling the rate of incoming requests.</p >
							 </CardContent >
						 </Card >

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

			<section className="mb-12 min-h-screen flex items-center justify-center" id="use-cases-section">
				<div className="w-full">
					<h2 className="text-3xl font-semibold mb-6 text-center">Use Cases</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<Card className="p-4 flex flex-col items-start">
							<CardHeader>
								<CardTitle>AI Model APIs</CardTitle>
								<CardDescription>Protect your AI model APIs from abuse and ensure fair usage.</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="list-disc pl-5 space-y-1">
									<li>Prevent malicious actors from overwhelming your AI models.</li>
									<li>Ensure availability for legitimate users.</li>
									<li>Control costs associated with AI model usage.</li>
								</ul>
							</CardContent>
						</Card>

						<Card className="p-4 flex flex-col items-start ">
							<CardHeader>
								<CardTitle>General APIs</CardTitle>
								<CardDescription>Protect your APIs from excessive requests and ensure optimal performance.</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="list-disc pl-5 space-y-1">
									<li>Prevent API abuse and denial-of-service attacks.</li>
									<li>Ensure fair usage and prevent resource exhaustion.</li>
									<li>Improve API performance and reliability.</li>
								</ul>
							</CardContent>
						</Card>

						<Card className="p-4 flex flex-col items-start justify-between">
							<CardHeader>
								<CardTitle>Serverless & Edge Environments</CardTitle>
								<CardDescription>True ratelimiting for serverless and edge environments like Cloudflare Workers and Vercel.</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="list-disc pl-5 space-y-1">
									<li>Bypass platform limitations (e.g. Cloudflare Workers' 100k requests/day limit where every request counts).</li>
									<li>Implement robust ratelimiting without relying on server-side resources.</li>
									<li>Protect your serverless functions and edge deployments from abuse.</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<section className="mb-12 min-h-screen flex items-center justify-center" id="difference-section">
				<div className="w-full">
					<h2 className="text-3xl font-semibold mb-6 text-center">Traditional Ratelimiting vs. Amplizard</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<Card className="p-4 flex flex-col items-start justify-between">
							<CardHeader>
								<CardTitle>Traditional Ratelimiting</CardTitle >
								<CardDescription>All requests reach your server.</CardDescription >
							 </CardHeader >
							<CardContent >
								< ul className="list-disc pl-5 space-y-1">
									<li>Higher infrastructure costs due to processing all requests. <Coins className="inline-block h-5 w-5 ml-1 text-red-500" /></li >
									<li>Server resources are consumed even by ratelimited requests. <ServerCrash className="inline-block h-5 w-5 ml-1 text-red-500" /></li >
									<li>Potential performance impact from handling excessive traffic. <ServerOff className="inline-block h-5 w-5 ml-1 text-red-500" /></li >
								</ul>
							 </CardContent >
						 </Card >

						<Card className="p-4 flex flex-col items-start justify-between">
							<CardHeader>
								<CardTitle>Amplizard Gateway</CardTitle >
								<CardDescription>Ratelimited requests are stopped before reaching your server.</CardDescription >
							 </CardHeader >
							<CardContent>
								< ul className="list-disc pl-5 space-y-1">
									<li>Reduced infrastructure costs as ratelimited requests don't reach your server. <ShieldCheck className="text-green-500 inline-block h-5 w-5 ml-1" /></li >
									<li>Server resources are conserved, improving performance. <Rocket className="inline-block h-5 w-5 ml-1 text-green-500" /></li >
									<li>No charge for ratelimited requests, optimizing costs. <Coins className="inline-block h-5 w-5 ml-1 text-green-500"/></li >
								</ul>
							 </CardContent >
						 </Card >
					 </div >
				</div >
			</section>	

			<section className="mb-12 min-h-screen flex items-center justify-center">
				<div className="w-full">
					<h2 className="text-3xl font-semibold mb-6 text-center">Plans</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<PlanCard
							title="Free"
							description="Perfect for getting started."
							price="$0/month"
							features={["2 Rules", "Upto 10 rule expressions", "100k requests per day", "Ratlimited requests not counted towards usage"]}
							onUpgrade={() => window.location.href = '/auth'}
							upgradable={true}
							customButtonText="Get Started"
						/>
						<PlanCard
							title="Premium"
							description="For large scale projects."
							price="$4.99/month"
							features={["Upto 10 Rules", "Upto 10 rule expressions", "1 million requests per day", "24/7 Support", "No charge for ratelimited requests", "Custom domain"]}
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
					<a href="/auth">
						<Button variant={"default"}>Join Now</Button>
					</a>
				</div>
			</section>
			</main>
			</>	
	);
}