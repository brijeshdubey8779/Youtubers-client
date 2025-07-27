import React, { useEffect } from 'react';

const SuccessNotification = ({ show, onClose, title, message, autoClose = true, duration = 5000 }) => {
    useEffect(() => {
        if (show && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [show, autoClose, duration, onClose]);

    if (!show) return null;

    return (
        <div className="fixed top-4 right-4 z-[60] max-w-sm w-full">
            <div className="bg-green-600 border border-green-700 rounded-lg shadow-lg p-4 text-white">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-green-100">{title}</h4>
                        <p className="text-green-200 text-sm mt-1">{message}</p>
                    </div>
                    {!autoClose && (
                        <button
                            onClick={onClose}
                            className="flex-shrink-0 text-green-200 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {autoClose && (
                    <div className="mt-3">
                        <div className="w-full bg-green-700 rounded-full h-1">
                            <div
                                className="bg-green-300 h-1 rounded-full animate-pulse"
                                style={{
                                    animation: `shrink ${duration}ms linear forwards`
                                }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
};

export default SuccessNotification; 