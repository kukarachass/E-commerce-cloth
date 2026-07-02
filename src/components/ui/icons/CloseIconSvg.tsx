interface CloseIconSvgProps {
    className?: string;
    onClick?: () => void;
}

export default function CloseIconSvg({ className, onClick }: CloseIconSvgProps) {
    return(
        <svg onClick={onClick} className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3L13 13" stroke="black" strokeWidth="1.5"/>
            <path d="M13 3L3 13" stroke="black" strokeWidth="1.5"/>
        </svg>
    )
}