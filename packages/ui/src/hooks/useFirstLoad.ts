import { useEffect, useState } from "react"

const useFirstLoad = () => {
  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false)
    }
  })

  return firstLoad
}

export default useFirstLoad
