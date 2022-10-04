import { S3ObjectList } from "~/types/s3";
import { Parser } from "xml2js";

export const s3url = "https://s3.eu-west-3.amazonaws.com/exerra-igpu-benchmark"

export const parser = new Parser()

export const getS3Objects = async (prefix: string): Promise<S3ObjectList> => {
	let objects = await (await fetch( `${s3url}?list-type=2&delimiter=/&prefix=${prefix}/&max-keys=500` )).text()

	let data: S3ObjectList = await parser.parseStringPromise( objects )

	if ("Contents" in data.ListBucketResult) {
		data.ListBucketResult.Contents = data.ListBucketResult.Contents?.filter( d => d.Key[0] != data.ListBucketResult.Prefix[0] )
	}

	return data
}