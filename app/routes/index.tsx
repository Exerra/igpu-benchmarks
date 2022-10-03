import { LoaderFunction, redirect } from "@remix-run/cloudflare";
import { Parser } from "xml2js"
import { Link, useLoaderData } from "@remix-run/react";
import ReactSearchBox from "react-search-box";

interface S3ObjectList {
	ListBucketResult: {
		$: { xmlns: string },
		CommonPrefixes: { Prefix: string[] }[],
		Contents: { Key: string[], LastModified: string[], Size: string[] }[],
		Delimiter: string[],
		IsTruncated: "true"[] | "false"[],
		KeyCount: string[],
		MaxKeys: string[],
		Name: string[],
		Prefix: string[]
	}
}

export const loader: LoaderFunction = async () => {

	let prefix = "reviews/"

	let parser = new Parser()

	let objects = await (await fetch( `https://s3.eu-west-3.amazonaws.com/exerra-igpu-benchmark?list-type=2&delimiter=/&prefix=${prefix}&max-keys=500` )).text()

	let data: S3ObjectList = await parser.parseStringPromise( objects )

	data.ListBucketResult.Contents = data.ListBucketResult.Contents.filter( d => d.Key[0] != data.ListBucketResult.Prefix[0] )

	for (let i = 0; i < data.ListBucketResult.Contents.length; i++) {
		data.ListBucketResult.Contents[i].Key[0] = data.ListBucketResult.Contents[i].Key[0].replace(data.ListBucketResult.Prefix[0], "")
	}

	return data
}

export default function Index() {
	let data = useLoaderData()

	let searchParse: { key: string, value: string }[] = []

	data.ListBucketResult.Contents.forEach(( result: { Key: string[]; }) => {
		let key = result.Key[0].replace(".md", "")

		searchParse.push({
			key,
			value: key
		})
	})

	console.log( data )
	return (
		<div>
			<div style={{ backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjY1MSIgdmlld0JveD0iMCAwIDk0MiA2NTEiIHdpZHRoPSI5NDIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxmaWx0ZXIgaWQ9ImEiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBoZWlnaHQ9IjU0Mi4zMDMiIHdpZHRoPSI5MTguMjY1IiB4PSIyMy4xNzkiIHk9IjcwLjA5NDkiPjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+PGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiBtb2RlPSJub3JtYWwiIHJlc3VsdD0ic2hhcGUiLz48ZmVHYXVzc2lhbkJsdXIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyIiBzdGREZXZpYXRpb249IjcxLjE4NjQiLz48L2ZpbHRlcj48ZmlsdGVyIGlkPSJiIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaGVpZ2h0PSI2MDAuMTMzIiB3aWR0aD0iNzUzLjA0NCIgeD0iNzguOTY4NyIgeT0iMTkuNTM5MiI+PGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz48ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIG1vZGU9Im5vcm1hbCIgcmVzdWx0PSJzaGFwZSIvPjxmZUdhdXNzaWFuQmx1ciByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXIiIHN0ZERldmlhdGlvbj0iNzEuMTg2NCIvPjwvZmlsdGVyPjxmaWx0ZXIgaWQ9ImMiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBoZWlnaHQ9IjU0Mi43MzkiIHdpZHRoPSI2MTMuODMiIHg9IjI4Ny44OTIiIHk9IjkuNTQ2NTciPjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+PGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiBtb2RlPSJub3JtYWwiIHJlc3VsdD0ic2hhcGUiLz48ZmVHYXVzc2lhbkJsdXIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyIiBzdGREZXZpYXRpb249IjcxLjE4NjQiLz48L2ZpbHRlcj48ZmlsdGVyIGlkPSJkIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaGVpZ2h0PSI2NDkuODA0IiB3aWR0aD0iODg4Ljc5NyIgeD0iLjk5MTUwOCIgeT0iLjUwODUwNyI+PGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz48ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIG1vZGU9Im5vcm1hbCIgcmVzdWx0PSJzaGFwZSIvPjxmZUdhdXNzaWFuQmx1ciByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXIiIHN0ZERldmlhdGlvbj0iNjAuNzUxOSIvPjwvZmlsdGVyPjxmaWx0ZXIgaWQ9ImUiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBoZWlnaHQ9IjU2MS4wNTMiIHdpZHRoPSI4NzYuMDA1IiB4PSI1MS44MTAzIiB5PSI2MC43NTUxIj48ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPjxmZUJsZW5kIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgbW9kZT0ibm9ybWFsIiByZXN1bHQ9InNoYXBlIi8+PGZlR2F1c3NpYW5CbHVyIHJlc3VsdD0iZWZmZWN0MV9mb3JlZ3JvdW5kQmx1ciIgc3RkRGV2aWF0aW9uPSI2MC43NTE5Ii8+PC9maWx0ZXI+PGZpbHRlciBpZD0iZiIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGhlaWdodD0iNjEzLjIwNyIgd2lkdGg9Ijg2MS40MjgiIHg9IjY1LjEwMzgiIHk9IjkuNDYwNjYiPjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+PGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiBtb2RlPSJub3JtYWwiIHJlc3VsdD0ic2hhcGUiLz48ZmVHYXVzc2lhbkJsdXIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyIiBzdGREZXZpYXRpb249IjYwLjc1MTkiLz48L2ZpbHRlcj48bGluZWFyR3JhZGllbnQgaWQ9ImciIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMTk1Ljk1NiIgeDI9IjM1NS44NTIiIHkxPSI0MTEuNTIiIHkyPSI3OS41NjUzIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNlZjdhNzYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiZGExZjgiIHN0b3Atb3BhY2l0eT0iMCIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJoIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjE2Mi40MTciIHgyPSI2MzcuNjI2IiB5MT0iMzg3LjkyOCIgeTI9IjQwLjM0NTMiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2MyYTBmZCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2MyYTBmZCIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjMwNC4zMjEiIHgyPSI3NjUuODg4IiB5MT0iMjI1Ljg0MSIgeTI9IjI5Ni4zODUiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2VlNzk3YSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2Y4ZDQ1YyIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJqIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjMxOC40OTgiIHgyPSI3OTAuMDM1IiB5MT0iMTI4Ljg0NiIgeTI9IjQ3MS43MjciPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzAzNWJkNiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2MyYTBmZCIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48ZyBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4zIj48ZWxsaXBzZSBmaWxsPSIjNjA0MjlmIiByeD0iMzIyLjE0IiByeT0iMTE0LjU4MSIgdHJhbnNmb3JtPSJtYXRyaXgoLjk3OTM1MSAuMjAyMTcgLS4yNDU1NzUgLjk2OTM3OCA0ODIuMzEyIDM0MS4yNDYpIi8+PC9nPjxnIGZpbHRlcj0idXJsKCNiKSIgb3BhY2l0eT0iLjMiPjxwYXRoIGQ9Im0yMzQuNzY5IDIwOC4zNjNjLTgwLjYyNy0xMDQuNTE1IDIyMi41NTIgMCAzNTguMTgzIDAgMTM1LjYzMiAwIDEwNy43NjMgMTU3LjkyOCA0Mi41MTQgMTkzLjAwN3MtMjMwLjU3NyAxMTAuNzg4LTM0MS4yMjYgNTcuNDkxIDIxLjE1Ny0xNDUuOTgzLTU5LjQ3MS0yNTAuNDk4eiIgZmlsbD0idXJsKCNnKSIvPjwvZz48ZyBmaWx0ZXI9InVybCgjYykiIG9wYWNpdHk9Ii4zIj48ZWxsaXBzZSBmaWxsPSIjZjhkNDVjIiByeD0iMTI5LjE4IiByeT0iMTY0LjM5NCIgdHJhbnNmb3JtPSJtYXRyaXgoLjA1ODI5MTkgLS45OTgzIC45OTk4MzEgLS4wMTgzOTQ5IDU5NC44MDcgMjgwLjkxNikiLz48L2c+PGcgZmlsdGVyPSJ1cmwoI2QpIiBvcGFjaXR5PSIuMiI+PHBhdGggZD0ibTM2My4yMzYgMTYwLjUzM2MxNDMuMzM5LTE2LjA4NSAzMDAuMDY2LTg1LjA4NDcgMzcyLjAxNSAxMy4yODIgNzEuOTQ5IDk4LjM2NyAxNy4yMTMgMTk4LjM4NS03Ni4zMDMgMjI3LjIyNi05My41MTcgMjguODQtNDQ5LjQ0IDE5NS4zODQtNTIxLjM4OSA5Ny4wMTctNzEuOTQ4NC05OC4zNjcgMTMyLjE2MS0zMDguNjg1IDIyNS42NzctMzM3LjUyNXoiIGZpbGw9InVybCgjaCkiLz48L2c+PGcgZmlsdGVyPSJ1cmwoI2UpIiBvcGFjaXR5PSIuNiI+PHBhdGggZD0ibTE5Mi4wMTggMjE5LjEzOWM1OS4wOTMtNTkuOTExIDIzNC4xMDQtNDIuOTkyIDM5OC43NzMgMjMuMDkyczI1Ni42NCAxNTYuMzA4IDE5Ny41NDcgMjE2LjIxOS0yNDAuNDg4IDU0LjkwNy00MDUuMTU4LTExLjE3N2MtMTY0LjY2OS02Ni4wODQtMjUwLjI1Ni0xNjguMjIzLTE5MS4xNjItMjI4LjEzNHoiIGZpbGw9InVybCgjaSkiLz48L2c+PGcgZmlsdGVyPSJ1cmwoI2YpIiBvcGFjaXR5PSIuNCI+PHBhdGggZD0ibTgwNS4wMjggMTM2LjM2NWMtNTEuNjUyIDcuMzA3LTE2Ny4yODkgNjEuODY2LTMxMy44NTggNTQuNTIzLTE4Ny43MDQtOS40MDQtMzEwLjQ3Ny0xMDAuMjg5MS0zMDQuMzQzLTM4LjYxNyAyMS4zNzIgMjE0Ljg1NiA0MzAuOTI4IDM2NC4yOTIgNTQ4LjcyOSAzNDcuNjI2czQ4LjUxNS0xMTkuNjggMjUuMDEtMjI1LjE5N2MtMjMuNTA0LTEwNS41MTctNDYuMDUtODUuOTY5IDQ0LjQ2Mi0xMzguMzM1eiIgZmlsbD0idXJsKCNqKSIvPjwvZz48L3N2Zz4=")` }} className={"h-screen bg-no-repeat bg-cover bg-center"}>
				<nav className="border-gray-200 px-2 sm:px-4 py-2.5 rounded">
					<div className="container flex flex-wrap justify-between items-center mx-auto">
						<Link to="/" className="flex items-center">
							<span
								className="self-center text-xl font-semibold whitespace-nowrap">Exerra Benchmarks</span>
						</Link>
					</div>
				</nav>

				<div className={"container justify-between items-center mx-auto w-full h-screen"}>
					<div className={"justify-center md:justify-start my-36 md:my-36 content-center"}>
						<h1 className={"font-bold text-6xl lg:text-9xl text-center md:text-left text-black"}><span className={"text-gray-700"}>Exerra</span> Benchmarks<span className={"text-gray-700"}>.</span></h1><br/>
						<h3 className={"font-bold text-2xl lg:text-3xl text-center mx-3 md:text-left"}>Integrated GPU benchmarks</h3><br/><br/><br/>

						<div className={"mx-3 block"}>
							<ReactSearchBox placeholder={"Search a review here"} data={searchParse} onSelect={(record) => {
								console.log(record)
								window.location.href = `/review/${record.item.value}`
							}} onChange={() => {}} />
						</div>

						{/*<a href="/auth/login"
						   className="block md:inline mx-3 md:mx-0 px-10 md:px-20 py-5 bg-gray-700 text-white rounded-xl text-center md:text-left">Start using Exerra Identity now</a>

						<a href="#learn-more"
						   className="block md:inline mx-3 md:mx-0 px-10 md:px-20 mt-3 md:mt-0 md:ml-3 py-5 white border-black border-2 text-black rounded-xl text-center md:text-left">Learn more</a>
						*/}
					</div>
				</div>

			</div>

			{/*<div className={"container w-auto justify-center lg:justify-between items-center mx-3 md:scale-100 md:mx-auto md:w-full bg-gray-100 px-10 py-10 flex rounded-2xl bg-cover bg-center flex-wrap"} style={{ backgroundImage: 'url("https://cdn.exerra.xyz/svg/iridescent/bg-iridescent-rightside.svg")' }} id={"learn-more"}>
				<div className={"md:max-w-lg"}>
					<h1 className={"text-4xl md:text-6xl"}>One system fits all</h1><br/>
					<p>
						A central identity service fits the needs of every service and API.<br /><br />
						New services just build on-top of already existing data, making the experience simple for everyone involved
						& with an API for profiles, you can make your own products based on Exerra Identity.
					</p>
				</div>
				<div className={"max-w-xl bg-white p-5 mt-5 lg:mt-0 md:p-10 rounded-2xl shadow-2xl"}>
					<img src={"https://cdn.exerra.xyz/svg/charts/services/identity/services-using-identity-october-2022.svg"} />
					<sub>Data for October 2022</sub>
				</div>
			</div>*/}
		</div>
	);
}
