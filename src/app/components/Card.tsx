import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export default function Card({ children, className = "", hover = false, onClick }: CardProps) {
    return (
        <div
            className={`bg-white rounded-xl shadow-md border border-gray-200 ${hover ? "transition-all hover:shadow-xl hover:scale-105 cursor-pointer" : ""
                } ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
