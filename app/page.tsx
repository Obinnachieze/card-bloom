import Explore from "@/screens/Explore";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/ui/footer";
import { Flower2, Github, Twitter, Instagram } from "lucide-react";

export default function Page() {
    return (
        <main className="min-h-screen flex flex-col">
            <div className="flex-1">
                <Hero />
                <Explore />
            </div>
            <Footer
                logo={<Flower2 className="h-8 w-8 text-pink-500" />}
                brandName="Card Bloom"
                socialLinks={[
                    {
                        icon: <Twitter className="h-5 w-5" />,
                        href: "https://twitter.com",
                        label: "Twitter",
                    },
                    {
                        icon: <Instagram className="h-5 w-5" />,
                        href: "https://instagram.com",
                        label: "Instagram",
                    },
                    {
                        icon: <Github className="h-5 w-5" />,
                        href: "https://github.com",
                        label: "GitHub",
                    },
                ]}
                mainLinks={[
                    { href: "/", label: "Home" },
                    { href: "/explore", label: "Explore" },
                    { href: "/create", label: "Create Card" },
                    { href: "/about", label: "About Us" },
                ]}
                legalLinks={[
                    { href: "/privacy", label: "Privacy Policy" },
                    { href: "/terms", label: "Terms of Service" },
                ]}
                copyright={{
                    text: `© ${new Date().getFullYear()} Card Bloom`,
                    license: "Made with ❤️ for beautiful moments",
                }}
            />
        </main>
    );
}
