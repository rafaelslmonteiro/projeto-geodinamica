// arquivo: api.ts ou como preferir nomeá-lo

import { Category, Question } from './types'

interface ContentfulResponse {
  items: any[];
  includes?: {
    Entry?: any[];
    Asset?: any[];
  };
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos de timeout

    const response = await fetch(
      'https://cdn.contentful.com/spaces/o2kemh1ir3sz/environments/master/entries?access_token=DFAi_mmqjK_EDdH82ttAv_xe_z-VOWJAqHEyNy7L96w&content_type=categories',
      { signal: controller.signal }
    )
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: ContentfulResponse = await response.json()

    if (!data.items || !Array.isArray(data.items)) {
      console.error('Unexpected data structure:', data)
      return []
    }

    const categories = data.items.map((item: any) => ({
      id: item.sys.id,
      name: item.fields.categoryName,
      description: item.fields.categoryDescription?.content?.[0]?.content?.[0]?.value || 'No description available'
    }))
    return categories
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching categories:', error.message)
    } else {
      console.error('Unknown error fetching categories')
    }
    throw error
  }
}

export async function fetchQuestions(categoryId: string): Promise<Question[]> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos de timeout

    const response = await fetch(
      `https://cdn.contentful.com/spaces/o2kemh1ir3sz/environments/master/entries?access_token=DFAi_mmqjK_EDdH82ttAv_xe_z-VOWJAqHEyNy7L96w&content_type=questions&fields.question_category.sys.id=${categoryId}&include=10`,
      { signal: controller.signal }
    )
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: ContentfulResponse = await response.json()

    if (!data.items || !Array.isArray(data.items)) {
      console.error('Unexpected data structure:', data)
      return []
    }

    const assets = data.includes?.Asset || []

    const questions = data.items.map((item: any) => {
      // Processar as opções da pergunta
      const options = item.fields.question_options.map((optionLink: any) => {
        const optionEntry = data.includes?.Entry?.find((entry: any) => entry.sys.id === optionLink.sys.id)
        return {
          id: optionEntry.sys.id,
          text: optionEntry.fields.option?.content?.[0]?.content?.[0]?.value || 'No option text available'
        }
      })

      // Processar o corpo da pergunta e extrair os assets relacionados
      const questionAssets = extractAssetsFromRichText(item.fields.question_body, assets)

      return {
        id: item.sys.id,
        text: item.fields.question,
        body: item.fields.question_body,
        options: options,
        correctOptionId: item.fields.correct_option.sys.id,
        explanation: item.fields.explanationAnswer?.content?.[0]?.content?.[0]?.value || 'No explanation available',
        assets: questionAssets, // Adiciona os assets relacionados à pergunta
      }
    })
    return questions
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching questions:', error.message)
    } else {
      console.error('Unknown error fetching questions')
    }
    throw error
  }
}

// Função auxiliar para extrair os assets do rich text
function extractAssetsFromRichText(richText: any, assets: any[]): any[] {
  const assetList: any[] = []

  function traverse(node: any) {
    if (node.nodeType === 'embedded-asset-block') {
      const assetId = node.data.target.sys.id
      const asset = assets.find((a: any) => a.sys.id === assetId)
      if (asset) {
        assetList.push(asset)
      }
    }
    if (node.content) {
      node.content.forEach((childNode: any) => {
        traverse(childNode)
      })
    }
  }

  traverse(richText)
  return assetList
}
