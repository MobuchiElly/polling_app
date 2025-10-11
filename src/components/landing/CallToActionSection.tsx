import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CallToActionSection() {
    return (
        <section className="py-20 px-6 md:px-8 lg:px-16 bg-primary text-primary-foreground rounded-xl text-center">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                    Ready to Create Your First Poll?
                </h2>
                <p className="text-lg mb-10 text-primary-foreground/90">
                    Join thousands of users who are already gathering valuable insights with our easy-to-use polling app.
                </p>
                <Link href="/auth/register" passHref>
                    <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold text-lg px-10 py-6 rounded-lg shadow-md hover:shadow-lg hover:bg-primary-foreground/90 transition-all duration-300">
                        Get Started - It's Free!
                    </Button>
                </Link>
            </div>
        </section>
    );
}