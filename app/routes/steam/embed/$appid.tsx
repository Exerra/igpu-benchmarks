import { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export let loader: LoaderFunction = ({ params }) => {

}

export default () => {
	let data = useLoaderData()
}