import React from "react";

export default class ReviewSection extends React.Component<{ title: string }, any> {
	render() {
		let { title } = this.props

		return (
			<section>
				<h1 className={"text-5xl mt-10 mb-5"}>{title}</h1>
				{this.props.children}
			</section>
		);
	}
}