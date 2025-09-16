import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CallToActionSection() {
  return (
    <section className="py-16 px-4 md:px-8 bg-primary text-primary-foreground text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Create Your First Poll?
        </h2>
        <p className="text-lg mb-8">
          Join thousands of users who are already gathering valuable insights with our easy-to-use polling app.
        </p>
        <Link href="/auth/register" passHref>
          <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            Get Started - It's Free!
          </Button>
        </Link>
      </div>
    </section>
  );
}