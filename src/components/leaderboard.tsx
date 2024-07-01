import {useState, useEffect} from "react";

interface LeaderboardEntry {
    id: number,
    name: string,
    score: number
}

function LeaderboardEntry(props: {entry:LeaderboardEntry}) {
    let entry = props.entry;
    return (
        <div className="flex gap-2 py-2 px-4 bg-secondary">
            <dt className="overflow-clip truncate flex-1">{entry.name}</dt>
            <dd className="text-end tracking-wide">{entry.score}</dd>
        </div>
    )
}

export default function Leaderboard(props: {title: string}) {
    if (new Date("2024-07-04T17:30:00+02:00") > new Date()){
        return (<></>);
    }

    let [loading, setLoading] = useState(false);
    let [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    function updateLeaderboard(){
        if (loading) return;
        setLoading(true);
        fetch(new URL("https://api.projectmothershipgame.com/leaderboard?count=25"), {
            method: "GET"
        }).then(result => {
            if (result.ok) {
                if (result.status == 200) {
                    return result.json();
                } else if (result.status == 204) {
                    return []
                } else {
                    throw new Error("Unexpected result from API call: " + result.status);
                }
            }
        }).then(data => {
            setLeaderboard(l => ([...data]));
            setLoading(false)
        }).catch(err => {
            setLoading(false)
        });
    }

    function refresh() {
        setLoading(true);
        setLeaderboard([]);
        setTimeout(() => updateLeaderboard(), 500);
    }

    useEffect(() => {
        updateLeaderboard();
    }, []);

    return (
        <div className="bg-gradient-to-r from-primary to-accent p-0.5 rounded-lg my-6 lg:w-1/2 lg:self-center">
            <div className="bg-background rounded-lg">
                <section className="bg-secondary bg-opacity-50 border-transparent p-4">
                    <header className="flex">
                        <h2 className="flex-1 text-2xl mb-3 font-bold leading-relaxed uppercase">{props.title}</h2>
                        <button onClick={refresh} title="refresh" disabled={loading}
                                className="size-8 rounded-full text-black bg-primary hover:bg-opacity-75 active:bg-opacity-25 disabled:bg-opacity-10 grid place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                 className="size-5">
                                <path fillRule="evenodd"
                                      d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z"
                                      clipRule="evenodd"/>
                            </svg>
                        </button>
                    </header>
                    {loading ? <div className="grid place-items-center h-20">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                 stroke="currentColor" className="size-8 animate-spin">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
                            </svg>
                        </div> :
                        (leaderboard.length < 1) ?
                        <p className="bg-secondary bg-opacity-50 py-2 px-4">[Empty]</p> :
                        <dl className="[&>*:nth-child(odd)]:bg-opacity-30 [&>*:first-child]:text-primary [&>*:first-child]:font-bold">
                            {leaderboard.map(e => (<LeaderboardEntry key={e.id} entry={e}/>))}
                        </dl>
                    }
                </section>
            </div>
        </div>);
}