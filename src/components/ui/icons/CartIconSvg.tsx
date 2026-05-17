export default function CartIconSvg({className}: { className?: string }) {
    return (
        <svg className={className} width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M4.36628 8H18.6323C19.1293 8 19.5523 8.366 19.6223 8.859L20.6473 16.035C21.1153 19.315 18.8363 22.355 15.5563 22.823C15.4193 22.843 15.2813 22.857 15.1433 22.867C13.9283 22.956 12.7133 23 11.4993 23C10.2843 23 9.06926 22.956 7.85526 22.867C4.55029 22.627 2.06529 19.752 2.30729 16.447C2.31729 16.309 2.33229 16.171 2.35129 16.035L3.37629 8.859C3.44629 8.366 3.86928 8 4.36628 8V8V8"
                stroke="black" strokeWidth="2"/>
            <path d="M6.5 8C7.833 3.333 9.5 1 11.5 1C13.5 1 15.167 3.333 16.5 8" stroke="black" strokeWidth="2"
                  strokeLinejoin="round"/>
        </svg>
    )
}