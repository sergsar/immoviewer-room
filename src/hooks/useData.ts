import {useEffect, useState} from "react";

export const useData: ({ name }: { name: string }) => { data: {}|undefined } = ({ name }) => {
    const [data, setData] = useState<{}|undefined>()

    useEffect(() => {
        fetch(`data/${name}.json`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
            .then((res) => res.json())
            .then((json) => setData(json))
    }, [name])
    return { data }
}