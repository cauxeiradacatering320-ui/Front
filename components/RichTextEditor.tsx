'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import LinkExtension from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import { ResizableImage } from './extensions/ResizableImage';
import { compressImage } from '@/utils/compressImage';
import { useCallback, useState, useRef, useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const MenuButton = ({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-1.5 rounded transition-colors ${
      active ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
    }`}
  >
    {children}
  </button>
);

const Divider = () => <span className="w-px h-5 bg-neutral-700 mx-1" />;

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [imgWidth, setImgWidth] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
    };
    if (showColorPicker) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColorPicker]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,

      Color,
      Highlight.configure({ multicolor: true }),
      ResizableImage.configure({
        allowBase64: true,
        inline: false,
      }),
      LinkExtension.configure({
        openOnClick: true,
        HTMLAttributes: { class: 'text-[#D4AF37] underline hover:text-[#B87333]' },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3 text-white prose-headings:text-white prose-p:text-neutral-300 prose-a:text-[#D4AF37] prose-strong:text-white prose-code:text-neutral-300 prose-code:bg-neutral-800 prose-pre:bg-neutral-900 prose-pre:text-neutral-300 prose-blockquote:text-neutral-300 prose-blockquote:border-l-[#D4AF37] prose-li:text-neutral-300 prose-ol:text-neutral-300 prose-ul:text-neutral-300',
      },
    },
  });

  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;

      try {
        const compressed = await compressImage(file, 1200, 0.8);
        editor.chain().focus().insertContent({
          type: 'resizableImage',
          attrs: { src: compressed },
        }).run();
      } catch {
        const reader = new FileReader();
        reader.onload = () => {
          editor.chain().focus().insertContent({
            type: 'resizableImage',
            attrs: { src: reader.result as string },
          }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [editor]);

  const handleSetLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const applyImageWidth = useCallback(
    (width: string) => {
      if (!editor) return;
      editor.chain().focus().updateAttributes('resizableImage', { width }).run();
      setImgWidth('');
    },
    [editor]
  );

  const imageActive = editor?.isActive('resizableImage');
  const imageWidth = imageActive
    ? (editor?.getAttributes('resizableImage')?.width as string) || ''
    : '';

  if (!editor) return null;

  return (
    <div className="border border-neutral-800 rounded-xl overflow-hidden flex flex-col bg-[#050505]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-neutral-800 bg-[#0a0a0a] shrink-0">
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Título grande"
        >
          <span className="text-sm font-bold">H2</span>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Título médio"
        >
          <span className="text-xs font-bold">H3</span>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          active={editor.isActive('heading', { level: 4 })}
          title="Título pequeno"
        >
          <span className="text-xs font-semibold">H4</span>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive('paragraph')}
          title="Parágrafo"
        >
          <span className="text-xs">¶</span>
        </MenuButton>

        <Divider />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Negrito"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6zM6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
          </svg>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Itálico"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h8M6 20h8M14 4l-4 16" />
          </svg>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Sublinhado"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v7a5 5 0 0010 0V4M5 20h14" />
          </svg>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Tachado"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h12M4 6l3 12M20 6l-3 12" />
          </svg>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive('highlight')}
          title="Marcar texto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </MenuButton>

        <div className="relative" ref={colorPickerRef}>
          <MenuButton
            onClick={() => setShowColorPicker(!showColorPicker)}
            active={showColorPicker}
            title="Cor do texto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </MenuButton>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-[#0a0a0a] border border-neutral-700 rounded-xl shadow-2xl z-50 grid grid-cols-6 gap-1">
              {['#FFFFFF', '#D4AF37', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#78716C', '#000000'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setShowColorPicker(false);
                  }}
                  className="w-6 h-6 rounded-lg border border-neutral-700 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setShowColorPicker(false);
                }}
                className="col-span-full mt-1 text-xs text-neutral-400 hover:text-white transition-colors py-1"
              >
                Remover cor
              </button>
            </div>
          )}
        </div>

        <Divider />

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Alinhar esquerda"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h10M4 14h16M4 18h10" />
          </svg>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Centralizar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 10h8M4 14h16M8 18h8" />
          </svg>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Alinhar direita"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 10h10M4 14h16M10 18h10" />
          </svg>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          active={editor.isActive({ textAlign: 'justify' })}
          title="Justificar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </MenuButton>

        <Divider />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Lista"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Lista numerada"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </MenuButton>

        <Divider />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Citação"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          title="Bloco de código"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </MenuButton>

        <Divider />

        <MenuButton onClick={addImage} title="Inserir imagem">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </MenuButton>

        <MenuButton
          onClick={() => {
            const url = editor.getAttributes('link').href;
            setLinkUrl(url || '');
            setShowLinkInput(!showLinkInput);
          }}
          active={editor.isActive('link')}
          title="Inserir link"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Linha horizontal"
        >
          <span className="text-xs font-bold">—</span>
        </MenuButton>
      </div>

      {/* Link input bar */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-neutral-800 bg-[#0a0a0a] shrink-0">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 px-2 py-1 text-sm bg-[#050505] border border-neutral-700 rounded text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]/50"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSetLink();
              if (e.key === 'Escape') setShowLinkInput(false);
            }}
          />
          <button
            type="button"
            onClick={handleSetLink}
            className="px-3 py-1 text-sm bg-[#D4AF37] text-black font-semibold rounded hover:bg-[#B87333] transition-colors"
          >
            {linkUrl ? 'Atualizar' : 'Adicionar'}
          </button>
          {editor?.isActive('link') && (
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                setShowLinkInput(false);
                setLinkUrl('');
              }}
              className="px-3 py-1 text-sm bg-red-800/60 text-red-400 rounded hover:bg-red-700/70 transition-colors"
            >
              Remover
            </button>
          )}
        </div>
      )}

      {/* Image resize toolbar */}
      {imageActive && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-neutral-800 bg-[#0a0a0a] shrink-0">
          <span className="text-xs text-neutral-400 font-medium">Imagem:</span>
          <label className="text-xs text-neutral-500">Largura:</label>
          <input
            type="number"
            value={imgWidth || imageWidth}
            onChange={(e) => setImgWidth(e.target.value)}
            placeholder={imageWidth || 'auto'}
            className="w-20 px-2 py-1 text-sm bg-[#050505] border border-neutral-700 rounded text-white placeholder-neutral-600 focus:outline-none focus:border-[#D4AF37]/50"
          />
          <span className="text-xs text-neutral-500">px</span>
          <button
            type="button"
            onClick={() => applyImageWidth(imgWidth)}
            className="px-2 py-1 text-xs bg-[#D4AF37] text-black font-semibold rounded hover:bg-[#B87333] transition-colors"
          >
            Aplicar
          </button>
          {[300, 500, 700, '100%'].map((w) => (
            <button
              key={String(w)}
              type="button"
              onClick={() => applyImageWidth(String(w))}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                String(imageWidth) === String(w)
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37]/40 text-[#D4AF37]'
                  : 'bg-transparent border-neutral-700 text-neutral-400 hover:border-neutral-600'
              }`}
            >
              {w}
            </button>
          ))}
          <span className="text-xs text-neutral-600 ml-2">
            ou arraste as bordas da imagem
          </span>
        </div>
      )}

      {/* Editor scrollável */}
      <div className="overflow-y-auto max-h-[calc(100vh-350px)]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
