import React from "react"

import { convertFromRaw, convertToRaw, EditorState, type RawDraftContentState } from "draft-js"
import { Editor } from "react-draft-wysiwyg"
import { toast } from "sonner"

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import axiosInstance from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

const SaveButton = ({ id, editorState }: { id: string, editorState: EditorState }) => {
    // Brief saving handler
    const saveHandler = React.useCallback(() => {
        toast.promise(async () => {
            const response = await axiosInstance.put(`/api/v1/admin-tools/human-request/${id}`, { brief: convertToRaw(editorState.getCurrentContent()) })
            return response.data.data
        }, {
            loading: 'Saving brief',
            success: 'Brief saved',
            error: 'An error occured'
        })
    }, [editorState])

    return <Button onClick={saveHandler}>Save</Button>
}

const BriefEditor = ({ data }: { data: any | null }) => {
    // Hold internal states
    const [editorState, setEditorState] = React.useState(data?.brief ? EditorState.createWithContent(convertFromRaw(data.brief as RawDraftContentState)) : EditorState.createEmpty())

    // Image upload handler
    const uploadCallback = async (file: File) => {
        const formData = new FormData()

        const action = `${import.meta.env.VITE_BACKEND_URL}/api/v1/app-tools/file`

        formData.append('files', file)
        formData.append('parentFolder', `design-tasks/${data?.id || 'unknown'}`)

        const response = await axiosInstance.post(action, formData, { headers: { "Content-Type": 'multipart/form-data' } })

        const result = await response.data
        return { data: { link: result.data.urls[0]}} 
    }

    const toolbarCustomButtons = React.useMemo(() => data ? [<SaveButton key="save" id={data?.id || ''} editorState={editorState}/>] : [], [data?.id, editorState])

    // Get data from parent context
    const { user } = useAuth()

    const isDesignerManager = user!.roles.some((role) => ['Designer Manager', 'Superadmin'].includes(role.name))

    return (
        <Editor
            toolbarHidden={!isDesignerManager}
            readOnly={!isDesignerManager}
            toolbar={{
                options: ['inline', 'blockType', 'list', 'link', 'image', 'history'],
                inline: { options: ['bold', 'italic', 'underline', 'strikethrough'] },
                image: { uploadEnabled: true, uploadCallback, previewImage: true }
            }}
            editorState={editorState}
            onEditorStateChange={setEditorState}
            toolbarCustomButtons={toolbarCustomButtons} />
    )
}

export default BriefEditor