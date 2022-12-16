import {useEffect, useState} from "react";

export const useData: <T extends {}>({ name }: { name: string }) => { data: T } = <T extends {}>({ name }: { name: string }) => {
    const [data, setData] = useState<T>({} as T)

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