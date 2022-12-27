import { useEffect, useState } from 'react'

export const useLocalData: <T>({ name }: { name: string }) => {
  data: T | undefined
} = ({ name }: { name: string }) => {
  const [data, setData] = useState()

  useEffect(() => {
    fetch(`data/${name}.json`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
      .then((res) => res.json())
      .then((json) => setData(json))
  }, [name])
  return { data }
}
