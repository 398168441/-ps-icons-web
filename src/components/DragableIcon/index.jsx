import { useState, useEffect} from 'react'
import { connect } from 'react-redux'

import * as actions from '../../actions/index'
import {getSvgText} from '../../utils/index'
import './index.scss'

const DragableIcon = ({
	label,
	type,
	theme,
	size,
	color,
	iconComponent,
	getIconComponent,
}) => {
	const [offset, setOffset] = useState({x: 0, y: 0})
	useEffect(() => {
		if(!iconComponent) {
			getIconComponent({type, theme, format: 'html'})
		}
	}, [type, theme])
	const handleDragStart = (e) => {
		e.dataTransfer.setData('text', '')
		e.dataTransfer.clearData('text')
		setOffset({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetX})
	}
	const handleDragEnd = (e) => {
		e.preventDefault()
		window.postMessage('handleDragEnd', JSON.stringify({
			x: e.screenX - offset.x,
			y: e.screenY - offset.y,
			size,
			svgCode: getSvgText(iconComponent, size, color),
			name: `icon-${label}`,
		}))
	}
	if(!iconComponent) {
		return null
	}
	return (
		<li
			className="dragable-icon"
			title={label}
		>
			<div
				className="dragable-icon__content"
				dangerouslySetInnerHTML={{ __html: iconComponent }}
				draggable={true}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			/>
		</li>
	)
}

export default connect(
	({ componentMap }, {type, theme}) => ({iconComponent: componentMap[`${type}${theme}`]}),
	{ ...actions },
)(DragableIcon)
