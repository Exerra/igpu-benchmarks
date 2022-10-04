export interface S3ObjectList {
	ListBucketResult: {
		$: { xmlns: string },
		CommonPrefixes: { Prefix: string[] }[],
		Contents?: { Key: string[], LastModified: string[], Size: string[] }[],
		Delimiter: string[],
		IsTruncated: "true"[] | "false"[],
		KeyCount: string[],
		MaxKeys: string[],
		Name: string[],
		Prefix: string[]
	}
}