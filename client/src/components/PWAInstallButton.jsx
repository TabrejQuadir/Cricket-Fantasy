import { useState, useEffect } from "react";
import { Download } from "lucide-react";

const PWAInstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Detect iOS (iPhone/iPad)
        const userAgent = window.navigator.userAgent.toLowerCase();
        setIsIOS(/iphone|ipad|ipod/.test(userAgent));

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                console.log(choiceResult.outcome === "accepted" ? "User accepted" : "User dismissed");
                setDeferredPrompt(null);
            });
        }
    };

    return (
        <button
            onClick={isIOS ? () => alert("Go to Safari, tap Share, then 'Add to Home Screen'.") : handleInstallClick}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
        >
            <Download size={20} /> Download App for Android & Windows
        </button>
    );
};

export default PWAInstallButton;
