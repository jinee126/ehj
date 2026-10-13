import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table'
import { TextStyle, Color } from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { TaskList, TaskItem } from '@tiptap/extension-list'
import { Placeholder, CharacterCount } from '@tiptap/extensions'

export const MAX_CHARS = 10000

export const editorExtensions = [
    // ===== StarterKit: 기본 기능은 전부 여기서 설정 =====
    StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: {
            openOnClick: false,
            autolink: true,
            defaultProtocol: 'https',
        },
        // 안 쓸 기능은 false로 끄면 됨. 예) codeBlock: false
    }),

    // ===== StarterKit에 없는 것만 추가 =====
    Image.configure({ allowBase64: false }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    TextStyle,
    Color,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Highlight.configure({ multicolor: true }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Placeholder.configure({ placeholder: '내용을 입력하세요' }),
    CharacterCount.configure({ limit: MAX_CHARS }),
]