import { Link } from "react-router-dom";
import { Code2, Github, Twitter, Linkedin, Mail, Heart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Footer = () => {
    return (
        <footer className="bg-muted/50 border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-primary p-2 rounded-lg">
                                <Code2 className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                CodeMaster
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Empowering developers to master the art of code through interactive learning, real-world projects, and community collaboration.
                        </p>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10 transition-colors">
                                <Github className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10 transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-6">Product</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/#modules" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    Learning Modules
                                </Link>
                            </li>
                            <li>
                                <Link to="/contests" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    Coding Contests
                                </Link>
                            </li>
                            <li>
                                <Link to="/store" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    Merch Store
                                </Link>
                            </li>
                            <li>
                                <Link to="/showcase" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    Project Showcase
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-6">Resources</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/playground" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    Code Playground
                                </Link>
                            </li>
                            <li>
                                <Link to="/leaderboard" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    Leaderboard
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                                    Community Forum
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-6">Stay Updated</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Subscribe to our newsletter for the latest coding tips and contest updates.
                        </p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter your email"
                                className="bg-background border-input focus:border-primary/50"
                            />
                            <Button size="icon">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-muted-foreground text-sm">
                        © {new Date().getFullYear()} CodeMaster. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>Made with</span>
                        <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
                        <span>by Aarjav Jain</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
