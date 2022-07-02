declare function require(name: string): any;

import EditorJS, { OutputData } from "@editorjs/editorjs";
const Header = require('@editorjs/header');
const List = require('@editorjs/list');

export class PageEditor {
  pageLeadEditor: EditorJS;
  pageBodyEditor: EditorJS;
  pageLeadEditorData!: OutputData;
  pageBodyEditorData?: OutputData;

  constructor(
    pageLeadEditorHolder: string, pageBodyEditorHolder: string,
    pageLeadEditorData?: OutputData, pageBodyEditorData?: OutputData) {
    
    this.pageLeadEditor = new EditorJS({
        holder: pageLeadEditorHolder,
        data: pageLeadEditorData
    });

    this.pageBodyEditor = new EditorJS({
      holder: pageBodyEditorHolder,
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            levels: [2, 3],
            defaultLevel: 2
          }
        },
        list: {
          class: List,
          inlineToolbar: true
        }
      },
      autofocus: false,
      data: pageBodyEditorData
    });    
  }

  public async updatePageEditorDataContainers() {
    try {
      this.pageLeadEditorData = await this.pageLeadEditor.save();
      this.pageBodyEditorData = await this.pageBodyEditor.save();
    } catch (error) {
      console.log(error);
    }
  }
}