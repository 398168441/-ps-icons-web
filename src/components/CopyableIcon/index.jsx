import {useEffect} from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import CopyToClipboard from 'react-copy-to-clipboard'

import * as actions from '../../actions/index'
import {message} from 'antd'
import './index.scss'

const CopyableIcon = ({
	label,
	type,
	theme,
	iconComponent,
	getIconComponent,
	batchMode,
	selected,
	onSelect,
}) => {
	useEffect(() => {
		if(!iconComponent) {
			getIconComponent({type, theme, format: 'html'})
		}
	}, [type, theme])
	const handleCopied = text => {
		message.success(
			<span>
				<code className="copied-code">{text}</code> 复制成功
			</span>,
		)
	}
	if(!iconComponent) {
		return null
	}
	if(batchMode) {
		return (
			<li
				className={classnames('copyable-icon copyable-icon--batch', {'copyable-icon--selected': selected})}
				title={label}
				dangerouslySetInnerHTML={{ __html: iconComponent }}
				onClick={() => onSelect(type, !selected)}
			/>
		)
	}
	return (
		<CopyToClipboard
			text={
				theme === 'native'
					? `<${type}IconNative />`
					: `<${type}Icon />`
			}
			onCopy={handleCopied}>
			<li className="copyable-icon" title={label} dangerouslySetInnerHTML={{ __html: iconComponent }} />
		</CopyToClipboard>
	)
}

export default connect(
	({ componentMap }, {type, theme}) => ({iconComponent: componentMap[`${type}${theme}`]}),
	{ ...actions },
)(CopyableIcon)
