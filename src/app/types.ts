// types.ts

import { Document } from '@contentful/rich-text-types';

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Option {
  id: string;
  text: string;
}

export interface Asset {
  sys: {
    id: string;
    type: string;
    // Outros campos em 'sys' se necessário
  };
  fields: {
    title?: string;
    description?: string;
    file: {
      url: string;
      details?: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

export interface Question {
  id: string;
  text: string;
  body: Document; // Usando o tipo 'Document' do Contentful para rich text
  options: Option[];
  correctOptionId: string;
  explanation: string;
  assets: Asset[]; // Adiciona o campo 'assets' à interface 'Question'
}
