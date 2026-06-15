import { useCallback, useEffect, useState } from "react"
import ErrorMessage from "./ErrorMessage"
import SuccessMessage from "./SuccessMessage"

interface AutoSaveBaseProps {
  isSaved: boolean
  isChanged: boolean
  isValid: boolean
  setSaved: (saved: boolean) => void
  setChanged: (changed: boolean) => void
  onSave: () => Promise<void>
  children?: React.ReactNode
}

const AutoSaveBase = ({ isSaved, isChanged, isValid, setSaved, setChanged, onSave, children }: AutoSaveBaseProps) => {
  const [saving, setSaving] = useState(false)
  const [httpResponseStatus, setHttpResponseStatus] = useState<number | undefined>(undefined)
  const [httpResponseError, setHttpResponseError] = useState<Error | undefined>(undefined)

  const save = useCallback(async () => {
    if (saving) {
      return
    }

    setSaving(true)

    try {
      await onSave()

      setHttpResponseStatus(200)
      setHttpResponseError(undefined)
      setSaved(true)
      setChanged(false)
    } catch (error) {
      setHttpResponseError(error as Error)
    } finally {
      setSaving(false)
    }
  }, [onSave, saving, setChanged, setSaved])

  useEffect(() => {
    if (!isValid) {
      setHttpResponseStatus(undefined)
      return
    }

    if (isSaved || !isChanged) {
      return
    }

    if (httpResponseError) {
      return
    }

    save()
  }, [isValid, isSaved, isChanged, httpResponseError, save])

  return (
    <>
      {children}
      {httpResponseStatus === 200 && <SuccessMessage message="Input saved" />}
      {httpResponseError && <ErrorMessage message="Autosave has failed, please refresh" />}
    </>
  )
}

export default AutoSaveBase
