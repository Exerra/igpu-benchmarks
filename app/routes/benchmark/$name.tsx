import { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import Markdown from "markdown-to-jsx";
import fm from "front-matter"
import React from "react";
import { mdConfig } from "~/modules/components/markdown";
import Zoom from "react-medium-image-zoom"
import ReviewWarning from "~/modules/components/warning";
import ReviewSection from "~/modules/components/section";
import { GameAttributes } from "~/types/attributes";
import siteinfo from "~/util/siteinfo";
import Navbar from "~/modules/views/navbar";

export const loader: LoaderFunction = async ({ params }) => {

	let prefix = "benchmarks"

	let md = await (await fetch( `https://s3.eu-west-3.amazonaws.com/exerra-igpu-benchmark/${prefix}/${params.name}.md` )).text()

	let attributes = await (await fetch(`https://s3.eu-west-3.amazonaws.com/exerra-igpu-benchmark/${prefix}/${params.name}/attributes.json`)).json()

	return { attributes: attributes }
}

export const meta: MetaFunction = ({ data }): any => {
	let { attributes }: { attributes: GameAttributes } = data
	let { title, icon } = attributes
	let description = `GPU benchmarks for ${title}`

	let metaObj = {
		title: title,
		description: `GPU benchmarks for ${title}`,
		"twitter:image": icon,
		"twitter:card": "summary",
		"twitter:site": "@Exerra",
		"twitter:title": title,
		"twitter:description": description,
		"og:image": icon,
		"og:url": `https://benchmarks.exerra.xyz/${title}`,
		"og:title": title,
		"og:description": description,
	}

	return metaObj
};

export default function Index() {
	let { attributes } = useLoaderData<{ attributes: GameAttributes }>()

	return (
		<div>
			<Navbar />

			<div className={"md:container md:justify-between items-center mx-3 md:mx-auto md:w-full"}>
				<div className={"bg-gray-200 p-10 rounded-2xl bg-center bg-cover lg:flex lg:justify-between items-center"} style={{ backgroundImage: 'url("https://cdn.exerra.xyz/svg/iridescent/bg-iridescent-rightside.svg")' }}>
					<div>
						<h1 className={"text-5xl font-bold md:text-7xl"}>{attributes.title}</h1><br />
						<p className={"text-lg"}>GPU benchmarks for <b>{attributes.title}</b></p>
					</div>
					<div className={"hidden lg:inline max-w-xl bg-white p-5 mt-5 lg:mt-0 md:p-5 rounded-2xl shadow-2xl aspect-square"}>
						<div className={"aspect-square bg-center bg-cover rounded-xl p-10"} style={{ backgroundImage: `url("${attributes.icon}")` }} />
					</div>
				</div>

				<main className={""}>

					<Outlet />

					{/*<ReviewSection title={"Screenshots"}>
						<div className={"p-10 shadow-2xl rounded-2xl flex flex-wrap gap-6 justify-center"}>
							{attributes.screenshots.map(screenshot => (
								<Zoom><div key={`loaded ${screenshot}`} style={{ aspectRatio: "auto 16 / 9", backgroundImage: `url('${screenshot}')` }} className={"w-80 md:w-96 shadow-2xl rounded-lg overflow-hidden bg-cover basis-1/3"} /></Zoom>
							))}
						</div>
					</ReviewSection>*/}

					{attributes.platforms.appid == null ? <></> :
						<ReviewSection title={"Buy the game"}>
							<div className={"gap-6 justify-center rounded-2xl"}>
								<iframe src={`https://store.steampowered.com/widget/${attributes.platforms.appid}/`} frameBorder="0" height={"190"} style={{ border: "0", boxShadow: "none" }} className={"w-full"}></iframe>
							</div>
						</ReviewSection>
					}
				</main>
			</div>
		</div>
	);
}

/*
<Zoom><div key={`loaded ${screenshot.id}`} style={{ width: "24rem", aspectRatio: "auto 16 / 9", backgroundImage: `url('${screenshot.image}')` }} className={"max-w-sm shadow-2xl rounded-lg overflow-hidden bg-cover"} /></Zoom>
 */
