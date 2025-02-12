import { PlanCard } from "@/components/PlanCard";
import { PlanCardProps } from "@/components/PlanCard";
import { Plan, AuthContext } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useContext } from "react";

export default function Plans() {
  const ac = useContext(AuthContext);
  const plan = ac?.authState.user?.plan
  
  const plans = [
    {
      title: "Free",
      description: "Perfect for getting started.",
      price: "$0",
      features: ["2 rules", "Upto 10 rule expressions", "100k requests", "Ratelimited requests are not counted towards usage."],
      mostPopular: false,
      currentPlan: plan === Plan.free && true,
      onUpgrade: () => {
        if(!ac?.authState.isAuthenticated){
          window.location.href = '/auth';
        }
      },
      upgradable: plan !== Plan.free ? true : false,
      customButtonText: "Get started",
    },
    {
      title: "Premium",
      description: "For large-scale projects",
      price: "$4.99",
      features: ["10 rules","Upto 10 rule expressions", "Unlimited requests", "24/7 Support", "No charge for ratelimited requests.", "Custom domain"],
      mostPopular: false,
      upgradable: plan === Plan.premium ? false : true,
      currentPlan: plan === Plan.premium && true,
      onUpgrade: () => {
        if(!ac?.authState.isAuthenticated){
          window.location.href = '/auth';
        }
      },
      customButtonText: "Coming Soon",
    },
    {
      title: "Custom Plan",
      description: "Tailor-made solution for your specific requirements.",
      price: "$$$",
      features: ["Unlimited possibilities"],
      mostPopular: false,
      upgradable: true,
      onUpgrade: () => {
        if(!ac?.authState.isAuthenticated){
          window.location.href = '/contact';
        }
      },
      customButtonText: "Contact Us",
    },
  ] as PlanCardProps[];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-400">Choose Your Plan</h1>
      <div className={cn("p-4 grid grid-cols- gap-6", `md:grid-cols-${plans.length}`)}>
        {plans.map((plan) => (
          <PlanCard
            key={plan.title}
            title={plan.title}
            description={plan.description}
            price={plan.price}
            features={plan.features}
            mostPopular={plan.mostPopular}
            upgradable={plan.upgradable}
            currentPlan={plan.currentPlan}
            onUpgrade={plan.onUpgrade}
            customButtonText={plan.customButtonText}
          />
        ))}
      </div>
    </div>
  );
}
