import { useState, type MouseEvent } from 'react'

type ClickHandler = (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>

export function useButton(onClick?: ClickHandler) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    if (isLoading) return
    if (!onClick) return

    setIsLoading(true)
    try {
      await onClick(event)
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, handleClick }
}
