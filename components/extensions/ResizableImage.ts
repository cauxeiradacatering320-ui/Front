import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ResizableImageComponent } from './ResizableImageComponent';

export interface ResizableImageOptions {
  allowBase64: boolean;
  inline: boolean;
}

export const ResizableImage = Node.create<ResizableImageOptions>({
  name: 'resizableImage',

  group() {
    return this.options.inline ? 'inline' : 'block';
  },

  inline() {
    return this.options.inline;
  },

  atom: true,
  draggable: true,

  addOptions() {
    return {
      allowBase64: false,
      inline: false,
    };
  },

  addAttributes() {
    return {
      src: { default: null },
      width: { default: null },
      height: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { width, ...rest } = HTMLAttributes;
    return [
      'img',
      mergeAttributes(rest, width ? { width } : {}),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },

});
