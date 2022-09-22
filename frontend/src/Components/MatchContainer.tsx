type MatchProps = {
    user: string;
    interests: string[]
}; /* use `interface` if exporting so that consumers can extend */

// Easiest way to declare a Function Component; return type is inferred.
export function MatchContainer({ user, interests }: MatchProps) {
    return (
        <article>
            {user}
            {interests.map((interest, i) => <p key="i">{interest}</p>)}
        </article>
        )
};