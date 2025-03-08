import { useState, useContext, useEffect } from "react";
import { PWAContext } from "../context/PWAContext";
import { Download } from "lucide-react";
import ReactModal from "react-modal";

const PWAInstallButton = () => {
    const { deferredPrompt, setDeferredPrompt, isInstalled, isIOS } = useContext(PWAContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // If session flag exists but deferredPrompt is null, force reload
        if (!deferredPrompt && sessionStorage.getItem("deferredPromptAvailable")) {
            console.log("Deferred prompt flag found in sessionStorage but no event available. Reloading page...");
            window.location.reload();
        }
    }, [deferredPrompt]);

    const handleInstallClick = () => {
        if (isInstalled) {
            alert("App is already installed!");
            return;
        }
        setIsModalOpen(true);
    };

    const handleModalInstall = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                console.log(choiceResult.outcome === "accepted" ? "User accepted" : "User dismissed");
                if (choiceResult.outcome === "accepted") {
                    setDeferredPrompt(null); // Clear after installation
                    sessionStorage.removeItem("deferredPromptAvailable"); // Remove session flag
                }
                setIsModalOpen(false);
            });
        } else {
            console.log("No deferredPrompt available. Please refresh the page.");
            alert("Installation prompt is not available. Please refresh the page.");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (isInstalled) return null;

    return (
        <>
            <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
            >
                <Download size={20} />
                Install App
            </button>

            <ReactModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Install PWA Modal"
                className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-xl font-semibold mb-4">Install the App</h2>
                <p className="mb-4">
                    {isIOS
                        ? "Tap the Share button in Safari, then select 'Add to Home Screen'."
                        : "Click the Install button below to install the app."}
                </p>

                {!isIOS && (
                    <button
                        onClick={handleModalInstall}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                    >
                        Install
                    </button>
                )}

                <button
                    onClick={closeModal}
                    className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                    Close
                </button>
            </ReactModal>
        </>
    );
};

export default PWAInstallButton;
