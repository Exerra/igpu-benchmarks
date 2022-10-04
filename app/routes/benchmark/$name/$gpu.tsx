import { LoaderFunction } from "@remix-run/cloudflare";
import { Parser } from "xml2js";
import { S3ObjectList } from "~/types/s3";
import { useLoaderData } from "@remix-run/react";
import ReviewSection from "~/modules/components/section";
import ReactSearchBox from "react-search-box";
import ReviewWarning from "~/modules/components/warning";
import React from "react";
import fm from "front-matter";
import { GameAttributes, GPUAttributes } from "~/types/attributes";
import Markdown from "markdown-to-jsx";
import { mdConfig } from "~/modules/components/markdown";
import { gpuPlayableParse, gpuSearchFilter } from "~/util/gpuParse";
import { getS3Objects, s3url } from "~/util/s3";

export const loader: LoaderFunction = async ({ params }) => {

	let prefix = `benchmarks/${params.name}/gpu`

	let objects = await getS3Objects(prefix)
	let md = await (await fetch(`${s3url}/${prefix}/${params.gpu}/benchmark.md`)).text()
	let gpuAttributes = await (await fetch(`${s3url}/${prefix}/${params.gpu}/attributes.json`)).json<GPUAttributes>()
	let gameAttributes = await (await fetch(`${s3url}/${`benchmarks/${params.name}`}/attributes.json`)).json<GameAttributes>()

	return { objects: objects, prefix: prefix, game: params.name, gpu: params.gpu, benchmark: fm(md).body, gpuAttributes, gameAttributes }
}

export default () => {
	let { objects, prefix, game, gpu, benchmark, gpuAttributes, gameAttributes } = useLoaderData<{ objects: S3ObjectList, prefix: string, game: string, gpu: string, benchmark: string, gpuAttributes: GPUAttributes, gameAttributes: GameAttributes }>()

	let gpus = gpuSearchFilter(objects, prefix)

	let playableStatus = gpuPlayableParse(gpuAttributes.playableStatus)

	return (
		<div className={"leading-relaxed"}>
			<div className={"flex flex-wrap gap-6 mt-10"}>
				{gameAttributes.warning == null ? <></> :
					<ReviewWarning>{gameAttributes.warning}</ReviewWarning>
				}

				<div className={`w-full basis-1/1 ${gameAttributes.warning == null ? "" : "lg:basis-1/3"} p-10 rounded-2xl ${playableStatus.bg} flex justify-between items-center grow 2xl:grow-0`}>
					<p className={`${playableStatus.colour} text-3xl md:text-4xl font-bold`}>{playableStatus.text}</p>
					<div className={"inline max-w-xl bg-white p-5 md:p-5 rounded-2xl shadow-2xl aspect-square"}>
						<p className={`text-4xl md:text-5xl ${playableStatus.colour}`}><i className={playableStatus.icon}></i></p>
					</div>
				</div>
			</div>

			<ReviewSection title={"Benchmark"}>
				<div>
					<ReactSearchBox placeholder={"Select a GPU"} data={gpus} onSelect={(record) => {
						console.log(record)
						window.location.href = `/benchmark/${game}/${record.item.value}`
					}} onChange={() => {}} />

					<div className={"p-10 shadow-2xl rounded-2xl bg-cover mt-5"}>
						<Markdown options={mdConfig}>{benchmark}</Markdown>
					</div>
				</div>
			</ReviewSection>
		</div>
	)
}