interface Props{
    className?: string;
    children?: React.ReactNode;
}

export default function Container({ className, children}: Props){
    return(
        <div className={`${className} max-w-[1232px] w-full mx-auto `}>
            {children}
        </div>
    )
}