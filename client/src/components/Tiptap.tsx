"use client"

import { Heading } from "@tiptap/extension-heading"
import { EditorContent, useEditor } from "@tiptap/react"
import StaterKit from "@tiptap/starter-kit"
import { Toolbar } from "./Toolbar"
import { useEffect } from "react"

export default function Tiptap({
    description,
    onChange,
}: {
    description: string,
    onChange: (richText: string) => void
}) {
    const editor = useEditor({
        extensions: [
            StaterKit.configure({}),
            Heading.configure({
            HTMLAttributes: {
                class: "text-xl font-bold",
                levels: [2],
            }
            })],
        content: description,
        editorProps: {
            attributes: {
                class: "flex min-h-[250px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
            }
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML())
        },
    })

    useEffect(() => {
        if (editor) {
            editor.commands.setContent(description);
        }
    }, [editor, description])
    
    return (
        <div className="flex flex-col justify-stretch min-h-[250px]">
            <Toolbar editor={editor} />
            <EditorContent editor={editor}/>
        </div>
    )
}