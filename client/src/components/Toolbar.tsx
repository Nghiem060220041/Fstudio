"use client"

import { type Editor } from "@tiptap/react"
import {
    Bold,
    Strikethrough,
    Italic,
    List,
    ListOrdered,
    Heading2,
    Heading1,
    Code2,
    Undo,
    Redo
} from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "./ui/separator"

type Props = {
    editor: Editor | null
}

export function Toolbar({ editor }: Props) {
    if (!editor) {
        return null
    }

    return (
        <div className="flex border border-input bg-transparent rounded-sm p-1 mb-2">
            <Toggle
                size="sm"
                className="mr-1"
                pressed={editor.isActive("undo")}
                onPressedChange={()=> editor.chain().focus().undo().run()}
            >
                <Undo className="w-4 h-4"/>
            </Toggle>
            <Toggle
                size="sm"
                className="mr-1"
                pressed={editor.isActive("redo")}
                onPressedChange={()=> editor.chain().focus().redo().run()}
            >
                <Redo className="w-4 h-4"/>
            </Toggle>
            <Toggle
                size="sm"
                className="mr-1"
                pressed={editor.isActive("heading2")}
                onPressedChange={()=> editor.chain().focus().toggleHeading({level:2}).run()}
            >
                <Heading2 className="w-4 h-4"/>
            </Toggle>
            <Toggle
                size="sm"
                className="mr-1"
                pressed={editor.isActive("bold")}
                onPressedChange={()=> editor.chain().focus().toggleBold().run()}
            >
                <Bold className="w-4 h-4"/>
            </Toggle>
            <Toggle
                size="sm"
                className="mr-1"
                pressed={editor.isActive("italic")}
                onPressedChange={()=> editor.chain().focus().toggleItalic().run()}
            >
                <Italic className="w-4 h-4"/>
            </Toggle>
            <Toggle
                size="sm"
                className="mr-1"
                pressed={editor.isActive("strike")}
                onPressedChange={()=> editor.chain().focus().toggleStrike().run()}
            >
                <Strikethrough className="w-4 h-4"/>
            </Toggle>
            <Separator orientation="vertical"/>
            <Toggle
                size="sm"
                className="mr-1"
                pressed={editor.isActive("bulletList")}
                onPressedChange={()=> editor.chain().focus().toggleBulletList().run()}
            >
                <List className="w-4 h-4"/>
            </Toggle>
            <Toggle
                size="sm"
                className="mr-1"
                pressed={editor.isActive("orderedList")}
                onPressedChange={()=> editor.chain().focus().toggleOrderedList().run()}
            >
                <ListOrdered className="w-4 h-4"/>
            </Toggle>
            <Separator orientation="vertical"/>
            <Toggle
                size="sm"
                className="mr-1"
                pressed={editor.isActive("codeBlock")}
                onPressedChange={()=> editor.chain().focus().toggleCodeBlock().run()}
            >
                <Code2 className="w-4 h-4"/>
            </Toggle>
        </div>
    )
}