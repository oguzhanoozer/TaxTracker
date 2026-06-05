"use client"

import { useNotification } from "@/app/(app)/context"
import { uploadFilesAction } from "@/app/(app)/files/actions"
import { FormError } from "@/components/forms/error"
import config from "@/lib/config"
import { Cloud, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { startTransition, useState } from "react"

export default function AIAssistantWidget() {
  const router = useRouter()
  const { showNotification } = useNotification()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true)
    setUploadError("")
    if (e.target.files && e.target.files.length > 0) {
      const formData = new FormData()

      for (let i = 0; i < e.target.files.length; i++) {
        formData.append("files", e.target.files[i])
      }

      startTransition(async () => {
        const result = await uploadFilesAction(formData)
        if (result.success) {
          showNotification({ code: "sidebar.unsorted", message: "new" })
          setTimeout(() => showNotification({ code: "sidebar.unsorted", message: "" }), 3000)
          router.push("/unsorted")
        } else {
          setUploadError(result.error ? result.error : "Something went wrong...")
        }
        setIsUploading(false)
      })
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card p-1.5">
      <label className="block rounded-lg border-2 border-dashed border-border hover:border-accent hover:bg-secondary p-10 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-colors min-h-[180px]">
        <input
          type="file"
          className="hidden"
          multiple
          accept={config.upload.acceptedMimeTypes}
          onChange={handleFileChange}
        />
        <div className="w-10 h-10 rounded-md bg-secondary text-accent flex items-center justify-center">
          {isUploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Cloud className="w-5 h-5" />
          )}
        </div>
        <p className="font-medium text-foreground">
          {isUploading ? "Uploading…" : "Drop files here, or click to browse"}
        </p>
        {!uploadError && (
          <p className="text-xs text-muted-foreground">
            Invoices, receipts, screenshots — we&apos;ll scan them.
          </p>
        )}
        {uploadError && <FormError>{uploadError}</FormError>}
      </label>
    </section>
  )
}
