import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M32.5 6.5C19.3 7.1 9 12.3 7.8 23.2c-.7 6.1 3.1 10.1 8.7 9.3C27.3 31.1 32.5 20.3 32.5 6.5Z"
                fill="currentColor"
            />
            <path
                d="M8.5 34c5.3-7.1 11.1-12.5 19.4-19"
                stroke="var(--background, #fffdf9)"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}
