export const getSvgText = (iconComponent, width = 18, fill = '#b1e26f') => {
	const svgBegin = iconComponent.indexOf('<svg')
	const svgEnd = iconComponent.indexOf('</i>')
	let svgText = iconComponent.slice(svgBegin, svgEnd)
	svgText = svgText.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
		.replace('width="1em"', `width="${width}"`)
		.replace('height="1em"', `height="${width}"`)
		.replace('fill="currentColor"', `fill="${fill}"`)
		.replace('><path', '><g><rect width="${width}" height="${width}" opacity="0"></rect><path')
    	.replace('</svg>', '</g></svg>')
	return svgText
}

export const downloadZip = (content) => {
	const url = window.URL.createObjectURL(new Blob([content], { 'type': 'application\/zip' }))
	const a = document.createElement('a')
	document.body.appendChild(a)
	a.setAttribute('download', 'cps-svg-download.zip')
	a.setAttribute('href', url)
	a.style['display'] = 'none'
	a.click()

	setTimeout(function() {
		window.URL.revokeObjectURL(url)
	}, 10)
}
