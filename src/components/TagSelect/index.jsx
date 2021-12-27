import {useEffect} from 'react'
import { connect } from 'react-redux'
import {Select} from 'antd'

import * as actions from '../../actions/index'
import './index.scss'

const TagSelect = ({tags, getTags, value = [], onChange, className, style, placeholder}) => {
	useEffect(() => {
		if(tags.length === 0) {
			// eslint-disable-next-line no-restricted-globals
			getTags({name})
		}
	}, [])

	return (
		<Select
			className={`tag-select ${className || ''}`}
			style={style} placeholder={placeholder}
			mode="multiple"
			value={value}
			onChange={onChange}
		>
			{tags.map(tag => (
				<Select.Option key={tag} value={tag}>{tag}</Select.Option>
			))}
		</Select>
	)
}

export default connect(
	({ tags }) => ({ tags }),
	{ ...actions },
)(TagSelect)
