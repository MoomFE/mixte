export interface TiptapEditorProps {

}

export type MenuKeys = '|' | 'undo' | 'redo' | 'bold' | 'italic' | 'underline' | 'strike' | 'code';

export interface TiptapEditorMenuProps {
  keys?: MenuKeys[];
}
