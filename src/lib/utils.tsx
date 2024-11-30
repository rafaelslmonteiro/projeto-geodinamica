// src/lib/utils.tsx

import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import {
  BLOCKS,
  INLINES,
  MARKS,
  Document,
  Block,
  Inline,
} from '@contentful/rich-text-types';
import { Asset } from '@/app/types';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

// Importações para a função 'cn'
import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Exportação da função 'cn'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AssetsMap {
  [key: string]: Asset;
}

export function renderRichText(body: Document, assets: Asset[]) {
  const assetsMap: AssetsMap = assets.reduce((acc: AssetsMap, asset) => {
    acc[asset.sys.id] = asset;
    return acc;
  }, {});

  const options = {
    renderMark: {
      [MARKS.BOLD]: (text: React.ReactNode) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text: React.ReactNode) => <em>{text}</em>,
      [MARKS.UNDERLINE]: (text: React.ReactNode) => (
        <span className="underline">{text}</span>
      ),
      [MARKS.CODE]: (text: React.ReactNode) => (
        <code className="bg-gray-100 text-red-500 px-1 py-0.5 rounded">
          {text}
        </code>
      ),
    },
    renderNode: {
      // Renderizadores para cabeçalhos
      [BLOCKS.HEADING_1]: (node: Block, children: React.ReactNode) => (
        <h1 className="text-4xl font-bold mb-4 text-primary">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (node: Block, children: React.ReactNode) => (
        <h2 className="text-3xl font-bold mb-4 text-primary">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node: Block, children: React.ReactNode) => (
        <h3 className="text-2xl font-bold mb-4 text-primary">{children}</h3>
      ),
      [BLOCKS.HEADING_4]: (node: Block, children: React.ReactNode) => (
        <h4 className="text-xl font-bold mb-4 text-primary">{children}</h4>
      ),
      [BLOCKS.HEADING_5]: (node: Block, children: React.ReactNode) => (
        <h5 className="text-lg font-bold mb-4 text-primary">{children}</h5>
      ),
      [BLOCKS.HEADING_6]: (node: Block, children: React.ReactNode) => (
        <h6 className="text-base font-bold mb-4 text-primary">{children}</h6>
      ),

      // Renderizador para parágrafos
      [BLOCKS.PARAGRAPH]: (node: Block, children: React.ReactNode) => (
        <p className="mb-4 text-gray-700 dark:text-gray-300">{children}</p>
      ),

      // Renderizadores para listas
      [BLOCKS.UL_LIST]: (node: Block, children: React.ReactNode) => (
        <ul className="list-disc list-inside mb-4 pl-4">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node: Block, children: React.ReactNode) => (
        <ol className="list-decimal list-inside mb-4 pl-4">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node: Block, children: React.ReactNode) => (
        <li className="mb-2">{children}</li>
      ),

      // Renderizador para citações
      [BLOCKS.QUOTE]: (node: Block, children: React.ReactNode) => (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4">
          {children}
        </blockquote>
      ),

      // Renderizador para linha horizontal
      [BLOCKS.HR]: () => <hr className="my-8 border-gray-300" />,

      // Renderizador para tabelas
      [BLOCKS.TABLE]: (node: Block, children: React.ReactNode) => (
        <table className="table-auto mb-4 w-full">{children}</table>
      ),
      [BLOCKS.TABLE_ROW]: (node: Block, children: React.ReactNode) => (
        <tr className="border-t border-gray-300">{children}</tr>
      ),
      [BLOCKS.TABLE_CELL]: (node: Block, children: React.ReactNode) => (
        <td className="px-4 py-2">{children}</td>
      ),
      [BLOCKS.TABLE_HEADER_CELL]: (node: Block, children: React.ReactNode) => (
        <th className="px-4 py-2 bg-gray-100 font-bold">{children}</th>
      ),

      // Asset embutido (imagens)
      [BLOCKS.EMBEDDED_ASSET]: (node: Block) => {
        const assetId = node.data.target.sys.id;
        const asset = assetsMap[assetId];

        if (asset) {
          const { url } = asset.fields.file;
          const description = asset.fields.description || asset.fields.title;
          const imageUrl = `https:${url}`;
          const { width, height } = asset.fields.file.details.image || {};

          return (
            <div key={assetId} className="my-6">
              <Image
                src={imageUrl}
                alt={description || 'Imagem'}
                width={width || 800}
                height={height || 600}
                layout="responsive"
                className="rounded-lg shadow-md"
              />
              {description && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  {description}
                </p>
              )}
            </div>
          );
        } else {
          return (
            <p
              key={assetId}
              className="my-4 text-red-500 bg-red-100 p-2 rounded"
            >
              Imagem não encontrada.
            </p>
          );
        }
      },

      // Entrada embutida (pode ser usado para renderizar conteúdo customizado)
      [BLOCKS.EMBEDDED_ENTRY]: (node: Block, children: React.ReactNode) => {
        // Aqui você pode lidar com entradas embutidas, se necessário
        return (
          <div className="embedded-entry my-4 p-4 border rounded">
            {children}
          </div>
        );
      },

      // Hiperlinks
      [INLINES.HYPERLINK]: (node: Inline, children: React.ReactNode) => {
        const url = node.data.uri;
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            {children}
            <ExternalLink className="h-4 w-4 inline-block ml-1" />
          </a>
        );
      },

      // Hiperlink de entrada
      [INLINES.ENTRY_HYPERLINK]: (node: Inline, children: React.ReactNode) => {
        // Aqui você pode lidar com links para entradas
        return (
          <a href="#" className="text-primary hover:underline">
            {children}
          </a>
        );
      },

      // Hiperlink de asset
      [INLINES.ASSET_HYPERLINK]: (node: Inline, children: React.ReactNode) => {
        // Aqui você pode lidar com links para assets
        return (
          <a href="#" className="text-primary hover:underline">
            {children}
          </a>
        );
      },

      // Entrada embutida inline
      [INLINES.EMBEDDED_ENTRY]: (node: Inline, children: React.ReactNode) => {
        // Aqui você pode renderizar entradas embutidas inline
        return (
          <span className="embedded-entry-inline bg-gray-100 p-1 rounded">
            {children}
          </span>
        );
      },
    },
    renderText: (text: string) => {
      // Retorna o texto sem modificações para evitar quebras de linha indesejadas
      return text;
    },
  };

  return documentToReactComponents(body, options);
}
