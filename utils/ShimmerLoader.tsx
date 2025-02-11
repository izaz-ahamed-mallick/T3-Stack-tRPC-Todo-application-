import React from "react";

const ShimmerLoader = () => {
    return (
        <div className="grid grid-cols-3 gap-4">
            {/* Shimmer Loader */}
            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index}
                    className="bg-gray-300 dark:bg-gray-700 animate-pulse rounded-lg h-32"
                ></div>
            ))}
        </div>
    );
};

export default ShimmerLoader;
