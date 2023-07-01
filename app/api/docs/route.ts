import { messagesSchema } from '@/lib/data';
import fs from 'fs';
import { loadQARefineChain } from 'langchain/chains';
import { Document } from 'langchain/dist/document';
import { NotionLoader } from 'langchain/document_loaders/fs/notion';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain/llms/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  return NextResponse.json({
    data: [],
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = messagesSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ message: result.error }, { status: 400 });
  }

  const response = await notionParser(
    result.data.messages.findLast((m) => m.role === 'user')?.content ?? ''
  );

  return new NextResponse(response.output_text);
}

const getNotionDocs = async (
  docPath: string = path.resolve('./public', './docs/apollo-docs-notion')
) => {
  if (!fs.existsSync(docPath)) {
    throw new Error('Notion docs not found');
  }

  const loader = new NotionLoader(docPath);
  return await loader.load();
};

const splitDocs = async (docs: Document[]) => {
  const splitter = new RecursiveCharacterTextSplitter();
  return await splitter.splitDocuments(docs);
};

const notionParser = async (input: string) => {
  const notionDocs = await getNotionDocs();
  const splittedDocs = await splitDocs(notionDocs);

  const vectorStore = await MemoryVectorStore.fromDocuments(
    splittedDocs,
    new OpenAIEmbeddings()
  );

  const relevantDocs = await vectorStore.similaritySearch(input);
  const model = new OpenAI({ temperature: 0.8 });
  const chain = loadQARefineChain(model);

  return await chain.call({ input_documents: relevantDocs, question: input });
};
