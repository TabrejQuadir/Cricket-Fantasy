import { createContext, useState, useEffect } from "react";

export const PWAContext = createContext();

export const PWAProvider = ({ children }) => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Detect iOS (iPhone/iPad)
        const userAgent = window.navigator.userAgent.toLowerCase();
        setIsIOS(/iphone|ipad|ipod/.test(userAgent));

        // Check if PWA is already installed
        if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
            setIsInstalled(true);
        }

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            console.log("beforeinstallprompt event fired");
            setDeferredPrompt(e);
            sessionStorage.setItem("deferredPromptAvailable", "true"); // Store a flag
        };

        const handleAppInstalled = () => {
            console.log("PWA was installed");
            setIsInstalled(true);
            setDeferredPrompt(null);
            sessionStorage.removeItem("deferredPromptAvailable"); // Remove flag after installation
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    return (
        <PWAContext.Provider value={{ deferredPrompt, setDeferredPrompt, isInstalled, isIOS }}>
            {children}
        </PWAContext.Provider>
    );
};
