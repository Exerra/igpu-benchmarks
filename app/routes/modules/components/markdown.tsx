import React from "react";

class H1 extends React.Component<any, any> {
	render() {
		return (
			<>
				<h1 className={"text-5xl mt-10 font-bold mb-2"}>{this.props.children}</h1>
			</>
		)
	}
}

class H2 extends React.Component<any, any> {
	render() {
		return (
			<h2 className={"text-4xl font-bold mt-7 text-gray-800"}>{this.props.children}</h2>
		)
	}
}

class H3 extends React.Component<any, any> {
	render() {
		return (
			<h3 className={"text-2xl font-bold mt-7 text-gray-700"}>{this.props.children}</h3>
		)
	}
}

class EmptyImg extends React.Component {
	render() {
		return <></>
	}
}

let emptyComponentConf = {
	component: EmptyImg
}

export let mdConfig = {
	disableParsingRawHTML: false,
	overrides: {
		script: emptyComponentConf,
		button: emptyComponentConf,
		form: emptyComponentConf,
		input: emptyComponentConf,
		h1: { component: H1 },
		h2: { component: H2 },
		h3: { component: H3 }
	}
}