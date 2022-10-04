import { LoaderFunction } from "@remix-run/cloudflare";
import { Parser } from "xml2js";
import { S3ObjectList } from "~/types/s3";
import { useLoaderData } from "@remix-run/react";
import ReviewSection from "~/modules/components/section";
import ReactSearchBox from "react-search-box";

export const loader: LoaderFunction = async ({ params }) => {

	console.log(params)

	let prefix = `benchmarks/${params.name}/gpu/`

	let parser = new Parser()

	let objects = await (await fetch( `https://s3.eu-west-3.amazonaws.com/exerra-igpu-benchmark?list-type=2&delimiter=/&prefix=${prefix}&max-keys=500` )).text()

	let data: S3ObjectList = await parser.parseStringPromise( objects )

	console.log(data.ListBucketResult.CommonPrefixes)

	//data.ListBucketResult.Contents = data.ListBucketResult.Contents.filter( d => d.Key[0] != data.ListBucketResult.Prefix[0] )

	return { data, prefix: prefix, game: params.name }
}

export default () => {
	let { data, prefix, game } = useLoaderData<{ data: S3ObjectList, prefix: string, game: string }>()

	let gpus: { key: string, value: string }[] = []

	data.ListBucketResult.CommonPrefixes.forEach(k => {
		let gpu = k.Prefix[0].replace(prefix, "").replace("/", "")

		gpus.push({
			key: gpu,
			value: gpu
		})
	})

	return (
		<ReviewSection title={"Benchmark"}>
			<div>
				<ReactSearchBox placeholder={"Select a GPU"} data={gpus} onSelect={(record) => {
					console.log(record)
					window.location.href = `/benchmark/${game}/${record.item.value}`
				}} onChange={() => {}} />
			</div>
		</ReviewSection>
	)
}