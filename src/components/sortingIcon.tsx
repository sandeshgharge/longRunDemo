type SortDir = "asc" | "desc";

export function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {

    if (!active) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-4 h-4 opacity-60"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="m8 9 4-4 4 4M16 15l-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
    return dir === "asc" ? (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="m8 14 4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ) : (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="m16 10-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}