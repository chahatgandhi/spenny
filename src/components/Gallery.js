import React from "react";
import { getImageUrl } from "../utils.js";

export default class Gallery extends React.Component {
	

	render() {
		return (
			<div className="gallery">
{Object.values(this.props.images).map((image)=> <img className="image-style" src={getImageUrl(image.farm, image.server, image.id, image.secret)} alt="" width="300px" />)}
					{/* */}
			</div>
				
			
			
		)
	}
}
