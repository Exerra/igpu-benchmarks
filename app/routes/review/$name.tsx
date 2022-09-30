import { LoaderFunction } from "@remix-run/cloudflare";
import { Parser } from "xml2js"
import { Link, useLoaderData } from "@remix-run/react";
import matter from "gray-matter"
import Markdown from "markdown-to-jsx";
import fm from "front-matter"
import React from "react";
import { mdConfig } from "~/routes/modules/components/markdown";
import Zoom from "react-medium-image-zoom"

interface Review {
	attributes: {
		title: string,
		platform: "Steam" | "Xbox" | "Epic" | "EA" | "Uplay",
		icon: string,
		playableStatus: "runs-great" | "playable" | "unplayable",
		screenshots: string[]
	},
	body: string,
	bodyBegin: number,
	frontmatter: string
}

export const loader: LoaderFunction = async ({ params }) => {

	let prefix = "reviews"

	let md = await (await fetch( `https://s3.eu-west-3.amazonaws.com/exerra-igpu-benchmark/${prefix}/${params.name}.md` )).text()

	return fm(md)
}

export default function Index() {
	let data: Review = useLoaderData()

	let playableStatus = {
		icon: "",
		text: "",
		colour: ""
	}

	switch (data.attributes.playableStatus) {
		case "runs-great":
			playableStatus.icon = "fa-solid fa-circle-check"
			playableStatus.text = "Runs great!"
			playableStatus.colour = "text-green-500"
			break;
		case "playable":
			playableStatus.icon = "fa-solid fa-face-meh"
			playableStatus.text = "Playable"
			playableStatus.colour = "text-orange-400"
			break;
		case "unplayable":
			playableStatus.icon = "fa-solid fa-circle-xmark"
			playableStatus.text = "Unplayable"
			playableStatus.colour = "text-red-400"
	}

	console.log( data.attributes )
	return (
		<div>
			<div className={"mx-3 mb-5"}>
				<nav className="border-gray-200 px-2 sm:px-4 py-2.5 rounded">
					<div className="container flex flex-wrap justify-between items-center mx-auto">
						<Link to="/" className="flex items-center">
							<span
								className="self-center text-xl font-semibold whitespace-nowrap">Exerra Benchmarks</span>
						</Link>
					</div>
				</nav>
			</div>

			<div className={"md:container md:justify-between items-center mx-3 md:mx-auto md:w-full"}>
				<div className={"bg-gray-200 p-10 rounded-2xl bg-center bg-cover lg:flex lg:justify-between items-center"} style={{ backgroundImage: 'url("https://cdn.exerra.xyz/svg/iridescent/bg-iridescent-rightside.svg")' }}>
					<div>
						<h1 className={"text-5xl font-bold md:text-7xl"}>{data.attributes.title} ({data.attributes.platform})</h1><br />
						<p className={"text-lg"}>Integrated GPU benchmarks for {data.attributes.title}</p>
					</div>
					<div className={"hidden lg:inline max-w-xl bg-white p-5 mt-5 lg:mt-0 md:p-5 rounded-2xl shadow-2xl aspect-square"}>
						<div className={"aspect-square bg-center bg-cover rounded-xl p-10"} style={{ backgroundImage: `url("${data.attributes.icon}")` }} />
					</div>
				</div>

				<main className={""} style={{ lineHeight: "2" }}>
					<section>
						<h1 className={"text-5xl mt-10 mb-5"}>Quick info</h1>
						<div className={"p-10 shadow-2xl rounded-2xl"}>
							<p className={`${playableStatus.colour} text-2xl`}><i className={playableStatus.icon}></i> {playableStatus.text}</p>
						</div>
					</section>

					<section>
						<h1 className={"text-5xl mt-10 mb-5"}>Review</h1>
						<div className={"p-10 shadow-2xl rounded-2xl"}>
							<Markdown options={mdConfig}>{data.body}</Markdown>
						</div>
					</section>

					<section>
						<h1 className={"text-5xl mt-10 mb-5"}>Screenshots</h1>
						<div className={"p-10 shadow-2xl rounded-2xl flex flex-wrap gap-6 justify-center"}>
							{data.attributes.screenshots.map(screenshot => (
								<Zoom><div key={`loaded ${screenshot}`} style={{ /*width: "24rem",*/ aspectRatio: "auto 16 / 9", backgroundImage: `url('${screenshot}')` }} className={"w-80 md:w-96 shadow-2xl rounded-lg overflow-hidden bg-cover basis-1/3"} /></Zoom>
							))}
						</div>
					</section>
				</main>
			</div>
		</div>
	);
}

/*
<Zoom><div key={`loaded ${screenshot.id}`} style={{ width: "24rem", aspectRatio: "auto 16 / 9", backgroundImage: `url('${screenshot.image}')` }} className={"max-w-sm shadow-2xl rounded-lg overflow-hidden bg-cover"} /></Zoom>
 */
