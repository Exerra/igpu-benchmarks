import { LoaderFunction } from "@remix-run/cloudflare";
import { Parser } from "xml2js";
import { S3ObjectList } from "~/types/s3";
import { useLoaderData } from "@remix-run/react";
import ReviewSection from "~/modules/components/section";
import ReactSearchBox from "react-search-box";
import { gpuSearchFilter } from "~/util/gpuParse";
import { getS3Objects } from "~/util/s3";

export const loader: LoaderFunction = async ({ params }) => {

	console.log(params)

	let prefix = `benchmarks/${params.name}/gpu`

	let objects = await getS3Objects(prefix)

	console.log(objects)

	return { objects, prefix: prefix, game: params.name }
}

export default () => {
	let { objects, prefix, game } = useLoaderData<{ objects: S3ObjectList, prefix: string, game: string }>()

	let gpus = gpuSearchFilter(objects, prefix)

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