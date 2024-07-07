import { MongoClient, GridFSBucket } from "mongodb";
import mongoose from "mongoose";
import { Readable } from "stream";

const client = new MongoClient(process.env.DATABASE_URL as string);
const db = client.db(process.env.DATABASE_NAME as string);
async () => await client.connect();
const bucket = new GridFSBucket(db);

export async function uploadFile(file: Express.Multer.File & { metadata: object }) {
  const fileName = file.originalname;
  if (!fileName) throw "Arquivo não encontrado.";

  const uploadStream = bucket.openUploadStream(fileName, {
    chunkSizeBytes: 255 * 1024, //255 Kb
    metadata: file.metadata || {},
  });

  const bufferStream = new Readable();
  bufferStream.push(file.buffer);
  bufferStream.push(null);
  bufferStream.pipe(uploadStream);

  return {
    message: `O arquivo ${file.originalname} foi processado e está sendo salvo. Identificador: ${uploadStream.id}.`,
    _id: uploadStream.id,
  };
}

export async function getFiles(query: any, skip?: number, limit?: number) {
  const files = await bucket
    .find(query)
    .sort({ _id: -1 })
    .skip(skip || 0)
    .limit(limit || 10)
    .toArray();
  return {
    files,
    count: await db.collection("fs.files").countDocuments(query),
  };
}

export async function recoverFile(fileId: mongoose.Types.ObjectId) {
  const filesCollection = db.collection("fs.files");
  const fileMetadata = await filesCollection.findOne({ _id: fileId });
  if (!fileMetadata) throw "Arquivo não encontrado.";

  const document = await getFileContent(bucket, fileMetadata);
  if (!document) throw "Conteúdo do arquivo não encontrado.";

  return document;
}

export async function deleteFile(fileId: mongoose.Types.ObjectId) {
  const filesCollection = db.collection("fs.files");
  const fileMetadata = await filesCollection.findOneAndUpdate(
    { _id: fileId },
    { $set: { "metadata.deletedAt": new Date() } }
  );
  if (!fileMetadata) throw "Arquivo não encontrado.";

  return `O arquivo ${fileId} foi deletado.`;
}

export async function updateFile(fileId: mongoose.Types.ObjectId, body: any) {
  const filesCollection = db.collection("fs.files");
  if (body.metadata.contract)
    body.metadata.contract = new mongoose.Types.ObjectId(
      body.metadata.contract
    );
  const fileMetadata = await filesCollection.findOneAndUpdate(
    { _id: fileId },
    { $set: body },
    { returnDocument: "after" }
  );
  if (!fileMetadata) throw "Arquivo não encontrado.";

  return fileMetadata.value;
}

async function getFileContent(
  bucket: GridFSBucket,
  metadata: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    const downloadStream = bucket.openDownloadStreamByName(metadata.filename);
    const chunks: any[] = [];

    downloadStream.on("data", (chunk) => {
      chunks.push(chunk);
    });

    downloadStream.on("error", (error) => {
      reject(error);
    });

    downloadStream.on("end", () => {
      const fileBuffer = Buffer.concat(chunks);
      resolve(fileBuffer);
    });
  });
}
